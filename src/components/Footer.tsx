import React from 'react';
import { Leaf, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-zinc-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-teal-900 flex items-center justify-center text-teal-100">
              <Leaf className="w-3 h-3 text-emerald-300" />
            </div>
            <span className="font-semibold text-zinc-800">CarbonBridge</span>
            <span>— Statistical Decision-Support for Indian MSME Exporters</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-600 text-center md:text-right">
            <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>
              Decision-support prototype. Not a certified EU CBAM declaration.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
