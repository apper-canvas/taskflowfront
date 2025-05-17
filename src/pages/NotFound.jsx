import React from 'react';
import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

function NotFound() {
  const AlertCircleIcon = getIcon('AlertCircle');

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-surface-50 dark:bg-surface-900 py-10 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg text-center">
        <div className="inline-flex justify-center items-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
          <AlertCircleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-3">Page Not Found</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        
        <Link to="/" className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
export default NotFound;