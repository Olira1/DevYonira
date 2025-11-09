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
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase/firebaseConfig";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CheckCircle,
  Plus,
  ArrowLeft,
  Video,
  FileText,
  Trash2,
  Edit,
  ToggleLeft,
  ToggleRight,
  Upload,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const AdminWeekDetail = () => {
  const { weekId } = useParams();
  const navigate = useNavigate();
  const [week, setWeek] = useState(null);
  const [phase, setPhase] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceFormData, setResourceFormData] = useState({
    title: "",
    topic: "classNotes", // 'classNotes' or 'video'
    url: "",
    file: null,
    order: 1,
    isReleased: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

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

      // Fetch resources for this week
      const resourcesQuery = query(
        collection(db, "resources"),
        where("weekId", "==", weekId),
        orderBy("order", "asc")
      );
      const resourcesSnapshot = await getDocs(resourcesQuery);
      const resourcesData = resourcesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResources(resourcesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setResourceFormData((prev) => ({
        ...prev,
        file: files[0],
      }));
    } else if (type === "checkbox") {
      setResourceFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setResourceFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let resourceUrl = resourceFormData.url;
      let filePath = "";

      // Upload file if it's a class note (PDF)
      if (resourceFormData.topic === "classNotes" && resourceFormData.file) {
        setUploading(true);
        const fileRef = ref(
          storage,
          `resources/${weekId}/${resourceFormData.file.name}`
        );
        const snapshot = await uploadBytes(fileRef, resourceFormData.file);
        resourceUrl = await getDownloadURL(snapshot.ref);
        filePath = snapshot.ref.fullPath;
        setUploading(false);
      }

      const resourceData = {
        title: resourceFormData.title,
        topic: resourceFormData.topic,
        url: resourceUrl,
        filePath: filePath,
        weekId: weekId,
        order: Number(resourceFormData.order),
        isReleased: resourceFormData.isReleased,
        createdAt: editingResource
          ? editingResource.createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingResource) {
        // Delete old file if new file is uploaded
        if (
          resourceFormData.file &&
          editingResource.filePath &&
          resourceFormData.topic === "classNotes"
        ) {
          const oldFileRef = ref(storage, editingResource.filePath);
          await deleteObject(oldFileRef).catch((error) =>
            console.warn("Old file not found:", error)
          );
        }
        await updateDoc(doc(db, "resources", editingResource.id), resourceData);
      } else {
        await addDoc(collection(db, "resources"), resourceData);
      }

      setShowResourceForm(false);
      setEditingResource(null);
      setResourceFormData({
        title: "",
        topic: "classNotes",
        url: "",
        file: null,
        order: resources.length + 1,
        isReleased: false,
      });
      await fetchData();
      alert(
        editingResource
          ? "Resource updated successfully!"
          : "Resource created successfully!"
      );
    } catch (error) {
      console.error("Error saving resource:", error);
      alert("Failed to save resource");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setResourceFormData({
      title: resource.title,
      topic: resource.topic,
      url: resource.url || "",
      file: null,
      order: resource.order,
      isReleased: resource.isReleased,
    });
    setShowResourceForm(true);
  };

  const handleDeleteResource = async (resourceId, filePath) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        // Delete file from storage if it exists
        if (filePath) {
          const fileRef = ref(storage, filePath);
          await deleteObject(fileRef).catch((error) =>
            console.warn("File not found:", error)
          );
        }

        await deleteDoc(doc(db, "resources", resourceId));
        await fetchData();
        alert("Resource deleted successfully!");
      } catch (error) {
        console.error("Error deleting resource:", error);
        alert("Failed to delete resource");
      }
    }
  };

  const handleToggleRelease = async (resource) => {
    try {
      await updateDoc(doc(db, "resources", resource.id), {
        isReleased: !resource.isReleased,
      });
      await fetchData();
    } catch (error) {
      console.error("Error toggling release:", error);
      alert("Failed to toggle release status");
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

  if (!week) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="m-auto text-center">
          <p className="text-gray-600">Week not found</p>
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

  const classNotes = resources.filter((r) => r.topic === "classNotes");
  const videos = resources.filter((r) => r.topic === "video");

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar links={sidebarLinks} />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(`/admin/materials/phase/${week.phaseId}`)}
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

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Resources</h2>
              <p className="text-gray-600">
                Manage Class Notes/Materials and Videos
              </p>
            </div>
            <button
              onClick={() => {
                setShowResourceForm(true);
                setEditingResource(null);
                setResourceFormData({
                  title: "",
                  topic: "classNotes",
                  url: "",
                  file: null,
                  order: resources.length + 1,
                  isReleased: false,
                });
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Resource</span>
            </button>
          </div>

          {showResourceForm && (
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingResource ? "Edit Resource" : "Add New Resource"}
              </h2>
              <form onSubmit={handleResourceSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={resourceFormData.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., HTML Basics - Part 1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic Type
                  </label>
                  <select
                    name="topic"
                    value={resourceFormData.topic}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="classNotes">
                      Class Notes/Materials (PDF)
                    </option>
                    <option value="video">Video</option>
                  </select>
                </div>

                {resourceFormData.topic === "classNotes" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload PDF File
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept=".pdf"
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required={!editingResource || !resourceFormData.url}
                    />
                    {uploading && (
                      <p className="text-blue-600 text-sm mt-2">
                        Uploading file...
                      </p>
                    )}
                    {editingResource && editingResource.url && (
                      <p className="text-gray-500 text-sm mt-2">
                        Current file:{" "}
                        <a
                          href={editingResource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View PDF
                        </a>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={resourceFormData.url}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=..."
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={resourceFormData.order}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isReleased"
                    checked={resourceFormData.isReleased}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm font-medium text-gray-700">
                    Release to Students
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submitting || uploading
                      ? "Saving..."
                      : editingResource
                      ? "Update Resource"
                      : "Add Resource"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResourceForm(false);
                      setEditingResource(null);
                      setResourceFormData({
                        title: "",
                        topic: "classNotes",
                        url: "",
                        file: null,
                        order: resources.length + 1,
                        isReleased: false,
                      });
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-8">
            {/* Class Notes Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Class Notes/Materials ({classNotes.length})
                </h3>
              </div>
              {classNotes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No class notes added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {classNotes.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white rounded-xl shadow-md p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <FileText className="h-5 w-5 text-green-600" />
                            <h4 className="text-lg font-bold text-gray-900">
                              {resource.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                resource.isReleased
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {resource.isReleased ? "Released" : "Draft"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Order: {resource.order}
                          </p>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View PDF →
                            </a>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleRelease(resource)}
                            className={`p-2 rounded-lg transition ${
                              resource.isReleased
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            title={
                              resource.isReleased
                                ? "Unrelease"
                                : "Release to Students"
                            }
                          >
                            {resource.isReleased ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditResource(resource)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                            title="Edit Resource"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteResource(
                                resource.id,
                                resource.filePath
                              )
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Resource"
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

            {/* Videos Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Video className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Videos ({videos.length})
                </h3>
              </div>
              {videos.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No videos added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white rounded-xl shadow-md p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Video className="h-5 w-5 text-red-600" />
                            <h4 className="text-lg font-bold text-gray-900">
                              {resource.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                resource.isReleased
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {resource.isReleased ? "Released" : "Draft"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Order: {resource.order}
                          </p>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Watch Video →
                            </a>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleRelease(resource)}
                            className={`p-2 rounded-lg transition ${
                              resource.isReleased
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            title={
                              resource.isReleased
                                ? "Unrelease"
                                : "Release to Students"
                            }
                          >
                            {resource.isReleased ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditResource(resource)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                            title="Edit Resource"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteResource(
                                resource.id,
                                resource.filePath
                              )
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Resource"
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
    </div>
  );
};

export default AdminWeekDetail;
