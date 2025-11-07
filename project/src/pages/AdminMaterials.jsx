import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { LayoutDashboard, Users, BookOpen, CheckCircle, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const AdminMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phase: 'Phase 1',
    link: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const materialsQuery = query(collection(db, 'materials'), orderBy('releaseDate', 'desc'));
    const materialsSnapshot = await getDocs(materialsQuery);
    const materialsData = materialsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMaterials(materialsData);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'materials'), {
        ...formData,
        releaseDate: new Date().toISOString(),
      });

      setFormData({
        title: '',
        description: '',
        phase: 'Phase 1',
        link: '',
      });
      setShowForm(false);
      await fetchMaterials();
      alert('Material released successfully!');
    } catch (error) {
      alert('Failed to release material');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar links={sidebarLinks} />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Materials</h1>
              <p className="text-gray-600">Manage and release course content</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Release New Material</span>
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Release New Material</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Introduction to React Hooks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the material"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phase
                  </label>
                  <select
                    value={formData.phase}
                    onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Phase 1">Phase 1 - HTML & CSS</option>
                    <option value="Phase 2">Phase 2 - JavaScript</option>
                    <option value="Phase 3">Phase 3 - React</option>
                    <option value="Phase 4">Phase 4 - Node.js</option>
                    <option value="Phase 5">Phase 5 - Database</option>
                    <option value="Phase 6">Phase 6 - Final Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Link/URL
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/course-material"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Link to video, PDF, or any learning resource
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submitting ? 'Releasing...' : 'Release Material'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Released Materials ({materials.length})
            </h2>
            {materials.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No materials released yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-white rounded-xl shadow-md p-6"
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
                        <p className="text-gray-600 mb-2">{material.description}</p>
                        <p className="text-sm text-gray-500">
                          Released: {new Date(material.releaseDate).toLocaleDateString()}
                        </p>
                        <a
                          href={material.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                        >
                          View Material →
                        </a>
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

export default AdminMaterials;
