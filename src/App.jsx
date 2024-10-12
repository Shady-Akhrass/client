import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './private/privateRoute.jsx';
import SkeletonLoader from './components/skeleton';
import FormSkeleton from './components/formSkeleton.jsx'; // Assuming this is another skeleton component

const MainOrphan = React.lazy(() => import('./resources/forms/orphan/main.jsx'));
const MainAid = React.lazy(() => import('./resources/forms/aid/main.jsx'));
const MainTeacher = React.lazy(() => import('./resources/forms/school/teacher/main.jsx'))
const MainStudent = React.lazy(() => import('./resources/forms/school/student/main.jsx'))
const Login = React.lazy(() => import('./resources/auth/login'));
const Logout = React.lazy(() => import('./resources/auth/logout.jsx'));
// const Register = React.lazy(() => import('./resources/auth/register'));
const Edit = React.lazy(() => import('./resources/auth/edit'));
const Base = React.lazy(() => import('./resources/layout/base'));
const Dashboard = React.lazy(() => import('./resources/auth/dashboard.jsx'));
const IndexOrphans = React.lazy(() => import('./resources/admin/orphan/index.jsx'));
const IndexAids = React.lazy(() => import('./resources/admin/aids/index.jsx'));
const IndexStudents = React.lazy(() => import('./resources/admin/school/student/index.jsx'));
const IndexTeachers = React.lazy(() => import('./resources/admin/school/teacher/index.jsx'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/orphan-form" />} />
          <Route path="/login" element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Login /></Suspense>} />
          {/* <Route path="/register" element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Register /></Suspense>} /> */}
          <Route path="/orphan-form" element={<Suspense fallback={<FormSkeleton width="100%" height="100vh" />}><MainOrphan /></Suspense>} />
          <Route path="/aid-form" element={<Suspense fallback={<FormSkeleton width="100%" height="100vh" />}><MainAid /></Suspense>} />
          <Route path="/teacher-form" element={<Suspense fallback={<FormSkeleton width="100%" height="100vh" />}><MainTeacher /></Suspense>} />
          <Route path="/student-form" element={<Suspense fallback={<FormSkeleton width="100%" height="100vh" />}><MainStudent /></Suspense>} />
          <Route path="/dashboard" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><Dashboard /></Base></Suspense>} />} />
          <Route path="/orphans" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexOrphans /></Base></Suspense>} />} />
          <Route path="/aids" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexAids /></Base></Suspense>} />} />
          <Route path="/students" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexStudents /></Base></Suspense>} />} />
          <Route path="/teachers" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexTeachers /></Base></Suspense>} />} />
          <Route path="/edit/:userId" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><Edit /></Base></Suspense>} />} />
          <Route path="/logout" element={<PrivateRoute element={<Suspense ><Logout /></Suspense>} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
