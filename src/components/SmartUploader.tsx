import React, { useState, useRef } from 'react';
import { Camera, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EXIF from 'exif-js';

interface Location {
  lat: number;
  lng: number;
  zone?: string;
  ward?: string;
  zone_number?: number;
  zone_name?: string;
}

export default function SmartUploader({ onUpload }: { onUpload: (data: { image: File; location: Location }) => void }) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      extractLocation(file);
    }
  };

  const convertDMSToDD = (degrees: number, minutes: number, seconds: number, direction: string) => {
    let dd = degrees + minutes / 60 + seconds / (60 * 60);
    if (direction === "S" || direction === "W") {
      dd = dd * -1;
    }
    return dd;
  };

  const extractLocation = (file: File) => {
    setIsExtracting(true);
    
    // Try Client-Side EXIF first
    EXIF.getData(file as any, function (this: any) {
      const latData = EXIF.getTag(this, "GPSLatitude");
      const lngData = EXIF.getTag(this, "GPSLongitude");
      const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
      const lngRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";

      let clientLat: number | null = null;
      let clientLng: number | null = null;

      if (latData && lngData) {
        clientLat = convertDMSToDD(latData[0], latData[1], latData[2], latRef);
        clientLng = convertDMSToDD(lngData[0], lngData[1], lngData[2], lngRef);
        console.log("Client-side EXIF extracted:", clientLat, clientLng);
      } else {
        console.log("Client-side EXIF missing or failed.");
      }

      // Proceed to upload to backend (passing client coords if found)
      uploadToBackend(file, clientLat, clientLng);
    });
  };

  const uploadToBackend = async (file: File, lat: number | null, lng: number | null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('violation_type_id', '1'); 
    
    if (lat !== null && lng !== null) {
      formData.append('lat', lat.toString());
      formData.append('lng', lng.toString());
    }

    try {
      const response = await fetch('/api/v1/report', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        const loc = { 
          lat: result.data.lat, 
          lng: result.data.lng, 
          zone: result.data.area,
          ward: result.data.ward,
          zone_number: result.data.zone_number,
          zone_name: result.data.zone_name
        };
        setLocation(loc);
        onUpload({ image: file, location: loc });
      } else {
        alert(result.message);
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to connect to reporting service.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800 flex flex-col items-center justify-center space-y-4">
      {!preview ? (
          <Button 
            variant="outline" 
            className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300"
            onClick={() => galleryInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File (Preserves GPS)
          </Button>
          <input 
            type="file" 
            accept=".jpg,.jpeg,.png,.heic,.heif"
            className="hidden" 
            ref={galleryInputRef}
            onChange={handleFileChange}
          />
      ) : (
        <div className="w-full space-y-4">
          <div className="relative w-full h-64 rounded-xl overflow-hidden">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute bottom-2 right-2"
              onClick={() => { setImage(null); setPreview(null); setLocation(null); }}
            >
              Retake
            </Button>
          </div>
          
          {location && (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 p-3 rounded-lg border border-green-900/30">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">📍 {location.zone} Locked</span>
                <CheckCircle2 className="w-4 h-4 ml-auto" />
              </div>
              <div className="grid grid-cols-2 gap-1">
                {location.ward && (
                  <div className="flex items-center justify-center text-blue-400 bg-blue-900/20 p-2 rounded-lg border border-blue-900/30 text-xs font-mono">
                    WARD {location.ward}
                  </div>
                )}
                {location.zone_number && (
                  <div className="flex items-center justify-center text-purple-400 bg-purple-900/20 p-2 rounded-lg border border-purple-900/30 text-xs font-mono">
                    ZONE {location.zone_number}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {isExtracting && <p className="text-zinc-400 text-sm animate-pulse">Extracting location...</p>}
        </div>
      )}
    </Card>
  );
}
