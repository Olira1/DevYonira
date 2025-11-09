import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CheckCircle,
  Plus,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Trash2,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const AdminPhaseDetail = () => {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWeekForm, setShowWeekForm] = useState(false);
  const [weekFormData, setWeekFormData] = useState({
    title: "",
    description: "",
    order: 1,
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleWeekSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, "weeks"), {
        ...weekFormData,
        phaseId: phaseId,
        createdAt: new Date().toISOString(),
      });

      setWeekFormData({
        title: "",
        description: "",
        order: weeks.length + 1,
      });
      setShowWeekForm(false);
      await fetchData();
      alert("Week created successfully!");
    } catch (error) {
      console.error("Error creating week:", error);
      alert("Failed to create week");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWeek = async (weekId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this week? This will also delete all resources under it."
      )
    ) {
      try {
        // Delete all resources under this week
        const resourcesQuery = query(
          collection(db, "resources"),
          orderBy("order", "asc")
        );
        const resourcesSnapshot = await getDocs(resourcesQuery);
        const resourcesToDelete = resourcesSnapshot.docs.filter(
          (doc) => doc.data().weekId === weekId
        );

        for (const resourceDoc of resourcesToDelete) {
          await deleteDoc(doc(db, "resources", resourceDoc.id));
        }

        await deleteDoc(doc(db, "weeks", weekId));
        await fetchData();
        alert("Week deleted successfully!");
      } catch (error) {
        console.error("Error deleting week:", error);
        alert("Failed to delete week");
      }
    }
  };

  const sidebarLinks = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: "/admin/verify",
      label: "Verify Students",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      path: "/admin/materials",
      label: "Release Materials",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      path: "/admin/students",
      label: "All Students",
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

  if (!phase) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="m-auto text-center">
          <p className="text-gray-600">Phase not found</p>
          <button
            onClick={() => navigate("/admin/materials")}
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
            onClick={() => navigate("/admin/materials")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Phases</span>
          </button>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {phase.title}
              </h1>
            </div>
            <p className="text-gray-600">{phase.description}</p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Weeks</h2>
              <p className="text-gray-600">Manage weeks and their resources</p>
            </div>
            <button
              onClick={() => setShowWeekForm(!showWeekForm)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Week</span>
            </button>
          </div>

          {showWeekForm && (
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create New Week
              </h2>
              <form onSubmit={handleWeekSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Week Title
                  </label>
                  <input
                    type="text"
                    value={weekFormData.title}
                    onChange={(e) =>
                      setWeekFormData({
                        ...weekFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Week 1: Basic Computer Skills"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={weekFormData.description}
                    onChange={(e) =>
                      setWeekFormData({
                        ...weekFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of what will be learned in this week"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={weekFormData.order}
                    onChange={(e) =>
                      setWeekFormData({
                        ...weekFormData,
                        order: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submitting ? "Creating..." : "Create Week"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWeekForm(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Weeks ({weeks.length})
            </h3>
            {weeks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No weeks created yet. Create your first week to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {weeks.map((week) => (
                  <div
                    key={week.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
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
                        <p className="text-sm text-gray-500">
                          Order: {week.order}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/materials/week/${week.id}`)
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                        >
                          <span>Manage Resources</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWeek(week.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Week"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
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
  );
};

export default AdminPhaseDetail;
