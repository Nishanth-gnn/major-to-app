import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  message: string;
}

export const ErrorCard: React.FC<Props> = ({ message }) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 w-full flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
      <div>
        <h3 className="text-sm font-medium text-red-800">Translation Error</h3>
        <p className="mt-1 text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
};

export default ErrorCard;
