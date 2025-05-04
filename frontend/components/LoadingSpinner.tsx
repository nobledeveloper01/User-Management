// components/LoadingSpinner.tsx
'use client';

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
    lg: 'h-6 w-6 border-2'
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-solid border-t-transparent ${sizeClasses[size]}`}
        style={{ borderColor: 'currentColor' }}
      ></div>
    </div>
  );
}