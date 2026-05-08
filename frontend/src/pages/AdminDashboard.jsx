import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileOutput, Server, Settings, Activity, Trash2, Edit } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { name: 'Total Users', value: '1,248', icon: Users, change: '+12%' },
    { name: 'Files Processed', value: '8,592', icon: FileOutput, change: '+24%' },
    { name: 'Server Load', value: '34%', icon: Server, change: '-5%' },
    { name: 'Active Sessions', value: '142', icon: Activity, change: '+18%' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Premium', joined: '2026-05-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'Free', joined: '2026-05-02' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', plan: 'Premium', joined: '2026-05-05' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', plan: 'Free', joined: '2026-05-06' },
    { id: 5, name: 'Alex Brown', email: 'alex@example.com', plan: 'Free', joined: '2026-05-07' },
  ];

  const recentConversions = [
    { id: 101, fileName: 'q3_financial_report.pdf', tool: 'Compress PDF', user: 'Jane Smith', date: 'Just now', size: '4.2 MB' },
    { id: 102, fileName: 'vacation_photos.zip', tool: 'JPG to PNG', user: 'Mike Johnson', date: '2 mins ago', size: '12.8 MB' },
    { id: 103, fileName: 'contract_draft_v2.docx', tool: 'Word to PDF', user: 'John Doe', date: '15 mins ago', size: '1.1 MB' },
    { id: 104, fileName: 'product_demo.mp4', tool: 'MP4 to GIF', user: 'Sarah Wilson', date: '1 hour ago', size: '24.5 MB' },
    { id: 105, fileName: 'scanned_receipts.pdf', tool: 'Merge PDF', user: 'Alex Brown', date: '3 hours ago', size: '8.4 MB' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 rounded-2xl flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{stat.name}</p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-amber-500'}`}>
                {stat.change} from last month
              </p>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <stat.icon className="w-8 h-8" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6">Recent Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="pb-4 px-4 font-medium">Name</th>
                  <th className="pb-4 px-4 font-medium">Plan</th>
                  <th className="pb-4 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.plan === 'Premium' 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' 
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex justify-end space-x-2">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6">Recent Conversions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="pb-4 px-4 font-medium">File / User</th>
                  <th className="pb-4 px-4 font-medium">Tool Used</th>
                  <th className="pb-4 px-4 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentConversions.map((conv) => (
                  <tr key={conv.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium text-sm truncate max-w-[200px]" title={conv.fileName}>{conv.fileName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">by {conv.user} • {conv.size}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {conv.tool}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {conv.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage users, view analytics, and configure system settings.</p>
        </div>
        
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? renderOverview() : (
        <div className="glass-panel p-8 rounded-3xl text-center">
          <Settings className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">System Settings</h2>
          <p className="text-slate-500">Configuration options are restricted in this demo environment.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
