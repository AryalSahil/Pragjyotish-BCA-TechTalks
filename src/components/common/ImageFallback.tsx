import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  containerClassName?: string;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackText,
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${containerClassName}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200/70 animate-pulse flex items-center justify-center text-slate-400">
          <ImageIcon className="w-6 h-6 opacity-40" />
        </div>
      )}

      {hasError || !src ? (
        <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-200 p-4 text-center">
          <ImageIcon className="w-8 h-8 text-blue-400 mb-2 opacity-80" />
          <span className="text-xs font-medium text-slate-300 line-clamp-2">
            {fallbackText || alt || 'Academic TechTalk Media'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Pragjyotish BCA TechTalks</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt || 'TechTalks asset'}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          onLoad={() => setIsLoaded(true)}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
          {...props}
        />
      )}
    </div>
  );
};
