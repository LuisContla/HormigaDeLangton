import "../../src/assets/script.js";
import { Crown, HardHat, Heart, Swords, Square } from '../components/Icons.jsx';

function LangtonsAnt() {
  return (
    <div className="contenedor-principal">
      {/* ─── HEADER ─── */}
      <div className="titulo">
        <h1>🐜 Simulación: Hormiga de Langton</h1>
        <p>Múltiples tipos de hormigas con reglas complejas</p>
      </div>

      {/* ─── TOOLBAR ─── */}
      <div className="toolbar">
        <div className="toolbar-group">
          <button id="generateRandomBtn" className="btn-generate" title="Generar población aleatoria">
            🎲 Poblar
          </button>
          <button id="toggleGame" className="btn-success" title="Iniciar/Pausar simulación">
            ▶ Iniciar
          </button>
          <button id="nextGenerationBtn" className="btn-outline" title="Avanzar una iteración">
            ⏭ Paso
          </button>
          <button id="resetBtn" className="btn-outline" title="Reiniciar simulación">
            🔄 Reset
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <span className="speed-label">Velocidad (ms):</span>
          <div className="speed-controls">
            <button id="minSpeed" className="btn-outline btn-small" title="Velocidad mínima (10ms)">min</button>
            <button id="decreaseSpeed" className="btn-outline btn-small" title="Reducir velocidad">−</button>
            <input type="number" id="speedInput" defaultValue={50} min={10} step={10} readOnly />
            <button id="increaseSpeed" className="btn-outline btn-small" title="Aumentar velocidad">+</button>
            <button id="maxSpeed" className="btn-outline btn-small" title="Velocidad máxima (1000ms)">máx</button>
          </div>
        </div>
      </div>

      {/* ─── CONTENIDO PRINCIPAL ─── */}
      <div className="main-content">

        {/* ─── CANVAS ─── */}
        <div className="juego-contenedor">
          <div className="instrucciones-wrapper">
            <button className="instrucciones-toggle" title="Instrucciones del ratón" aria-label="Ver instrucciones">?</button>
            <div className="instrucciones-popup">
              <strong>Controles del ratón:</strong>
              <ul>
                <li><strong>Clic Izquierdo:</strong> Dibuja la hormiga o celda seleccionada. Si ya hay una hormiga, la cambia de tipo.</li>
                <li><strong>Clic Derecho:</strong> Elimina la hormiga debajo del cursor.</li>
              </ul>
            </div>
          </div>
          <canvas id="gameCanvas" />
        </div>

        {/* ─── PANEL LATERAL ─── */}
        <aside className="panel-lateral">

          {/* Estadísticas */}
          <div className="seccion">
            <div className="seccion-header">
              <span className="seccion-icon">📊</span> Estadísticas
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Generaciones</span>
                <span className="stat-value" id="generationCounter">0</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Población</span>
                <span className="stat-value" id="aliveCounter">0</span>
              </div>

              <div className="stat-divider" />

              <div className="stat-item stat-reina">
                <span className="stat-label">👑 Reinas</span>
                <span className="stat-value" id="countReinas">0</span>
              </div>
              <div className="stat-item stat-trabajadora">
                <span className="stat-label">⛑ Trabajadoras</span>
                <span className="stat-value" id="countTrabajadoras">0</span>
              </div>
              <div className="stat-item stat-reproductora">
                <span className="stat-label">💕 Reproductoras</span>
                <span className="stat-value" id="countReproductoras">0</span>
              </div>
              <div className="stat-item stat-soldado">
                <span className="stat-label">⚔ Soldados</span>
                <span className="stat-value" id="countSoldados">0</span>
              </div>

              <div className="stat-divider" />

              <div className="stat-item stat-nacimientos">
                <span className="stat-label">Nacimientos</span>
                <span className="stat-value" id="countNacimientos">0</span>
              </div>
              <div className="stat-item stat-decesos">
                <span className="stat-label">Decesos</span>
                <span className="stat-value" id="countDecesos">0</span>
              </div>
              <div className="stat-item stat-conflictos">
                <span className="stat-label">Conflictos</span>
                <span className="stat-value" id="countConflictos">0</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Densidad</span>
                <span className="stat-value" id="densityStat">0%</span>
              </div>

              <div className="stat-divider" />

              <div className="stat-item full-width">
                <span className="stat-label">Ratio Naci/Decesos</span>
                <span className="stat-value" id="ratioStat">1.00</span>
              </div>
            </div>
          </div>

          {/* Pincel Manual */}
          <div className="seccion">
            <div className="seccion-header">
              <span className="seccion-icon">🖌</span> Pincel Manual
            </div>
            <div className="brush-selector" id="brushContainer">
              <button className="brush-btn active" data-brush="celda" title="Invertir Celda"><Square size={16} /></button>
              <button className="brush-btn" data-brush="0" style={{ backgroundColor: 'var(--color-reina)' }} title="Reina"><Crown size={16} /></button>
              <button className="brush-btn" data-brush="1" style={{ backgroundColor: 'var(--color-trabajadora)' }} title="Trabajadora"><HardHat size={16} /></button>
              <button className="brush-btn" data-brush="2" style={{ backgroundColor: 'var(--color-reproductora)' }} title="Reproductora"><Heart size={16} /></button>
              <button className="brush-btn" data-brush="3" style={{ backgroundColor: 'var(--color-soldado)', color: '#0b1120' }} title="Soldado"><Swords size={16} /></button>
            </div>
          </div>

          {/* Toggles */}
          <div className="seccion">
            <div className="toggles-row">
              <div className="toggle-item">
                <label htmlFor="toroidalCheck">🌐 Mundo Toroidal</label>
                <label className="switch">
                  <input type="checkbox" id="toroidalCheck" defaultChecked />
                  <span className="slider round" />
                </label>
              </div>
              <div className="toggle-item">
                <label htmlFor="showPathCheck">👁 Celdas Visitadas</label>
                <label className="switch">
                  <input type="checkbox" id="showPathCheck" defaultChecked />
                  <span className="slider round" />
                </label>
              </div>
            </div>
          </div>

          {/* ─── COLAPSABLE: Casos de Estudio (Reporte) ─── */}
          <details className="seccion-colapsable" open>
            <summary>📊 Casos de Estudio (Reporte)</summary>
            <div className="seccion-body">
              <p className="seccion-texto-caso" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', lineHeight: '1.4', textAlign: 'justify' }}>
                Estas configuraciones corresponden a los casos de estudio y pruebas más representativos descritos en el reporte de estabilización del ecosistema.
              </p>
              <button id="btnPreloadSobrepoblacion" className="btn-preload" title="Escenario de Sobrepoblación (Prueba 1)">
                💥 Sobrepoblación (Prueba 1)
              </button>
              <button id="btnPreloadAislamiento" className="btn-preload" title="Escenario de Aislamiento (Prueba 5)">
                💀 Aislamiento (Prueba 5)
              </button>
              <button id="btnPreloadCercania" className="btn-preload" title="Escenario de Cercanía a la Estabilidad (Prueba 15)">
                ⚖️ Cercanía a Estabilidad (Prueba 15)
              </button>
              <button id="btnPreloadEstabilidad" className="btn-preload" title="Escenario de Estabilidad Dinámica (Prueba 20)">
                🌟 Estabilidad Dinámica (Prueba 20)
              </button>
            </div>
          </details>

          {/* ─── COLAPSABLE: Configuración del Grid ─── */}
          <details className="seccion-colapsable">
            <summary>⚙ Configuración del Grid</summary>
            <div className="seccion-body">
              <div className="config-row">
                <label htmlFor="inputRows">Filas:</label>
                <input type="number" id="inputRows" min={10} defaultValue={100} step={10} />
              </div>
              <div className="config-row">
                <label htmlFor="inputCols">Columnas:</label>
                <input type="number" id="inputCols" min={10} defaultValue={100} step={10} />
              </div>
              <div className="config-row">
                <label htmlFor="inputCellSize">Tamaño de celdas:</label>
                <input type="number" id="inputCellSize" min={2} defaultValue={6} />
              </div>
              <button id="updateSizeBtn" className="btn-apply">Aplicar Tamaño</button>
            </div>
          </details>

          {/* ─── COLAPSABLE: Población Inicial ─── */}
          <details className="seccion-colapsable">
            <summary>🐜 Población Inicial</summary>
            <div className="seccion-body">
              <div className="config-row">
                <label htmlFor="inputDensidadTotal">Densidad Total (%):</label>
                <input type="number" id="inputDensidadTotal" min="1" max="100" defaultValue="50" />
              </div>
              <div className="section-subtitle">Distribución de tipos (%):</div>
              <div className="ant-density">
                <div className="ant-type-indicator">
                  <input type="color" id="colorReina" defaultValue="#FF0000" disabled style={{ padding: 0, width: 16, height: 16 }} />
                  <label><Crown size={14} style={{ marginRight: 3 }} /> Reinas:</label>
                </div>
                <input type="number" id="inputProbReina" min="0" max="100" defaultValue="10" />
              </div>
              <div className="ant-density">
                <div className="ant-type-indicator">
                  <input type="color" id="colorTrabajadora" defaultValue="#0000FF" disabled style={{ padding: 0, width: 16, height: 16 }} />
                  <label><HardHat size={14} style={{ marginRight: 3 }} /> Trabajadoras:</label>
                </div>
                <input type="number" id="inputProbTrabajadora" min="0" max="100" defaultValue="35" />
              </div>
              <div className="ant-density">
                <div className="ant-type-indicator">
                  <input type="color" id="colorReproductora" defaultValue="#FF69B4" disabled style={{ padding: 0, width: 16, height: 16 }} />
                  <label><Heart size={14} style={{ marginRight: 3 }} /> Reproductoras:</label>
                </div>
                <input type="number" id="inputProbReproductora" min="0" max="100" defaultValue="25" />
              </div>
              <div className="ant-density">
                <div className="ant-type-indicator">
                  <input type="color" id="colorSoldado" defaultValue="#00FF00" disabled style={{ padding: 0, width: 16, height: 16 }} />
                  <label><Swords size={14} style={{ marginRight: 3 }} /> Soldados:</label>
                </div>
                <input type="number" id="inputProbSoldado" min="0" max="100" defaultValue="30" />
              </div>
            </div>
          </details>

          {/* ─── COLAPSABLE: Nacimientos ─── */}
          <details className="seccion-colapsable">
            <summary>🥚 Nacimientos (Probabilidad %)</summary>
            <div className="seccion-body">
              <div className="ant-density">
                <label><Crown size={14} style={{ marginRight: 3 }} /> Reinas:</label>
                <input type="number" id="inputNacReina" min="0" max="100" defaultValue="25" />
              </div>
              <div className="ant-density">
                <label><HardHat size={14} style={{ marginRight: 3 }} /> Trabajadoras:</label>
                <input type="number" id="inputNacTrabajadora" min="0" max="100" defaultValue="15" />
              </div>
              <div className="ant-density">
                <label><Heart size={14} style={{ marginRight: 3 }} /> Reproductoras:</label>
                <input type="number" id="inputNacReproductora" min="0" max="100" defaultValue="45" />
              </div>
              <div className="ant-density">
                <label><Swords size={14} style={{ marginRight: 3 }} /> Soldados:</label>
                <input type="number" id="inputNacSoldado" min="0" max="100" defaultValue="15" />
              </div>
            </div>
          </details>

        </aside>
      </div>
    </div>
  );
}

export default LangtonsAnt;
