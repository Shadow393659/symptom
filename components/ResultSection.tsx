
import React from 'react';

interface ResultSectionProps {
  content: string;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ content }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div 
        className="edu-content p-8 rounded-3xl border border-slate-200 bg-white shadow-sm"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};
