import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Layers, LogOut, User, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { currentUser, loginWithGoogle, logout } = useAuth();

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className="fixed w-full z-50 top-0 left-0 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Layers className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-xl tracking-tight">ConvertPro</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="hidden sm:flex items-center space-x-1 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              <span>Admin</span>
            </Link>
            <Link to="/pricing" className="hidden sm:flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-orange-500/30">
              <Star className="h-4 w-4 fill-white" />
              <span>Go Premium</span>
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" className="h-6 w-6 rounded-full" />
                  ) : (
                    <User className="h-5 w-5 text-slate-500" />
                  )}
                  <span className="text-sm font-medium hidden sm:block">{currentUser.displayName || 'User'}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={loginWithGoogle}
                className="px-5 py-2 gradient-btn rounded-xl shadow-lg"
              >
                Log In
              </button>
            )}
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
