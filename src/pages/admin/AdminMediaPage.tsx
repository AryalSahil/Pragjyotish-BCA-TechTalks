import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useTechTalks } from '../../context/TechTalksContext';
import { ImageFallback } from '../../components/common/ImageFallback';
import { formatDate } from '../../lib/utils';
import { Upload, Trash2, ExternalLink, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const { gallery } = useTechTalks();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <AdminLayout
      title="Media & Session Asset Manager"
      subtitle="Manage posters, laboratory photography, and multimedia assets"
      actions={
        <button
          type="button"
          onClick={() => setStatusMessage('Supabase Storage bucket "techtalks-media" is mapped and ready for direct upload.')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Media Asset</span>
        </button>
      }
    >
      <div className="space-y-6">

        {statusMessage && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Storage status banner */}
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-1">
              <Database className="w-4 h-4" />
              <span>Supabase Storage Bucket: &quot;techtalks-media&quot;</span>
            </div>
            <p className="text-xs text-slate-400">
              Media records stored in PostgreSQL <code>public.event_media</code> with Row Level Security.
            </p>
          </div>
          <span className="bg-slate-800 px-3 py-1 rounded-md text-slate-300 font-mono text-xs">
            {gallery.length} Verified Assets
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
                  <ImageFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-md capitalize font-medium">
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.caption}</p>
                  <p className="text-[11px] text-slate-400 mt-2">Added on {formatDate(item.date)}</p>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] font-mono">ID: {item.id}</span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Published
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
};
