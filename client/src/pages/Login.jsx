import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, Mail, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const Login = () => {
  const [error, setError] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await apiClient.post('/api/auth/login', data);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to access your premium product dashboard</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'hsl(var(--text-secondary))' 
                }} 
              />
              <input
                type="email"
                id="email-input"
                className="form-control"
                style={{ paddingLeft: '48px', ...(errors.email && { borderColor: 'hsl(var(--danger))' }) }}
                placeholder="name@example.com"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p style={{ color: 'hsl(var(--danger))', fontSize: '0.8rem', marginTop: '6px' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'hsl(var(--text-secondary))' 
                }} 
              />
              <input
                type="password"
                id="password-input"
                className="form-control"
                style={{ paddingLeft: '48px', ...(errors.password && { borderColor: 'hsl(var(--danger))' }) }}
                placeholder="••••••••"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p style={{ color: 'hsl(var(--danger))', fontSize: '0.8rem', marginTop: '6px' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'hsl(var(--accent))', textDecoration: 'none', fontWeight: 600 }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
