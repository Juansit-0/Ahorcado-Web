// ahorcado.js

// Clase Letra
class Letra {
    constructor(p_letra) {
        this.letra = p_letra.toLowerCase();
    }

    darLetra() {
        return this.letra;
    }

    esIgual(otraLetra) {
        return this.letra === otraLetra.letra;
    }
}

// Clase Palabra
class Palabra {
    constructor(p_palabra) {
        this.letras = p_palabra.toLowerCase().split('').map(char => new Letra(char));
    }

    _buscarLetraEnLista(p_letra, lista_letras) {
        for (let letra of lista_letras) {
            if (letra.esIgual(p_letra)) {
                return true;
            }
        }
        return false;
    }

    estaCompleta(p_jugadas) {
        for (let letra of this.letras) {
            if (!this._buscarLetraEnLista(letra, p_jugadas)) {
                return false;
            }
        }
        return true;
    }

    estaLetra(p_letra) {
        return this._buscarLetraEnLista(p_letra, this.letras);
    }

    darOcurrencias(p_jugadas) {
        const resultado = [];
        for (let letra of this.letras) {
            if (this._buscarLetraEnLista(letra, p_jugadas)) {
                resultado.push(letra.darLetra());
            } else {
                resultado.push("_");
            }
        }
        return resultado;
    }

    darLetras() {
        return this.letras; // Devuelve la lista de objetos Letra
    }

    darPalabraString() {
        return this.letras.map(l => l.darLetra()).join('');
    }
}

// Enum para el estado del juego (equivalente al Enum de Python)
const Estado = {
    NO_INICIADO: 1,
    JUGANDO: 2,
    GANADOR: 3,
    AHORCADO: 4
};

// Clase JuegoAhorcado
class JuegoAhorcado {
    static TOTAL_PALABRAS = 12; 
    static MAX_INTENTOS = 6;

    constructor() {
        this.diccionario = [
            new Palabra("algoritmo"),
            new Palabra("contenedora"),
            new Palabra("avance"),
            new Palabra("ciclo"),
            new Palabra("indice"),
            new Palabra("instrucciones"),
            new Palabra("arreglo"),
            new Palabra("vector"),
            new Palabra("inicio"),
            new Palabra("cuerpo"),
            new Palabra("recorrido"),
            new Palabra("patron"),
        ];

        this.palabraActual = null;
        this.intentosDisponibles = JuegoAhorcado.MAX_INTENTOS;
        this.jugadas = []; // Lista de objetos Letra jugadas
        this.estado = Estado.NO_INICIADO;
    }

    iniciarJuego() {
        const indiceAleatorio = Math.floor(Math.random() * this.diccionario.length);
        this.palabraActual = this.diccionario[indiceAleatorio];
        this.intentosDisponibles = JuegoAhorcado.MAX_INTENTOS;
        this.jugadas = [];
        this.estado = Estado.JUGANDO;
    }

    // Método para jugar una letra
    jugarLetra(p_letra_string) {
        if (this.estado !== Estado.JUGANDO) {
            return false; // No se puede jugar si el juego no está en curso
        }

        const letra_jugada = new Letra(p_letra_string);

        // Validar si la letra ya fue utilizada
        if (this.letraUtilizada(letra_jugada)) {
            return false; // Letra ya utilizada
        }

        this.jugadas.push(letra_jugada);

        // Verificar si la letra está en la palabra
        if (this.palabraActual.estaLetra(letra_jugada)) {
            // Letra correcta
            if (this.palabraActual.estaCompleta(this.jugadas)) {
                this.estado = Estado.GANADOR;
            }
            return true; // Letra correcta
        } else {
            // Letra incorrecta
            this.intentosDisponibles--;
            if (this.intentosDisponibles <= 0) {
                this.estado = Estado.AHORCADO;
            }
            return false; // Letra incorrecta
        }
    }

    darIntentosDisponibles() {
        return this.intentosDisponibles;
    }

    darJugadas() {
        return [...this.jugadas]; // Devuelve una copia para evitar modificaciones externas
    }

    darOcurrencias() {
        if (!this.palabraActual) return [];
        return this.palabraActual.darOcurrencias(this.jugadas);
    }

    darEstado() {
        return this.estado;
    }

    letraUtilizada(letra) {
        for (let jugada of this.jugadas) {
            if (jugada.esIgual(letra)) {
                return true;
            }
        }
        return false;
    }

    // Nuevo método para obtener la palabra completa (para mostrar al final del juego)
    darPalabraCompleta() {
        if (this.palabraActual) {
            return this.palabraActual.darPalabraString().toUpperCase();
        }
        return "";
    }
}