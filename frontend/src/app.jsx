// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';

// A simple Private Route wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* We will build the Dashboard in Phase 8 */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <div className="p-8">
                <h1 className="text-3xl font-bold">Dealership Dashboard (Coming Soon)</h1>
              </div>
            </PrivateRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;