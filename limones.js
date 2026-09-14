const canvas = document.getElementById("areaJuego");
const ctx = canvas.getContext("2d");

const ALTURA_SUELO = 80;
const ALTURA_PERSONAJE = 60;
const ANCHO_PERSONAJE = 40;

const ANCHO_LIMON = 24;
const ALTO_LIMON = 24;

let personajeX = canvas.width / 2 - ANCHO_PERSONAJE / 2;
let personajeY = canvas.height - (ALTURA_SUELO + ALTURA_PERSONAJE);

let puntage = 0;
let vidas = 3;
let nivel = 1;

let limones = [];
let intervalo;
let juegoActivo = true;

let velocidadJugador = 9;
let velocidadBase = 3;

const teclas = {
  izquierda: false,
  derecha: false
};

/* =========================
   INICIO
========================= */

function iniciar() {
  clearInterval(intervalo);

  juegoActivo = true;
  personajeX = canvas.width / 2 - ANCHO_PERSONAJE / 2;
  personajeY = canvas.height - (ALTURA_SUELO + ALTURA_PERSONAJE);

  crearLimonesIniciales();

  actualizarHUD();
  configurarTeclado();
  dibujar();

  intervalo = setInterval(bajarLimones, 30);
}

/* =========================
   TECLADO
========================= */

function configurarTeclado() {
  document.onkeydown = function (evento) {

    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      teclas.izquierda = true;
    }

    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      teclas.derecha = true;
    }
  };

  document.onkeyup = function (evento) {

    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      teclas.izquierda = false;
    }

    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      teclas.derecha = false;
    }
  };
}

/* =========================
   CREAR LIMONES
========================= */

function crearLimonesIniciales() {
  limones = [];

  const cantidadInicial = 1 + Math.floor(Math.random() * 2);

  for (let i = 0; i < cantidadInicial; i++) {
    crearLimon(true);
  }
}

function crearLimon(nuevo = false) {
  const limon = {
    x: generarAleatorio(5, canvas.width - ANCHO_LIMON - 5),
    y: nuevo
      ? generarAleatorio(-350, -30)
      : generarAleatorio(-180, -40),

    velocidad: generarVelocidad(),

    rotacion: generarAleatorio(0, 360),

    rotacionVelocidad: generarAleatorio(-3, 3),

    escala: generarAleatorio(85, 115) / 100
  };

  limones.push(limon);
}

/* =========================
   VELOCIDAD ALEATORIA
========================= */

function generarVelocidad() {
  const min = Math.max(2, velocidadBase - 1);
  const max = velocidadBase + 4;

  return generarAleatorio(min * 10, max * 10) / 10;
}

/* =========================
   DIBUJADO GENERAL
========================= */

function dibujar() {
  limpiarCanva();

  dibujarFondo();
  dibujarLuna();
  dibujarSuelo();
  dibujarLimones();
  dibujarPersonaje();
}

/* =========================
   FONDO DEL CANVAS
========================= */

function dibujarFondo() {
  const gradiente = ctx.createLinearGradient(
    0,
    0,
    0,
    canvas.height
  );

  gradiente.addColorStop(0, "#020617");
  gradiente.addColorStop(0.45, "#0f1d3a");
  gradiente.addColorStop(1, "#172554");

  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Estrellas
  ctx.save();

  const estrellas = [
    [45, 70, 2],
    [110, 130, 1],
    [170, 55, 2],
    [250, 155, 1],
    [325, 80, 2],
    [400, 125, 1],
    [475, 50, 2],
    [545, 160, 1],
    [80, 260, 1],
    [210, 300, 2],
    [370, 250, 1],
    [510, 310, 2]
  ];

  estrellas.forEach((estrella) => {
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.45 + Math.random() * 0.45;

    ctx.beginPath();
    ctx.arc(
      estrella[0],
      estrella[1],
      estrella[2],
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  ctx.restore();
}

/* =========================
   LUNA
========================= */

function dibujarLuna() {
  const x = canvas.width - 90;
  const y = 90;
  const radio = 42;

  const gradiente = ctx.createRadialGradient(
    x - 12,
    y - 12,
    5,
    x,
    y,
    radio
  );

  gradiente.addColorStop(0, "#fff7b2");
  gradiente.addColorStop(0.65, "#fde68a");
  gradiente.addColorStop(1, "#f59e0b");

  ctx.save();

  ctx.shadowColor = "#facc15";
  ctx.shadowBlur = 35;

  ctx.fillStyle = gradiente;
  ctx.beginPath();
  ctx.arc(x, y, radio, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Cráteres
  ctx.fillStyle = "rgba(180, 130, 30, 0.20)";

  ctx.beginPath();
  ctx.arc(x - 15, y - 8, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + 13, y + 15, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + 4, y - 20, 4, 0, Math.PI * 2);
  ctx.fill();
}

/* =========================
   SUELO
========================= */

function dibujarSuelo() {
  const sueloY = canvas.height - ALTURA_SUELO;

  const gradiente = ctx.createLinearGradient(
    0,
    sueloY,
    0,
    canvas.height
  );

  gradiente.addColorStop(0, "#22c55e");
  gradiente.addColorStop(0.15, "#16a34a");
  gradiente.addColorStop(1, "#064e3b");

  ctx.fillStyle = gradiente;
  ctx.fillRect(
    0,
    sueloY,
    canvas.width,
    ALTURA_SUELO
  );

  ctx.fillStyle = "#86efac";
  ctx.fillRect(0, sueloY, canvas.width, 4);

  // Detalles del suelo
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";

  for (let x = 0; x < canvas.width; x += 35) {
    ctx.fillRect(
      x,
      sueloY + 20 + (x % 3) * 8,
      18,
      4
    );
  }
}

/* =========================
   PERSONAJE
========================= */

function dibujarPersonaje() {

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

  const pixelWidth = ANCHO_PERSONAJE / columnas;
  const pixelHeight = ALTURA_PERSONAJE / filas;

  // Sombra
  ctx.save();

  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(
    personajeX + ANCHO_PERSONAJE / 2,
    personajeY + ALTURA_PERSONAJE + 5,
    25,
    7,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();

  for (let r = 0; r < filas; r++) {
    for (let c = 0; c < columnas; c++) {

      const colorIndex = sprite[r][c];

      if (colorIndex !== 0) {

        ctx.fillStyle = colores[colorIndex];

        ctx.fillRect(
          personajeX + c * pixelWidth,
          personajeY + r * pixelHeight,
          pixelWidth + 0.5,
          pixelHeight + 0.5
        );
      }
    }
  }
}

/* =========================
   LIMONES
========================= */

function dibujarLimones() {

  limones.forEach((limon) => {

    const centroX = limon.x + ANCHO_LIMON / 2;
    const centroY = limon.y + ALTO_LIMON / 2;

    ctx.save();

    ctx.translate(centroX, centroY);
    ctx.rotate(limon.rotacion * Math.PI / 180);
    ctx.scale(limon.escala, limon.escala);

    // Aura
    ctx.shadowColor = "#facc15";
    ctx.shadowBlur = 15;

    const gradiente = ctx.createRadialGradient(
      -5,
      -6,
      2,
      0,
      0,
      14
    );

    gradiente.addColorStop(0, "#fff7ae");
    gradiente.addColorStop(0.35, "#fde047");
    gradiente.addColorStop(1, "#eab308");

    ctx.fillStyle = gradiente;

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

    // Hoja
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#22c55e";

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
  });
}

/* =========================
   MOVIMIENTO
========================= */

function moverJugador() {

  if (teclas.izquierda) {
    personajeX -= velocidadJugador;
  }

  if (teclas.derecha) {
    personajeX += velocidadJugador;
  }

  if (personajeX < 0) {
    personajeX = 0;
  }

  if (personajeX + ANCHO_PERSONAJE > canvas.width) {
    personajeX = canvas.width - ANCHO_PERSONAJE;
  }
}

/* =========================
   CAÍDA
========================= */

function bajarLimones() {

  if (!juegoActivo) {
    return;
  }

  moverJugador();

  for (let i = limones.length - 1; i >= 0; i--) {

    const limon = limones[i];

    limon.y += limon.velocidad;
    limon.rotacion += limon.rotacionVelocidad;

    if (detectarAtrapado(limon)) {

      limones.splice(i, 1);

      puntage++;

      actualizarNivel();

      actualizarHUD();

      continue;
    }

    if (
      limon.y + ALTO_LIMON >=
      canvas.height - ALTURA_SUELO
    ) {

      limones.splice(i, 1);

      vidas--;

      actualizarHUD();

      if (vidas <= 0) {
        terminarJuego();
        return;
      }
    }
  }

  // Mantiene varios limones activos y aumenta la dificultad
  const cantidadMaxima = Math.min(1 + nivel, 7);

  if (
    limones.length < cantidadMaxima &&
    Math.random() < 0.025 + nivel * 0.003
  ) {
    crearLimon();
  }

  dibujar();
}

/* =========================
   COLISIÓN
========================= */

function detectarAtrapado(limon) {

  return (
    limon.x + ANCHO_LIMON > personajeX &&
    limon.x < personajeX + ANCHO_PERSONAJE &&
    limon.y + ALTO_LIMON > personajeY &&
    limon.y < personajeY + ALTURA_PERSONAJE
  );
}

/* =========================
   NIVEL
========================= */

function actualizarNivel() {

  nivel = Math.floor(puntage / 5) + 1;

  // Cada nivel hace que los limones puedan caer más rápido
  velocidadBase = Math.min(
    8,
    3 + (nivel - 1) * 0.65
  );

  // Actualiza la velocidad de los limones que siguen en pantalla
  limones.forEach((limon) => {
    if (Math.random() < 0.35) {
      limon.velocidad = generarVelocidad();
    }
  });

  const nivelSpan = document.getElementById("txtNivel");

  if (nivelSpan) {
    nivelSpan.textContent = nivel;
  }
}

/* =========================
   GAME OVER
========================= */

function terminarJuego() {

  juegoActivo = false;
  teclas.izquierda = false;
  teclas.derecha = false;

  clearInterval(intervalo);

  dibujar();

  setTimeout(() => {
    alert(
      "GAME OVER\n\n" +
      "Puntaje final: " + puntage +
      "\nNivel alcanzado: " + nivel
    );
  }, 100);
}

/* =========================
   REINICIAR
========================= */

function reiniciar() {

  clearInterval(intervalo);

  vidas = 3;
  puntage = 0;
  nivel = 1;
  velocidadBase = 3;

  limones = [];

  actualizarHUD();

  iniciar();
}

/* =========================
   HUD
========================= */

function actualizarHUD() {

  mostrarEnSpan("txtVidas", vidas);
  mostrarEnSpan("txtPuntaje", puntage);
  mostrarEnSpan("txtNivel", nivel);
}

/* =========================
   UTILIDADES
========================= */

function limpiarCanva() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
}

function generarAleatorio(min, max) {

  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function mostrarEnSpan(idSpan, valor) {

  const componente =
    document.getElementById(idSpan);

  if (componente) {
    componente.textContent = valor;
  }
}
