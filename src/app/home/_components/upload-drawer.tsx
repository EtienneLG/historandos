import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UploadDrawerProps {
  onClose: () => void;
}

export default function UploadDrawer({ onClose }: UploadDrawerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [photoDirectoryId, setPhotoDirectoryId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.gpx')) {
        setGpxFile(file);
      } else {
        alert('Please upload a valid .gpx file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.gpx')) {
        setGpxFile(file);
      } else {
        alert('Please upload a valid .gpx file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gpxFile) return alert('GPX file is required.');

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('gpxFile', gpxFile);
      formData.append('date', date);
      if (photoDirectoryId) {
        formData.append('photoDirectoryId', photoDirectoryId);
      }

      const response = await fetch('/api/traces/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      router.refresh(); 
      onClose();
    } catch (error) {
      console.error('Error uploading trace:', error);
      alert('Failed to upload track to Infomaniak.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Blur Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Sliding Panel Container */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-lg transform bg-white p-3 shadow-2xl transition-all duration-300 ease-in-out border-l border-gray-100 flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-5 px-1 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Publier une rando</h2>
              <p className="text-xs text-gray-500 mt-0.5">Téléverser une nouvelle randonnée</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-6 px-1 space-y-5 min-h-0 pr-1">
            
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-gray-600">Titre</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex. Grand tour des Écrins"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-gray-600">Date de l'activité</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-gray-600">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajouter des détails sur les personnes, les conditions, la durée..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Optional Photo Directory ID */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-gray-600">ID du répertoire photo</label>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded">Optionnel</span>
              </div>
              <input
                type="text"
                value={photoDirectoryId}
                onChange={(e) => setPhotoDirectoryId(e.target.value)}
                placeholder="ex. 120102"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 font-mono text-xs"
              />
            </div>

            {/* GPX Dropzone File Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-gray-600">Fichier GPX</label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : gpxFile 
                      ? 'border-emerald-500 bg-emerald-50/10' 
                      : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <input
                  type="file"
                  accept=".gpx"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />

                {!gpxFile ? (
                  <>
                    <div className="p-2 bg-white shadow-sm border border-gray-100 rounded-lg text-gray-500 mb-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Drag & drop le fichier ou <span className="text-blue-600 hover:underline">parcourir</span></p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Fichier .GPX uniquement &lt; 1GB</p>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-emerald-500 text-white shadow-md shadow-emerald-100 rounded-lg mb-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-gray-800 text-center max-w-[85%] truncate">{gpxFile.name}</p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{(gpxFile.size / 1024).toFixed(1)} KB Ready</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setGpxFile(null);
                      }}
                      className="mt-3 text-xs font-semibold text-red-500 hover:text-red-700 hover:underline z-10"
                    >
                      Retirer le fichier
                    </button>
                  </>
                )}
              </div>
            </div>

          </form>

          {/* Action Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 bg-white">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !gpxFile || !title}
              className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                'Upload Track'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}