import { useRouteError, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";

export default function ErrorBoundary() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-gray-100"
      >
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-600">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
          {error.status === 404 ? "Page Not Found" : "Oops! Something went wrong"}
        </h1>
        
        <p className="text-gray-500 font-medium leading-relaxed mb-10">
          {error.status === 404 
            ? "The page you are looking for doesn't exist or has been moved. Let's get you back on track."
            : "An unexpected error occurred. Our team has been notified and we're working to fix it."}
        </p>

        <div className="flex flex-col gap-4">
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-green-700 transition-all"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black hover:bg-gray-100 transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>
        </div>

        {import.meta.env.DEV && (
          <div className="mt-8 text-left bg-gray-900 rounded-2xl p-4 overflow-auto max-h-40">
            <p className="text-xs font-mono text-red-400 mb-2">Debug Info:</p>
            <pre className="text-[10px] font-mono text-gray-400">
              {error.statusText || error.message}
            </pre>
          </div>
        )}
      </motion.div>
    </div>
  );
}
