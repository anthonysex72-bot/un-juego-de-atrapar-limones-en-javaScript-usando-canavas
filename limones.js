const canvas =
    document.getElementById("areaJuego");

const ctx =
    canvas.getContext("2d");


/* ==========================================
   CONFIGURACIÓN
========================================== */

const ALTURA_SUELO = 85;

const ANCHO_PERSONAJE = 42;
const ALTURA_PERSONAJE = 64;

const ANCHO_LIMON = 24;
const ALTO_LIMON = 24;

const PUNTAJE_GANAR = 30;


/* ==========================================
   PERSONAJE
========================================== */

let personajeX =
    canvas.width / 2 -
    ANCHO_PERSONAJE / 2;

let personajeY =
    canvas.height -
    ALTURA_SUELO -
    ALTURA_PERSONAJE;


/* ==========================================
   ESTADO
========================================== */

let puntage = 0;

let vidas = 3;

let nivel = 1;

let juegoActivo = true;

let estadoFinal = "";


/* ==========================================
   LIMONES
========================================== */

let limones = [];


/* ==========================================
   MOVIMIENTO
========================================== */

let velocidadJugador = 7;

let velocidadBase = 1.6;


/* ==========================================
   SALTO
========================================== */

let velocidadSalto = 0;

let enElAire = false;

const fuerzaSalto = -13;

const gravedad = 0.65;


/* ==========================================
   CUELLO
========================================== */

let cuelloActivo = false;

let direccionCuello = 0;

let longitudCuello = 0;

const longitudCuelloMaxima = 180;

const velocidadCuello = 12;


/* ==========================================
   TECLADO
========================================== */

const teclas = {

    izquierda: false,

    derecha: false,

    saltar: false,

    cuelloIzquierda: false,

    cuelloDerecha: false

};


/* ==========================================
   MÚSICA
========================================== */

let audioContext = null;

let musicaIniciada = false;

let intervaloMusica = null;

let notaMusica = 0;


/* ==========================================
   INICIO
========================================== */

function iniciar() {

    juegoActivo = true;

    estadoFinal = "";

    vidas = 3;

    puntage = 0;

    nivel = 1;

    velocidadBase = 1.6;

    personajeX =
        canvas.width / 2 -
        ANCHO_PERSONAJE / 2;

    personajeY =
        canvas.height -
        ALTURA_SUELO -
        ALTURA_PERSONAJE;

    velocidadSalto = 0;

    enElAire = false;

    cuelloActivo = false;

    direccionCuello = 0;

    longitudCuello = 0;

    crearLimonesIniciales();

    actualizarHUD();

    configurarTeclado();

    iniciarMusica();

    requestAnimationFrame(bucleJuego);
}


/* ==========================================
   TECLADO
========================================== */

function configurarTeclado() {

    document.onkeydown = function (evento) {

        iniciarMusica();


        if (
            evento.key === "Enter" &&
            !juegoActivo
        ) {

            reiniciar();

            return;
        }


        if (
            evento.key === "ArrowLeft"
        ) {

            evento.preventDefault();

            teclas.izquierda = true;

        }


        if (
            evento.key === "ArrowRight"
        ) {

            evento.preventDefault();

            teclas.derecha = true;

        }


        if (
            evento.code === "Space" &&
            !evento.repeat
        ) {

            evento.preventDefault();

            teclas.saltar = true;

        }


        if (
            evento.key.toLowerCase() === "a"
        ) {

            teclas.cuelloIzquierda = true;

        }


        if (
            evento.key.toLowerCase() === "d"
        ) {

            teclas.cuelloDerecha = true;

        }

    };


    document.onkeyup = function (evento) {

        if (
            evento.key === "ArrowLeft"
        ) {

            teclas.izquierda = false;

        }


        if (
            evento.key === "ArrowRight"
        ) {

            teclas.derecha = false;

        }


        if (
            evento.code === "Space"
        ) {

            teclas.saltar = false;

        }


        if (
            evento.key.toLowerCase() === "a"
        ) {

            teclas.cuelloIzquierda = false;

        }


        if (
            evento.key.toLowerCase() === "d"
        ) {

            teclas.cuelloDerecha = false;

        }

    };

}


/* ==========================================
   LIMONES INICIALES
========================================== */

function crearLimonesIniciales() {

    limones = [];

    /*
       Comenzamos con solamente
       2 limones para que el juego
       no empiece demasiado rápido.
    */

    for (
        let i = 0;
        i < 2;
        i++
    ) {

        crearLimon(true);

    }

}


/* ==========================================
   CREAR LIMÓN
========================================== */

function crearLimon(nuevo = false) {

    const limon = {

        x: generarAleatorio(
            10,
            canvas.width -
            ANCHO_LIMON -
            10
        ),

        y:

            nuevo

                ? generarAleatorio(
                    -420,
                    -80
                )

                : generarAleatorio(
                    -220,
                    -50
                ),

        velocidad:
            generarVelocidad(),

        rotacion:
            generarAleatorio(
                0,
                360
            ),

        rotacionVelocidad:
            generarAleatorio(
                -3,
                3
            ),

        escala:
            generarAleatorio(
                85,
                115
            ) / 100

    };


    limones.push(limon);

}


/* ==========================================
   VELOCIDAD PROGRESIVA
========================================== */

function generarVelocidad() {

    let min;
    let max;


    /*
       NIVEL 1

       Muy tranquilo.
    */

    if (nivel === 1) {

        min = 1.2;

        max = 2.1;

    }


    /*
       NIVEL 2

       Sigue siendo fácil.
    */

    else if (nivel === 2) {

        min = 1.5;

        max = 2.5;

    }


    /*
       NIVEL 3
    */

    else if (nivel === 3) {

        min = 1.8;

        max = 2.8;

    }


    /*
       NIVEL 4
    */

    else if (nivel === 4) {

        min = 2.1;

        max = 3.2;

    }


    /*
       NIVEL 5
    */

    else if (nivel === 5) {

        min = 2.4;

        max = 3.6;

    }


    /*
       NIVEL 6
    */

    else if (nivel === 6) {

        min = 2.7;

        max = 4.0;

    }


    /*
       NIVEL 7+
    */

    else {

        min =
            Math.min(
                4.5,
                2.8 +
                (nivel - 6) * 0.18
            );

        max =
            Math.min(
                6.5,
                4.0 +
                (nivel - 6) * 0.25
            );

    }


    return (

        Math.round(
            (Math.random() *
            (max - min) +
            min) * 10
        ) / 10

    );

}


/* ==========================================
   BUCLE
========================================== */

function bucleJuego() {

    if (juegoActivo) {

        actualizar();

    }


    dibujar();


    requestAnimationFrame(
        bucleJuego
    );

}


/* ==========================================
   ACTUALIZACIÓN
========================================== */

function actualizar() {

    moverJugador();

    actualizarSalto();

    actualizarCuello();

    actualizarLimones();

    controlarGeneracion();

    actualizarNivel();

}


/* ==========================================
   MOVIMIENTO
========================================== */

function moverJugador() {

    if (teclas.izquierda) {

        personajeX -=
            velocidadJugador;

    }


    if (teclas.derecha) {

        personajeX +=
            velocidadJugador;

    }


    if (
        personajeX < 0
    ) {

        personajeX = 0;

    }


    if (
        personajeX +
        ANCHO_PERSONAJE >
        canvas.width
    ) {

        personajeX =
            canvas.width -
            ANCHO_PERSONAJE;

    }


    if (
        teclas.saltar &&
        !enElAire
    ) {

        velocidadSalto =
            fuerzaSalto;

        enElAire = true;

        teclas.saltar = false;

    }

}


/* ==========================================
   SALTO
========================================== */

function actualizarSalto() {

    if (!enElAire) {

        personajeY =
            canvas.height -
            ALTURA_SUELO -
            ALTURA_PERSONAJE;

        return;

    }


    personajeY +=
        velocidadSalto;

    velocidadSalto +=
        gravedad;


    const suelo =
        canvas.height -
        ALTURA_SUELO -
        ALTURA_PERSONAJE;


    if (
        personajeY >= suelo
    ) {

        personajeY = suelo;

        velocidadSalto = 0;

        enElAire = false;

    }

}


/* ==========================================
   CUELLO
========================================== */

function actualizarCuello() {

    if (
        teclas.cuelloIzquierda
    ) {

        direccionCuello = -1;

        cuelloActivo = true;

        longitudCuello +=
            velocidadCuello;

    }

    else if (
        teclas.cuelloDerecha
    ) {

        direccionCuello = 1;

        cuelloActivo = true;

        longitudCuello +=
            velocidadCuello;

    }

    else {

        cuelloActivo = false;

        longitudCuello -= 15;

    }


    longitudCuello =
        Math.max(
            0,
            Math.min(
                longitudCuello,
                longitudCuelloMaxima
            )
        );


    if (
        longitudCuello === 0
    ) {

        direccionCuello = 0;

    }

}


/* ==========================================
   ACTUALIZAR LIMONES
========================================== */

function actualizarLimones() {

    for (
        let i = limones.length - 1;
        i >= 0;
        i--
    ) {

        const limon =
            limones[i];


        limon.y +=
            limon.velocidad;


        limon.rotacion +=
            limon.rotacionVelocidad;


        if (
            detectarAtrapado(limon)
        ) {

            limones.splice(i, 1);

            puntage++;

            actualizarHUD();

            continue;

        }


        if (
            limon.y +
            ALTO_LIMON >=
            canvas.height -
            ALTURA_SUELO
        ) {

            limones.splice(i, 1);

            vidas--;

            actualizarHUD();


            if (
                vidas <= 0
            ) {

                terminarJuego();

                return;

            }

        }

    }

}


/* ==========================================
   GENERACIÓN PROGRESIVA
========================================== */

function controlarGeneracion() {

    let cantidadMaxima;

    let probabilidad;


    /*
       NIVEL 1
    */

    if (nivel === 1) {

        cantidadMaxima = 2;

        probabilidad = 0.006;

    }


    /*
       NIVEL 2
    */

    else if (nivel === 2) {

        cantidadMaxima = 2;

        probabilidad = 0.009;

    }


    /*
       NIVEL 3
    */

    else if (nivel === 3) {

        cantidadMaxima = 3;

        probabilidad = 0.012;

    }


    /*
       NIVEL 4
    */

    else if (nivel === 4) {

        cantidadMaxima = 4;

        probabilidad = 0.014;

    }


    /*
       NIVEL 5
    */

    else if (nivel === 5) {

        cantidadMaxima = 5;

        probabilidad = 0.016;

    }


    /*
       NIVEL 6
    */

    else if (nivel === 6) {

        cantidadMaxima = 6;

        probabilidad = 0.019;

    }


    /*
       NIVEL 7+
    */

    else {

        cantidadMaxima =
            Math.min(
                8,
                6 +
                Math.floor(
                    (nivel - 7) / 2
                )
            );


        probabilidad =
            Math.min(
                0.035,
                0.020 +
                (nivel - 7) *
                0.002
            );

    }


    if (
        limones.length <
        cantidadMaxima
    ) {

        if (
            Math.random() <
            probabilidad
        ) {

            crearLimon();

        }

    }

}


/* ==========================================
   COLISIÓN
========================================== */

function detectarAtrapado(limon) {

    if (
        detectarColisionRectangular(

            limon.x,
            limon.y,

            ANCHO_LIMON,
            ALTO_LIMON,

            personajeX,
            personajeY,

            ANCHO_PERSONAJE,
            ALTURA_PERSONAJE

        )
    ) {

        return true;

    }


    if (
        longitudCuello > 0
    ) {

        const cabezaX =
            personajeX +
            ANCHO_PERSONAJE / 2 +
            direccionCuello *
            longitudCuello;


        const cabezaY =
            personajeY + 15;


        const distanciaX =
            Math.abs(

                limon.x +
                ANCHO_LIMON / 2 -
                cabezaX

            );


        const distanciaY =
            Math.abs(

                limon.y +
                ALTO_LIMON / 2 -
                cabezaY

            );


        if (
            distanciaX < 25 &&
            distanciaY < 30
        ) {

            return true;

        }

    }


    return false;

}


/* ==========================================
   COLISIÓN RECTANGULAR
========================================== */

function detectarColisionRectangular(

    x1,
    y1,
    ancho1,
    alto1,

    x2,
    y2,
    ancho2,
    alto2

) {

    return (

        x1 < x2 + ancho2 &&

        x1 + ancho1 > x2 &&

        y1 < y2 + alto2 &&

        y1 + alto1 > y2

    );

}


/* ==========================================
   NIVEL
========================================== */

function actualizarNivel() {

    nivel =
        Math.floor(
            puntage / 5
        ) + 1;


    /*
       La velocidad base ahora
       aumenta mucho más suavemente.
    */

    if (nivel === 1) {

        velocidadBase = 1.6;

    }

    else if (nivel === 2) {

        velocidadBase = 1.9;

    }

    else if (nivel === 3) {

        velocidadBase = 2.2;

    }

    else if (nivel === 4) {

        velocidadBase = 2.5;

    }

    else if (nivel === 5) {

        velocidadBase = 2.8;

    }

    else if (nivel === 6) {

        velocidadBase = 3.1;

    }

    else {

        velocidadBase =
            Math.min(
                5.5,
                3.1 +
                (nivel - 6) *
                0.25
            );

    }


    mostrarEnSpan(
        "txtNivel",
        nivel
    );


    if (
        puntage >=
        PUNTAJE_GANAR
    ) {

        ganarJuego();

    }

}


/* ==========================================
   GAME OVER
========================================== */

function terminarJuego() {

    juegoActivo = false;

    estadoFinal = "GAMEOVER";


    teclas.izquierda = false;

    teclas.derecha = false;

    teclas.cuelloIzquierda = false;

    teclas.cuelloDerecha = false;

}


/* ==========================================
   GANAR
========================================== */

function ganarJuego() {

    if (!juegoActivo) {

        return;

    }


    juegoActivo = false;

    estadoFinal = "GANASTE";


    teclas.izquierda = false;

    teclas.derecha = false;

    teclas.cuelloIzquierda = false;

    teclas.cuelloDerecha = false;

}


/* ==========================================
   REINICIAR
========================================== */

function reiniciar() {

    iniciar();

}


/* ==========================================
   HUD
========================================== */

function actualizarHUD() {

    mostrarEnSpan(
        "txtVidas",
        vidas
    );


    mostrarEnSpan(
        "txtPuntaje",
        puntage
    );


    mostrarEnSpan(
        "txtNivel",
        nivel
    );

}


/* ==========================================
   DIBUJADO
========================================== */

function dibujar() {

    limpiarCanva();

    dibujarFondo();

    dibujarLunaOSol();

    dibujarEstrellas();

    dibujarMontanas();

    dibujarSuelo();

    dibujarLimones();

    dibujarPersonaje();


    if (
        !juegoActivo
    ) {

        dibujarPantallaFinal();

    }

}


/* ==========================================
   FONDO
========================================== */

function dibujarFondo() {

    const ciclo =
        (puntage % 40) / 40;


    let cielo;


    if (
        ciclo < 0.25
    ) {

        cielo = [
            "#07111f",
            "#13243a"
        ];

    }

    else if (
        ciclo < 0.45
    ) {

        cielo = [
            "#27365c",
            "#d97745"
        ];

    }

    else if (
        ciclo < 0.70
    ) {

        cielo = [
            "#3ca6d8",
            "#b8e1ed"
        ];

    }

    else if (
        ciclo < 0.85
    ) {

        cielo = [
            "#df6a35",
            "#542719"
        ];

    }

    else {

        cielo = [
            "#07111f",
            "#152642"
        ];

    }


    const gradiente =
        ctx.createLinearGradient(

            0,
            0,
            0,
            canvas.height

        );


    gradiente.addColorStop(
        0,
        cielo[0]
    );


    gradiente.addColorStop(
        1,
        cielo[1]
    );


    ctx.fillStyle =
        gradiente;


    ctx.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );

}


/* ==========================================
   ESTRELLAS
========================================== */

function dibujarEstrellas() {

    const ciclo =
        (puntage % 40) / 40;


    if (
        ciclo > 0.35 &&
        ciclo < 0.82
    ) {

        return;

    }


    const estrellas = [

        [70, 55, 2],
        [150, 120, 1],
        [250, 45, 2],
        [360, 110, 1],
        [470, 60, 2],
        [590, 125, 1],
        [700, 50, 2],
        [830, 105, 1],
        [950, 45, 2],
        [1080, 115, 1],
        [1160, 65, 2]

    ];


    estrellas.forEach(
        estrella => {

            ctx.fillStyle =
                "white";

            ctx.globalAlpha =
                0.7;


            ctx.beginPath();

            ctx.arc(

                estrella[0],
                estrella[1],
                estrella[2],

                0,
                Math.PI * 2

            );

            ctx.fill();

        }
    );


    ctx.globalAlpha = 1;

}


/* ==========================================
   SOL / LUNA
========================================== */

function dibujarLunaOSol() {

    const ciclo =
        (puntage % 40) / 40;


    const x =
        canvas.width - 120;

    const y = 90;


    if (
        ciclo >= 0.35 &&
        ciclo <= 0.85
    ) {

        ctx.save();


        ctx.shadowColor =
            "#facc15";

        ctx.shadowBlur =
            25;


        ctx.fillStyle =
            "#fde047";


        ctx.beginPath();

        ctx.arc(

            x,
            y,
            40,

            0,
            Math.PI * 2

        );

        ctx.fill();


        ctx.restore();

    }

    else {

        ctx.save();


        ctx.shadowColor =
            "#fff7b2";

        ctx.shadowBlur =
            18;


        ctx.fillStyle =
            "#fff7b2";


        ctx.beginPath();

        ctx.arc(

            x,
            y,
            38,

            0,
            Math.PI * 2

        );

        ctx.fill();


        ctx.fillStyle =
            "#111827";


        ctx.beginPath();

        ctx.arc(

            x + 15,
            y - 8,
            34,

            0,
            Math.PI * 2

        );

        ctx.fill();


        ctx.restore();

    }

}


/* ==========================================
   MONTAÑAS
========================================== */

function dibujarMontanas() {

    const base =
        canvas.height -
        ALTURA_SUELO;


    ctx.fillStyle =
        "rgba(15,23,42,0.62)";


    ctx.beginPath();


    ctx.moveTo(
        0,
        base
    );


    for (
        let x = 0;
        x <= canvas.width;
        x += 100
    ) {

        const altura =
            55 +
            (x % 180);


        ctx.lineTo(

            x,
            base - altura

        );

    }


    ctx.lineTo(
        canvas.width,
        base
    );


    ctx.closePath();

    ctx.fill();

}


/* ==========================================
   SUELO
========================================== */

function dibujarSuelo() {

    const sueloY =
        canvas.height -
        ALTURA_SUELO;


    const gradiente =
        ctx.createLinearGradient(

            0,
            sueloY,
            0,
            canvas.height

        );


    gradiente.addColorStop(
        0,
        "#2d9b55"
    );


    gradiente.addColorStop(
        0.15,
        "#18753d"
    );


    gradiente.addColorStop(
        1,
        "#0b4029"
    );


    ctx.fillStyle =
        gradiente;


    ctx.fillRect(

        0,
        sueloY,
        canvas.width,
        ALTURA_SUELO

    );


    ctx.fillStyle =
        "#6ee7a0";


    ctx.fillRect(

        0,
        sueloY,
        canvas.width,
        4

    );


    ctx.fillStyle =
        "rgba(0,0,0,0.18)";


    for (
        let x = 0;
        x < canvas.width;
        x += 35
    ) {

        ctx.fillRect(

            x,
            sueloY + 20 +
            (x % 3) * 8,

            18,
            4

        );

    }

}


/* ==========================================
   PERSONAJE ORIGINAL
========================================== */

function dibujarPersonaje() {

    /*
       ESTE ES TU SPRITE ORIGINAL.
       NO LO CAMBIÉ.
    */

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


    const colores = {

        1: "#111827",

        2: "#F2C94C",

        3: "#EF4444",

        4: "#F5D5C5",

        5: "#38BDF8"

    };


    const columnas = 20;

    const filas = 21;


    let ancho =
        ANCHO_PERSONAJE;

    let alto =
        ALTURA_PERSONAJE;


    if (
        estadoFinal === "GANASTE"
    ) {

        ancho *= 1.45;

        alto *= 1.20;

    }


    const pixelWidth =
        ancho / columnas;

    const pixelHeight =
        alto / filas;


    /*
       SOMBRA
    */

    ctx.save();

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";


    ctx.beginPath();

    ctx.ellipse(

        personajeX +
        ancho / 2,

        personajeY +
        alto + 5,

        ancho * 0.55,

        7,

        0,

        0,
        Math.PI * 2

    );

    ctx.fill();

    ctx.restore();


    /*
       CUELLO
    */

    if (
        longitudCuello > 0 &&
        direccionCuello !== 0
    ) {

        dibujarCuello(
            ancho,
            alto
        );

    }


    /*
       CUERPO
    */

    for (
        let r = 0;
        r < filas;
        r++
    ) {

        for (
            let c = 0;
            c < columnas;
            c++
        ) {

            const colorIndex =
                sprite[r][c];


            if (
                colorIndex !== 0
            ) {

                ctx.fillStyle =
                    colores[colorIndex];


                ctx.fillRect(

                    personajeX +
                    c * pixelWidth,

                    personajeY +
                    r * pixelHeight,

                    pixelWidth + 0.5,

                    pixelHeight + 0.5

                );

            }

        }

    }


    if (
        estadoFinal === "GANASTE"
    ) {

        dibujarDormido(

            personajeX,
            personajeY,
            ancho,
            alto

        );

    }

}


/* ==========================================
   CUELLO
========================================== */

function dibujarCuello(
    ancho,
    alto
) {

    const inicioX =
        personajeX +
        ancho / 2;


    const inicioY =
        personajeY + 14;


    const finX =
        inicioX +
        direccionCuello *
        longitudCuello;


    const finY =
        inicioY;


    ctx.lineWidth = 12;

    ctx.strokeStyle =
        "#111827";


    ctx.beginPath();

    ctx.moveTo(
        inicioX,
        inicioY
    );

    ctx.lineTo(
        finX,
        finY
    );

    ctx.stroke();


    ctx.lineWidth = 7;

    ctx.strokeStyle =
        "#F5D5C5";


    ctx.beginPath();

    ctx.moveTo(
        inicioX,
        inicioY
    );

    ctx.lineTo(
        finX,
        finY
    );

    ctx.stroke();


    ctx.fillStyle =
        "#F5D5C5";


    ctx.beginPath();

    ctx.arc(

        finX,
        finY,
        13,

        0,
        Math.PI * 2

    );

    ctx.fill();


    ctx.fillStyle =
        "#111827";


    ctx.beginPath();

    ctx.arc(

        finX,
        finY - 7,
        12,

        Math.PI,
        Math.PI * 2

    );

    ctx.fill();


    ctx.fillStyle =
        "#111827";


    ctx.fillRect(

        finX - 5,
        finY - 1,
        3,
        3

    );


    ctx.fillRect(

        finX + 3,
        finY - 1,
        3,
        3

    );

}


/* ==========================================
   DORMIDO
========================================== */

function dibujarDormido(
    x,
    y,
    ancho,
    alto
) {

    ctx.fillStyle =
        "rgba(245,213,197,0.9)";


    ctx.beginPath();

    ctx.ellipse(

        x +
        ancho / 2,

        y +
        alto * 0.60,

        ancho * 0.50,

        alto * 0.30,

        0,

        0,
        Math.PI * 2

    );

    ctx.fill();


    ctx.strokeStyle =
        "#111827";

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(
        x + ancho * 0.25,
        y + alto * 0.30
    );

    ctx.lineTo(
        x + ancho * 0.37,
        y + alto * 0.30
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x + ancho * 0.62,
        y + alto * 0.30
    );

    ctx.lineTo(
        x + ancho * 0.74,
        y + alto * 0.30
    );

    ctx.stroke();


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 18px Arial";


    ctx.fillText(

        "Z",
        x + ancho + 5,
        y - 5

    );


    ctx.font =
        "bold 14px Arial";


    ctx.fillText(

        "Z",
        x + ancho + 18,
        y - 22

    );


    ctx.font =
        "bold 11px Arial";


    ctx.fillText(

        "Z",
        x + ancho + 28,
        y - 34

    );

}


/* ==========================================
   LIMONES
========================================== */

function dibujarLimones() {

    limones.forEach(
        limon => {

            const centroX =
                limon.x +
                ANCHO_LIMON / 2;


            const centroY =
                limon.y +
                ALTO_LIMON / 2;


            ctx.save();


            ctx.translate(
                centroX,
                centroY
            );


            ctx.rotate(
                limon.rotacion *
                Math.PI / 180
            );


            ctx.scale(
                limon.escala,
                limon.escala
            );


            ctx.shadowColor =
                "#facc15";

            ctx.shadowBlur = 12;


            const gradiente =
                ctx.createRadialGradient(

                    -5,
                    -6,
                    2,

                    0,
                    0,
                    14

                );


            gradiente.addColorStop(
                0,
                "#fff7ae"
            );


            gradiente.addColorStop(
                0.35,
                "#fde047"
            );


            gradiente.addColorStop(
                1,
                "#eab308"
            );


            ctx.fillStyle =
                gradiente;


            ctx.beginPath();


            ctx.ellipse(

                0,
                0,

                10,
                14,

                0,

                0,
                Math.PI * 2

            );


            ctx.fill();


            ctx.shadowBlur = 0;


            ctx.fillStyle =
                "#22c55e";


            ctx.beginPath();


            ctx.ellipse(

                6,
                -10,

                5,
                2.5,

                -0.4,

                0,
                Math.PI * 2

            );


            ctx.fill();


            ctx.restore();

        }
    );

}


/* ==========================================
   PANTALLA FINAL
========================================== */

function dibujarPantallaFinal() {

    ctx.fillStyle =
        "rgba(3,7,18,0.80)";


    ctx.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );


    const anchoPanel = 650;

    const altoPanel = 270;


    const panelX =
        canvas.width / 2 -
        anchoPanel / 2;


    const panelY =
        canvas.height / 2 -
        altoPanel / 2;


    ctx.fillStyle =
        "rgba(15,23,42,0.97)";


    ctx.strokeStyle =
        estadoFinal === "GANASTE"
            ? "#facc15"
            : "#ef4444";


    ctx.lineWidth = 4;


    ctx.beginPath();


    ctx.roundRect(

        panelX,
        panelY,

        anchoPanel,
        altoPanel,

        20

    );


    ctx.fill();

    ctx.stroke();


    ctx.textAlign =
        "center";


    ctx.font =
        "900 60px Arial";


    ctx.fillStyle =
        estadoFinal === "GANASTE"
            ? "#facc15"
            : "#ef4444";


    ctx.fillText(

        estadoFinal === "GANASTE"
            ? "¡GANASTE!"
            : "GAME OVER",

        canvas.width / 2,

        panelY + 82

    );


    ctx.font =
        "bold 25px Arial";


    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(

        "PUNTAJE: " +
        puntage,

        canvas.width / 2,

        panelY + 135

    );


    ctx.font =
        "bold 19px Arial";


    ctx.fillStyle =
        "#94a3b8";


    ctx.fillText(

        "NIVEL: " +
        nivel,

        canvas.width / 2,

        panelY + 170

    );


    ctx.font =
        "900 18px Arial";


    ctx.fillStyle =
        "#38bdf8";


    ctx.fillText(

        "PRESIONA ENTER PARA JUGAR DE NUEVO",

        canvas.width / 2,

        panelY + 220

    );


    ctx.textAlign =
        "left";

}


/* ==========================================
   LIMPIAR
========================================== */

function limpiarCanva() {

    ctx.clearRect(

        0,
        0,
        canvas.width,
        canvas.height

    );

}


/* ==========================================
   MÚSICA
========================================== */

function iniciarMusica() {

    if (
        musicaIniciada
    ) {

        return;

    }


    try {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }


        musicaIniciada = true;


        const notas = [

            261.63,
            329.63,
            392.00,
            523.25,
            392.00,
            329.63,
            293.66,
            349.23

        ];


        intervaloMusica =
            setInterval(

                () => {

                    if (
                        !audioContext
                    ) {

                        return;

                    }


                    const oscilador =
                        audioContext.createOscillator();


                    const ganancia =
                        audioContext.createGain();


                    oscilador.type =
                        "square";


                    oscilador.frequency.value =
                        notas[
                            notaMusica %
                            notas.length
                        ];


                    ganancia.gain.value =
                        0.025;


                    oscilador.connect(
                        ganancia
                    );


                    ganancia.connect(
                        audioContext.destination
                    );


                    const ahora =
                        audioContext.currentTime;


                    oscilador.start(
                        ahora
                    );


                    ganancia.gain.exponentialRampToValueAtTime(

                        0.001,

                        ahora + 0.18

                    );


                    oscilador.stop(

                        ahora + 0.2

                    );


                    notaMusica++;

                },

                240

            );

    }

    catch (error) {

        console.log(
            "La música no pudo iniciarse."
        );

    }

}