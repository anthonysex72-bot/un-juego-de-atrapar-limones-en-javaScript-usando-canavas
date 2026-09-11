function generarAleatorio(min,max){
    let random=Math.random();
    let numero=random*(max-min);
    let numeroEntero=Math.ceil(numero);
    numeroEntero=numeroEntero+min;
    return numeroEntero;
}

function mostrarEnSpan(idSpan, valor){

    let componente=document.getElementById(idSpan);

    componente.textContent=valor;

}