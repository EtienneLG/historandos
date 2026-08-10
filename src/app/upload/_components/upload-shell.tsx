'use client';

import dynamic from 'next/dynamic';
import { useUploadStore } from '@/stores/upload-store';
import DropOverlay from './step-drop/drop-overlay';
import StepGlobal from './step-global/step-global';
import StepDetails from './step-details/step-details';
import ElevationChart from './step-details/elevation-chart';

const UploadMap = dynamic(() => import("./upload-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-sm">
      Loading map...
    </div>
  ),
});

export default function UploadShell() {
  const currentStep = useUploadStore((s) => s.currentStep);
  const isProcessing = useUploadStore((s) => s.isProcessing);
  const setIsProcessing = useUploadStore((s) => s.setIsProcessing);

  return (
    <div className="relative w-full h-full min-h-0">

      {/* Step 1 : Drop */}
      {currentStep === 'drop' ? (
        <DropOverlay
          onFileUploaded={() => setIsProcessing("Chargement de la carte")}
        />
      ) : (
        <div className="relative w-full h-full transition-opacity duration-300">

          {/* Map Canvas */}
          <div className="w-full h-full">
            <UploadMap
              handleMapLoad={() => setIsProcessing(null)}
            />
          </div>

          {/* Elevation Chart */}
          {currentStep === 'details' && (
            <div className="absolute bottom-2 left-2 right-[418px] h-[180px] bg-parchment-light border border-stone rounded-xl flex items-center justify-center text-xs font-mono text-ink/40 z-10 shadow-sm">
              <ElevationChart/>
            </div>
          )}

          {/* Config Panel */}
          <div className="absolute right-2 top-2 bottom-2 w-[400px] bg-white border border-stone shadow-md rounded-xl overflow-y-auto p-4 flex flex-col justify-between z-10">
            {/* Step 2 : Global data */}
            {currentStep == 'global' && (
              <StepGlobal/>
            )}

            {/* Step 3 : Details */}
            {currentStep == 'details' && (
              <StepDetails/>
            )}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          {/* Animated Spinner Icon */}
          <svg className="animate-spin h-10 w-10 text-white mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-medium text-gray-100">{isProcessing}</p>
          <span className="text-xs text-gray-400 mt-1">Veuillez patienter</span>
        </div>
      )}
    </div>
  );
}