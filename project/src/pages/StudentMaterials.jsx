import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Lock,
  Folder,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const StudentMaterials = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch phases
        const phasesQuery = query(
          collection(db, "phases"),
          orderBy("order", "asc")
        );
        const phasesSnapshot = await getDocs(phasesQuery);
        const phasesData = phasesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPhases(phasesData);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const sidebarLinks = [
    {
      path: "/student",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: "/student/materials",
      label: "My Materials",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      path: "/student/progress",
      label: "Progress",
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Materials
          </h1>
          <p className="text-gray-600 mb-8">
            Access all your learning resources
          </p>

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
          ) : phases.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Phases Yet
              </h2>
              <p className="text-gray-600">
                Phases will appear here once the admin creates them.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {phases.map((phase) => (
                <div
                  key={phase.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() =>
                    navigate(`/student/materials/phase/${phase.id}`)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Folder className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">
                          {phase.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-2">{phase.description}</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gray-400" />
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
