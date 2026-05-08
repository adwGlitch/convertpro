import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ToolCard = ({ tool }) => {
  const Icon = tool.icon;
  
  return (
    <Link to={`/tool/${tool.id}`}>
      <motion.div 
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
        className="glass-panel premium-card-hover p-8 rounded-3xl cursor-pointer h-full flex flex-col items-start"
      >
        <div className={`p-4 rounded-2xl mb-6 text-white bg-gradient-to-br shadow-lg shadow-${tool.color.split('-')[1]}-500/30 ${tool.color}`}>
          <Icon className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">{tool.name}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed flex-grow">
          {tool.description}
        </p>
      </motion.div>
    </Link>
  );
};

export default ToolCard;
