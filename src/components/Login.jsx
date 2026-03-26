import React, { useState } from 'react';
import { ShieldCheck, User, Lock } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleManualLogin = (e) => {
    e.preventDefault();
    
    // මෙහිදී ඔබගේ ID එක සහ Password එක පරීක්ෂා කෙරේ
    if (username === "himash@gifty" && password === "gifty123") {
      const mockUser = {
        name: "Himash Perera",
        role: "Proprietor",
        id: username
      };
      localStorage.setItem('studioUser', JSON.stringify(mockUser));
      onLoginSuccess(mockUser);
    } else {
      alert("පරිශීලක නාමය හෝ මුරපදය වැරදියි!");
    }
  };

  return (
    <div style={loginWrapper}>
      <div style={loginBox}>
        <div style={iconCircle}><ShieldCheck size={40} color="#3b82f6" /></div>
        <h2 style={{ margin: '10px 0', color: '#1e293b' }}>Gifty Vibe POS</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
          පද්ධතියට ඇතුළු වීමට විස්තර ඇතුළත් කරන්න.
        </p>

        <form onSubmit={handleManualLogin} style={{ textAlign: 'left' }}>
          <div style={inputContainer}>
            <label style={labelStyle}>Username / ID</label>
            <div style={fieldWrapper}>
              <User size={18} color="#94a3b8" style={fieldIcon} />
              <input 
                type="text" 
                placeholder="Enter Username"
                style={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={inputContainer}>
            <label style={labelStyle}>Password</label>
            <div style={fieldWrapper}>
              <Lock size={18} color="#94a3b8" style={fieldIcon} />
              <input 
                type="password" 
                placeholder="Enter Password"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" style={loginBtn}>Login Now</button>
        </form>

        <div style={{ margin: '20px 0', color: '#cbd5e1', fontSize: '12px' }}>OR</div>

        {/* Google Login Button */}
        <button style={googleBtn}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: '18px' }} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

// අමතර Styles
const inputContainer = { marginBottom: '15px' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '5px' };
const fieldWrapper = { position: 'relative', display: 'flex', alignItems: 'center' };
const fieldIcon = { position: 'absolute', left: '12px' };
const inputStyle = { width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' };
const loginBtn = { width: '100%', padding: '12px', borderRadius: '12px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

// පෙර තිබූ styles...
const loginWrapper = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f1f5f9' };
const loginBox = { background: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', width: '380px' };
const iconCircle = { background: '#eff6ff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' };
const googleBtn = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: '600', cursor: 'pointer', color: '#475569' };

export default Login;