import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    tipo: 'produto'
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      const response = await axios.get('/api/produtos');
      setProdutos(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar produtos' });
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
      const data = {
        ...formData,
        preco: parseFloat(formData.preco)
      };

      if (editingId) {
        await axios.put(`/api/produtos/${editingId}`, data);
        setMessage({ type: 'success', text: 'Produto atualizado com sucesso' });
      } else {
        await axios.post('/api/produtos', data);
        setMessage({ type: 'success', text: 'Produto cadastrado com sucesso' });
      }
      resetForm();
      loadProdutos();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar produto' });
    }
  };

  const handleEdit = (produto) => {
    setEditingId(produto.id);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco,
      tipo: produto.tipo || 'produto'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await axios.delete(`/api/produtos/${id}`);
        setMessage({ type: 'success', text: 'Produto deletado com sucesso' });
        loadProdutos();
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao deletar produto' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      tipo: 'produto'
    });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-title">
        <h1>Produtos/Serviços</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Novo Produto
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <span>{message.text}</span>
          <button className="close-btn" onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      {produtos.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhum produto cadastrado</h3>
          <p>Clique em "Novo Produto" para começar</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.tipo === 'produto' ? 'Produto' : 'Serviço'}</td>
                  <td>{produto.descricao || '-'}</td>
                  <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-primary btn-small" onClick={() => handleEdit(produto)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(produto.id)}>
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
              <h2>{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
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
                  <label>Tipo</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                  >
                    <option value="produto">Produto</option>
                    <option value="servico">Serviço</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Preço *</label>
                  <input
                    type="number"
                    name="preco"
                    value={formData.preco}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
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

export default Produtos;
