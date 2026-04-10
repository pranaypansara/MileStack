import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateContract = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const newContract = {
        title,
        description,
        freelancerId,
        totalAmount: Number(totalAmount)
      };
      
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/contracts`, newContract, config);
      navigate(`/contract/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create contract');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Create a New Contract</h2>
      <p style={{ color: 'gray' }}>You will be assigned as the Client.</p>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label>Project Title</label>
          <input 
            type="text" 
            required 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        <div>
          <label>Description</label>
          <textarea 
            required 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={{ width: '100%', padding: '8px', minHeight: '100px' }} 
          />
        </div>
        <div>
          <label>Freelancer User ID (Ask them for this string via Dashboard)</label>
          <input 
            type="text" 
            required 
            value={freelancerId} 
            onChange={(e) => setFreelancerId(e.target.value)} 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        <div>
          <label>Total Contract Amount ($)</label>
          <input 
            type="number" 
            required 
            value={totalAmount} 
            onChange={(e) => setTotalAmount(e.target.value)} 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        
        <button type="submit" style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
          Create Contract
        </button>
      </form>
    </div>
  );
};

export default CreateContract;
