import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import UploadArea from '../components/UploadArea';

const toolDetails = {
  'merge': { name: 'Merge PDF', description: 'Combine multiple PDFs into one unified document.', type: '.pdf', multiple: true },
  'compress': { name: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', type: '.pdf', multiple: false },
  'pdf-to-word': { name: 'PDF to Word', description: 'Convert PDFs to editable Word documents.', type: '.pdf', multiple: false },
  'word-to-pdf': { name: 'Word to PDF', description: 'Convert Word documents to PDF.', type: '.doc,.docx', multiple: false },
  'jpg-to-png': { name: 'JPG to PNG', description: 'Convert JPG images to PNG format.', type: '.jpg,.jpeg', multiple: false },
  'png-to-jpg': { name: 'PNG to JPG', description: 'Transform PNG images into high-quality JPGs.', type: '.png', multiple: false },
  'mp4-to-mp3': { name: 'MP4 to MP3', description: 'Extract audio from video files.', type: '.mp4', multiple: false },
  'mp4-to-gif': { name: 'MP4 to GIF', description: 'Convert video to animated GIF.', type: '.mp4', multiple: false },
};

const ToolPage = () => {
  const { toolId } = useParams();
  const tool = toolDetails[toolId];
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  if (!tool) {
    return <div className="text-center mt-20 text-2xl">Tool not found</div>;
  }

  const handleUpload = async (files) => {
    setError(null);
    setDownloadUrl(null);
    
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach(file => formData.append('files', file));
    } else {
      formData.append('file', files);
    }

    try {
      // Determine endpoint based on toolId
      const endpoint = `http://localhost:3000/api/${toolId}`;
      
      const response = await axios.post(endpoint, formData, {
        responseType: 'blob', // Important for downloading files
      });

      // Handle mock responses (JSON returned instead of blob)
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const json = JSON.parse(text);
        if (json.message) {
          setError(json.message); // using error state to show mock message
          return;
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setError('An error occurred during processing. Make sure the backend server is running.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all tools
      </Link>

      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {tool.name}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-500 dark:text-slate-400"
        >
          {tool.description}
        </motion.p>
      </div>

      {!downloadUrl && !error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <UploadArea toolId={toolId} onUpload={handleUpload} multiple={tool.multiple} acceptedTypes={{[tool.type]: []}} />
        </motion.div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl text-center">
          <p className="text-amber-800 dark:text-amber-200 font-medium">{error}</p>
          <button onClick={() => setError(null)} className="mt-4 px-6 py-2 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded-lg hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors">
            Try Again
          </button>
        </motion.div>
      )}

      {downloadUrl && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl mx-auto p-12 glass-panel rounded-3xl text-center border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-3xl font-bold mb-4">Task Complete!</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-8">Your file has been successfully processed.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={downloadUrl} 
              download={`converted_${Date.now()}`}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
            >
              Download File
            </a>
            <button 
              onClick={() => setDownloadUrl(null)}
              className="px-8 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-colors"
            >
              Start Over
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ToolPage;
