import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf_cnpj: '',
    endereco: '',
    telefone: '',
    email: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await axios.get('/api/clientes');
      setClientes(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar clientes' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/clientes/${editingId}`, formData);
        setMessage({ type: 'success', text: 'Cliente atualizado com sucesso' });
      } else {
        await axios.post('/api/clientes', formData);
        setMessage({ type: 'success', text: 'Cliente cadastrado com sucesso' });
      }
      resetForm();
      loadClientes();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar cliente' });
    }
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    setFormData({
      nome: cliente.nome,
      cpf_cnpj: cliente.cpf_cnpj || '',
      endereco: cliente.endereco || '',
      telefone: cliente.telefone || '',
      email: cliente.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await axios.delete(`/api/clientes/${id}`);
        setMessage({ type: 'success', text: 'Cliente deletado com sucesso' });
        loadClientes();
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao deletar cliente' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf_cnpj: '',
      endereco: '',
      telefone: '',
      email: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-title">
        <h1>Clientes</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Novo Cliente
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <span>{message.text}</span>
          <button className="close-btn" onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      {clientes.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhum cliente cadastrado</h3>
          <p>Clique em "Novo Cliente" para começar</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.cpf_cnpj || '-'}</td>
                  <td>{cliente.telefone || '-'}</td>
                  <td>{cliente.email || '-'}</td>
                  <td>{cliente.endereco || '-'}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-primary btn-small" onClick={() => handleEdit(cliente)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(cliente.id)}>
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CPF/CNPJ</label>
                  <input
                    type="text"
                    name="cpf_cnpj"
                    value={formData.cpf_cnpj}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Endereço</label>
                <textarea
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;
