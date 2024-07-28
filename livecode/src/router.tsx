import { Navigate, createBrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import App from './App';
import ErrorPage from './pages/ErrorPage';
import Contest from './pages/Contest';
import EventComponent from './pages/Schedule'
import ProblemPage from './pages/ProblemPage.tsx'
import SchedulePage from './pages/UserSchedule.tsx'
import FeedbackPage from './pages/Feedback.tsx'
import PreMeetingPage from './pages/PreMeetingPage.tsx'
import ContestFlow from './pages/ContestFlow.tsx';
import Registration from './components/auth/Register.tsx';
import Login from './components/auth/SignIn.tsx';
import ProtectedRoute from './components/auth/ProtectRoute.tsx';
import Profile from './components/auth/Profile.tsx';
import CreateTSP from './components/admin/CreateServices.tsx';
import SolveProblem from './pages/ProblemDetails.tsx';
import ConnectViaLink from './components/ConnectViaLink.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: '/contest/*',
        element: <ProtectedRoute><ContestFlow /></ProtectedRoute>,
      },
      {
        path: '/schedule-contest',
        element: <ProtectedRoute><EventComponent scheduledTime='' /></ProtectedRoute>,
      },
      {
        path: '/problems',
        element: <ProtectedRoute><ProblemPage /></ProtectedRoute>,
      },
      {
        path: '/schedules',
        element: <ProtectedRoute><SchedulePage /></ProtectedRoute>,
      },
      {
        path: '/contest-feedback/:id',
        element: <ProtectedRoute><FeedbackPage /></ProtectedRoute>,
      },
      {
        path: '/contest/*',
        element: <ProtectedRoute><ContestFlow /></ProtectedRoute>,
      },
      {
        path: '/profile/:username',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path:'/problems/:slug',
        element:<SolveProblem />
      },
      {
        path: '/admin/create',
        element: <ProtectedRoute><CreateTSP /></ProtectedRoute>,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Registration />,
      },
      {
        path:'/join-vai-link',
        element:<ConnectViaLink />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
      

    ],
  },
]);

export default router;