import piexif
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
    # Ensure WARD_NO is string to match GeoJSON 'name' if needed, or int
    # GeoJSON 'name' is likely string "168". CSV is likely int.
    # Let's standardize on string.
    ward_mapping['WARD_NO'] = ward_mapping['WARD_NO'].astype(str)
except Exception as e:
    print(f"Mapping Load Error: {e}")
    ward_mapping = pd.DataFrame()

def extract_exif_data(image_path):
    try:
        exif_dict = piexif.load(image_path)
        
        # GPS
        gps = exif_dict.get("GPS")
        if not gps:
            return None
            
        def convert_to_degrees(value):
            d = value[0][0] / value[0][1]
            m = value[1][0] / value[1][1]
            s = value[2][0] / value[2][1]
            return d + (m / 60.0) + (s / 3600.0)

        lat_raw = gps.get(piexif.GPSIFD.GPSLatitude)
        lng_raw = gps.get(piexif.GPSIFD.GPSLongitude)
        
        if not lat_raw or not lng_raw:
            return None
            
        lat = convert_to_degrees(lat_raw)
        lng = convert_to_degrees(lng_raw)
        
        # Timestamp
        exif_ifd = exif_dict.get("Exif")
        date_str = exif_ifd.get(piexif.ExifIFD.DateTimeOriginal)
        if date_str:
            timestamp = datetime.strptime(date_str.decode("utf-8"), "%Y:%m:%d %H:%M:%S")
        else:
            timestamp = datetime.now()

        return lat, lng, timestamp

    except Exception as e:
        print(f"EXIF Error: {e}")
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
