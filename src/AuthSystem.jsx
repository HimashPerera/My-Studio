import React, { useState } from 'react';
import { Lock, User, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const AuthSystem = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const ADMIN_ID = "991061649V";
  const ADMIN_PW = "hima123";

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (formData.username.trim() === ADMIN_ID && formData.password === ADMIN_PW) {
      onLoginSuccess('Hima Admin');
    } else {
      alert("වැරදි ID අංකයක් හෝ මුරපදයක්!");
    }
  };

  return (
    <div style={authStyles.overlay}>
      <div style={authStyles.card}>
        <div style={authStyles.header}>
          <div style={authStyles.iconCircle}><Lock size={28} /></div>
          <h2>GiftyVibe Login</h2>
          <p>පද්ධතියට ඇතුළු වන්න</p>
        </div>
        <form onSubmit={handleCustomLogin} style={authStyles.form}>
          <div style={authStyles.inputBox}>
            <User size={18} style={authStyles.fieldIcon} />
            <input 
              type="text" placeholder="ID Number" required 
              style={authStyles.inputField}
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div style={authStyles.inputBox}>
            <ShieldCheck size={18} style={authStyles.fieldIcon} />
            <input 
              type={showPassword ? "text" : "password"} placeholder="Password" required 
              style={authStyles.inputField}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <div onClick={() => setShowPassword(!showPassword)} style={authStyles.eyeBtn}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
          <button type="submit" style={authStyles.loginBtn}>
            <LogIn size={18} /> Login
          </button>
        </form>
      </div>
    </div>
  );
};

const authStyles = {
  overlay: { height: '100vh', width: '100%', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' },
  card: { background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', width: '350px', textAlign: 'center' },
  header: { marginBottom: '25px' },
  iconCircle: { background: '#6366f1', color: '#fff', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputBox: { position: 'relative', display: 'flex', alignItems: 'center' },
  fieldIcon: { position: 'absolute', left: '15px', color: '#94a3b8' },
  eyeBtn: { position: 'absolute', right: '15px', color: '#94a3b8', cursor: 'pointer' },
  inputField: { width: '100%', padding: '12px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' },
  loginBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '13px', borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }
};

export default AuthSystem;