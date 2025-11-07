import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { LayoutDashboard, BookOpen, TrendingUp, Award } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const StudentProgress = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

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

  const phases = [
    { name: 'HTML & CSS Fundamentals', status: 'completed' },
    { name: 'JavaScript Mastery', status: 'in-progress' },
    { name: 'React.js Development', status: 'locked' },
    { name: 'Node.js & Express', status: 'locked' },
    { name: 'Database Management', status: 'locked' },
    { name: 'Final Capstone Project', status: 'locked' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="m-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const progress = userData?.progress || 0;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar links={sidebarLinks} />

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
          <p className="text-gray-600 mb-8">Track your learning journey</p>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Overall Progress</h2>
              <span className="text-3xl font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 mt-4">
              {progress === 100
                ? 'Congratulations! You have completed all materials.'
                : `Keep going! You're making great progress.`}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Phases</h2>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        phase.status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : phase.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{phase.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{phase.status}</p>
                    </div>
                  </div>
                  {phase.status === 'completed' && (
                    <Award className="h-6 w-6 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {progress === 100 && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md p-8 text-center">
              <Award className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
              <p className="text-lg">
                You've completed the DevYonira Bootcamp. You're ready to start your career as a
                developer!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
