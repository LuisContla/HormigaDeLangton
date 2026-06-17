# 🐜 Simulación de la Hormiga de Langton Multi-Agente

Este proyecto es una versión extendida y avanzada del clásico autómata celular de la **Hormiga de Langton**. En lugar de un solo agente, simula un ecosistema multi-agente complejo que incorpora reglas biológicas de envejecimiento, colisión, deceso y reproducción, permitiendo explorar empíricamente el surgimiento de homeostasis y la estabilidad dinámica en sistemas complejos.

---

## 🚀 Tecnologías y Arquitectura

Para lograr un rendimiento óptimo capaz de simular miles de agentes simultáneamente a 60 FPS, se optó por una arquitectura híbrida de tecnologías web modernas:

*   **React JS (Vite):** Utilizado para estructurar la interfaz gráfica de usuario (GUI), modularizar los paneles de control de variables y el monitoreo de estadísticas en tiempo real.
*   **Vanilla JavaScript (ES6+):** La lógica de simulación, cálculo de colisiones y motor celular se desarrollaron en JavaScript puro sin dependencias para maximizar la velocidad de cómputo.
*   **HTML5 Canvas API:** Se seleccionó para renderizar gráficamente el movimiento y la rotación vectorial de los agentes directamente sobre un lienzo de pixeles, evitando la saturación del DOM del navegador.
*   **CSS3 Vanilla:** Diseño de interfaz basado en el estilo moderno *Glassmorphism* con paletas oscuras adaptativas.

---

## ⚙️ Características y Funcionalidades

### 1. Jerarquías de Hormigas (Especies)
El ecosistema inicializa y distribuye la población basándose en cuatro clases de hormigas con comportamientos específicos:
*   **Reinas (Rojas 👑):** Agentes fértiles clave para la descendencia. Si dos reinas colisionan, se desata un conflicto territorial que puede provocar la muerte de una o ambas.
*   **Trabajadoras (Azules ⛑):** Agentes dedicados a alterar el terreno de juego, invirtiendo el color de las celdas visitadas según la regla básica de Langton.
*   **Reproductoras (Rosas 💕):** Agentes fértiles que, al encontrarse de frente a 180° con una Reina, gatillan el nacimiento de una nueva cría.
*   **Soldados (Verdes ⚔):** Agentes protectores que priorizan la ocupación y resolución del espacio ante conflictos de colisión de celdas.

### 2. Reglas Biológicas
*   **Envejecimiento y Muerte:** Todas las hormigas tienen un ciclo de vida limitado a **80 iteraciones**. Al cumplir esta edad, mueren de forma natural y son retiradas de la cuadrícula.
*   **Reproducción y Natalidad:** Ocurre únicamente por el encuentro frontal (180 grados de desfase en la dirección) entre una Reina y una Reproductora. La clase de la nueva cría se determina aleatoriamente según porcentajes de natalidad configurables.
*   **Evasión de Colisiones:** Si dos hormigas intentan ocupar el mismo casillero en un turno, se calcula un conflicto. La hormiga en movimiento buscará una dirección alterna libre de forma aleatoria; si no la encuentra, perderá su turno (congelamiento temporal).

### 3. Interacción en Caliente (Pincel Manual)
El usuario puede interactuar directamente con la simulación en tiempo real utilizando el ratón:
*   **Clic Izquierdo:** Permite alternar manualmente el estado de las celdas o sembrar hormigas individuales de cualquier jerarquía. Si se hace clic sobre una hormiga existente, esta cicla secuencialmente de tipo.
*   **Clic Derecho:** Funciona como borrador eliminando instantáneamente cualquier hormiga ubicada bajo el cursor.

---

## 📊 Casos de Estudio y Estabilización (Pre-cargas)

El panel interactivo incluye accesos directos para cargar los escenarios paramétricos más importantes analizados en el reporte de estabilización:

1.  **💥 Sobrepoblación (Prueba 1):** Alta densidad inicial (50%) combinada con una desmedida tasa reproductiva. Desemboca rápidamente en un crecimiento demográfico exponencial incontrolable, causando "congelamiento espacial" y colapso de la colonia.
2.  **💀 Aislamiento (Prueba 5):** Baja densidad (10%) y escasa natalidad. Los agentes mueren por vejez antes de poder encontrarse espacialmente para procrear, llevando al ecosistema a una extinción inevitable.
3.  **⚖️ Cercanía a Estabilidad (Prueba 15):** Muestra la gran sensibilidad del sistema; logra prolongar la supervivencia por más de 700 turnos, pero decae lentamente debido a sutiles desbalances hacia las hormigas estériles.
4.  **🌟 Estabilidad Dinámica (Prueba 20):** La configuración óptima de equilibrio dinámico autosostenible. Con una densidad del 25% y un balance del 40% combinado de nacimientos fértiles (16% Reinas, 24% Reproductoras), el ecosistema alcanza la homeostasis, permitiendo la vida indefinida en el tablero.

---

## ⚡ Optimización Técnica: Partición Espacial $O(1)$

Para solucionar el problema clásico de la complejidad cuadrática $O(N^2)$ al evaluar la colisión de cada hormiga contra todas las demás, se implementó una optimización basada en **Partición Espacial (Spatial Partitioning)**.

Se utiliza una matriz bidimensional paralela (`antGrid`) en memoria. En lugar de iterar la lista de agentes para buscar ocupantes, cada hormiga consulta y registra su referencia directamente en su coordenada respectiva de `antGrid`. Esto reduce la detección de colisiones a un costo computacional constante de **$O(1)$**, permitiendo fluidificar el renderizado de más de 8,000 hormigas simultáneas en navegadores convencionales.

---

## 🎮 Controles de la Interfaz

*   **Poblar 🎲:** Limpia el tablero e inicializa una distribución aleatoria basada en la densidad y porcentajes especificados.
*   **Iniciar / Pausar ▶/⏸:** Controla el avance del bucle de animación principal.
*   **Paso ⏭:** Avanza manualmente un único frame/generación en el autómata.
*   **Reset 🔄:** Limpia por completo la cuadrícula y las estadísticas.
*   **Velocidad ⏱:** Ajusta dinámicamente el retardo (en milisegundos) entre cada iteración de la simulación.
*   **Paneles Colapsables ⚙:** Permiten modificar en caliente las filas/columnas del Grid, la densidad de arranque y las probabilidades de natalidad de la colonia.

---

## 🛠️ Instrucciones de Instalación y Ejecución

Para correr el simulador de manera local en tu computadora, sigue estos sencillos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
    cd TU_REPOSITORIO
    ```

2.  **Instalar las dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo local (Vite):**
    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador:**
    Abre tu navegador web e ingresa a la dirección local que indique la consola (usualmente `http://localhost:5173`).
