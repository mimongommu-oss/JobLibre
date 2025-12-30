
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public readonly props: Readonly<Props>;

  public state: State = {
    hasError: false,
    error: undefined
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-100 animate-in zoom-in">
            <AlertTriangle size={40} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Oups, petit problème !</h1>
          <p className="text-gray-500 mb-8 max-w-xs text-sm font-medium">
            Une erreur inattendue s'est produite. Essayez de recharger.
          </p>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-full max-w-sm mb-8 text-left overflow-auto max-h-32">
             <p className="text-[10px] font-mono text-red-500 break-words">
                {this.state.error?.message || "Erreur inconnue"}
             </p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-jobgreen text-white rounded-xl font-bold shadow-lg shadow-green-900/10 hover:bg-green-700 transition-all active:scale-95"
          >
            <RefreshCw size={18} /> Recharger l'application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
