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
const MainEmployment = React.lazy(() => import('./resources/forms/employment/main.jsx'));
const MainShelter = React.lazy(() => import('./resources/forms/shelter/main.jsx'));
const MainPatient = React.lazy(() => import('./resources/forms/patient/main.jsx'));
const Login = React.lazy(() => import('./resources/auth/login'));
const Logout = React.lazy(() => import('./resources/auth/logout.jsx'));
// const Register = React.lazy(() => import('./resources/auth/register'));
const Edit = React.lazy(() => import('./resources/auth/edit'));
const Base = React.lazy(() => import('./resources/layout/base'));
const OrphanStatistics = React.lazy(() => import('./resources/admin/statistics/orphanStatistics.jsx'));
const AidStatistics = React.lazy(() => import('./resources/admin/statistics/aidStatistics.jsx'));
const SchoolStatistics = React.lazy(() => import('./resources/admin/statistics/schoolStatistics.jsx'));
// const ShelterStatistics = React.lazy(() => import('./resources/admin/statistics/shelterStatistics.jsx'));
const IndexOrphans = React.lazy(() => import('./resources/admin/orphan/index.jsx'));
const IndexAids = React.lazy(() => import('./resources/admin/aids/index.jsx'));
const IndexStudents = React.lazy(() => import('./resources/admin/school/student/index.jsx'));
const IndexTeachers = React.lazy(() => import('./resources/admin/school/teacher/index.jsx'));
const IndexEmployments = React.lazy(() => import('./resources/admin/employment/index.jsx'));
// const IndexShelters = React.lazy(() => import('./resources/admin/shelter/index.jsx'));
const DownloadTemplate = React.lazy(() => import('./resources/forms/shelter/downloadTemplate.jsx'));
const IndexShelters = React.lazy(() => import('./resources/admin/shelter/index.jsx'))
const IndexPatients = React.lazy(() => import('./resources/admin/patient/index.jsx'))
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
          <Route path="/patient-form" element={<Suspense fallback={<FormSkeleton width="100%" height="100vh" />}><MainPatient /></Suspense>} />
          {/* <Route path="/teacher-form" element={<Suspense fallback={<FormSkeleton width="100%" height="100vh" />}><MainTeacher /></Suspense>} /> */}
          <Route path="/employment-form" element={<Suspense fallback={<FormSkeleton width="100%" height="100vh" />}><MainEmployment /></Suspense>} />
          <Route path="/student-form" element={<Suspense fallback={<FormSkeleton width="100%" height="100vh" />}><MainStudent /></Suspense>} />
          <Route path="/shelter-form" element={<Suspense fallback={<FormSkeleton width="100%" height="100vh" />}><MainShelter /></Suspense>} />
          <Route path="/shelter-template" element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><DownloadTemplate /></Suspense>} />
          <Route path="/statistics/orphans-statistics" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><OrphanStatistics /></Base></Suspense>} />} />
          <Route path="/statistics/aids-statistics" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><AidStatistics /></Base></Suspense>} />} />
          <Route path="/statistics/school-statistics" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><SchoolStatistics /></Base></Suspense>} />} />
          {/* <Route path="/statistics/shelter-statistics" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><ShelterStatistics /></Base></Suspense>} />} /> */}
          <Route path="/orphans" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexOrphans /></Base></Suspense>} />} />
          <Route path="/aids" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexAids /></Base></Suspense>} />} />
          <Route path="/students" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexStudents /></Base></Suspense>} />} />
          <Route path="/teachers" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexTeachers /></Base></Suspense>} />} />
          <Route path="/employments" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexEmployments /></Base></Suspense>} />} />
          <Route path="/shelters" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexShelters /></Base></Suspense>} />} />
          <Route path="/patients" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><IndexPatients /></Base></Suspense>} />} />
          <Route path="/edit/:userId" element={<PrivateRoute element={<Suspense fallback={<SkeletonLoader width="100%" height="100vh" />}><Base><Edit /></Base></Suspense>} />} />
          <Route path="/logout" element={<PrivateRoute element={<Suspense ><Logout /></Suspense>} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
