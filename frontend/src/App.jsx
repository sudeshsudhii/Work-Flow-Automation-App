import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadData from './pages/UploadData';
import WorkflowConfig from './pages/WorkflowConfig';
import Templates from './pages/Templates';
import Logs from './pages/Logs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<UploadData />} />
            <Route path="workflows" element={<WorkflowConfig />} />
            <Route path="templates" element={<Templates />} />
            <Route path="logs" element={<Logs />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
