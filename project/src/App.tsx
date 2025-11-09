import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import StudentMaterials from "./pages/StudentMaterials";
import StudentPhaseDetail from "./pages/StudentPhaseDetail";
import StudentWeekDetail from "./pages/StudentWeekDetail";
import StudentProgress from "./pages/StudentProgress";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVerify from "./pages/AdminVerify";
import AdminMaterials from "./pages/AdminMaterials";
import AdminPhaseDetail from "./pages/AdminPhaseDetail";
import AdminWeekDetail from "./pages/AdminWeekDetail";
import AdminStudents from "./pages/AdminStudents";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/student"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/materials"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentMaterials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/materials/phase/:phaseId"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentPhaseDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/materials/week/:weekId"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentWeekDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/progress"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentProgress />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verify"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminVerify />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/materials"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminMaterials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/materials/phase/:phaseId"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPhaseDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/materials/week/:weekId"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminWeekDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminStudents />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
