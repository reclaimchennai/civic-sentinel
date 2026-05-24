"use client";

import React, { useState, useRef } from "react";
import { Camera, MapPin, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import exifr from "exifr";

interface Location {
  lat: number;
  lng: number;
  zone?: string;
  ward?: string;
  zone_number?: number;
  zone_name?: string;
}

export default function SmartUploader({ onUpload }: { onUpload: (data: { image: File; location: Location }) => void }) {
  const { data: session } = useSession();
  const [, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    await extractAndUpload(file);
  };

  const extractAndUpload = async (file: File) => {
    setIsExtracting(true);

    let lat: number | null = null;
    let lng: number | null = null;
    try {
      const gps = await exifr.gps(file);
      if (gps && Number.isFinite(gps.latitude) && Number.isFinite(gps.longitude)) {
        lat = gps.latitude;
        lng = gps.longitude;
      }
    } catch (err) {
      console.warn("exifr extraction failed:", err);
    }

    await uploadToBackend(file, lat, lng);
  };

  const uploadToBackend = async (file: File, lat: number | null, lng: number | null) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("violation_type_id", "1");
    if (lat !== null && lng !== null) {
      formData.append("lat", lat.toString());
      formData.append("lng", lng.toString());
    }
    if (session?.user?.id) {
      formData.append("user_id", session.user.id);
    }

    try {
      const response = await fetch("/api/v1/report", { method: "POST", body: formData });
      const result = await response.json();

      if (result.status === "success") {
        const loc = {
          lat: result.data.lat,
          lng: result.data.lng,
          zone: result.data.area,
          ward: result.data.ward,
          zone_number: result.data.zone_number,
          zone_name: result.data.zone_name,
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
        <div className="w-full space-y-4">
          <div
            onClick={() => cameraInputRef.current?.click()}
            className="w-full h-40 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-800/50 transition-all group"
          >
            <Camera className="w-10 h-10 text-zinc-500 group-hover:text-yellow-500 mb-2 transition-colors" />
            <p className="text-zinc-400 font-medium">Snap Picture</p>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              ref={cameraInputRef}
              onChange={handleFileChange}
            />
          </div>

          <div className="flex items-center justify-center space-x-2 text-zinc-600 text-xs uppercase font-bold tracking-widest">
            <span className="h-px w-full bg-zinc-800"></span>
            <span>OR</span>
            <span className="h-px w-full bg-zinc-800"></span>
          </div>

          <Button
            variant="outline"
            className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300"
            onClick={() => galleryInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.heic,.heif"
            className="hidden"
            ref={galleryInputRef}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="relative w-full h-64 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-2 right-2"
              onClick={() => {
                setImage(null);
                setPreview(null);
                setLocation(null);
              }}
            >
              Retake
            </Button>
          </div>

          {location && (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 p-3 rounded-lg border border-green-900/30">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">{location.zone} Locked</span>
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
