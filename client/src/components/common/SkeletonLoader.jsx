import React from 'react';

/**
 * Basic Shimmer Line or Block
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-slate-200/80 dark:bg-slate-700/60 animate-pulse rounded-2xl ${className}`}
      {...props}
    />
  );
};

/**
 * Dashboard & Home Page Skeleton (Student & Teacher)
 */
export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse max-w-5xl mx-auto w-full p-2 sm:p-4">
      {/* Top Header Card Skeleton */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-3 w-full sm:w-2/3">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-2xl" />
          <Skeleton className="h-4 w-48 rounded-full" />
        </div>
        <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl shrink-0" />
      </div>

      {/* 4 Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="w-7 h-7 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20 rounded-xl" />
            <Skeleton className="h-3 w-28 rounded-full" />
          </div>
        ))}
      </div>

      {/* Main Content / Lesson Modules Grid Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-full rounded-xl" />
                <Skeleton className="h-3 w-3/4 rounded-full" />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Lesson Learning View Skeleton (Video + Content + Activities)
 */
export const LessonSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl mx-auto w-full p-2 sm:p-4">
      {/* Top Stepper Navigation Skeleton */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-xl" />
        ))}
      </div>

      {/* Video / Hero Section Skeleton */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        <div className="space-y-3 text-center flex flex-col items-center">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-8 w-72 rounded-2xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-full" />
        </div>

        {/* Video Player Placeholder */}
        <Skeleton className="aspect-video w-full max-w-2xl mx-auto rounded-3xl shadow-md" />

        {/* Action Button Placeholder */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Skeleton className="h-12 w-40 rounded-2xl" />
          <Skeleton className="h-12 w-52 rounded-2xl" />
        </div>
      </div>

      {/* Concept Cards Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * Learning Path Competencies Skeleton
 */
export const LearningPathSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl mx-auto w-full p-2 sm:p-4">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-2xl" />
          <Skeleton className="h-3 w-64 rounded-full" />
        </div>
        <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Skeleton className="h-11 w-32 rounded-2xl" />
        <Skeleton className="h-11 w-32 rounded-2xl" />
      </div>

      {/* Path Competencies List */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 flex-1">
              <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-5 w-3/4 rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-10 w-28 rounded-2xl shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Teacher Table & Tracker Skeleton
 */
export const TableSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse w-full">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52 rounded-2xl" />
          <Skeleton className="h-3 w-40 rounded-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-none">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Teacher Analytics Page Skeleton
 */
export const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse w-full">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-2xl" />
          <Skeleton className="h-3 w-48 rounded-full" />
        </div>
        <Skeleton className="w-10 h-10 rounded-2xl" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-xl" />
            <Skeleton className="h-3 w-32 rounded-full" />
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <Skeleton className="h-5 w-48 rounded-full" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <Skeleton className="h-5 w-48 rounded-full" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
