"use client";

import React, { useState, useRef } from 'react';
import { Camera, MapPin, CheckCircle2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

  const extractLocation = async (file: File) => {
    setIsExtracting(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('violation_type_id', '1'); // Default for extraction step

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
        // Handle rejection (Outside GCC, No GPS, etc.)
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
