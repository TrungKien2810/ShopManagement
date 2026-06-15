import React from "react";
import { cn } from "../lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "skeleton-shimmer",
        className
      )} 
    />
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="p-5 linear-surface h-40 flex flex-col justify-between">
          <div>
            <Skeleton className="h-2 w-16 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-full mt-auto" />
        </div>
      ))}
    </div>
  );
};

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="linear-card p-4 flex gap-4">
          <Skeleton className="w-20 h-20 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
