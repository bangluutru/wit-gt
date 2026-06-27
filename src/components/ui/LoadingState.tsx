import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message, fullScreen = false }: LoadingStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-3
        ${fullScreen ? 'fixed inset-0 bg-wit-paper z-50' : 'py-20'}
      `}
    >
      <Loader2 className="h-8 w-8 animate-spin text-wit-red" />
      {message && (
        <p className="text-sm text-wit-text-secondary animate-fade-in">
          {message}
        </p>
      )}
    </div>
  );
}
