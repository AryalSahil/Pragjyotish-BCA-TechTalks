import React from 'react';
import { CalendarSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="py-16 px-4 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50/50 my-6">
      <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-4">
        {icon || <CalendarSearch className="w-6 h-6 text-slate-500" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800 transition-colors shadow-xs"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};
