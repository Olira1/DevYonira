import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { LayoutDashboard, Users, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchStudents = async () => {
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'student'));
      const usersSnapshot = await getDocs(usersQuery);
      const studentsData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
      setLoading(false);
    };

    fetchStudents();
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

  const filteredStudents = students.filter((student) => {
    if (filter === 'verified') return student.verified;
    if (filter === 'pending') return !student.verified;
    return true;
  });

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Students</h1>
          <p className="text-gray-600 mb-8">View student progress and details</p>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setFilter('verified')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  filter === 'verified'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Verified ({students.filter((s) => s.verified).length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  filter === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending ({students.filter((s) => !s.verified).length})
              </button>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No students found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                        {student.verified && (
                          <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{student.email}</p>
                      {student.transactionID && (
                        <p className="text-sm text-gray-500 mt-1">
                          Transaction ID: <span className="font-mono">{student.transactionID}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Joined: {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">
                          {student.progress || 0}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Overall Progress</p>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${student.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
