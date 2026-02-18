import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    telefone_celular: '',
    telefone_fixo: '',
    email: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      const response = await axios.get('/api/empresas');
      setEmpresas(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar empresas' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        logo: logo
      };

      if (editingId) {
        await axios.put(`/api/empresas/${editingId}`, data);
        setMessage({ type: 'success', text: 'Empresa atualizada com sucesso' });
      } else {
        await axios.post('/api/empresas', data);
        setMessage({ type: 'success', text: 'Empresa cadastrada com sucesso' });
      }

      resetForm();
      loadEmpresas();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar empresa' });
    }
  };

  const handleEdit = (empresa) => {
    setEditingId(empresa.id);
    setFormData({
      nome: empresa.nome,
      cnpj: empresa.cnpj || '',
      endereco: empresa.endereco || '',
      telefone: empresa.telefone || '',
      telefone_celular: empresa.telefone_celular || '',
      telefone_fixo: empresa.telefone_fixo || '',
      email: empresa.email || ''
    });
    if (empresa.logoData) {
      setLogoPreview(empresa.logoData);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta empresa?')) {
      try {
        await axios.delete(`/api/empresas/${id}`);
        setMessage({ type: 'success', text: 'Empresa deletada com sucesso' });
        loadEmpresas();
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao deletar empresa' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cnpj: '',
      endereco: '',
      telefone: '',
      telefone_celular: '',
      telefone_fixo: '',
      email: ''
    });
    setLogo(null);
    setLogoPreview(null);
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-title">
        <h1>Empresas</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nova Empresa
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <span>{message.text}</span>
          <button className="close-btn" onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      {empresas.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhuma empresa cadastrada</h3>
          <p>Clique em "Nova Empresa" para começar</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Nome</th>
                <th>CNPJ</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map(empresa => (
                <tr key={empresa.id}>
                  <td>
                    {empresa.logoData && (
                      <img src={empresa.logoData} alt={empresa.nome} style={{ maxWidth: '50px', maxHeight: '50px' }} />
                    )}
                  </td>
                  <td>{empresa.nome}</td>
                  <td>{empresa.cnpj || '-'}</td>
                  <td>{empresa.telefone || '-'}</td>
                  <td>{empresa.email || '-'}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-primary btn-small" onClick={() => handleEdit(empresa)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(empresa.id)}>
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
              <h2>{editingId ? 'Editar Empresa' : 'Nova Empresa'}</h2>
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
                  <label>CNPJ</label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Telefone Celular</label>
                  <input
                    type="text"
                    name="telefone_celular"
                    value={formData.telefone_celular}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Telefone Fixo</label>
                  <input
                    type="text"
                    name="telefone_fixo"
                    value={formData.telefone_fixo}
                    onChange={handleInputChange}
                    placeholder="(11) 3333-3333"
                  />
                </div>
                <div className="form-group">
                  <label>Telefone (Geral)</label>
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

              <div className="form-group">
                <label>Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                {logoPreview && (
                  <img src={logoPreview} alt="Preview" className="logo-preview" />
                )}
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

export default Empresas;
