import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  iconSize = 5, 
  textSize = "text-xl" 
}) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/')}
      className={cn(
        "flex items-center gap-2.5 cursor-pointer group transition-all active:scale-95",
        className
      )}
    >
      <div className={cn(
        "bg-brand-purple rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(244,181,65,0.45)] transition-transform group-hover:scale-110",
        `w-${iconSize + 3} h-${iconSize + 3}`
      )}>
        <Store className={cn("text-white", `w-${iconSize} h-${iconSize}`)} />
      </div>
      <span className={cn("font-bold tracking-tight text-white", textSize)}>ZôOS</span>
    </div>
  );
};
