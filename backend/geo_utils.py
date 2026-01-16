import piexif
from PIL import Image, ExifTags
from datetime import datetime
import geopandas as gpd
from shapely.geometry import Point
import pandas as pd
import requests
import os
from dotenv import load_dotenv

load_dotenv()

GEOJSON_PATH = "data/Chennai_Wards.geojson"
MAPPING_PATH = "data/ward_zone_mapping.csv"
LOCATIONIQ_KEY = os.getenv("LOCATIONIQ_API_KEY")

# Load mapping once
try:
    ward_mapping = pd.read_csv(MAPPING_PATH)
    ward_mapping['WARD_NO'] = ward_mapping['WARD_NO'].astype(str)
except Exception as e:
    print(f"Mapping Load Error: {e}")
    ward_mapping = pd.DataFrame()

def get_decimal_from_dms(dms, ref):
    try:
        degrees = dms[0]
        minutes = dms[1]
        seconds = dms[2]
        
        # Handle cases where values might be Tuble(num, den) from some libraries, 
        # though Pillow usually gives float/int if already processed, 
        # or IFDRational. Let's assume they are numbers.
        
        decimal = float(degrees) + (float(minutes) / 60.0) + (float(seconds) / 3600.0)
        
        if ref in ['S', 'W']:
            decimal = -decimal
            
        return decimal
    except Exception as e:
        print(f"DMS Conversion Error: {e} | Val: {dms}")
        return float('nan')

def extract_exif_data(image_path):
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        
        if not exif_data:
            print("No EXIF data found in image via Pillow.")
            return None

        # Map EXIF tags to names
        exif = {
            ExifTags.TAGS[k]: v
            for k, v in exif_data.items()
            if k in ExifTags.TAGS
        }
        
        # Extract GPS Info
        gps_info = exif.get('GPSInfo')
        if not gps_info:
            print("No GPSInfo tag found.")
            return None
            
        print(f"RAW GPS INFO: {gps_info}")

        # Parse GPS
        # 1: LatitudeRef, 2: Latitude, 3: LongitudeRef, 4: Longitude
        lat_ref = gps_info.get(1)
        lat_dms = gps_info.get(2)
        lng_ref = gps_info.get(3)
        lng_dms = gps_info.get(4)
        
        if not (lat_dms and lng_dms):
            print("Incomplete GPS data: Missing Lat/Lng values.")
            return None
            
        # Default refs if missing (assume N/E for Chennai context if desperate, but better to fail safe)
        lat_ref = lat_ref or 'N'
        lng_ref = lng_ref or 'E'
            
        lat = get_decimal_from_dms(lat_dms, lat_ref)
        lng = get_decimal_from_dms(lng_dms, lng_ref)
        
        # Check for NaN or Zero
        if lat != lat or lng != lng or (lat == 0 and lng == 0):
             print(f"Invalid Coordinates extracted: {lat}, {lng}")
             return None
        
        # Extract Timestamp
        date_str = exif.get('DateTimeOriginal')
        if date_str:
            try:
                timestamp = datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
            except ValueError:
                timestamp = datetime.now()
        else:
            timestamp = datetime.now()

        return lat, lng, timestamp

    except Exception as e:
        print(f"EXIF Extraction Error: {e}")
        return None

def is_in_gcc_boundary(lat, lng):
    try:
        # Load GCC Wards
        gdf = gpd.read_file(GEOJSON_PATH)
        
        # Ensure 2D and standard CRS
        if gdf.crs != "EPSG:4326":
            gdf = gdf.to_crs("EPSG:4326")
        
        point = Point(lng, lat) # GeoJSON uses (lng, lat)
        
        print(f"Checking point {point} against {len(gdf)} polygons")
        
        # Check if point is within any polygon
        # Using within(point) on the series is often faster/better
        mask = gdf.geometry.contains(point)
        
        if mask.any():
            # Get the ward name from the matching row
            ward = gdf.loc[mask, 'name'].values[0]
            print(f"Point is inside Ward: {ward}")
            
            # Lookup Zone
            zone_info = ward_mapping[ward_mapping['WARD_NO'] == str(ward)]
            if not zone_info.empty:
                zone_no = int(zone_info.iloc[0]['ZONE_NO'])
                zone_name = zone_info.iloc[0]['ZONE_NAME']
                return True, ward, zone_no, zone_name
            
            return True, ward, None, None
        
        # Check distance if not found (debugging)
        min_dist = gdf.geometry.distance(point).min()
        print(f"Point is NOT in GCC. Min distance to boundary: {min_dist}")

        return False, None, None, None
    except Exception as e:
        print(f"GeoFence Error: {e}")
        return False, None, None, None

def reverse_geocode(lat, lng):
    if not LOCATIONIQ_KEY:
        return "Unknown Area (No API Key)"
    
    try:
        url = f"https://us1.locationiq.com/v1/reverse.php?key={LOCATIONIQ_KEY}&lat={lat}&lon={lng}&format=json"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            # Try to get best area name
            address = data.get("address", {})
            return address.get("suburb") or address.get("neighbourhood") or address.get("city_district") or "Chennai"
        return "Unknown Area"
    except Exception as e:
        print(f"Geocode Error: {e}")
        return "Unknown Area"
