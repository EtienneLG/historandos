import Link from 'next/link';
import UploadShell from './_components/upload-shell';
import { SiteHeader } from '@/components/site-header';

export default function UploadPage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">

      <SiteHeader>
        {/* Left Side: Go back arrow */}
        <div className="flex flex-1 justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium text-stone-600 hover:text-stone-900 transition-colors group"
          >
            {/* Inline SVG Left Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Cancel
          </Link>
        </div>
      </SiteHeader>

      <main className="flex-1 min-h-0 relative w-full">
        <UploadShell />
      </main>

    </div>
  );
}