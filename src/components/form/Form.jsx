import { useState } from 'react';
import './form.css';

export default function Form({ handleButtonClick }) {
    const mi_url = 'http://localhost:3000/servidores';

    const [formData, setFormData] = useState({
        nombreServidor: '',
        cpu: {
            modelo: '',
            nucleos: 0,
            hilos: 0,
            velocidadBase: 0.0,
            velocidadBoost: 0.0,
            generacion: '',
            consumoTDP: 0,
            precio: 0
        },
        ram: {
            capacidadTotal: 0,
            tipo: '',
            velocidad: 0,
            numeroModulos: 0,
            configuracion: '',
            precio: 0
        },
        almacenamiento: {
            tipo: '',
            capacidadTotal: 1000,
            velocidadLectura: 3500,
            velocidadEscritura: 3000,
            interfaz: '',
            factorForma: '',
            precio: 0
        }
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function calcularPrecioTotal() {
        return formData.cpu.precio + formData.ram.precio + formData.almacenamiento.precio;
    }

    function comprobarPresupuesto() {
        const precioTotal = calcularPrecioTotal();
        return precioTotal <= 700;
    }

    function comprobarFormulario() {
        if (
            formData.nombreServidor.length > 0 &&
            formData.cpu.nucleos > 0 &&
            formData.ram.capacidadTotal > 0 &&
            formData.almacenamiento.capacidadTotal > 0
        ) {
            return true;
        }
        return false;
    }

    function handleChange(section, field, value) {

        if (section === 'general') {
            setFormData({ ...formData, nombreServidor: value });
        } else {
            setFormData({
                ...formData,
                [section]: {
                    ...formData[section],
                    [field]: value
                }
            });
        }
    }

    async function enviarFormulario() {
        setError('');

        if (!comprobarFormulario()) {
            setError('Por favor, completa todos los campos obligatorios (*)');
            return;
        }

        if (!comprobarPresupuesto()) {
            setError(`El precio total (${calcularPrecioTotal()}€) supera el límite de 700€`);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(mi_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al enviar el formulario');
            }
            handleButtonClick();
            const data = await response.json();
            alert('¡Servidor guardado correctamente!');
            console.log('Respuesta del servidor:', data);

            setFormData({
                nombreServidor: '',
                cpu: {
                    modelo: '',
                    nucleos: 0,
                    hilos: 0,
                    velocidadBase: 0.0,
                    velocidadBoost: 0.0,
                    generacion: '',
                    consumoTDP: 0,
                    precio: 0
                },
                ram: {
                    capacidadTotal: 0,
                    tipo: '',
                    velocidad: 0,
                    numeroModulos: 0,
                    configuracion: '',
                    precio: 0
                },
                almacenamiento: {
                    tipo: '',
                    capacidadTotal: 1000,
                    velocidadLectura: 3500,
                    velocidadEscritura: 3000,
                    interfaz: '',
                    factorForma: '',
                    precio: 0
                }
            });
        } catch (err) {
            setError('Error al conectar con el servidor: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    const precioTotal = calcularPrecioTotal();
    const superaPresupuesto = precioTotal > 700;

    return (
        <div className="container">
            <h2>Especificaciones del Servidor</h2>

            <div className="seccion" id="presupuesto" style={{
                backgroundColor: superaPresupuesto ? '#ffebee' : '#e8f5e9',
                border: `2px solid ${superaPresupuesto ? '#f44336' : '#4caf50'}`
            }}>
                <h3>Presupuesto</h3>
                <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: superaPresupuesto ? '#d32f2f' : '#2e7d32' }}>
                    Precio Total: {precioTotal.toFixed(2)}€ / 700€
                </p>
                {superaPresupuesto && (
                    <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                        El presupuesto supera el límite de 700€
                    </p>
                )}
            </div>

            {error && (
                <div style={{ backgroundColor: '#ffebee', padding: '10px', borderRadius: '5px', color: '#d32f2f', marginBottom: '15px' }}>
                    {error}
                </div>
            )}

            <div className="seccion">
                <h3>General</h3>
                <label><strong>Nombre del Servidor*</strong></label>
                <input
                    type="text"
                    placeholder="Ej: Servidor-Principal-01"
                    value={formData.nombreServidor}
                    onChange={(e) => handleChange('general', '', e.target.value)}
                />
            </div>

            <div className="seccion">
                <h3>CPU</h3>

                <label><strong>Precio CPU (€)*</strong></label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Ej: 250.00"
                    value={formData.cpu.precio}
                    onChange={(e) => handleChange('cpu', 'precio', parseFloat(e.target.value) || 0)}
                    min="0"
                />

                <label>Modelo del CPU</label>
                <input
                    type="text"
                    placeholder="Ej: Intel Xeon E5-2680"
                    value={formData.cpu.modelo}
                    onChange={(e) => handleChange('cpu', 'modelo', e.target.value)}
                />

                <label><strong>Núcleos*</strong></label>
                <select
                    value={formData.cpu.nucleos}
                    onChange={(e) => handleChange('cpu', 'nucleos', parseInt(e.target.value) || 0)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                    <option value="64">64</option>
                    <option value="128">128</option>
                </select>

                <label>Hilos</label>
                <select
                    value={formData.cpu.hilos}
                    onChange={(e) => handleChange('cpu', 'hilos', parseInt(e.target.value) || 0)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                    <option value="64">64</option>
                    <option value="128">128</option>
                    <option value="256">256</option>
                </select>

                <label>Velocidad Base (GHz)</label>
                <input
                    type="number"
                    step="0.1"
                    placeholder="Ej: 2.4"
                    value={formData.cpu.velocidadBase}
                    onChange={(e) => handleChange('cpu', 'velocidadBase', parseFloat(e.target.value) || 0)}
                />

                <label>Velocidad Boost (GHz)</label>
                <input
                    type="number"
                    step="0.1"
                    placeholder="Ej: 3.8"
                    value={formData.cpu.velocidadBoost}
                    onChange={(e) => handleChange('cpu', 'velocidadBoost', parseFloat(e.target.value) || 0)}
                />

                <label>Generación</label>
                <input
                    type="text"
                    placeholder="Ej: 12ª Gen"
                    value={formData.cpu.generacion}
                    onChange={(e) => handleChange('cpu', 'generacion', e.target.value)}
                />

                <label>Consumo (TDP en W)</label>
                <input
                    type="number"
                    placeholder="Ej: 95"
                    value={formData.cpu.consumoTDP}
                    onChange={(e) => handleChange('cpu', 'consumoTDP', parseInt(e.target.value) || 0)}
                />
            </div>

            <div className="seccion">
                <h3>RAM</h3>

                <label><strong>Precio RAM (€)*</strong></label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Ej: 150.00"
                    value={formData.ram.precio}
                    onChange={(e) => handleChange('ram', 'precio', parseFloat(e.target.value) || 0)}
                    min="0"
                />

                <label><strong>Capacidad Total (GB)*</strong></label>
                <select
                    value={formData.ram.capacidadTotal}
                    onChange={(e) => handleChange('ram', 'capacidadTotal', parseInt(e.target.value) || 0)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="4">4 GB</option>
                    <option value="8">8 GB</option>
                    <option value="16">16 GB</option>
                    <option value="32">32 GB</option>
                    <option value="64">64 GB</option>
                    <option value="128">128 GB</option>
                    <option value="256">256 GB</option>
                    <option value="512">512 GB</option>
                </select>

                <label>Tipo</label>
                <select
                    value={formData.ram.tipo}
                    onChange={(e) => handleChange('ram', 'tipo', e.target.value)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="DDR3">DDR3</option>
                    <option value="DDR4">DDR4</option>
                    <option value="DDR5">DDR5</option>
                </select>

                <label>Velocidad (MHz)</label>
                <select
                    value={formData.ram.velocidad}
                    onChange={(e) => handleChange('ram', 'velocidad', parseInt(e.target.value) || 0)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="2133">2133 MHz</option>
                    <option value="2400">2400 MHz</option>
                    <option value="2666">2666 MHz</option>
                    <option value="3200">3200 MHz</option>
                    <option value="3600">3600 MHz</option>
                    <option value="4800">4800 MHz</option>
                    <option value="5600">5600 MHz</option>
                    <option value="6400">6400 MHz</option>
                </select>

                <label>Número de Módulos</label>
                <select
                    value={formData.ram.numeroModulos}
                    onChange={(e) => handleChange('ram', 'numeroModulos', parseInt(e.target.value) || 0)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                </select>

                <label>Configuración</label>
                <select
                    value={formData.ram.configuracion}
                    onChange={(e) => handleChange('ram', 'configuracion', e.target.value)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="single">Single Channel</option>
                    <option value="dual">Dual Channel</option>
                    <option value="quad">Quad Channel</option>
                </select>
            </div>

            <div className="seccion">
                <h3>Almacenamiento</h3>

                <label><strong>Precio Almacenamiento (€)*</strong></label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Ej: 120.00"
                    value={formData.almacenamiento.precio}
                    onChange={(e) => handleChange('almacenamiento', 'precio', parseFloat(e.target.value) || 0)}
                    min="0"
                />

                <label><strong>Tipo*</strong></label>
                <select
                    value={formData.almacenamiento.tipo}
                    onChange={(e) => handleChange('almacenamiento', 'tipo', e.target.value)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="HDD">HDD</option>
                    <option value="SSD">SSD SATA</option>
                    <option value="NVMe">NVMe SSD</option>
                </select>

                <label>Capacidad Total (GB/TB)</label>
                <select
                    value={formData.almacenamiento.capacidadTotal}
                    onChange={(e) => handleChange('almacenamiento', 'capacidadTotal', parseInt(e.target.value) || 0)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="256">256 GB</option>
                    <option value="512">512 GB</option>
                    <option value="1000">1 TB</option>
                    <option value="2000">2 TB</option>
                    <option value="4000">4 TB</option>
                    <option value="8000">8 TB</option>
                </select>

                <label>Velocidad Lectura (MB/s)</label>
                <input
                    type="number"
                    placeholder="Ej: 3500"
                    value={formData.almacenamiento.velocidadLectura}
                    onChange={(e) => handleChange('almacenamiento', 'velocidadLectura', parseInt(e.target.value) || 0)}
                />

                <label>Velocidad Escritura (MB/s)</label>
                <input
                    type="number"
                    placeholder="Ej: 3000"
                    value={formData.almacenamiento.velocidadEscritura}
                    onChange={(e) => handleChange('almacenamiento', 'velocidadEscritura', parseInt(e.target.value) || 0)}
                />

                <label>Interfaz</label>
                <select
                    value={formData.almacenamiento.interfaz}
                    onChange={(e) => handleChange('almacenamiento', 'interfaz', e.target.value)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="SATA3">SATA III</option>
                    <option value="PCIe3">PCIe 3.0 x4</option>
                    <option value="PCIe4">PCIe 4.0 x4</option>
                    <option value="PCIe5">PCIe 5.0 x4</option>
                </select>

                <label>Factor de Forma</label>
                <select
                    value={formData.almacenamiento.factorForma}
                    onChange={(e) => handleChange('almacenamiento', 'factorForma', e.target.value)}
                >
                    <option value="">Seleccionar...</option>
                    <option value="2.5">2.5"</option>
                    <option value="3.5">3.5"</option>
                    <option value="M.2">M.2 2280</option>
                    <option value="M.2-2">M.2 2242</option>
                </select>
            </div>

            <button
                onClick={enviarFormulario}
                className="submit"
                disabled={loading || !comprobarFormulario() || !comprobarPresupuesto()}
            >
                {loading ? 'Guardando...' : 'Guardar Especificaciones'}
            </button>
        </div>
    );
}