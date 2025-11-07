import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { LayoutDashboard, BookOpen, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [transactionID, setTransactionID] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleVerifyTransaction = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        transactionID: transactionID,
      });

      setMessage('Transaction ID submitted! Waiting for admin approval.');
      setUserData({ ...userData, transactionID });
    } catch (error) {
      setMessage('Failed to submit transaction ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sidebarLinks = [
    {
      path: '/student',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: '/student/materials',
      label: 'My Materials',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      path: '/student/progress',
      label: 'Progress',
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  if (!userData) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="m-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar links={sidebarLinks} />

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-gray-600 mb-8">Track your learning progress and access materials</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Verification Status</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {userData.verified ? 'Verified' : 'Pending'}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    userData.verified ? 'bg-green-100' : 'bg-orange-100'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      userData.verified ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {userData.progress || 0}%
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Materials Access</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {userData.verified ? 'Unlocked' : 'Locked'}
                  </p>
                </div>
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
            </div>
          </div>

          {!userData.verified && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Verify Your Payment
              </h2>
              <p className="text-gray-600 mb-6">
                Enter your transaction ID to get verified and unlock course materials.
              </p>

              {message && (
                <div
                  className={`mb-4 px-4 py-3 rounded-lg ${
                    message.includes('submitted')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleVerifyTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={transactionID}
                    onChange={(e) => setTransactionID(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your transaction ID"
                    required
                    disabled={userData.transactionID}
                  />
                </div>

                {!userData.transactionID && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit for Verification'}
                  </button>
                )}

                {userData.transactionID && (
                  <p className="text-green-600">
                    Transaction ID submitted. Waiting for admin approval.
                  </p>
                )}
              </form>
            </div>
          )}

          {userData.verified && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
              <p className="mb-4">
                Your payment has been verified. You now have full access to all course materials.
              </p>
              <a
                href="/student/materials"
                className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                View Materials
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
