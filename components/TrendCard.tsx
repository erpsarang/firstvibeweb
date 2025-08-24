
import React from 'react';
import type { TrendCardData } from '../types';

interface TrendCardProps {
  data: TrendCardData;
}

export const TrendCard: React.FC<TrendCardProps> = ({ data }) => {
  return (
    <div className="bg-[#1A1A1E] border border-gray-700/50 rounded-xl p-6 flex flex-col gap-4 h-full transition-transform transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
      <div>
        <span className="text-sm font-semibold text-blue-400 bg-blue-900/50 px-3 py-1 rounded-full">{data.category}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-100 leading-snug flex-grow">{data.title}</h3>
      <p className="text-gray-400 text-base line-clamp-2">{data.summary}</p>
      <div className="flex items-center gap-3 pt-2 border-t border-gray-700/50 mt-auto">
        <img src={data.sourceLogoUrl} alt={`${data.sourceName} logo`} className="w-6 h-6 rounded-full bg-white object-contain" />
        <span className="text-sm text-gray-500 font-medium">{data.sourceName}</span>
        <span className="text-sm text-gray-600 ml-auto">{data.publishedDate}</span>
      </div>
    </div>
  );
};
