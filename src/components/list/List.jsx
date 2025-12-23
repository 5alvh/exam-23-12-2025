import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Server, Cpu, HardDrive, MemoryStick } from 'lucide-react';
import './list.css'; 

export default function List({refreshList} ) {
  const [servers, setServers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('http://localhost:3000/servidores');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        setServers(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching servers:', err);
        setError('Failed to load server data. Please try again later.');
        setServers([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [refreshList]); 

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="server-list-container">
        <h1 className="server-list-title">Lista de servidores</h1>
        <div className="loading-message">Cargando servidores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="server-list-container">
        <h1 className="server-list-title">Lista de servidores</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="server-list-container">
      <h1 className="server-list-title">Lista de servidores</h1>
      
      {servers.length === 0 ? (
        <div className="no-data-message">No se encontraron servidores.</div>
      ) : (
        <div className="servers-grid">
          {servers.map((server) => (
            <div
              key={server.id}
              className={`server-card ${expandedId === server.id ? 'expanded' : ''}`}
            >
              {/* Card Header - Always Visible */}
              <button
                onClick={() => toggleExpand(server.id)}
                className="card-header"
                aria-expanded={expandedId === server.id}
              >
                <div className="card-header-content">
                  <Server className="card-icon server-icon" />
                  <div className="card-title-wrapper">
                    <h2 className="card-title">{server.nombreServidor}</h2>
                    <div className="card-summary">
                      <span>{server.cpu.nucleos} cores</span>
                      <span>{server.ram.capacidadTotal}GB RAM</span>
                      <span>{server.almacenamiento.capacidadTotal}GB {server.almacenamiento.tipo}</span>
                    </div>
                  </div>
                </div>
                {expandedId === server.id ? (
                  <ChevronUp className="expand-icon" />
                ) : (
                  <ChevronDown className="expand-icon" />
                )}
              </button>

              {expandedId === server.id && (
                <div className="card-details">
                  <div className="details-grid">
                    <div className="detail-section">
                      <div className="detail-header">
                        <Cpu className="detail-icon cpu-icon" />
                        <h3>CPU</h3>
                      </div>
                      <div className="detail-content">
                        <p><span className="detail-label">Modelo:</span> {server.cpu.modelo}</p>
                        <p><span className="detail-label">Núcleos/Hilos:</span> {server.cpu.nucleos}/{server.cpu.hilos}</p>
                        <p><span className="detail-label">Velocidad:</span> {server.cpu.velocidadBase}GHz - {server.cpu.velocidadBoost}GHz</p>
                        <p><span className="detail-label">Generación:</span> {server.cpu.generacion}</p>
                        <p><span className="detail-label">TDP:</span> {server.cpu.consumoTDP}W</p>
                        {server.cpu.precio && <p><span className="detail-label">Precio:</span> ${server.cpu.precio}</p>}
                      </div>
                    </div>

                    <div className="detail-section">
                      <div className="detail-header">
                        <MemoryStick className="detail-icon ram-icon" />
                        <h3>RAM</h3>
                      </div>
                      <div className="detail-content">
                        <p><span className="detail-label">Capacidad:</span> {server.ram.capacidadTotal}GB</p>
                        <p><span className="detail-label">Tipo:</span> {server.ram.tipo}</p>
                        <p><span className="detail-label">Velocidad:</span> {server.ram.velocidad}MHz</p>
                        <p><span className="detail-label">Módulos:</span> {server.ram.numeroModulos}</p>
                        <p><span className="detail-label">Config:</span> {server.ram.configuracion}</p>
                        {server.ram.precio && <p><span className="detail-label">Precio:</span> ${server.ram.precio}</p>}
                      </div>
                    </div>

                    <div className="detail-section">
                      <div className="detail-header">
                        <HardDrive className="detail-icon storage-icon" />
                        <h3>Almacenamiento</h3>
                      </div>
                      <div className="detail-content">
                        <p><span className="detail-label">Tipo:</span> {server.almacenamiento.tipo}</p>
                        <p><span className="detail-label">Capacidad:</span> {server.almacenamiento.capacidadTotal}GB</p>
                        <p><span className="detail-label">Lectura:</span> {server.almacenamiento.velocidadLectura}MB/s</p>
                        <p><span className="detail-label">Escritura:</span> {server.almacenamiento.velocidadEscritura}MB/s</p>
                        <p><span className="detail-label">Interfaz:</span> {server.almacenamiento.interfaz}</p>
                        <p><span className="detail-label">Factor:</span> {server.almacenamiento.factorForma}</p>
                        {server.almacenamiento.precio && <p><span className="detail-label">Precio:</span> ${server.almacenamiento.precio}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}