// game-logic.js

// Instancia del juego
const juego = new JuegoAhorcado();

// Referencias a elementos del DOM
const hangmanFigure = document.getElementById('hangman-figure');
const wordDisplay = document.getElementById('word-display');
const attemptsLeft = document.getElementById('attempts-left');
const usedLettersDisplay = document.getElementById('used-letters');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const restartButton = document.getElementById('restart-button');
const gameMessage = document.getElementById('game-message');

// Dibujos del ahorcado (adaptados de tu código Python)
const ahorcadoDibujos = [
    `
   +---+
   |   |
       |
       |
       |
       |
=========`, // 0 intentos - ahorcado completo
    `
   +---+
   |   |
   😁   |
       |
       |
       |
=========`, // 1 intento
    `
   +---+
   |   |
   🙂   |
   |   |
       |
       |
=========`, // 2 intentos
    `
   +---+
   |   |
   😳   |
  /|   |
       |
       |
=========`, // 3 intentos
    `
   +---+
   |   |
   😦   |
  /|\\  |
       |
       |
=========`, // 4 intentos
    `
   +---+
   |   |
   😨   |
  /|\\  |
  /    |
       |
       |
=========`, // 5 intentos
    `
   +---+
   |   |
   🐵   |
  /|\\  |
  /⌡\\  |
       |
       |
=========`  // 6 intentos (inicial) 
];
// 
// Función para actualizar la interfaz de usuario (UI)
function actualizarUI() {
    const ocurrencias = juego.darOcurrencias();
    wordDisplay.textContent = ocurrencias.join(' ');

    attemptsLeft.textContent = `Intentos restantes: ${juego.darIntentosDisponibles()}`;

    const letrasJugadas = juego.darJugadas().map(l => l.darLetra().toUpperCase()).join(', ');
    usedLettersDisplay.textContent = `Letras usadas: ${letrasJugadas}`;

    // Actualizar el dibujo del ahorcado
    // El índice 0 es el ahorcado completo (0 intentos), el índice 6 es el inicial (6 intentos)
    const idxDibujo = JuegoAhorcado.MAX_INTENTOS - juego.darIntentosDisponibles();
    hangmanFigure.textContent = ahorcadoDibujos[idxDibujo] || ahorcadoDibujos[JuegoAhorcado.MAX_INTENTOS]; // Fallback por si acaso

    gameMessage.textContent = ""; // Limpiar mensaje por defecto

    // Manejar estados finales del juego
    if (juego.darEstado() === Estado.GANADOR) {
        gameMessage.textContent = `🎉 ¡FELICITACIONES! ¡Has ganado! La palabra era: ${juego.darPalabraCompleta()}`;
        guessButton.style.display = 'none';
        guessInput.style.display = 'none';
        restartButton.style.display = 'inline-block';
    } else if (juego.darEstado() === Estado.AHORCADO) {
        gameMessage.textContent = `💀 ¡Has sido ahorcado! Mejor suerte la próxima vez. La palabra era: ${juego.darPalabraCompleta()}`;
        guessButton.style.display = 'none';
        guessInput.style.display = 'none';
        restartButton.style.display = 'inline-block';
    } else {
        guessButton.style.display = 'inline-block';
        guessInput.style.display = 'inline-block';
        restartButton.style.display = 'none';
    }
    guessInput.focus(); // Enfocar el input para que el usuario pueda escribir de inmediato
}

// Función para manejar el intento de adivinar una letra
function manejarAdivinar() {
    const letra = guessInput.value.trim().toLowerCase();
    guessInput.value = ''; // Limpiar input

    if (letra.length !== 1 || !/[a-zñ]/.test(letra)) {
        gameMessage.textContent = "Por favor, ingresa solo una letra válida (a-z, ñ).";
        return;
    }

    // El chequeo de letra utilizada se hace dentro de juego.jugarLetra
    const resultado = juego.jugarLetra(letra);

    // Solo mostramos un mensaje de éxito/fracaso si el juego sigue en curso
    if (juego.darEstado() === Estado.JUGANDO) {
        if (resultado) {
            gameMessage.textContent = `✅ ¡Bien! La letra '${letra.toUpperCase()}' está en la palabra.`;
        } else {
            gameMessage.textContent = `❌ La letra '${letra.toUpperCase()}' no está en la palabra.`;
        }
    } else {
        // Si el juego terminó, el mensaje final se maneja en actualizarUI
        gameMessage.textContent = ""; // Limpiar cualquier mensaje intermedio
    }
    actualizarUI();
}

// Función para iniciar una nueva partida
function iniciarNuevaPartida() {
    juego.iniciarJuego();
    guessInput.value = '';
    gameMessage.textContent = '';
    actualizarUI();
}

// Event Listeners
guessButton.addEventListener('click', manejarAdivinar);
guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        manejarAdivinar();
    }
});
restartButton.addEventListener('click', iniciarNuevaPartida);

// Inicializar el juego al cargar la página
iniciarNuevaPartida();