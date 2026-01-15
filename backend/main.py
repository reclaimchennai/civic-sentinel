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
    violation_type_id: int = Form(...)
):
    try:
        # 1. Save uploaded file temporarily
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Extract EXIF Data
        exif_data = extract_exif_data(file_path)
        if not exif_data:
            os.remove(file_path)
            return ViolationResponse(status="error", message="No EXIF metadata found in image. GPS required.")
        
        lat, lng, timestamp = exif_data
        
        if not lat or not lng:
             os.remove(file_path)
             return ViolationResponse(status="error", message="No GPS coordinates found in image.")

        # 3. GCC Boundary Check
        if not is_in_gcc_boundary(lat, lng):
            os.remove(file_path)
            return ViolationResponse(status="error", message="Location is outside Greater Chennai Corporation limits.")

        # 4. Reverse Geocoding
        area = reverse_geocode(lat, lng)

        # 5. Database Insertion
        report_id = save_violation_report(
            image_path=file_path,
            lat=lat,
            lng=lng,
            timestamp=timestamp,
            violation_type_id=violation_type_id,
            area=area
        )

        return ViolationResponse(
            status="success", 
            message="Violation reported successfully.", 
            data={
                "report_id": str(report_id),
                "area": area,
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
