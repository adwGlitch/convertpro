import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Shield, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (!currentUser) {
      loginWithGoogle();
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create order on backend
      const { data: order } = await axios.post('http://localhost:3000/api/create-order');

      // 2. Open Razorpay Checkout
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with actual key
        amount: order.amount,
        currency: order.currency,
        name: 'ConvertPro Premium',
        description: 'Unlock unlimited file conversions and priority processing.',
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify payment on backend
            const verifyRes = await axios.post('http://localhost:3000/api/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            if (verifyRes.data.success) {
              alert('Payment successful! You are now a Premium member.');
              // Here you would typically update the user's status in the database/context
            }
          } catch (err) {
            alert('Payment verification failed.');
            console.error(err);
          }
        },
        prefill: {
          name: currentUser.displayName || '',
          email: currentUser.email || '',
        },
        theme: {
          color: '#4f46e5', // indigo-600
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert('Payment failed: ' + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert('Failed to initiate payment. Make sure the backend is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold mb-6"
        >
          Supercharge your workflow
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-500 dark:text-slate-400"
        >
          Get unlimited conversions, faster processing, and no ads.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto"
      >
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg uppercase tracking-wide">
            Most Popular
          </div>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Star className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Premium</h2>
          </div>

          <div className="mb-6">
            <span className="text-5xl font-extrabold">₹999</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">/lifetime</span>
          </div>

          <ul className="space-y-4 mb-8">
            {['Unlimited file size', 'Batch processing (up to 50 files)', 'Priority conversion speed', 'No advertisements', '24/7 Priority Support'].map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                {currentUser ? 'Upgrade Now' : 'Login to Upgrade'}
              </>
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            <Shield className="h-4 w-4 mr-1.5" />
            Secure payment powered by Razorpay
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing;
