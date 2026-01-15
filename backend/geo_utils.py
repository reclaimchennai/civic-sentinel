import piexif
from datetime import datetime
import geopandas as gpd
from shapely.geometry import Point
import requests
import os
from dotenv import load_dotenv

load_dotenv()

GEOJSON_PATH = "data/Chennai_Wards.geojson"
LOCATIONIQ_KEY = os.getenv("LOCATIONIQ_API_KEY")

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
        # Optimally, load this once globally, but for now loading per request for simplicity
        # In prod, this would be a global object
        gdf = gpd.read_file(GEOJSON_PATH)
        
        point = Point(lng, lat) # GeoJSON uses (lng, lat)
        
        # Check if point is within any polygon in the GeoDataFrame
        is_within = gdf.contains(point).any()
        return is_within
    except Exception as e:
        print(f"GeoFence Error: {e}")
        # Fail safe: Allow if check fails? Or Block? 
        # Blocking is safer for the requirement "Constrain app functionality"
        return False

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
