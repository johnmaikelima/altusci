import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        senha
      });

      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('userName', response.data.nome);
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userRole', response.data.role);

      setMessage({ type: 'success', text: 'Login realizado com sucesso!' });
      setTimeout(() => {
        navigate('/empresas');
      }, 500);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao fazer login' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>

        <p className="login-info">
          Contate o administrador para criar uma conta
        </p>
      </div>
    </div>
  );
}

export default Login;
