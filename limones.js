let canvas = document.getElementById("areaJuego");

let ctx = canvas.getContext("2d");

const ALTURA_SUELO = 80;
const ALTURA_PERSONAJE = 60;
const ANCHO_PERSONAJE = 40;

let personajeX = canvas.width / 2;
let personajeY=canvas.height-(ALTURA_SUELO+ALTURA_PERSONAJE);
let limonX=canvas.width/2;
let limonY=360;
let puntage=0;
let vidas=3;
let velocidadCaida=50;


const ANCHO_LIMON=20;
const ALTO_LIMON=20;


function iniciar() {
    setInterval(bajarLimon,velocidadCaida);
    dibujarSuelo();
    dibujarPersonaje();
    dibujarLimon();

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

    const pixelWidth = ANCHO_PERSONAJE / columnas;
    const pixelHeight = ALTURA_PERSONAJE / filas;

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
    detectarAtrapado();

}


function moverDerecha() {

    personajeX = personajeX + 10;

    actualizaPantalla();
    detectarAtrapado();

}


function actualizaPantalla() {

    limpiarCanva();

    dibujarSuelo();

    dibujarPersonaje();
    dibujarLimon();

}


function limpiarCanva() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

function dibujarLimon(){
    ctx.fillStyle="green";
    ctx.fillRect(limonX,limonY,ANCHO_LIMON,ALTO_LIMON);
}

function bajarLimon(){
    limonY= limonY + 10;
    actualizaPantalla();
    detectarAtrapado();
    detectarPiso();

}

function detectarAtrapado(){
    if(limonX+ANCHO_LIMON>personajeX && 
       limonX<personajeX+ANCHO_PERSONAJE &&
       limonY+ALTO_LIMON>personajeY &&
       limonY<personajeY+ALTURA_PERSONAJE){
       aparecerLimon();
       puntage=puntage+1;
       mostrarEnSpan("txtPuntaje",puntage);
    }
}



function probarAletorio(){
    let aleatorio=generarAleatorio(10,80);
    console.log(aleatorio);
    
}

function aparecerLimon(){
    limonY=generarAleatorio(0,canvas.height-ALTURA_SUELO-ALTO_LIMON);
    limonX=generarAleatorio(0,canvas.width-ANCHO_LIMON);
    actualizaPantalla();
}

function detectarPiso(){
    if(limonY+ALTO_LIMON>=canvas.height-ALTURA_SUELO){
        aparecerLimon();
        vidas=vidas-1;
        mostrarEnSpan("txtVidas",vidas);
        if(vidas==0){
            alert("GAME OVER");
        }
    }


    }
