import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // New
import { setCredentials } from '../redux/slices/authSlice'; // New

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize Dispatch
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Identifiants invalides');
      }

      // --- REDUX ACTION ---
      // This updates the global state and localStorage via the slice
      dispatch(setCredentials({ 
        user: data.user, 
        token: data.token 
      }));
      
      navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white min-vh-100 d-flex align-items-center py-5 overflow-hidden">
      <div className="container">
        <div className="row align-items-center">
          
          <div className="col-lg-6 position-relative d-flex justify-content-center justify-content-lg-start mb-5 mb-lg-0">
            <div className="position-absolute d-none d-sm-block" style={{ width: '320px', height: '450px', border: '6px solid black', top: '-20px', left: '20px', zIndex: 1 }}></div>
            <div className="position-relative bg-white shadow-lg" style={{ width: '320px', height: '520px', zIndex: 2, marginLeft: '40px', overflow: 'hidden' }}>
              <img src="/assets/img/login/olive-oil-bowl.png" alt="Tunisian Olive Oil" className="w-100 h-100 object-fit-cover" />
            </div>
          </div>

          <div className="col-lg-6 px-lg-5">
            <div className="d-flex flex-column align-items-center align-items-lg-start">
              <p className="text-uppercase mb-4 text-dark fw-medium" style={{ letterSpacing: '2px', fontSize: '0.75rem' }}>
                The marketplace that reunites the best of Tunisian olive oil
              </p>

              <h2 className="mb-4" style={{ fontFamily: 'serif', fontWeight: '300', fontSize: '2.5rem' }}>Login</h2>

              <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
                <div className="mb-4">
                  <input
                    type="email"
                    name="email"
                    className="form-control border-0 border-bottom rounded-0 px-0 shadow-none"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ borderBottom: '1.5px solid #000' }}
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    name="password"
                    className="form-control border-0 border-bottom rounded-0 px-0 shadow-none"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ borderBottom: '1.5px solid #000' }}
                  />
                </div>

                {error && (
                  <div className="alert alert-danger border-0 small py-2 rounded-0 mb-4">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="btn btn-outline-dark rounded-pill px-5 py-2 w-100"
                  style={{ fontSize: '1.1rem', fontFamily: 'serif', letterSpacing: '1px' }}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : 'Se connecter'}
                </button>
              </form>

              <div className="mt-4 d-flex justify-content-between w-100" style={{ maxWidth: '400px' }}>
                <Link to="/forgot" className="text-decoration-none text-muted small">Forgot password?</Link>
                <Link to="/register" className="text-decoration-none text-dark fw-bold small">Create Account</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default SignIn;