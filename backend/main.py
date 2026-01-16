import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from pydantic import BaseModel
from typing import Optional
import uvicorn
from geo_utils import extract_exif_data, is_in_gcc_boundary, reverse_geocode
from db import save_violation_report

app = FastAPI()

# Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ViolationResponse(BaseModel):
    status: str
    message: str
    data: Optional[dict] = None

@app.post("/api/v1/report", response_model=ViolationResponse)
async def report_violation(
    file: UploadFile = File(...),
    violation_type_id: int = Form(...),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None)
):
    try:
        # 1. Save uploaded file temporarily
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Determine Location (Form Data > Backend EXIF)
        timestamp = None
        
        # If client provided coordinates, use them (trusting client for prototype, 
        # or assuming client read valid EXIF that server couldn't)
        if lat is None or lng is None:
            # Fallback to Backend EXIF extraction
            exif_data = extract_exif_data(file_path)
            if exif_data:
                lat, lng, timestamp = exif_data
        
        if lat is None or lng is None:
             os.remove(file_path)
             return ViolationResponse(status="error", message="No GPS coordinates found in image. Please use a photo with valid GPS data.")

        # Default timestamp if not found
        if not timestamp:
            from datetime import datetime
            timestamp = datetime.now()

        # 3. GCC Boundary Check
        in_gcc, ward, zone_no, zone_name = is_in_gcc_boundary(lat, lng)
        print(f"Is in GCC: {in_gcc}, Ward: {ward}, Zone: {zone_no} ({zone_name})")
        if not in_gcc:
            os.remove(file_path)
            return ViolationResponse(status="error", message=f"Location ({lat}, {lng}) is outside Greater Chennai Corporation limits.")

        # 4. Reverse Geocoding
        area = reverse_geocode(lat, lng)

        # 5. Database Insertion
        report_id = save_violation_report(
            image_path=file_path,
            lat=lat,
            lng=lng,
            timestamp=timestamp,
            violation_type_id=violation_type_id,
            area=area,
            ward=ward,
            zone_number=zone_no,
            zone_name=zone_name
        )

        return ViolationResponse(
            status="success", 
            message="Violation reported successfully.", 
            data={
                "report_id": str(report_id),
                "area": area,
                "ward": ward,
                "zone_number": zone_no,
                "zone_name": zone_name,
                "lat": lat, 
                "lng": lng
            }
        )

    except Exception as e:
        # Clean up on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
