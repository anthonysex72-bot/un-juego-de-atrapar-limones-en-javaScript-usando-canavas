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