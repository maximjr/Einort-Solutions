import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6 geometric-clip">
            <AlertOctagon className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="font-display font-medium text-3xl mb-4 text-white">System Exception</h1>
          <p className="text-silver-metallic font-light text-sm max-w-md mb-8">
            The rendering engine encountered an unexpected fault. Our telemetry has captured the breakdown. 
          </p>
          
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl max-w-lg w-full mb-8 text-left overflow-x-auto text-[10px] font-mono text-white/50">
             {this.state.error?.message || "Unknown rendering error"}
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 geometric-clip-button px-6 py-3 bg-white text-dark hover:bg-white/90 transition-colors uppercase tracking-widest text-[10px] font-bold"
          >
             <RotateCcw className="w-4 h-4" /> Initialize Recovery Sequence
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
