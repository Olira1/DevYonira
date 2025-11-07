import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, collection, query, orderBy, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { LayoutDashboard, BookOpen, TrendingUp, ExternalLink, Lock } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const StudentMaterials = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        const materialsQuery = query(
          collection(db, 'materials'),
          orderBy('releaseDate', 'desc')
        );
        const materialsSnapshot = await getDocs(materialsQuery);
        const materialsData = materialsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMaterials(materialsData);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleMaterialClick = async (materialId) => {
    if (userData && userData.verified) {
      const currentProgress = userData.progress || 0;
      const increment = Math.floor(100 / materials.length);
      const newProgress = Math.min(currentProgress + increment, 100);

      await updateDoc(doc(db, 'users', user.uid), {
        progress: newProgress,
      });

      setUserData({ ...userData, progress: newProgress });
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
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Materials</h1>
          <p className="text-gray-600 mb-8">Access all your learning resources</p>

          {!userData?.verified ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Materials Locked
              </h2>
              <p className="text-gray-600 mb-6">
                Please verify your payment to unlock all course materials.
              </p>
              <a
                href="/student"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </a>
            </div>
          ) : materials.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Materials Yet
              </h2>
              <p className="text-gray-600">
                Materials will appear here once the admin releases them.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                          {material.phase}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {material.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{material.description}</p>
                      <p className="text-sm text-gray-500">
                        Released: {new Date(material.releaseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={material.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleMaterialClick(material.id)}
                      className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                    >
                      <span>View</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
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

export default StudentMaterials;
