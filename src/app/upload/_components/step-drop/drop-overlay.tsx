import { useUploadStore } from '@/stores/upload-store';
import React, { useState } from 'react';
import { computeHikePoints, gpxToGeoJson } from '@/lib/geo';

interface DropOverlayProps {
  onFileUploaded: () => void;
}

export default function DropOverlay({ onFileUploaded }: DropOverlayProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const setIsProcessing = useUploadStore((s) => s.setIsProcessing);
  const setGeometry = useUploadStore((s) => s.setGeometry);
  const setHikePoints = useUploadStore((s) => s.setHikePoints);
  const goToNextStep = useUploadStore((s) => s.goToNextStep);

  const handleFileDrop = (gpxXmlText: string) => {
    setIsProcessing('Traitement du fichier');

    try {
      const parsedGeometry = gpxToGeoJson(gpxXmlText);

      if (!parsedGeometry) {
        throw new Error("This file doesn't seem to contain any path geometry.");
      }

      setGeometry(parsedGeometry);
      setHikePoints(computeHikePoints(parsedGeometry));
      onFileUploaded();
      goToNextStep();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error parsing GPX file');
    } finally {
      setIsProcessing(null);
    }
  };

  const processFile = (file: File) => {
    setIsProcessing('Chargement du fichier');

    try {
      if (!file) {
        throw Error('Please provide a file');
      }

      if (!file.name.endsWith('.gpx')) {
        throw Error('Please upload a valid .gpx file');
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          handleFileDrop(text);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error parsing GPX file');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 p-8
        ${
          isDragging
            ? 'bg-stone-200/50 border-4 border-dashed border-stone-400'
            : 'bg-parchment-light hover:bg-stone-50 border-2 border-dashed border-stone-300'
        }`}
    >
      {/* Hidden native input element to support click actions */}
      <input
        type="file"
        accept=".gpx"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />

      <div className="flex flex-col items-center text-center max-w-md pointer-events-none select-none">
        {/* Upload Icon */}
        <div
          className={`p-4 rounded-full bg-stone-100 border border-stone-200 mb-4 transition-transform duration-200 ${isDragging ? 'scale-110 text-stone-700' : 'text-stone-400'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        </div>

        {/* Text Details */}
        <h3 className="text-base font-semibold text-stone-800">
          {isDragging ? 'Drop your track here' : 'Upload your GPX file'}
        </h3>

        <p className="text-sm text-stone-500 mt-1">
          Drag and drop your route anywhere on this screen, or{' '}
          <span className="text-stone-700 font-medium underline">browse files</span>
        </p>

        <span className="text-xs text-stone-400 mt-6 px-3 py-1 bg-stone-100/80 border border-stone-200 rounded-md tracking-wide uppercase">
          Supports .gpx tracks
        </span>
      </div>
    </div>
  );
}
