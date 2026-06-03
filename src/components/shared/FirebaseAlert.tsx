import { AlertTriangle, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { isFirebaseConfigured } from "../../lib/firebase";

export function FirebaseAlert({ feature }: { feature: string }) {
  const [copied, setCopied] = useState(false);

  if (isFirebaseConfigured) return null;

  const envs = `VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 text-left mb-8">
      <div className="flex items-start gap-4">
        <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400 shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-white mb-2">
            {feature} is temporarily unavailable
          </h3>
          <p className="text-sm text-slate-300 font-light mb-4">
            This module requires a secure connection to the database. Missing
            environment variables detected. Please configure your Vercel
            deployment{" "}
            <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-xs tracking-wider">
              .env
            </code>{" "}
            variables.
          </p>

          <div className="bg-background/80 rounded-xl p-4 overflow-x-auto border border-white/5 relative group">
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
              title="Copy environment template"
            >
              {copied ? (
                <CheckCircle2 size={16} className="text-green-400" />
              ) : (
                <Copy size={16} />
              )}
            </button>
            <pre className="text-slate-400 text-xs font-mono leading-relaxed">
              {envs}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
