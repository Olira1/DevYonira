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
  Video,
  FileText,
  ExternalLink,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const StudentWeekDetail = () => {
  const { weekId } = useParams();
  const navigate = useNavigate();
  const [week, setWeek] = useState(null);
  const [phase, setPhase] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [weekId]);

  const fetchData = async () => {
    try {
      // Fetch week
      const weekDoc = await getDoc(doc(db, "weeks", weekId));
      if (weekDoc.exists()) {
        const weekData = { id: weekDoc.id, ...weekDoc.data() };
        setWeek(weekData);

        // Fetch phase
        if (weekData.phaseId) {
          const phaseDoc = await getDoc(doc(db, "phases", weekData.phaseId));
          if (phaseDoc.exists()) {
            setPhase({ id: phaseDoc.id, ...phaseDoc.data() });
          }
        }
      }

      // Fetch only released resources for this week
      // Try with orderBy first, fallback to without if index is missing
      let resourcesSnapshot;
      try {
        const resourcesQuery = query(
          collection(db, "resources"),
          where("weekId", "==", weekId),
          where("isReleased", "==", true),
          orderBy("order", "asc")
        );
        resourcesSnapshot = await getDocs(resourcesQuery);
      } catch (indexError) {
        // If composite index is missing, fetch without orderBy and sort in memory
        console.warn("Composite index missing, fetching without orderBy:", indexError);
        const resourcesQuery = query(
          collection(db, "resources"),
          where("weekId", "==", weekId),
          where("isReleased", "==", true)
        );
        resourcesSnapshot = await getDocs(resourcesQuery);
      }
      
      const resourcesData = resourcesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort by order if not already sorted
      resourcesData.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      console.log("📚 Student Resources Fetched:", {
        weekId: weekId,
        totalResources: resourcesData.length,
        resources: resourcesData.map(r => ({
          id: r.id,
          title: r.title,
          isReleased: r.isReleased,
          topic: r.topic
        }))
      });
      
      setResources(resourcesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(`Error fetching data: ${error.message}`);
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

  if (!week) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="m-auto text-center">
          <p className="text-gray-600">Week not found</p>
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

  const classNotes = resources.filter((r) => r.topic === "classNotes");
  const videos = resources.filter((r) => r.topic === "video");

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar links={sidebarLinks} />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(`/student/materials/phase/${week.phaseId}`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Weeks</span>
          </button>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {week.title}
            </h1>
            {phase && (
              <p className="text-gray-600 mb-2">Phase: {phase.title}</p>
            )}
            <p className="text-gray-600">{week.description}</p>
          </div>

          <div className="space-y-8">
            {/* Class Notes Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Class Notes/Materials ({classNotes.length})
                </h2>
              </div>
              {classNotes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No class notes available yet. Check back later.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {classNotes.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <FileText className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-bold text-gray-900">
                              {resource.title}
                            </h3>
                          </div>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mt-4"
                            >
                              <span>View PDF</span>
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Video className="h-6 w-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Videos ({videos.length})
                </h2>
              </div>
              {videos.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No videos available yet. Check back later.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Video className="h-5 w-5 text-red-600" />
                            <h3 className="text-lg font-bold text-gray-900">
                              {resource.title}
                            </h3>
                          </div>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mt-4"
                            >
                              <span>Watch Video</span>
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentWeekDetail;
