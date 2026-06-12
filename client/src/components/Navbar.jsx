import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Heart, User, LogOut, Package } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="nav-brand">
        <Package size={24} className="accent-glow" style={{ color: 'hsl(var(--accent))' }} />
        <span>BlackCube</span>
      </Link>
      
      <div className="nav-links">
        <NavLink to="/add-product" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <PlusCircle size={18} />
          <span>Add Product</span>
        </NavLink>
        
        <NavLink to="/liked-products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Heart size={18} />
          <span>Liked Products</span>
        </NavLink>
        
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <User size={18} />
          <span>Profile</span>
        </NavLink>
        
        <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
