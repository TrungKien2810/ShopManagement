import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, HandMetal } from 'lucide-react';
import type { TableDto } from '../models/table';
import { TableStatus } from '../models/table';
import { cn } from '../lib/utils';

interface TableViewMapProps {
  tables: TableDto[];
  onTableClick: (table: TableDto) => void;
  onOpenTable: (id: string) => void;
}

// Mock position generator for now (in a real app, these would come from the DB)
const getTablePosition = (index: number) => {
  const cols = 4;
  const padding = 100;
  const spacingX = 220;
  const spacingY = 180;
  
  return {
    x: padding + (index % cols) * spacingX,
    y: padding + Math.floor(index / cols) * spacingY
  };
};

export const TableViewMap: React.FC<TableViewMapProps> = ({ tables, onTableClick, onOpenTable }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | 'All'>('All');
  const locations = ['All', ...new Set(tables.map(t => t.location))];

  const filteredTables = selectedLocation === 'All' 
    ? tables 
    : tables.filter(t => t.location === selectedLocation);

  return (
    <div className="relative w-full h-[600px] linear-surface border-none overflow-hidden bg-[#020308] select-none">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      {/* Controls */}
      <div className="absolute top-6 left-6 z-10 flex gap-2">
         {locations.map(loc => (
           <button
             key={loc}
             onClick={() => setSelectedLocation(loc)}
             className={cn(
               "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
               selectedLocation === loc 
                 ? "bg-brand-purple border-brand-purple text-white shadow-[0_0_15px_rgba(94,106,210,0.3)]" 
                 : "bg-[#08090a] border-white/[0.08] text-brand-gray hover:border-white/[0.2]"
             )}
           >
             {loc}
           </button>
         ))}
      </div>

      <div className="absolute inset-0 overflow-auto p-12">
        <div className="relative w-[1200px] h-[800px]">
          <AnimatePresence>
            {filteredTables.map((table, index) => {
              const pos = getTablePosition(index);
              const isActive = table.status !== TableStatus.Available;
              
              return (
                <motion.div
                  layout
                  key={table.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, zIndex: 50 }}
                  className={cn(
                    "absolute w-40 h-32 rounded-2xl p-4 cursor-pointer transition-shadow flex flex-col justify-between",
                    isActive 
                      ? "linear-card border-brand-purple/40 bg-brand-purple/5 shadow-[0_10px_30px_-10px_rgba(94,106,210,0.2)]" 
                      : "linear-card hover:border-brand-emerald/40"
                  )}
                  onClick={() => onTableClick(table)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-brand-gray uppercase tracking-widest mb-0.5">{table.location}</span>
                      <h4 className="text-sm font-bold text-white">{table.name}</h4>
                    </div>
                    {isActive ? (
                      <div className="w-5 h-5 rounded-md bg-brand-purple/20 flex items-center justify-center">
                        <HandMetal className="w-3 h-3 text-brand-purple" />
                      </div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-brand-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-[#31343e]" />
                      <span className="text-[10px] font-bold text-[#31343e]">{table.capacity}</span>
                    </div>
                    
                    {isActive ? (
                       <span className="text-[10px] font-black text-brand-purple uppercase">In Service</span>
                    ) : (
                       <button 
                         onClick={(e) => { e.stopPropagation(); onOpenTable(table.id); }}
                         className="text-[9px] font-black text-brand-emerald uppercase hover:underline"
                       >
                         Open
                       </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-6 p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/[0.05]">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-emerald" />
            <span className="text-[10px] font-bold text-brand-gray uppercase">Available</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-purple" />
            <span className="text-[10px] font-bold text-brand-gray uppercase">Occupied</span>
         </div>
      </div>
    </div>
  );
};
