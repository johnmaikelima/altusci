import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/empresas');
      return;
    }
    carregarUsuarios();
  }, [userRole, navigate]);

  const carregarUsuarios = async () => {
    try {
      const response = await axios.get('/api/usuarios', {
        headers: { 'x-user-id': userId }
      });
      setUsuarios(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar usuários' });
    }
  };

  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', {
        email,
        senha,
        nome,
        adminId: userId
      });

      setMessage({ type: 'success', text: 'Usuário criado com sucesso!' });
      setEmail('');
      setSenha('');
      setNome('');
      setShowForm(false);
      carregarUsuarios();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao criar usuário' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarUsuario = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      await axios.delete(`/api/usuarios/${id}`, {
        headers: { 'x-user-id': userId }
      });

      setMessage({ type: 'success', text: 'Usuário deletado com sucesso!' });
      carregarUsuarios();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao deletar usuário' });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Usuários</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Novo Usuário'}
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="form-container">
          <h2>Criar Novo Usuário</h2>
          <form onSubmit={handleCriarUsuario}>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Senha:</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha segura"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Usuário'}
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Data de Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`badge badge-${usuario.role}`}>
                    {usuario.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </span>
                </td>
                <td>{new Date(usuario.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                  <div className="actions">
                    {usuario.role !== 'admin' && (
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeletarUsuario(usuario.id)}
                      >
                        Deletar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Usuarios;
