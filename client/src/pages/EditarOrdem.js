import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditarOrdem() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [message, setMessage] = useState(null);
  const [itens, setItens] = useState([]);
  const [formData, setFormData] = useState({
    numero: '',
    empresa_id: '',
    cliente_id: '',
    descricao: '',
    observacoes: '',
    status: 'aberta',
    data_conclusao: ''
  });
  const [loading, setLoading] = useState(true);
  const [showNovoClienteModal, setShowNovoClienteModal] = useState(false);
  const [novoClienteData, setNovoClienteData] = useState({
    nome: '',
    cpf_cnpj: '',
    endereco: '',
    telefone: '',
    email: ''
  }); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadData();
  }, [id]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      const [empresasRes, clientesRes, produtosRes, ordemRes] = await Promise.all([
        axios.get('/api/empresas'),
        axios.get('/api/clientes'),
        axios.get('/api/produtos'),
        axios.get(`/api/ordens/${id}`)
      ]);
      setEmpresas(empresasRes.data);
      setClientes(clientesRes.data);
      setProdutos(produtosRes.data);
      
      const ordem = ordemRes.data;
      setFormData({
        numero: ordem.numero,
        empresa_id: ordem.empresa_id,
        cliente_id: ordem.cliente_id,
        descricao: ordem.descricao || '',
        observacoes: ordem.observacoes || '',
        status: ordem.status || 'aberta',
        data_conclusao: ordem.data_conclusao || ''
      });
      setItens(ordem.itens || []);
      setLoading(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar dados' });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNovoClienteChange = (e) => {
    const { name, value } = e.target;
    setNovoClienteData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCriarNovoCliente = async (e) => {
    e.preventDefault();
    try {
      if (!novoClienteData.nome) {
        setMessage({ type: 'error', text: 'Nome do cliente é obrigatório' });
        return;
      }

      const response = await axios.post('/api/clientes', novoClienteData);
      const novoClienteId = response.data.id;

      setFormData(prev => ({
        ...prev,
        cliente_id: novoClienteId
      }));

      setNovoClienteData({
        nome: '',
        cpf_cnpj: '',
        endereco: '',
        telefone: '',
        email: ''
      });

      setShowNovoClienteModal(false);
      setMessage({ type: 'success', text: 'Cliente criado e selecionado com sucesso' });
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao criar cliente' });
    }
  };

  const handleAddItem = () => {
    setItens([...itens, {
      descricao: '',
      quantidade: 1,
      valor_unitario: 0
    }]);
  };

  const handleRemoveItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItens = [...itens];
    newItens[index][field] = value;
    setItens(newItens);
  };

  const handleProdutoSelect = (index, produtoId) => {
    const produto = produtos.find(p => p.id === parseInt(produtoId));
    if (produto) {
      handleItemChange(index, 'produto_id', produtoId);
      handleItemChange(index, 'descricao', produto.nome);
      handleItemChange(index, 'valor_unitario', produto.preco);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.numero || !formData.empresa_id || !formData.cliente_id) {
        setMessage({ type: 'error', text: 'Preencha os campos obrigatórios' });
        return;
      }

      const data = {
        ...formData,
        empresa_id: parseInt(formData.empresa_id),
        cliente_id: parseInt(formData.cliente_id),
        itens: itens.map(item => ({
          ...item,
          produto_id: item.produto_id ? parseInt(item.produto_id) : null,
          quantidade: parseFloat(item.quantidade),
          valor_unitario: parseFloat(item.valor_unitario)
        }))
      };

      await axios.put(`/api/ordens/${id}`, data);
      setMessage({ type: 'success', text: 'Ordem de serviço atualizada com sucesso' });
      setTimeout(() => navigate('/ordens'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar ordem de serviço' });
    }
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      return total + (parseFloat(item.quantidade) * parseFloat(item.valor_unitario) || 0);
    }, 0);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div>
      <div className="page-title">
        <h1>Editar Ordem de Serviço</h1>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <span>{message.text}</span>
          <button className="close-btn" onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row-3">
            <div className="form-group">
              <label>Número da Ordem *</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Empresa *</label>
              <select
                name="empresa_id"
                value={formData.empresa_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione uma empresa</option>
                {empresas.map(empresa => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Cliente *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={handleInputChange}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNovoClienteModal(true)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  + Novo
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="aberta">Aberta</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data de Conclusão</label>
              <input
                type="date"
                name="data_conclusao"
                value={formData.data_conclusao}
                onChange={handleInputChange}
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

          <div className="form-group">
            <label>Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
            />
          </div>

          <h3 style={{ marginTop: '30px', marginBottom: '20px', color: '#2c3e50' }}>
            Itens da Ordem
          </h3>

          {itens.length > 0 && (
            <div className="table-container" style={{ marginBottom: '20px' }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '50%' }}>Descrição</th>
                    <th style={{ width: '12%' }}>Quantidade</th>
                    <th style={{ width: '15%' }}>Valor Unitário</th>
                    <th style={{ width: '13%' }}>Subtotal</th>
                    <th style={{ width: '10%' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={item.descricao}
                          onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                          placeholder="Digite a descrição"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontFamily: 'inherit'
                          }}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.quantidade}
                          onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                          step="0.01"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontFamily: 'inherit',
                            textAlign: 'center'
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.valor_unitario}
                          onChange={(e) => handleItemChange(index, 'valor_unitario', e.target.value)}
                          step="0.01"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontFamily: 'inherit',
                            textAlign: 'right'
                          }}
                          required
                        />
                      </td>
                      <td style={{ fontWeight: 'bold', color: '#667eea', textAlign: 'right' }}>
                        R$ {(parseFloat(item.quantidade) * parseFloat(item.valor_unitario) || 0).toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-danger btn-small"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddItem}
            style={{ marginBottom: '20px' }}
          >
            + Adicionar Item
          </button>

          {itens.length > 0 && (
            <div style={{
              padding: '15px',
              backgroundColor: '#ecf0f1',
              borderRadius: '4px',
              marginBottom: '20px',
              textAlign: 'right'
            }}>
              <strong style={{ fontSize: '18px', color: '#2c3e50' }}>
                Total: R$ {calcularTotal().toFixed(2)}
              </strong>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/ordens')}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-success">
              Atualizar Ordem
            </button>
          </div>
        </form>
      </div>

      {showNovoClienteModal && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Novo Cliente</h2>
              <button className="close-btn" onClick={() => setShowNovoClienteModal(false)}>×</button>
            </div>

            <form onSubmit={handleCriarNovoCliente}>
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={novoClienteData.nome}
                  onChange={handleNovoClienteChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CPF/CNPJ</label>
                  <input
                    type="text"
                    name="cpf_cnpj"
                    value={novoClienteData.cpf_cnpj}
                    onChange={handleNovoClienteChange}
                  />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={novoClienteData.telefone}
                    onChange={handleNovoClienteChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={novoClienteData.email}
                  onChange={handleNovoClienteChange}
                />
              </div>

              <div className="form-group">
                <label>Endereço</label>
                <textarea
                  name="endereco"
                  value={novoClienteData.endereco}
                  onChange={handleNovoClienteChange}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNovoClienteModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  Criar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditarOrdem;
