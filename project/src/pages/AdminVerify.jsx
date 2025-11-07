import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { LayoutDashboard, Users, BookOpen, CheckCircle, X, Check } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const AdminVerify = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const usersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'student')
    );
    const usersSnapshot = await getDocs(usersQuery);
    const studentsData = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(studentsData);
    setLoading(false);
  };

  const handleVerify = async (studentId, approve) => {
    setActionLoading(studentId);

    try {
      await updateDoc(doc(db, 'users', studentId), {
        verified: approve,
      });

      await fetchStudents();
    } catch (error) {
      alert('Failed to update verification status');
    } finally {
      setActionLoading(null);
    }
  };

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

  const pendingStudents = students.filter((s) => s.transactionID && !s.verified);
  const verifiedStudents = students.filter((s) => s.verified);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar links={sidebarLinks} />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Students</h1>
          <p className="text-gray-600 mb-8">Review and approve student transactions</p>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Pending Verification ({pendingStudents.length})
            </h2>
            {pendingStudents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending verifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingStudents.map((student) => (
                  <div
                    key={student.id}
                    className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                      <p className="text-gray-600">{student.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Transaction ID: <span className="font-mono">{student.transactionID}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Joined: {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleVerify(student.id, true)}
                        disabled={actionLoading === student.id}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Check className="h-5 w-5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleVerify(student.id, false)}
                        disabled={actionLoading === student.id}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center space-x-2 disabled:opacity-50"
                      >
                        <X className="h-5 w-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Verified Students ({verifiedStudents.length})
            </h2>
            {verifiedStudents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No verified students yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifiedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                      <p className="text-gray-600">{student.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Transaction ID: <span className="font-mono">{student.transactionID}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-6 w-6" />
                      <span className="font-semibold">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVerify;
