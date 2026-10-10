import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, Globe, ArrowRight } from 'lucide-react';
import { Speaker } from '../../types';
import { ImageFallback } from '../common/ImageFallback';

interface SpeakerCardProps {
  speaker: Speaker;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker }) => {
  const profileUrl = `/speakers/${speaker.slug || speaker.id}`;

  return (
    <article className="group flex flex-col bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors shadow-xs">
      <div className="flex items-start gap-4 mb-4">
        <Link
          to={profileUrl}
          className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700 block"
          aria-label={`View ${speaker.name}'s profile`}
        >
          <ImageFallback
            src={speaker.avatar}
            alt={speaker.name}
            fallbackText={speaker.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
            <Link to={profileUrl} className="focus-visible:outline-2 focus-visible:outline-blue-700 rounded-xs">
              {speaker.name}
            </Link>
          </h3>
          <p className="text-xs font-semibold text-blue-900 mt-0.5 line-clamp-1">
            {speaker.role}
          </p>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {speaker.organization}
          </p>
        </div>
      </div>

      {/* Biography */}
      <p className="text-xs text-slate-600 leading-relaxed flex-1 mb-4 line-clamp-3">
        {speaker.bio}
      </p>

      {/* Domain Expertise Unboxed Tags */}
      <div className="pt-3 border-t border-slate-100 mb-4">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Areas of Focus
        </span>
        <div className="text-xs text-slate-700 flex flex-wrap gap-x-2 gap-y-1">
          {speaker.expertise.map((exp, idx) => (
            <span key={exp} className="inline-flex items-center">
              {exp}
              {idx < speaker.expertise.length - 1 && (
                <span aria-hidden="true" className="ml-2 text-slate-300">·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: View Profile & Approved Links */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <Link
          to={profileUrl}
          className="inline-flex items-center gap-1 font-semibold text-blue-900 hover:text-blue-700 transition-colors focus-visible:outline-2 focus-visible:outline-blue-700"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        <div className="flex items-center gap-3">
          {speaker.approvedLinks.linkedin && (
            <a
              href={speaker.approvedLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-700 transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 p-1"
              aria-label={`${speaker.name} on LinkedIn (opens in new tab)`}
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
          {speaker.approvedLinks.github && (
            <a
              href={speaker.approvedLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 p-1"
              aria-label={`${speaker.name} on GitHub (opens in new tab)`}
              title="GitHub Profile"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {speaker.approvedLinks.website && (
            <a
              href={speaker.approvedLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-900 transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 p-1"
              aria-label={`${speaker.name} Academic Website (opens in new tab)`}
              title="Academic or Personal Portfolio"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
