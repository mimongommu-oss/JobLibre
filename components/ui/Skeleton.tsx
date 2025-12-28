
import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200/80", className)}
      {...props}
    />
  );
};

export const JobCardSkeleton: React.FC = () => {
    return (
        <div className="rounded-3xl p-5 mb-5 border-2 border-gray-100 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-6 w-24 mt-2" />
                </div>
            </div>
            <div className="mt-5 flex gap-3">
                <Skeleton className="h-11 flex-1 rounded-xl" />
                <Skeleton className="h-11 w-14 rounded-xl" />
            </div>
        </div>
    );
};
