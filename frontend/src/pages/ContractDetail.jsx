import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ContractDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [contract, setContract] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Milestone Form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const fetchDetails = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/contracts/${id}`, config);
      setContract(data.contract);
      setMilestones(data.milestones);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line
  }, [id, user]);

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/milestones`, {
        contractId: id,
        title,
        amount: Number(amount),
      }, config);
      setTitle('');
      setAmount('');
      fetchDetails(); // Reload to show new
    } catch (error) {
       alert(error.response?.data?.message || 'Error adding milestone');
    }
  };

  const updateMilestone = async (milestoneId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/milestones/${milestoneId}`, { status: newStatus }, config);
      fetchDetails(); // Reload
    } catch (error) {
       alert(error.response?.data?.message || 'Error updating status');
    }
  };

  const depositFunds = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`${import.meta.env.VITE_API_URL}/api/contracts/${id}/deposit`, {}, config);
        fetchDetails(); 
      } catch (error) {
         alert(error.response?.data?.message || 'Error depositing funds');
      }
  }

  const handleAccept = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contracts/${id}/accept`, {}, config);
      fetchDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Error accepting contract');
    }
  };

  const handleReject = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contracts/${id}/reject`, {}, config);
      fetchDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Error rejecting contract');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!contract) return <div>Contract not found.</div>;

  const isClient = contract.clientId._id === user._id;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h1>{contract.title}</h1>
      <p><strong>Description:</strong> {contract.description}</p>
      
      <div style={{ display: 'flex', gap: '20px', margin: '20px 0', padding: '15px', background: '#f5f5f5' }}>
        <div>
           <strong>Client:</strong> {contract.clientId.name}
        </div>
        <div>
           <strong>Freelancer:</strong> {contract.freelancerId.name}
        </div>
        <div>
           <strong>Status:</strong> <span style={{ padding: '3px 8px', borderRadius: '4px', background: contract.status === 'active' ? '#d4edda' : contract.status === 'pending_freelancer_approval' ? '#fff3cd' : '#f8d7da', border: '1px solid #ccc' }}>{contract.status.replace(/_/g, ' ').toUpperCase()}</span>
           {!isClient && contract.status === 'pending_freelancer_approval' && (
              <div style={{ marginTop: '10px' }}>
                 <button onClick={handleAccept} style={{ background: 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', marginRight: '10px' }}>✅ Accept</button>
                 <button onClick={handleReject} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>❌ Reject</button>
              </div>
           )}
        </div>
        <div>
           <strong>Payment Status:</strong> {contract.paymentStatus.toUpperCase()}
           {isClient && contract.paymentStatus === 'pending' && contract.status === 'active' && (
              <button onClick={depositFunds} style={{marginLeft: '10px', background: 'orange'}}>Simulate Deposit to Escrow</button>
           )}
        </div>
      </div>

      <h2>Milestones</h2>

      {milestones.length === 0 ? <p>No milestones created yet.</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#ddd' }}>
              <th style={{ padding: '8px' }}>Title</th>
              <th style={{ padding: '8px' }}>Amount</th>
              <th style={{ padding: '8px' }}>Status</th>
              <th style={{ padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((m) => (
              <tr key={m._id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '8px' }}>{m.title}</td>
                <td style={{ padding: '8px' }}>${m.amount}</td>
                <td style={{ padding: '8px' }}><strong>{m.status.toUpperCase()}</strong></td>
                <td style={{ padding: '8px' }}>
                    
                    {/* Freelancer Actions */}
                    {!isClient && contract.status === 'active' && m.status === 'pending' && (
                        <button onClick={() => updateMilestone(m._id, 'in-progress')}>Start Working</button>
                    )}
                    {!isClient && contract.status === 'active' && m.status === 'in-progress' && (
                        <button onClick={() => updateMilestone(m._id, 'completed')}>Mark Completed</button>
                    )}

                    {/* Client Actions */}
                    {isClient && m.status === 'completed' && (
                        <>
                          <button onClick={() => updateMilestone(m._id, 'approved')} style={{ background: 'green', color: 'white', marginRight: '5px' }}>Approve & Release Payment</button>
                          <button onClick={() => updateMilestone(m._id, 'disputed')} style={{ background: 'red', color: 'white' }}>Dispute</button>
                        </>
                    )}

                    {m.status === 'approved' && <span style={{ color: 'green' }}>✓ Funds Released</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isClient && (
        <div style={{ marginTop: '40px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
          <h3>Add New Milestone</h3>
          <form onSubmit={handleAddMilestone} style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Milestone Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="number" placeholder="Amount ($)" required value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button type="submit">Add Milestone</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContractDetail;
