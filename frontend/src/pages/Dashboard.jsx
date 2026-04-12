import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/contracts`, config);
        setContracts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch contracts', error);
        setLoading(false);
      }
    };
    fetchContracts();
  }, [user]);

  const handleAccept = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contracts/${id}/accept`, {}, config);
      setContracts(contracts.map(c => c._id === id ? { ...c, status: 'active', freelancerApproved: true } : c));
    } catch (error) {
      alert(error.response?.data?.message || 'Error accepting contract');
    }
  };

  const handleReject = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contracts/${id}/reject`, {}, config);
      setContracts(contracts.map(c => c._id === id ? { ...c, status: 'rejected' } : c));
    } catch (error) {
      alert(error.response?.data?.message || 'Error rejecting contract');
    }
  };

  const clientContracts = contracts.filter((c) => c.clientId._id === user._id);
  const freelancerContracts = contracts.filter((c) => c.freelancerId._id === user._id);
  
  const pendingFreelancerContracts = freelancerContracts.filter((c) => c.status === 'pending_freelancer_approval');
  const otherFreelancerContracts = freelancerContracts.filter((c) => c.status !== 'pending_freelancer_approval');

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <Link to="/create-contract">
          <button style={{ padding: '10px', background: 'green', color: 'white', cursor: 'pointer', border: 'none' }}>
            + Create New Contract
          </button>
        </Link>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Your Auth ID for reference (so clients can add you):</h3>
        <code style={{ background: '#eee', padding: '5px' }}>{user._id}</code>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Contracts as Client</h2>
        {clientContracts.length === 0 ? <p>No contracts yet.</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {clientContracts.map((c) => (
              <li key={c._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}>
                <h4>{c.title}</h4>
                <p>Freelancer: {c.freelancerId.name} | Total: ${c.totalAmount} | Status: {c.status}</p>
                <Link to={`/contract/${c._id}`}>View Details</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Pending Approvals (Freelancer)</h2>
        {pendingFreelancerContracts.length === 0 ? <p>No pending contracts.</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pendingFreelancerContracts.map((c) => (
              <li key={c._id} style={{ border: '1px solid orange', margin: '10px 0', padding: '15px' }}>
                <h4>{c.title}</h4>
                <p>Client: {c.clientId.name} | Total: ${c.totalAmount}</p>
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => handleAccept(c._id)} style={{ marginRight: '10px', background: 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>✅ Accept</button>
                  <button onClick={() => handleReject(c._id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>❌ Reject</button>
                  <Link to={`/contract/${c._id}`} style={{ marginLeft: '15px' }}>View Details</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Contracts as Freelancer</h2>
        {otherFreelancerContracts.length === 0 ? <p>No active contracts.</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {otherFreelancerContracts.map((c) => (
              <li key={c._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}>
                <h4>{c.title}</h4>
                <p>Client: {c.clientId.name} | Total: ${c.totalAmount} | Status: {c.status}</p>
                <Link to={`/contract/${c._id}`}>View Details</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
