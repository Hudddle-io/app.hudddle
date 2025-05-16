import { Loader } from "lucide-react";
import React from "react";

const LoadingPage = ({ loadingText }: { loadingText: string }) => {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className="h-10 w-10 animate-spin text-gray-200" />
        <p className="text-xs font-thin">{loadingText}</p>
      </div>
    </div>
  );
};

export default LoadingPage;
