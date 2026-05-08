import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, CheckCircle, Loader2, ArrowUpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadArea = ({ toolId, onUpload, multiple = false, acceptedTypes }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isUploading) {
      interval = setInterval(() => {
        setProgress(p => (p < 90 ? p + Math.random() * 15 : p));
      }, 500);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => multiple ? [...prev, ...acceptedFiles] : acceptedFiles);
  }, [multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: acceptedTypes,
    multiple 
  });

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    await onUpload(multiple ? files : files[0]);
    setIsUploading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <div 
        {...getRootProps()} 
        className={`relative border-[3px] border-dashed rounded-[2rem] p-16 text-center cursor-pointer overflow-hidden transition-all duration-500 ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.02]' 
            : 'border-slate-300/80 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
        } glass-panel flex flex-col items-center justify-center min-h-[350px] shadow-sm`}
      >
        <input {...getInputProps()} />
        <motion.div 
          animate={{ y: isDragActive ? -10 : 0 }}
          className="bg-indigo-100 dark:bg-indigo-900/50 p-6 rounded-full mb-6 shadow-inner"
        >
          {isDragActive ? (
             <ArrowUpCircle className="h-16 w-16 text-indigo-600 dark:text-indigo-400 animate-bounce" />
          ) : (
             <UploadCloud className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
          )}
        </motion.div>
        <h3 className="text-3xl font-bold mb-4 tracking-tight">
          {isDragActive ? 'Drop files now' : 'Select files to convert'}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg font-medium">or drag and drop them here</p>
        
        <button className="px-8 py-3 gradient-btn rounded-xl shadow-lg">
          Browse Files
        </button>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 glass-panel rounded-3xl p-8 border border-indigo-100 dark:border-indigo-900/30"
          >
            <h4 className="font-bold text-xl mb-6 flex items-center">
              <CheckCircle className="text-emerald-500 mr-3 h-6 w-6" />
              {files.length} file{files.length !== 1 && 's'} ready
            </h4>
            <div className="space-y-4 mb-8">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mr-4">
                      <File className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!isUploading && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(file); }}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {isUploading && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-indigo-600 dark:text-indigo-400">Processing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    className="bg-indigo-600 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.5 }}
                  ></motion.div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleProcess}
              disabled={isUploading}
              className="w-full gradient-btn py-4 rounded-xl text-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin mr-3 h-6 w-6" />
                  Converting Files
                </>
              ) : (
                'Start Conversion'
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadArea;
