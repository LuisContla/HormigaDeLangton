import "../../src/assets/script.js";

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
              <label>👑 Reinas:</label>
              <input type="number" id="inputProbReina" min="0" max="100" defaultValue="1" />
              <input type="color" id="colorReina" defaultValue="#FF0000" disabled />
            </div>
            <div className="ant-density">
              <label>👷 Trabajadoras:</label>
              <input type="number" id="inputProbTrabajadora" min="0" max="100" defaultValue="55" />
              <input type="color" id="colorTrabajadora" defaultValue="#0000FF" disabled />
            </div>
            <div className="ant-density">
              <label>💕 Reproductoras:</label>
              <input type="number" id="inputProbReproductora" min="0" max="100" defaultValue="9" />
              <input type="color" id="colorReproductora" defaultValue="#FF69B4" disabled />
            </div>
            <div className="ant-density">
              <label>⚔️ Soldados:</label>
              <input type="number" id="inputProbSoldado" min="0" max="100" defaultValue="35" />
              <input type="color" id="colorSoldado" defaultValue="#00FF00" disabled />
            </div>
            <button id="generateRandomBtn">Generar Población</button>
          </div>

          <h3>Pincel Manual</h3>
          <div className="inputs-pincel">
            <label>Selecciona qué dibujar:</label>
            <div className="brush-selector" id="brushContainer">
              <button className="brush-btn active" data-brush="celda" title="Invertir Celda">⬛</button>
              <button className="brush-btn" data-brush="0" style={{ backgroundColor: '#FF0000', color: 'white' }} title="Reina">👑</button>
              <button className="brush-btn" data-brush="1" style={{ backgroundColor: '#0000FF', color: 'white' }} title="Trabajadora">👷</button>
              <button className="brush-btn" data-brush="2" style={{ backgroundColor: '#FF69B4', color: 'white' }} title="Reproductora">💕</button>
              <button className="brush-btn" data-brush="3" style={{ backgroundColor: '#00FF00', color: 'black' }} title="Soldado">⚔️</button>
            </div>
          </div>

          <h3>Controles de Simulación</h3>
          <div className="botones-control">
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

          <div className="entorno">
            <label htmlFor="toroidalCheck">Mundo Toroidal:</label>
            <label className="switch">
              <input type="checkbox" id="toroidalCheck" defaultChecked />
              <span className="slider round" />
            </label>
          </div>
        </div>

        {/* CENTRO: Canvas */}
        <div className="juego-contenedor">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default LangtonsAnt;
