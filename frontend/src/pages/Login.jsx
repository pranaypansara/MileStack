import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    let res;
    if (isLoginView) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', padding: '20px' }}>
      <h2>{isLoginView ? 'Login' : 'Signup'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLoginView && (
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
        )}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isLoginView ? 'Login' : 'Signup'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', cursor: 'pointer', color: 'blue' }} onClick={() => setIsLoginView(!isLoginView)}>
        {isLoginView ? "Don't have an account? Signup" : 'Already have an account? Login'}
      </p>
    </div>
  );
};

export default Login;
