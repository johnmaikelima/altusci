import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Ordens() {
  const [ordens, setOrdens] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadOrdens();
  }, []);

  const loadOrdens = async () => {
    try {
      const response = await axios.get('/api/ordens');
      setOrdens(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar ordens' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta ordem de serviço?')) {
      try {
        await axios.delete(`/api/ordens/${id}`);
        setMessage({ type: 'success', text: 'Ordem de serviço deletada com sucesso' });
        loadOrdens();
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao deletar ordem' });
      }
    }
  };

  const handlePrint = async (id) => {
    try {
      const response = await axios.get(`/pdf/${id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ordem-servico-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao gerar PDF' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aberta':
        return '#3498db';
      case 'em_andamento':
        return '#f39c12';
      case 'concluida':
        return '#27ae60';
      case 'cancelada':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div>
      <div className="page-title">
        <h1>Ordens de Serviço</h1>
        <Link to="/ordens/criar" className="btn btn-primary">
          + Nova Ordem
        </Link>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <span>{message.text}</span>
          <button className="close-btn" onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      {ordens.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhuma ordem de serviço cadastrada</h3>
          <p>Clique em "Nova Ordem" para começar</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Empresa</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Status</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ordens.map(ordem => (
                <tr key={ordem.id}>
                  <td><strong>{ordem.numero}</strong></td>
                  <td>{ordem.empresa_nome}</td>
                  <td>{ordem.cliente_nome}</td>
                  <td>{new Date(ordem.data_criacao).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: getStatusColor(ordem.status),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {ordem.status}
                    </span>
                  </td>
                  <td>R$ {parseFloat(ordem.total || 0).toFixed(2)}</td>
                  <td>
                    <div className="actions">
                      <Link to={`/ordens/editar/${ordem.id}`} className="btn btn-primary btn-small">
                        Editar
                      </Link>
                      <button className="btn btn-secondary btn-small" onClick={() => handlePrint(ordem.id)}>
                        Imprimir
                      </button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(ordem.id)}>
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
    </div>
  );
}

export default Ordens;
