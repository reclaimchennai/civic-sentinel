"use client";

import React, { useState, useRef } from 'react';
import EXIF from 'exif-js';
import { Camera, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Location {
  lat: number;
  lng: number;
  zone?: string;
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

  const extractLocation = (file: File) => {
    setIsExtracting(true);
    EXIF.getData(file as any, function (this: any) {
      const lat = EXIF.getTag(this, "GPSLatitude");
      const lng = EXIF.getTag(this, "GPSLongitude");
      const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
      const lngRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";

      if (lat && lng) {
        const latitude = convertDMSToDD(lat[0], lat[1], lat[2], latRef);
        const longitude = convertDMSToDD(lng[0], lng[1], lng[2], lngRef);
        
        // Mock Reverse Geocoding for Chennai Zones
        // In a real app, call an API here.
        const mockZone = "T. Nagar"; 
        
        const loc = { lat: latitude, lng: longitude, zone: mockZone };
        setLocation(loc);
        onUpload({ image: file, location: loc });
      } else {
        // Fallback: Trigger Map Selection (Mocked here for now)
        console.log("No GPS data found");
        const fallbackLoc = { lat: 13.0827, lng: 80.2707, zone: "Chennai Central" };
        setLocation(fallbackLoc);
        onUpload({ image: file, location: fallbackLoc });
      }
      setIsExtracting(false);
    });
  };

  const convertDMSToDD = (degrees: number, minutes: number, seconds: number, direction: string) => {
    let dd = degrees + minutes / 60 + seconds / (60 * 60);
    if (direction === "S" || direction === "W") {
      dd = dd * -1;
    }
    return dd;
  };

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800 flex flex-col items-center justify-center space-y-4">
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-64 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors"
        >
          <Camera className="w-12 h-12 text-zinc-500 mb-2" />
          <p className="text-zinc-400">Snap or Upload Violation</p>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
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
            <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 p-3 rounded-lg border border-green-900/30">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">📍 {location.zone} Locked</span>
              <CheckCircle2 className="w-4 h-4 ml-auto" />
            </div>
          )}
          
          {isExtracting && <p className="text-zinc-400 text-sm animate-pulse">Extracting location...</p>}
        </div>
      )}
    </Card>
  );
}
