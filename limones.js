let canvas=document.getElementById("areaJuego");
let ctx=canvas.getContext("2d")
const ALTURA_SUELO=80;
const ALTURA_PERSONAJE=60;
const ANCHO_PERSONAJE=40;
let personajeX=canvas.width/2;


function iniciar(){
    dibujarSuelo();
    dibujarPersonaje();
}

function dibujarSuelo(){
    ctx.fillStyle="blue";
    ctx.fillRect(0,canvas.height-ALTURA_SUELO,canvas.width,ALTURA_SUELO);
}
function dibujarPersonaje(){
    ctx.fillStyle="yellow"
    ctx.fillRect(personajeX,canvas.height-(ALTURA_SUELO+60),ANCHO_PERSONAJE,ALTURA_PERSONAJE);
}

function moverIzquierda(){
    personajeX=personajeX-10;
    actualizaPantalla();
    

function actualizaPantalla(){
    limpiarCanva();
    dibujarSuelo();
    dibujarPersonaje();
}

function limpiarCanva(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}