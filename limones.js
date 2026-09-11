let canvas = document.getElementById("areaJuego");

let ctx = canvas.getContext("2d");

const ALTURA_SUELO = 80;
const ALTURA_PERSONAJE = 60;
const ANCHO_PERSONAJE = 40;

let personajeX = canvas.width / 2;


function iniciar() {

    dibujarSuelo();
    dibujarPersonaje();

}


function dibujarSuelo() {

    ctx.fillStyle = "blue";

    ctx.fillRect(
        0,
        canvas.height - ALTURA_SUELO,
        canvas.width,
        ALTURA_SUELO
    );

}


function dibujarPersonaje() {

    // Posición base Y
    const personajeY = canvas.height - (ALTURA_SUELO + ALTURA_PERSONAJE);

    // Matriz de 20x21 del pixel art
    const sprite = [
        [0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,2,2,2,2,2,2,2,1,0,0,0,0,0,0],
        [0,0,0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0],
        [0,0,0,0,1,2,2,3,3,3,3,2,2,2,1,0,0,0,0,0],
        [0,0,0,1,3,3,3,2,2,2,2,3,3,3,3,1,0,0,0,0],
        [0,0,0,1,3,2,2,1,1,1,1,2,2,3,2,1,0,0,0,0],
        [0,0,1,2,1,1,1,1,1,1,1,1,1,1,2,1,0,0,0,0],
        [0,1,2,2,1,1,1,4,1,1,4,1,1,1,2,2,1,0,0,0],
        [0,0,1,2,1,4,1,4,4,4,1,4,4,1,2,1,0,0,0,0],
        [0,0,0,1,1,4,1,4,4,4,1,4,4,1,1,0,0,0,0,0],
        [0,0,0,0,1,4,4,4,4,4,4,4,4,1,0,0,0,0,0,0],
        [0,0,0,0,1,4,4,4,4,4,4,4,4,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,4,3,4,3,3,4,1,0,0,0,0,0,0,0],
        [0,0,0,0,1,4,3,3,4,3,3,4,4,1,0,0,0,0,0,0],
        [0,0,0,1,0,1,3,3,4,3,3,1,0,1,0,0,0,0,0,0],
        [0,0,1,4,1,0,1,5,5,5,1,0,1,4,1,0,0,0,0,0],
        [0,0,0,1,0,0,1,5,5,5,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,4,1,4,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,4,1,4,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0]
    ];

    // Paleta de colores
    const colores = {
        1: "#000000",
        2: "#F2C94C",
        3: "#EB5757",
        4: "#F5D5C5",
        5: "#2F80ED"
    };

    const columnas = 20;
    const filas = 21;

    // Tamaño de cada pixel
    const pixelWidth = ANCHO_PERSONAJE / columnas;
    const pixelHeight = ALTURA_PERSONAJE / filas;

    // Dibujar personaje pixel por pixel
    for (let r = 0; r < filas; r++) {

        for (let c = 0; c < columnas; c++) {

            const colorIndex = sprite[r][c];

            if (colorIndex !== 0) {

                ctx.fillStyle = colores[colorIndex];

                ctx.fillRect(
                    personajeX + (c * pixelWidth),
                    personajeY + (r * pixelHeight),
                    pixelWidth,
                    pixelHeight
                );

            }
        }
    }
}


function moverIzquierda() {

    personajeX = personajeX - 10;

    actualizaPantalla();

}


function moverDerecha() {

    personajeX = personajeX + 10;

    actualizaPantalla();

}


function actualizaPantalla() {

    limpiarCanva();

    dibujarSuelo();

    dibujarPersonaje();

}


function limpiarCanva() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

}