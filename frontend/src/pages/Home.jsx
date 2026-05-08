import React from 'react';
import { motion } from 'framer-motion';
import { FileUp, FileArchive, FileText, Image as ImageIcon, FileOutput, Scissors, Film, Music } from 'lucide-react';
import ToolCard from '../components/ToolCard';

const tools = [
  { id: 'merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one unified document.', icon: FileUp, color: 'from-indigo-500 to-purple-600' },
  { id: 'compress', name: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', icon: FileArchive, color: 'from-emerald-400 to-teal-500' },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDFs to editable Word documents.', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Make DOC and DOCX files easy to read by converting them to PDF.', icon: FileOutput, color: 'from-orange-400 to-red-500' },
  { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG images to PNG format with transparent backgrounds.', icon: ImageIcon, color: 'from-pink-500 to-rose-500' },
  { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Transform PNG images into high-quality JPGs.', icon: Scissors, color: 'from-amber-400 to-orange-500' },
  { id: 'mp4-to-mp3', name: 'MP4 to MP3', description: 'Extract high-quality audio from your video files.', icon: Music, color: 'from-fuchsia-500 to-pink-600' },
  { id: 'mp4-to-gif', name: 'MP4 to GIF', description: 'Convert video clips into looping animated GIFs.', icon: Film, color: 'from-violet-500 to-purple-600' },
];

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob dark:bg-purple-900"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000 dark:bg-indigo-900"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000 dark:bg-pink-900"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400"
          >
            All the tools you need <br className="hidden md:block" />
            to work with files
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium"
          >
            100% free and easy to use. Merge, compress, and convert files in seconds without losing quality.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5, ease: "easeOut" }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
