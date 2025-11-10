import { Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
          >
            <Home className="h-5 w-5" />
            <span>Go to Homepage</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full mt-4 text-gray-600 hover:text-gray-900 transition flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

