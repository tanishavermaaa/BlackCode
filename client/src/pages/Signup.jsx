import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, KeyRound, AlertCircle } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  mobileNumber: z.string().min(1, 'Mobile number is required').regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[@$!%*?&]/, 'Password must contain a special character (@$!%*?&)'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const Signup = () => {
  const [error, setError] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema)
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await apiClient.post('/api/auth/signup', data);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred during registration');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel" style={{ maxWidth: '540px' }}>
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join BlackCube to manage and explore products</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="name-input">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User 
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
                type="text"
                id="name-input"
                className="form-control"
                style={{ paddingLeft: '48px', ...(errors.name && { borderColor: 'hsl(var(--danger))' }) }}
                placeholder="John Doe"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p style={{ color: 'hsl(var(--danger))', fontSize: '0.8rem', marginTop: '6px' }}>
                {errors.name.message}
              </p>
            )}
          </div>

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
                placeholder="john@example.com"
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
            <label className="form-label" htmlFor="phone-input">Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <Phone 
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
                type="tel"
                id="phone-input"
                className="form-control"
                style={{ paddingLeft: '48px', ...(errors.mobileNumber && { borderColor: 'hsl(var(--danger))' }) }}
                placeholder="9876543210"
                {...register('mobileNumber')}
              />
            </div>
            {errors.mobileNumber && (
              <p style={{ color: 'hsl(var(--danger))', fontSize: '0.8rem', marginTop: '6px' }}>
                {errors.mobileNumber.message}
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
                placeholder="Minimum 12 characters with symbol, number, uppercase"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p style={{ color: 'hsl(var(--danger))', fontSize: '0.8rem', marginTop: '6px' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password-input">Confirm Password</label>
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
                id="confirm-password-input"
                className="form-control"
                style={{ paddingLeft: '48px', ...(errors.confirmPassword && { borderColor: 'hsl(var(--danger))' }) }}
                placeholder="Repeat password"
                {...register('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <p style={{ color: 'hsl(var(--danger))', fontSize: '0.8rem', marginTop: '6px' }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'hsl(var(--accent))', textDecoration: 'none', fontWeight: 600 }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
