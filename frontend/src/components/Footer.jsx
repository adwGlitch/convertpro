import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-12 border-t border-slate-200 dark:border-slate-800 glass-panel">
      <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} ConvertPro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
