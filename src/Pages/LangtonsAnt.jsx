import "../../src/assets/script.js";
import { Crown, HardHat, Heart, Swords, Square } from '../components/Icons.jsx';

function LangtonsAnt() {
  return (
    <div className="contenedor-principal">
      <div className="titulo">
        <h1>Simulación: Hormiga de Langton</h1>
        <p>Múltiples tipos de hormigas con reglas complejas</p>
      </div>

      <div className="panel-izquierdo-derecho">
        {/* PANEL IZQUIERDO: Configuración */}
        <div className="panel-controles">
          <h3>Controles de Simulación</h3>
          <div className="botones-control">
            <button id="generateRandomBtn">Generar Población</button>
            <button id="toggleGame">Iniciar</button>
            <button id="nextGenerationBtn">Avanzar 1 Paso</button>
            <button id="resetBtn">Reiniciar</button>
          </div>

          <div className="botones-velocidad">
            <label htmlFor="speedInput">Velocidad (ms): </label>
            <button id="minSpeed">min</button>
            <button id="decreaseSpeed">−</button>
            <input type="number" id="speedInput" defaultValue={50} min={10} step={10} readOnly />
            <button id="increaseSpeed">+</button>
            <button id="maxSpeed">máx</button>
          </div>

          <h3>Configuración del Grid</h3>
          <div className="inputs-configuracion">
            <label htmlFor="inputRows">Filas:</label>
            <input type="number" id="inputRows" min={10} defaultValue={100} step={10} />
            <label htmlFor="inputCols">Columnas:</label>
            <input type="number" id="inputCols" min={10} defaultValue={100} step={10} />
            <label htmlFor="inputCellSize">Tamaño de celdas:</label>
            <input type="number" id="inputCellSize" min={2} defaultValue={6} />
            <button id="updateSizeBtn">Aplicar Tamaño</button>
          </div>

          <h3>Población Inicial</h3>
          <div className="inputs-poblacion">
            <div className="ant-density">
              <label>Densidad Total (%):</label>
              <input type="number" id="inputDensidadTotal" min="1" max="100" defaultValue="50" />
            </div>
            <p>Distribución de los tipos (%):</p>
            <div className="ant-density">
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input type="color" id="colorReina" defaultValue="#FF0000" disabled style={{marginRight: 8, padding: 0, width: 20, height: 20}} />
                <label style={{display: 'flex', alignItems: 'center'}}><Crown size={16} style={{marginRight: 4}}/> Reinas:</label>
              </div>
              <input type="number" id="inputProbReina" min="0" max="100" defaultValue="10" />
            </div>
            <div className="ant-density">
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input type="color" id="colorTrabajadora" defaultValue="#0000FF" disabled style={{marginRight: 8, padding: 0, width: 20, height: 20}} />
                <label style={{display: 'flex', alignItems: 'center'}}><HardHat size={16} style={{marginRight: 4}}/> Trabajadoras:</label>
              </div>
              <input type="number" id="inputProbTrabajadora" min="0" max="100" defaultValue="35" />
            </div>
            <div className="ant-density">
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input type="color" id="colorReproductora" defaultValue="#FF69B4" disabled style={{marginRight: 8, padding: 0, width: 20, height: 20}} />
                <label style={{display: 'flex', alignItems: 'center'}}><Heart size={16} style={{marginRight: 4}}/> Reproductoras:</label>
              </div>
              <input type="number" id="inputProbReproductora" min="0" max="100" defaultValue="25" />
            </div>
            <div className="ant-density">
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input type="color" id="colorSoldado" defaultValue="#00FF00" disabled style={{marginRight: 8, padding: 0, width: 20, height: 20}} />
                <label style={{display: 'flex', alignItems: 'center'}}><Swords size={16} style={{marginRight: 4}}/> Soldados:</label>
              </div>
              <input type="number" id="inputProbSoldado" min="0" max="100" defaultValue="30" />
            </div>
          </div>

          <h3>Nacimientos (Probabilidad %)</h3>
          <div className="inputs-nacimientos">
            <div className="ant-density">
              <label><Crown size={16} style={{marginRight: 4}}/> Reinas:</label>
              <input type="number" id="inputNacReina" min="0" max="100" defaultValue="25" />
            </div>
            <div className="ant-density">
              <label><HardHat size={16} style={{marginRight: 4}}/> Trabajadoras:</label>
              <input type="number" id="inputNacTrabajadora" min="0" max="100" defaultValue="15" />
            </div>
            <div className="ant-density">
              <label><Heart size={16} style={{marginRight: 4}}/> Reproductoras:</label>
              <input type="number" id="inputNacReproductora" min="0" max="100" defaultValue="45" />
            </div>
            <div className="ant-density">
              <label><Swords size={16} style={{marginRight: 4}}/> Soldados:</label>
              <input type="number" id="inputNacSoldado" min="0" max="100" defaultValue="15" />
            </div>
          </div>

          <h3>Pincel Manual</h3>
          <div className="inputs-pincel">
            <label>Selecciona qué dibujar:</label>
            <div className="brush-selector" id="brushContainer">
              <button className="brush-btn active" data-brush="celda" title="Invertir Celda"><Square size={16} /></button>
              <button className="brush-btn" data-brush="0" style={{ backgroundColor: '#FF0000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Reina"><Crown size={16} /></button>
              <button className="brush-btn" data-brush="1" style={{ backgroundColor: '#0000FF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Trabajadora"><HardHat size={16} /></button>
              <button className="brush-btn" data-brush="2" style={{ backgroundColor: '#FF69B4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Reproductora"><Heart size={16} /></button>
              <button className="brush-btn" data-brush="3" style={{ backgroundColor: '#00FF00', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Soldado"><Swords size={16} /></button>
            </div>
          </div>

          <div className="entorno">
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
              <label htmlFor="toroidalCheck" style={{margin: 0}}>Mundo Toroidal:</label>
              <label className="switch">
                <input type="checkbox" id="toroidalCheck" defaultChecked />
                <span className="slider round" />
              </label>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <label htmlFor="showPathCheck" style={{margin: 0}}>Mostrar Celdas Visitadas:</label>
              <label className="switch">
                <input type="checkbox" id="showPathCheck" />
                <span className="slider round" />
              </label>
            </div>
          </div>
        </div>

        {/* CENTRO: Canvas y Explicación */}
        <div className="juego-contenedor">
          <div className="instrucciones-grid" style={{marginBottom: '10px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: '#cbd5e1', width: '100%', boxSizing: 'border-box'}}>
            <strong style={{color: '#a78bfa'}}>Controles del Ratón en el Grid:</strong>
            <ul style={{margin: '5px 0 0 20px', padding: 0}}>
              <li><strong>Clic Izquierdo:</strong> Dibuja la hormiga o celda seleccionada en el pincel. Si ya hay una hormiga, la cambia de tipo cíclicamente.</li>
              <li><strong>Clic Derecho:</strong> Elimina la hormiga seleccionada debajo del cursor.</li>
            </ul>
          </div>
          <canvas id="gameCanvas" />
        </div>

        {/* PANEL DERECHO: Estadísticas */}
        <div className="panel-estadisticas">
          <h3>Estadísticas</h3>
          <div className="contadores">
            <p>Generaciones (Iteraciones):<br /><span id="generationCounter">0</span></p>
            <p>Población Total:<br /><span id="aliveCounter">0</span></p>
            <hr />
            <h4>Censo Actual</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <p style={{ flex: '1 1 40%' }}>Reinas:<br /><span id="countReinas">0</span></p>
              <p style={{ flex: '1 1 40%' }}>Trabajadoras:<br /><span id="countTrabajadoras">0</span></p>
              <p style={{ flex: '1 1 40%' }}>Reproductoras:<br /><span id="countReproductoras">0</span></p>
              <p style={{ flex: '1 1 40%' }}>Soldados:<br /><span id="countSoldados">0</span></p>
            </div>
            <hr />
            <h4>Eventos</h4>
            <p>Decesos:<br /><span id="countDecesos">0</span></p>
            <p>Nacimientos:<br /><span id="countNacimientos">0</span></p>
            <p>Conflictos:<br /><span id="countConflictos">0</span></p>

            <hr />
            <h4>Análisis de Estabilidad</h4>
            <p>Densidad Tablero:<br /><span id="densityStat">0%</span></p>
            <p>Ratio Naci/Decesos:<br /><span id="ratioStat">1.00</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LangtonsAnt;
