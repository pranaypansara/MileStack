import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// We will create these pages next
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateContract from './pages/CreateContract';
import ContractDetail from './pages/ContractDetail';
import Navbar from './components/Navbar';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/create-contract" element={user ? <CreateContract /> : <Navigate to="/login" />} />
          <Route path="/contract/:id" element={user ? <ContractDetail /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
