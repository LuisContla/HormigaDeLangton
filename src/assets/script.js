console.log("Script cargado: Inicializando Hormiga de Langton...");

function initApp() {
    console.log("Intentando inicializar...");
    const canvas = document.getElementById('gameCanvas');
    if(!canvas) {
        // React hasn't mounted yet — retry
        requestAnimationFrame(initApp);
        return;
    }
    // Prevent duplicate initialization on HMR
    if(canvas.dataset.initialized) return;
    canvas.dataset.initialized = 'true';
    console.log("DOM listo. Configurando Canvas...");

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
    const showPathCheck = document.getElementById('showPathCheck');
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
    let antGrid = []; // partición espacial O(1)
    let ants = [];
    let generation = 0;
    let deaths = 0;
    let births = 0;
    let conflicts = 0;
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

    // Precarga y Colorización del SVG
    let antImages = {};
    let svgsLoaded = false;
    const baseAntImg = new Image();
    baseAntImg.src = '/src/assets/Hormiga.svg'; // Ruta absoluta del servidor de Vite
    
    baseAntImg.onload = () => {
        for (const type of Object.values(ANT_TYPES)) {
            const color = ANT_COLORS[type];
            const tCanvas = document.createElement('canvas');
            tCanvas.width = 128; // Resolución interna
            tCanvas.height = 128;
            const tCtx = tCanvas.getContext('2d');
            
            // Dibujar la silueta original
            tCtx.drawImage(baseAntImg, 0, 0, 128, 128);
            
            // Aplicar tinte de color usando source-in (reemplaza píxeles no transparentes)
            tCtx.globalCompositeOperation = 'source-in';
            tCtx.fillStyle = color;
            tCtx.fillRect(0, 0, 128, 128);
            
            antImages[type] = tCanvas;
        }
        svgsLoaded = true;
        drawAll(); // Redibujar si ya había algo
    };

    function initGrid() {
        grid = [];
        antGrid = [];
        for (let y = 0; y < rows; y++) {
            let row = [];
            let antRow = [];
            for (let x = 0; x < cols; x++) {
                row.push(0);
                antRow.push(null);
            }
            grid.push(row);
            antGrid.push(antRow);
        }
        ants = [];
        generation = 0;
        deaths = 0;
        births = 0;
        conflicts = 0;
        document.getElementById('countDecesos').innerText = deaths;
        document.getElementById('countNacimientos').innerText = births;
        document.getElementById('countConflictos').innerText = conflicts;
        updateStats();
        resizeCanvas();
        drawAll();
    }

    function resizeCanvas() {
        canvas.width = cols * cellSize;
        canvas.height = rows * cellSize;
    }

    function drawAll() {
        if (!grid || grid.length === 0) return;
        
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
        if (!showPathCheck || showPathCheck.checked) {
            ctx.fillStyle = '#f8fafc'; // Color para estado '1' (como negro en la regla original)
            for(let y = 0; y < rows; y++) {
                for(let x = 0; x < cols; x++) {
                    if(grid[y][x] === 1) {
                        ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
                    }
                }
            }
        }

        // Dibujar las hormigas por encima de las celdas
        for(const ant of ants) {
            if(!ant.alive) continue;
            
            if (svgsLoaded && antImages[ant.type]) {
                ctx.save();
                // Trasladar al centro de la celda
                ctx.translate(ant.x * cellSize + cellSize / 2, ant.y * cellSize + cellSize / 2);
                
                // Rotar según la dirección: 0=Arriba, 1=Derecha, 2=Abajo, 3=Izquierda
                // Compensamos -45 grados (-Math.PI / 4) porque el SVG base apunta a la esquina superior derecha
                ctx.rotate(ant.dir * Math.PI / 2 - Math.PI / 4);
                
                // Dibujar centrado
                ctx.drawImage(antImages[ant.type], -cellSize / 2, -cellSize / 2, cellSize, cellSize);
                ctx.restore();
            } else {
                // Fallback a cuadrados
                ctx.fillStyle = ant.color;
                ctx.fillRect(ant.x * cellSize + 1, ant.y * cellSize + 1, cellSize - 2, cellSize - 2);
            }
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
            const newAnt = {
                x: pos.x,
                y: pos.y,
                type: type,
                color: ANT_COLORS[type],
                dir: Math.floor(Math.random() * 4), // 0:Arriba, 1:Derecha, 2:Abajo, 3:Izquierda
                age: 0,
                alive: true
            };
            ants.push(newAnt);
            antGrid[pos.y][pos.x] = newAnt;
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

        const totalCells = rows * cols;
        const density = totalCells > 0 ? ((nAlive / totalCells) * 100).toFixed(2) : 0;
        const densityElement = document.getElementById('densityStat');
        if (densityElement) densityElement.innerText = density + '%';

        const ratio = deaths > 0 ? (births / deaths).toFixed(2) : (births > 0 ? "Inf" : "1.00");
        const ratioElement = document.getElementById('ratioStat');
        if (ratioElement) ratioElement.innerText = ratio;
    }

    function step() {
        const isToroidal = toroidalCheck.checked;

        // Probabilidades de Nacimiento
        const inputNacReina = document.getElementById('inputNacReina');
        const inputNacTrabajadora = document.getElementById('inputNacTrabajadora');
        const inputNacReproductora = document.getElementById('inputNacReproductora');
        const inputNacSoldado = document.getElementById('inputNacSoldado');
        
        let pNacReina = inputNacReina ? parseFloat(inputNacReina.value) : 1;
        let pNacTrab = inputNacTrabajadora ? parseFloat(inputNacTrabajadora.value) : 55;
        let pNacRep = inputNacReproductora ? parseFloat(inputNacReproductora.value) : 9;
        let pNacSold = inputNacSoldado ? parseFloat(inputNacSoldado.value) : 35;
        
        const totalP = pNacReina + pNacTrab + pNacRep + pNacSold;
        if (totalP > 0) { pNacReina /= totalP; pNacTrab /= totalP; pNacRep /= totalP; pNacSold /= totalP; } 
        else { pNacReina = 0.01; pNacTrab = 0.55; pNacRep = 0.09; pNacSold = 0.35; }
        
        const birthProbs = [
            { type: ANT_TYPES.REINA, prob: pNacReina },
            { type: ANT_TYPES.TRABAJADORA, prob: pNacTrab },
            { type: ANT_TYPES.REPRODUCTORA, prob: pNacRep },
            { type: ANT_TYPES.SOLDADO, prob: pNacSold }
        ];

        function getBirthType() {
            let r = Math.random();
            let cum = 0;
            for(let bp of birthProbs) {
                cum += bp.prob;
                if(r <= cum) return bp.type;
            }
            return ANT_TYPES.TRABAJADORA;
        }

        function getNextPos(x, y, dir) {
            let nx = x, ny = y;
            if(dir === 0) ny--; else if(dir === 1) nx++; else if(dir === 2) ny++; else if(dir === 3) nx--;
            if(isToroidal) {
                if(nx < 0) nx = cols - 1; else if(nx >= cols) nx = 0;
                if(ny < 0) ny = rows - 1; else if(ny >= rows) ny = 0;
            } else {
                if(nx < 0) nx = 0; else if(nx >= cols) nx = cols - 1;
                if(ny < 0) ny = 0; else if(ny >= rows) ny = rows - 1;
            }
            return {nx, ny};
        }
        
        // Iteramos las hormigas
        // Para evitar problemas modificando el array, iteramos por índice actual
        const numAnts = ants.length;
        for(let i = 0; i < numAnts; i++) {
            const ant = ants[i];
            if(!ant.alive) continue;
            
            // 1. Envejecimiento
            ant.age++;
            if(ant.age >= 80) {
                ant.alive = false;
                antGrid[ant.y][ant.x] = null;
                deaths++;
                continue;
            }
            
            // 2. Regla de Langton Clásica (dirección intencionada)
            const state = grid[ant.y][ant.x];
            let intendedDir = state === 0 ? (ant.dir + 1) % 4 : (ant.dir + 3) % 4;
            
            let pos = getNextPos(ant.x, ant.y, intendedDir);
            let nextX = pos.nx;
            let nextY = pos.ny;
            
            // 3. Detección de Colisiones (Celda Ocupada)
            let occupant = antGrid[nextY][nextX];
            if (occupant && !occupant.alive) occupant = null; // Por si acaso hay residuos
            let moved = true;
            
            if (occupant && occupant !== ant) {
                conflicts++;
                moved = false; // Asumimos que no puede moverse directo a menos que resolvamos
                
                // Regla especial: Encuentro de Reinas
                if(ant.type === ANT_TYPES.REINA && occupant.type === ANT_TYPES.REINA) {
                    if(ant.age <= 60 && occupant.age <= 60) {
                        if(Math.random() < 0.5) { ant.alive = false; deaths++; }
                        if(Math.random() < 0.5) { occupant.alive = false; deaths++; }
                    } else {
                        if(ant.age > 60) { if(Math.random() < 0.8) { ant.alive = false; deaths++; } }
                        else { if(Math.random() < 0.5) { ant.alive = false; deaths++; } }
                        
                        if(occupant.age > 60) { if(Math.random() < 0.8) { occupant.alive = false; deaths++; } }
                        else { if(Math.random() < 0.5) { occupant.alive = false; deaths++; } }
                    }
                } 
                // Regla especial: Nacimiento (Reina + Reproductora a 180°)
                else if ( (ant.type === ANT_TYPES.REINA && occupant.type === ANT_TYPES.REPRODUCTORA) ||
                          (ant.type === ANT_TYPES.REPRODUCTORA && occupant.type === ANT_TYPES.REINA) ) {
                    // Verificamos si están frente a frente (diferencia de dir de 2)
                    if (Math.abs(intendedDir - occupant.dir) === 2 || Math.abs(ant.dir - occupant.dir) === 2) {
                        let newType = getBirthType();
                        // Encontrar celda adyacente libre
                        let freeDirs = [0,1,2,3].filter(d => {
                            let p = getNextPos(ant.x, ant.y, d);
                            let occ = antGrid[p.ny][p.nx];
                            return !(occ && occ.alive);
                        });
                        if (freeDirs.length > 0) {
                            let bDir = freeDirs[Math.floor(Math.random()*freeDirs.length)];
                            let bPos = getNextPos(ant.x, ant.y, bDir);
                            let newAntObj = {
                                x: bPos.nx, y: bPos.ny,
                                type: newType, color: ANT_COLORS[newType],
                                dir: Math.floor(Math.random() * 4),
                                age: 0, alive: true
                            };
                            ants.push(newAntObj);
                            antGrid[bPos.ny][bPos.nx] = newAntObj;
                            births++;
                        }
                    }
                }

                // Resolver movimiento (giro aleatorio)
                if (ant.alive) {
                    let otherDirs = [0, 1, 2, 3].filter(d => d !== intendedDir);
                    let randomDir = otherDirs[Math.floor(Math.random() * 3)];
                    let altPos = getNextPos(ant.x, ant.y, randomDir);
                    
                    let altOccupant = antGrid[altPos.ny][altPos.nx];
                    let altOccupied = altOccupant && altOccupant.alive && altOccupant !== ant;
                    
                    if (altOccupied) {
                        // Esperar un paso (pierde turno, no invierte color ni se mueve)
                        moved = false; 
                    } else {
                        // Se mueve a la alternativa
                        intendedDir = randomDir;
                        nextX = altPos.nx;
                        nextY = altPos.ny;
                        moved = true;
                    }
                }
                
                // Apply deaths from Reina collisions to antGrid immediately
                if (occupant && !occupant.alive) {
                    antGrid[occupant.y][occupant.x] = null;
                }
                if (!ant.alive) {
                    antGrid[ant.y][ant.x] = null;
                }
            }
            
            if (moved && ant.alive) {
                // Aplicar cambio de grid y movimiento
                antGrid[ant.y][ant.x] = null;
                grid[ant.y][ant.x] = 1 - state; // invertir estado actual
                ant.dir = intendedDir;
                ant.x = nextX;
                ant.y = nextY;
                antGrid[ant.y][ant.x] = ant;
            }
        }
        
        document.getElementById('countDecesos').innerText = deaths;
        document.getElementById('countNacimientos').innerText = births;
        document.getElementById('countConflictos').innerText = conflicts;
        
        generation++;
        updateStats(); // To update counters
        drawAll(); // Redibujar
        
        // Auto-pausa si se extinguen
        let nAliveStr = document.getElementById('aliveCounter').innerText;
        if (parseInt(nAliveStr) === 0 && generation > 0) {
            isRunning = false;
            document.getElementById('toggleGame').innerText = "Iniciar";
            cancelAnimationFrame(animationId);
        }
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

    canvas.addEventListener('contextmenu', e => e.preventDefault());

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

            const isRightClick = e.buttons === 2 || e.button === 2;
            let occupant = antGrid[y][x];
            let existingAntAlive = occupant && occupant.alive;
            
            if (isRightClick) {
                if (existingAntAlive) {
                    occupant.alive = false;
                    antGrid[y][x] = null;
                    updateStats();
                    drawAll();
                }
                return;
            }

            const brushValue = currentBrushValue;
            
            if(brushValue === "celda") {
                // Alternar estado de la celda (1 o 0) de forma manual
                grid[y][x] = 1 - grid[y][x];
                drawAll();
            } else {
                if (existingAntAlive) {
                    // Ciclar el tipo de la hormiga si se hace clic nuevamente sobre ella (solo en mousedown para no ciclar rápido)
                    if (e.type === 'mousedown') {
                        occupant.type = (occupant.type + 1) % 4;
                        occupant.color = ANT_COLORS[occupant.type];
                        updateStats();
                        drawAll();
                    }
                } else {
                    // Insertar hormiga seleccionada
                    const type = parseInt(brushValue);
                    const newAnt = {
                        x, y,
                        type: type,
                        color: ANT_COLORS[type],
                        dir: Math.floor(Math.random() * 4),
                        age: 0,
                        alive: true
                    };
                    ants.push(newAnt);
                    antGrid[y][x] = newAnt;
                    updateStats();
                    drawAll();
                }
            }
        }
    }

    // Arranque inicial
    initGrid();
    
    if (showPathCheck) {
        showPathCheck.addEventListener('change', drawAll);
    }

    const btnPreloadAislamiento = document.getElementById('btnPreloadAislamiento');
    if (btnPreloadAislamiento) {
        btnPreloadAislamiento.addEventListener('click', () => {
            // Densidad Inicial
            if (inputDensidadTotal) inputDensidadTotal.value = 10;
            
            // Probabilidades Iniciales
            if (inputProbReina) inputProbReina.value = 5;
            if (inputProbTrabajadora) inputProbTrabajadora.value = 45;
            if (inputProbReproductora) inputProbReproductora.value = 10;
            if (inputProbSoldado) inputProbSoldado.value = 40;
            
            // Probabilidades de Nacimiento
            const inputNacReina = document.getElementById('inputNacReina');
            const inputNacTrabajadora = document.getElementById('inputNacTrabajadora');
            const inputNacReproductora = document.getElementById('inputNacReproductora');
            const inputNacSoldado = document.getElementById('inputNacSoldado');
            
            if (inputNacReina) inputNacReina.value = 1;
            if (inputNacTrabajadora) inputNacTrabajadora.value = 60;
            if (inputNacReproductora) inputNacReproductora.value = 4;
            if (inputNacSoldado) inputNacSoldado.value = 35;
        });
    }

    const btnPreloadSobrepoblacion = document.getElementById('btnPreloadSobrepoblacion');
    if (btnPreloadSobrepoblacion) {
        btnPreloadSobrepoblacion.addEventListener('click', () => {
            // Densidad Inicial
            if (inputDensidadTotal) inputDensidadTotal.value = 50;
            
            // Probabilidades Iniciales
            if (inputProbReina) inputProbReina.value = 20;
            if (inputProbTrabajadora) inputProbTrabajadora.value = 20;
            if (inputProbReproductora) inputProbReproductora.value = 40;
            if (inputProbSoldado) inputProbSoldado.value = 20;
            
            // Probabilidades de Nacimiento
            const inputNacReina = document.getElementById('inputNacReina');
            const inputNacTrabajadora = document.getElementById('inputNacTrabajadora');
            const inputNacReproductora = document.getElementById('inputNacReproductora');
            const inputNacSoldado = document.getElementById('inputNacSoldado');
            
            if (inputNacReina) inputNacReina.value = 25;
            if (inputNacTrabajadora) inputNacTrabajadora.value = 15;
            if (inputNacReproductora) inputNacReproductora.value = 45;
            if (inputNacSoldado) inputNacSoldado.value = 15;
        });
    }

    const btnPreloadCercania = document.getElementById('btnPreloadCercania');
    if (btnPreloadCercania) {
        btnPreloadCercania.addEventListener('click', () => {
            // Densidad Inicial
            if (inputDensidadTotal) inputDensidadTotal.value = 25;
            
            // Probabilidades Iniciales
            if (inputProbReina) inputProbReina.value = 12;
            if (inputProbTrabajadora) inputProbTrabajadora.value = 30;
            if (inputProbReproductora) inputProbReproductora.value = 28;
            if (inputProbSoldado) inputProbSoldado.value = 30;
            
            // Probabilidades de Nacimiento
            const inputNacReina = document.getElementById('inputNacReina');
            const inputNacTrabajadora = document.getElementById('inputNacTrabajadora');
            const inputNacReproductora = document.getElementById('inputNacReproductora');
            const inputNacSoldado = document.getElementById('inputNacSoldado');
            
            if (inputNacReina) inputNacReina.value = 15;
            if (inputNacTrabajadora) inputNacTrabajadora.value = 35;
            if (inputNacReproductora) inputNacReproductora.value = 20;
            if (inputNacSoldado) inputNacSoldado.value = 30;
        });
    }

    const btnPreloadEstabilidad = document.getElementById('btnPreloadEstabilidad');
    if (btnPreloadEstabilidad) {
        btnPreloadEstabilidad.addEventListener('click', () => {
            // Densidad Inicial
            if (inputDensidadTotal) inputDensidadTotal.value = 25;
            
            // Probabilidades Iniciales
            if (inputProbReina) inputProbReina.value = 12;
            if (inputProbTrabajadora) inputProbTrabajadora.value = 30;
            if (inputProbReproductora) inputProbReproductora.value = 28;
            if (inputProbSoldado) inputProbSoldado.value = 30;
            
            // Probabilidades de Nacimiento
            const inputNacReina = document.getElementById('inputNacReina');
            const inputNacTrabajadora = document.getElementById('inputNacTrabajadora');
            const inputNacReproductora = document.getElementById('inputNacReproductora');
            const inputNacSoldado = document.getElementById('inputNacSoldado');
            
            if (inputNacReina) inputNacReina.value = 16;
            if (inputNacTrabajadora) inputNacTrabajadora.value = 30;
            if (inputNacReproductora) inputNacReproductora.value = 24;
            if (inputNacSoldado) inputNacSoldado.value = 30;
        });
    }
}

// Start initialization (works on first load and Vite HMR reloads)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already loaded (common during HMR)
    requestAnimationFrame(initApp);
}
