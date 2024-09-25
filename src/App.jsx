import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './private/privateRoute.jsx';
import SkeletonLoader from './components/skeleton';
import FormSkeleton from './components/formSkeleton.jsx'; // Assuming this is another skeleton component

const Main = React.lazy(() => import('./resources/frontsite/orphan/main.jsx'));
const Login = React.lazy(() => import('./resources/auth/login'));
const Logout = React.lazy(() => import('./resources/auth/logout.jsx'));
// const Register = React.lazy(() => import('./resources/auth/register'));
const Edit = React.lazy(() => import('./resources/auth/edit'));
const Base = React.lazy(() => import('./resources/layout/base'));
const Dashboard = React.lazy(() => import('./resources/auth/dashboard.jsx'));
const Index = React.lazy(() => import('./resources/backsite/orphan/index.jsx'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/orphan-form" />} />
          <Route path="/login" element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Login /></Suspense>} />
          {/* <Route path="/register" element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Register /></Suspense>} /> */}
          <Route path="/orphan-form" element={<Suspense fallback={<FormSkeleton width="100%" height="100vh" />}><Main /></Suspense>} />
          <Route path="/dashboard" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><Dashboard /></Base></Suspense>} />} />
          <Route path="/orphans" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><Index /></Base></Suspense>} />} />
          <Route path="/edit/:userId" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><Edit /></Base></Suspense>} />} />
          <Route path="/logout" element={<PrivateRoute element={<Suspense ><Logout /></Suspense>} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
