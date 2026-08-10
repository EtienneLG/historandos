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

  /* const handleSplit = () => {
    const segments = [...uploadState.segments];
    const targetSegment = segments[segments.length - 1];
    const splitIndex = Math.floor((targetSegment.segment.startIndex + targetSegment.segment.endIndex) / 2);

    const segment1Metrics = calculatePartialTraceMetrics(uploadState.geoJson, targetSegment.segment.startIndex, splitIndex);
    const segment2Metrics = calculatePartialTraceMetrics(uploadState.geoJson, splitIndex, targetSegment.segment.endIndex);

    console.log(segment1Metrics, segment2Metrics);

    const updatedSegment1: DaySegment = {
      ...targetSegment,
      segment: {
        ...targetSegment.segment,
        endIndex: splitIndex,
      },
      metrics: segment1Metrics,
    };

    const updatedSegment2: DaySegment = {
      id: crypto.randomUUID(),
      title: `Jour ${segments.length + 1}`,
      description: '',
      pois: [],
      segment: {
        startIndex: splitIndex,
        endIndex: targetSegment.segment.endIndex,
      },
      accomodation: 'other',
      metrics: segment2Metrics,
    };

    segments.splice(segments.length - 1, 1, updatedSegment1, updatedSegment2);

    setUploadState((prev) => ({
      ...prev,
      segments: segments,
    }));
  }

  const setActiveSegmentIndex = (index: number | null) => {
    setUploadState((prev) => ({
      ...prev,
      activeSegmentIndex: index,
    }));
  }

  const handleUpdateSegment = (index: number, fields: Partial<DaySegment>) => {
    const updated = [...uploadState.segments];
    updated[index] = { ...updated[index], ...fields };
    setUploadState((prev) => ({
      ...prev,
      segments: updated,
    }));
  };

  const handleAddPoi = (segmentIndex: number) => {
    const updated = [...uploadState.segments];
    const seg = updated[segmentIndex].segment;
    const initCoordsIdx = Math.floor(Math.random() * (seg.endIndex - seg.startIndex) + seg.startIndex);

    const newPoi: POI = {
      id: crypto.randomUUID(),
      coordinateIndex: initCoordsIdx,
      description: '',
    };

    updated[segmentIndex] = {
      ...updated[segmentIndex],
      pois: [...updated[segmentIndex].pois, newPoi]
    };

    setUploadState((prev) => ({
      ...prev,
      segments: updated,
    }));
  };

  const handleRemovePoi = (segmentIndex: number, poiIndex: number) => {
    const updated = [...uploadState.segments];
    const pois = updated[segmentIndex].pois.filter((_, i) => i !== poiIndex);

    updated[segmentIndex] = { ...updated[segmentIndex], pois };

    setUploadState((prev) => ({
      ...prev,
      segments: updated,
    }));
  };

  const handleUpdatePoi = (segmentIndex: number, poiIndex: number, fields: Partial<POI>) => {
    const updated = [...uploadState.segments];
    const pois = [...updated[segmentIndex].pois];

    pois[poiIndex] = { ...pois[poiIndex], ...fields };
    updated[segmentIndex] = { ...updated[segmentIndex], pois };

    setUploadState((prev) => ({
      ...prev,
      segments: updated,
    }));
  };

  const handleUpdateSplitIndex = (segmentId: string, newIndex: number) => {
    const updated = [...uploadState.segments];
    const targetIndex = updated.findIndex((s) => s.id === segmentId);

    const beforeMetrics = calculatePartialTraceMetrics(uploadState.geoJson, updated[targetIndex].segment.startIndex, newIndex);
    const afterMetrics = calculatePartialTraceMetrics(uploadState.geoJson, newIndex, updated[targetIndex + 1].segment.endIndex);

    updated[targetIndex] = {
      ...updated[targetIndex],
      segment: {
        ...updated[targetIndex].segment,
        endIndex: newIndex,
      },
      metrics: beforeMetrics
    };
    updated[targetIndex + 1] = {
      ...updated[targetIndex + 1],
      segment: {
        ...updated[targetIndex + 1].segment,
        startIndex: newIndex,
      },
      metrics: afterMetrics,
    };

    setUploadState((prev) => ({
      ...prev,
      segments: updated,
    }));
  } */

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
            {/*currentStep == 'details' && (
              <div className="text-sm text-ink flex-1 flex flex-col">
                <StepDetails
                  segments={uploadState.segments}
                  activeSegmentIndex={uploadState.activeSegmentIndex}
                  setActiveSegmentIndex={setActiveSegmentIndex}
                  onSplit={handleSplit}
                  onUpdateSegment={handleUpdateSegment}
                  onNewPoi={handleAddPoi}
                  onDeletePoi={handleRemovePoi}
                  onUpadtePoi={handleUpdatePoi}
                  onBack={goToPrevStep}
                  onNext={() => void (0)}
                />
              </div>
            )*/}
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