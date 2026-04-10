import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px 20px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
      <h2>Milestack MVP</h2>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '15px' }}>Hi, {user.name}</span>
            <Link to="/" style={{ color: 'lightblue', marginRight: '15px' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'lightblue' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
