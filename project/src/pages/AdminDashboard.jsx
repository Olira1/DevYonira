import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { LayoutDashboard, Users, BookOpen, CheckCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    pendingVerification: 0,
    totalMaterials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'student'));
      const usersSnapshot = await getDocs(usersQuery);
      const users = usersSnapshot.docs.map((doc) => doc.data());

      const verifiedCount = users.filter((u) => u.verified).length;
      const pendingCount = users.filter((u) => u.transactionID && !u.verified).length;

      const materialsSnapshot = await getDocs(collection(db, 'materials'));

      setStats({
        totalStudents: users.length,
        verifiedStudents: verifiedCount,
        pendingVerification: pendingCount,
        totalMaterials: materialsSnapshot.docs.length,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  const sidebarLinks = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: '/admin/verify',
      label: 'Verify Students',
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      path: '/admin/materials',
      label: 'Release Materials',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      path: '/admin/students',
      label: 'All Students',
      icon: <Users className="h-5 w-5" />,
    },
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

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar links={sidebarLinks} />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage students and course materials</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalStudents}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Verified Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.verifiedStudents}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Pending Verification</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.pendingVerification}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Materials</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalMaterials}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a
                  href="/admin/verify"
                  className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <h3 className="font-semibold text-blue-900">Verify Students</h3>
                  <p className="text-sm text-blue-700">
                    Review and approve student transactions
                  </p>
                </a>
                <a
                  href="/admin/materials"
                  className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <h3 className="font-semibold text-green-900">Release Materials</h3>
                  <p className="text-sm text-green-700">
                    Upload new course content for students
                  </p>
                </a>
                <a
                  href="/admin/students"
                  className="block p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition"
                >
                  <h3 className="font-semibold text-orange-900">View All Students</h3>
                  <p className="text-sm text-orange-700">
                    Check student progress and details
                  </p>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New student registration
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Material accessed by student
                    </p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Verification request pending
                    </p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
