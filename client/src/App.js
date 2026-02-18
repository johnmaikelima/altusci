import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import ProtectedRoute from './ProtectedRoute';
import Empresas from './pages/Empresas';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Ordens from './pages/Ordens';
import CriarOrdem from './pages/CriarOrdem';
import EditarOrdem from './pages/EditarOrdem';
import Usuarios from './pages/Usuarios';

function App() {
  const [userName] = useState(localStorage.getItem('userName'));
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="app">
        {userId && (
          <nav className="navbar">
            <div className="nav-container">
              <Link to="/" className="nav-logo">
                📋 Manager OS
              </Link>
              <ul className="nav-menu">
                <li className="nav-item">
                  <Link to="/empresas" className="nav-link">Empresas</Link>
                </li>
                <li className="nav-item">
                  <Link to="/clientes" className="nav-link">Clientes</Link>
                </li>
                <li className="nav-item">
                  <Link to="/produtos" className="nav-link">Produtos</Link>
                </li>
                <li className="nav-item">
                  <Link to="/ordens" className="nav-link">Ordens de Serviço</Link>
                </li>
                {userRole === 'admin' && (
                  <li className="nav-item">
                    <Link to="/usuarios" className="nav-link">Usuários</Link>
                  </li>
                )}
                <li className="nav-item nav-user">
                  <span className="user-name">{userName}</span>
                  <button onClick={handleLogout} className="nav-link logout-btn">
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        )}

        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/empresas" element={<ProtectedRoute><Empresas /></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
            <Route path="/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
            <Route path="/ordens" element={<ProtectedRoute><Ordens /></ProtectedRoute>} />
            <Route path="/ordens/criar" element={<ProtectedRoute><CriarOrdem /></ProtectedRoute>} />
            <Route path="/ordens/editar/:id" element={<ProtectedRoute><EditarOrdem /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
            <Route path="/" element={userId ? <ProtectedRoute><Ordens /></ProtectedRoute> : <Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
