import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="glass-panel profile-card">
        <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', color: 'hsl(var(--accent))', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
          User Profile
        </div>
        <h1 className="page-title text-center" style={{ fontSize: '2.4rem', marginBottom: '32px' }}>
          {user.name}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }}>
          <div className="profile-field">
            <span className="profile-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} />
              Full Name
            </span>
            <span className="profile-value">{user.name}</span>
          </div>

          <div className="profile-field">
            <span className="profile-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} />
              Email Address
            </span>
            <span className="profile-value">{user.email}</span>
          </div>

          <div className="profile-field">
            <span className="profile-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} />
              Mobile Number
            </span>
            <span className="profile-value">{user.mobileNumber}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="btn btn-secondary btn-block"
          style={{ 
            borderColor: 'hsla(var(--danger), 0.3)', 
            color: '#f87171',
            background: 'rgba(239, 68, 68, 0.05)'
          }}
        >
          <LogOut size={18} />
          Logout from Session
        </button>
      </div>
    </div>
  );
};

export default Profile;
