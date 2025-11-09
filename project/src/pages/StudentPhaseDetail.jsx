import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  ArrowLeft,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const StudentPhaseDetail = () => {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [phaseId]);

  const fetchData = async () => {
    try {
      // Fetch phase
      const phaseDoc = await getDoc(doc(db, "phases", phaseId));
      if (phaseDoc.exists()) {
        setPhase({ id: phaseDoc.id, ...phaseDoc.data() });
      }

      // Fetch weeks for this phase
      const weeksQuery = query(
        collection(db, "weeks"),
        where("phaseId", "==", phaseId),
        orderBy("order", "asc")
      );
      const weeksSnapshot = await getDocs(weeksQuery);
      const weeksData = weeksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWeeks(weeksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!phase) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="m-auto text-center">
          <p className="text-gray-600">Phase not found</p>
          <button
            onClick={() => navigate("/student/materials")}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar links={sidebarLinks} />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/student/materials")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Phases</span>
          </button>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {phase.title}
            </h1>
            <p className="text-gray-600">{phase.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Weeks ({weeks.length})
            </h2>
            {weeks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No weeks available yet. Check back later.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {weeks.map((week) => (
                  <div
                    key={week.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                    onClick={() =>
                      navigate(`/student/materials/week/${week.id}`)
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <h3 className="text-xl font-bold text-gray-900">
                            {week.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-2">{week.description}</p>
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
    </div>
  );
};

export default StudentPhaseDetail;
