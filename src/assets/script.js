console.log("Script cargado: Inicializando Hormiga de Langton...");

window.addEventListener('load', () => {
    console.log("DOM cargado. Configurando Canvas...");
    const canvas = document.getElementById('gameCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // UI Elements
    const inputRows = document.getElementById('inputRows');
    const inputCols = document.getElementById('inputCols');
    const inputCellSize = document.getElementById('inputCellSize');
    const updateSizeBtn = document.getElementById('updateSizeBtn');
    
    // Inputs de población
    const inputDensidadTotal = document.getElementById('inputDensidadTotal');
    const inputProbReina = document.getElementById('inputProbReina');
    const inputProbTrabajadora = document.getElementById('inputProbTrabajadora');
    const inputProbReproductora = document.getElementById('inputProbReproductora');
    const inputProbSoldado = document.getElementById('inputProbSoldado');
    
    const generateRandomBtn = document.getElementById('generateRandomBtn');
    const toggleGameBtn = document.getElementById('toggleGame');
    const resetBtn = document.getElementById('resetBtn');
    const nextGenerationBtn = document.getElementById('nextGenerationBtn');
    const toroidalCheck = document.getElementById('toroidalCheck');
    const speedInput = document.getElementById('speedInput');
    
    const countReinas = document.getElementById('countReinas');
    const countTrabajadoras = document.getElementById('countTrabajadoras');
    const countReproductoras = document.getElementById('countReproductoras');
    const countSoldados = document.getElementById('countSoldados');
    const generationCounter = document.getElementById('generationCounter');
    const aliveCounter = document.getElementById('aliveCounter');

    let rows = parseInt(inputRows.value);
    let cols = parseInt(inputCols.value);
    let cellSize = parseInt(inputCellSize.value);
    
    // Variables globales del simulador
    let grid = []; // 0 = blanco (no visitado), 1 = negro (visitado)
    let ants = [];
    let generation = 0;
    let isRunning = false;
    let speed = parseInt(speedInput.value);
    let animationId = null;
    let lastRenderTime = 0;

    const ANT_TYPES = {
        REINA: 0,
        TRABAJADORA: 1,
        REPRODUCTORA: 2,
        SOLDADO: 3
    };

    const ANT_COLORS = {
        [ANT_TYPES.REINA]: '#FF0000',
        [ANT_TYPES.TRABAJADORA]: '#0000FF',
        [ANT_TYPES.REPRODUCTORA]: '#FF69B4',
        [ANT_TYPES.SOLDADO]: '#00FF00'
    };

    function initGrid() {
        grid = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
        ants = [];
        generation = 0;
        updateStats();
        resizeCanvas();
        drawAll();
    }

    function resizeCanvas() {
        canvas.width = cols * cellSize;
        canvas.height = rows * cellSize;
    }

    function drawAll() {
        // Dibujar el fondo oscuro y líneas sutiles
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#333';
        for(let i = 0; i <= cols; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.stroke();
        }
        for(let j = 0; j <= rows; j++) {
            ctx.beginPath();
            ctx.moveTo(0, j * cellSize);
            ctx.lineTo(canvas.width, j * cellSize);
            ctx.stroke();
        }

        // Dibujar el estado de las celdas en segundo plano
        // (Las etiquetas 0 y 1 no se muestran, solo su efecto visual)
        ctx.fillStyle = '#f8fafc'; // Color para estado '1' (como negro en la regla original)
        for(let y = 0; y < rows; y++) {
            for(let x = 0; x < cols; x++) {
                if(grid[y][x] === 1) {
                    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
                }
            }
        }

        // Dibujar las hormigas por encima de las celdas
        for(const ant of ants) {
            if(!ant.alive) continue;
            ctx.fillStyle = ant.color;
            ctx.fillRect(ant.x * cellSize + 1, ant.y * cellSize + 1, cellSize - 2, cellSize - 2);
        }
    }

    function populateAnts() {
        initGrid();
        const totalCells = rows * cols;
        const densidad = parseInt(inputDensidadTotal.value) || 50;
        const numAnts = Math.floor(totalCells * (densidad / 100));
        
        let pReina = parseFloat(inputProbReina.value) || 0;
        let pTrab = parseFloat(inputProbTrabajadora.value) || 0;
        let pRep = parseFloat(inputProbReproductora.value) || 0;
        let pSold = parseFloat(inputProbSoldado.value) || 0;
        
        // Normalizar probabilidades si no suman 100%
        const totalP = pReina + pTrab + pRep + pSold;
        if (totalP > 0) {
            pReina /= totalP;
            pTrab /= totalP;
            pRep /= totalP;
            pSold /= totalP;
        } else {
            // Valores por defecto en caso de inputs vacíos o todos en 0
            pReina = 0.01; pTrab = 0.55; pRep = 0.09; pSold = 0.35;
        }
        
        const nReinas = Math.floor(numAnts * pReina);
        const nTrabajadoras = Math.floor(numAnts * pTrab);
        const nReproductoras = Math.floor(numAnts * pRep);
        const nSoldados = Math.floor(numAnts * pSold);
        
        const typesToPlace = [
            ...Array(nReinas).fill(ANT_TYPES.REINA),
            ...Array(nTrabajadoras).fill(ANT_TYPES.TRABAJADORA),
            ...Array(nReproductoras).fill(ANT_TYPES.REPRODUCTORA),
            ...Array(nSoldados).fill(ANT_TYPES.SOLDADO)
        ];
        
        // Completar por decimales redondeados
        while(typesToPlace.length < numAnts) {
            typesToPlace.push(ANT_TYPES.TRABAJADORA);
        }
        
        // Mezclar aleatoriamente el orden
        typesToPlace.sort(() => Math.random() - 0.5);
        
        // Obtener posiciones únicas aleatorias
        let availablePositions = [];
        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++) {
                availablePositions.push({x, y});
            }
        }
        availablePositions.sort(() => Math.random() - 0.5);
        
        for(let i=0; i<numAnts; i++) {
            const pos = availablePositions[i];
            const type = typesToPlace[i];
            ants.push({
                x: pos.x,
                y: pos.y,
                type: type,
                color: ANT_COLORS[type],
                dir: Math.floor(Math.random() * 4), // 0:Arriba, 1:Derecha, 2:Abajo, 3:Izquierda
                age: 0,
                alive: true
            });
        }
        
        updateStats();
        drawAll();
    }

    function updateStats() {
        let nReinas = 0, nTrab = 0, nRep = 0, nSold = 0, nAlive = 0;
        for(const ant of ants) {
            if(ant.alive) {
                nAlive++;
                if(ant.type === ANT_TYPES.REINA) nReinas++;
                else if(ant.type === ANT_TYPES.TRABAJADORA) nTrab++;
                else if(ant.type === ANT_TYPES.REPRODUCTORA) nRep++;
                else if(ant.type === ANT_TYPES.SOLDADO) nSold++;
            }
        }
        generationCounter.innerText = generation;
        aliveCounter.innerText = nAlive;
        countReinas.innerText = nReinas;
        countTrabajadoras.innerText = nTrab;
        countReproductoras.innerText = nRep;
        countSoldados.innerText = nSold;
    }

    function step() {
        const isToroidal = toroidalCheck.checked;
        
        for(const ant of ants) {
            if(!ant.alive) continue;
            
            // Regla de Langton Clásica
            const state = grid[ant.y][ant.x];
            
            // 0 = Blanco -> Gira a la derecha (Dir + 1)
            // 1 = Negro -> Gira a la izquierda (Dir + 3)
            if(state === 0) {
                ant.dir = (ant.dir + 1) % 4; 
            } else {
                ant.dir = (ant.dir + 3) % 4;
            }
            
            // Invertir estado de la celda
            grid[ant.y][ant.x] = 1 - state;
            
            // Avanzar en la dirección actual
            if(ant.dir === 0) ant.y--;      // Arriba
            else if(ant.dir === 1) ant.x++; // Derecha
            else if(ant.dir === 2) ant.y++; // Abajo
            else if(ant.dir === 3) ant.x--; // Izquierda
            
            // Validar límites del mundo
            if(isToroidal) {
                if(ant.x < 0) ant.x = cols - 1;
                else if(ant.x >= cols) ant.x = 0;
                
                if(ant.y < 0) ant.y = rows - 1;
                else if(ant.y >= rows) ant.y = 0;
            } else {
                if(ant.x < 0) ant.x = 0;
                else if(ant.x >= cols) ant.x = cols - 1;
                
                if(ant.y < 0) ant.y = 0;
                else if(ant.y >= rows) ant.y = rows - 1;
            }
        }
        
        generation++;
        generationCounter.innerText = generation;
        drawAll(); // Redibujar una vez que todas las hormigas se movieron para evitar parpadeos
    }

    function loop(timestamp) {
        if(!isRunning) return;
        
        if(timestamp - lastRenderTime >= speed) {
            step();
            lastRenderTime = timestamp;
        }
        
        animationId = requestAnimationFrame(loop);
    }

    // --- EVENT LISTENERS ---
    
    generateRandomBtn.addEventListener('click', populateAnts);
    
    toggleGameBtn.addEventListener('click', () => {
        isRunning = !isRunning;
        toggleGameBtn.innerText = isRunning ? "Pausar" : "Iniciar";
        if(isRunning) {
            lastRenderTime = performance.now();
            animationId = requestAnimationFrame(loop);
        } else {
            cancelAnimationFrame(animationId);
        }
    });

    resetBtn.addEventListener('click', () => {
        isRunning = false;
        toggleGameBtn.innerText = "Iniciar";
        cancelAnimationFrame(animationId);
        initGrid();
    });

    nextGenerationBtn.addEventListener('click', () => {
        if(!isRunning) {
            step();
        }
    });

    updateSizeBtn.addEventListener('click', () => {
        rows = parseInt(inputRows.value);
        cols = parseInt(inputCols.value);
        cellSize = parseInt(inputCellSize.value);
        isRunning = false;
        toggleGameBtn.innerText = "Iniciar";
        cancelAnimationFrame(animationId);
        initGrid();
    });

    // Controles de Velocidad
    const minSpeedBtn = document.getElementById('minSpeed');
    const maxSpeedBtn = document.getElementById('maxSpeed');
    const decreaseSpeedBtn = document.getElementById('decreaseSpeed');
    const increaseSpeedBtn = document.getElementById('increaseSpeed');
    
    function updateSpeed(newSpeed) {
        speed = Math.max(10, Math.min(newSpeed, 1000));
        speedInput.value = speed;
    }
    
    minSpeedBtn.addEventListener('click', () => updateSpeed(10));
    maxSpeedBtn.addEventListener('click', () => updateSpeed(1000));
    decreaseSpeedBtn.addEventListener('click', () => updateSpeed(speed - 10));
    increaseSpeedBtn.addEventListener('click', () => updateSpeed(speed + 10));

    // Lógica del Selector de Pincel
    let currentBrushValue = "celda";
    const brushButtons = document.querySelectorAll('.brush-btn');
    brushButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            brushButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBrushValue = btn.getAttribute('data-brush');
        });
    });

    // Condiciones Iniciales Particulares Definidas por el Usuario
    let isDrawing = false;
    let drawStartX = -1;
    let drawStartY = -1;

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        handleManualInput(e);
    });
    canvas.addEventListener('mousemove', (e) => {
        if(isDrawing) handleManualInput(e);
    });
    window.addEventListener('mouseup', () => {
        isDrawing = false;
        drawStartX = -1;
        drawStartY = -1;
    });

    function handleManualInput(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        
        if(x >= 0 && x < cols && y >= 0 && y < rows) {
            // Evitar dibujar varias veces en el mismo píxel en un solo drag si no nos hemos movido
            if (x === drawStartX && y === drawStartY) return;
            drawStartX = x;
            drawStartY = y;

            const brushValue = currentBrushValue;
            
            if(brushValue === "celda") {
                // Alternar estado de la celda (1 o 0) de forma manual
                grid[y][x] = 1 - grid[y][x];
                drawAll();
            } else {
                // Insertar hormiga seleccionada
                const type = parseInt(brushValue);
                // Si la celda está vacía de hormigas, permitimos colocar una
                const existingAnt = ants.find(a => a.x === x && a.y === y && a.alive);
                if (!existingAnt) {
                    ants.push({
                        x, y,
                        type: type,
                        color: ANT_COLORS[type],
                        dir: Math.floor(Math.random() * 4),
                        age: 0,
                        alive: true
                    });
                    updateStats();
                    drawAll();
                }
            }
        }
    }

    // Arranque inicial
    initGrid();
});
