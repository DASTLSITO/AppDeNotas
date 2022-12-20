"use strict";

const d = document, w = window;
const textoTemporal = d.querySelector(".textoTemporal");
const contenedorTareasAside = d.querySelector(".contenedor-tareas");
const contenedorTareas = d.querySelector(".contenedor-tarea__texto");
const botonAñadirTarea = d.querySelector(".añadir");
const barras = d.querySelector(".bars");
const IDBRequest = indexedDB.open("tareas", 1);
const aside = d.querySelector(".aside");

barras.addEventListener("click", ()=>{
    aside.classList.toggle("asideVisible");
});

IDBRequest.addEventListener("upgradeneeded", ()=>{
    console.log("Creada correctamente");
    const db = IDBRequest.result;
    db.createObjectStore("informacion", {
        autoIncrement: true,
    });
});

IDBRequest.addEventListener("success", ()=>{
    leerTareas();
});

IDBRequest.addEventListener("error", ()=>{
    console.log("Error");
});

const añadirTareaDB = objeto => {
    const IDBData = getIDBData("readwrite", "Objeto añadido correctamente");
    IDBData.add(objeto);
}

const leerTareas = () => {
    const IDBData = getIDBData("readonly", "Objetos leidos correctamente");
    const cursor = IDBData.openCursor();
    contenedorTareasAside.textContent = "";
    cursor.addEventListener("success", ()=>{
        if(cursor.result){
            mostrarAside(cursor.result.value, cursor.result.key);
            cursor.result.continue();
        }else{
            const contenedorGithub = d.createElement("div");
            const github = d.createElement("a");
            const githubLogo = d.createElement("i");

            github.setAttribute("target","_BLANK");
            contenedorGithub.classList.add("githubAside");
            github.setAttribute("href", "https://github.com/DASTLSITO");
            githubLogo.classList.add("fab");
            githubLogo.classList.add("fa-github");

            github.appendChild(githubLogo);
            contenedorGithub.appendChild(github);

            contenedorTareasAside.appendChild(contenedorGithub);
        }
    });
}

const modiciarTareas = (objeto, key) =>{
    const IDBData = getIDBData("readwrite", "Objeto modificado correctamente");
    IDBData.put(objeto, key);
}

const eliminarTareas = key =>{
    const IDBData = getIDBData("readwrite", "Objeto eliminado correctamente");
    IDBData.delete(key);
}

const getIDBData = (modo, mensaje) => {
    const db = IDBRequest.result;
    const IDBTransaction = db.transaction("informacion", modo);
    const objectStore = IDBTransaction.objectStore("informacion");
    IDBTransaction.addEventListener("complete", ()=>{
        console.log(mensaje);
    });
    return objectStore;
}

const añadirTarea = () => {
    !(aside.classList.contains("asideVisible")) && aside.classList.toggle("asideVisible");
    añadirTareaDB({titulo: 'Tarea', descripcion: 'Descripción', texto: 'Texto de la nota'});
    leerTareas();
}

const mostrarTexto = (tarea, key) => {
    contenedorTareas.textContent = "";

    const contenedorTarea = document.createElement("DIV");
    const contenedorBoton = document.createElement("DIV");
    const titulo = document.createElement("h1");
    const descripcion = document.createElement("h4");
    const texto = document.createElement("P");
    const botonGuardar = document.createElement("button");
    const botonBorrar = document.createElement("button");

    contenedorTarea.classList.add("contenedor-tarea-main");
    contenedorBoton.classList.add("contenedor-boton-main");
    titulo.classList.add("titulo-tarea__texto");
    descripcion.classList.add("descripcion-tarea__texto");
    texto.classList.add("contenido-tarea__texto");
    botonGuardar.classList.add("guardar-tarea");
    botonGuardar.classList.add("imposible");
    botonBorrar.classList.add("borrar-tarea");

    botonGuardar.textContent = "Guardar tarea";
    botonBorrar.textContent = "Borrar tarea";
    titulo.textContent = tarea.titulo;
    descripcion.textContent = tarea.descripcion;
    texto.textContent = tarea.texto;

    titulo.setAttribute("contenteditable", "true");
    descripcion.setAttribute("contenteditable", "true");
    texto.setAttribute("contenteditable", "true");

    titulo.addEventListener("keyup", ()=>{
        botonGuardar.classList.replace("imposible", "posible");
    });

    descripcion.addEventListener("keyup", ()=>{
        botonGuardar.classList.replace("imposible", "posible");
    });

    texto.addEventListener("keyup", ()=>{
        botonGuardar.classList.replace("imposible", "posible");
    });

    botonGuardar.addEventListener("click", ()=>{
        if(botonGuardar.classList.contains("posible")){
            modiciarTareas({titulo: titulo.textContent, descripcion: descripcion.textContent, texto: texto.textContent}, key);
            leerTareas();
            botonGuardar.classList.replace("posible", "imposible");
        }
    });

    botonBorrar.addEventListener("click", ()=>{
        eliminarTareas(key);
        contenedorTareas.textContent = "";
        leerTareas();
    });

    contenedorBoton.appendChild(botonGuardar);
    contenedorBoton.appendChild(botonBorrar);

    contenedorTarea.appendChild(titulo);
    contenedorTarea.appendChild(descripcion);
    contenedorTarea.appendChild(texto);

    contenedorTareas.appendChild(contenedorTarea);
    contenedorTareas.appendChild(contenedorBoton);
}

const mostrarAside = (tarea, key) => {
    const contenedorTareaAside = document.createElement("DIV");
    const tituloAside = document.createElement("P");
    const descripcionAside = document.createElement("P");
    contenedorTareaAside.classList.add("contenedor-tarea");
    tituloAside.classList.add("titulo-tarea");
    descripcionAside.classList.add("descripcion-tarea");

    tituloAside.textContent = tarea.titulo;
    descripcionAside.textContent = tarea.descripcion;

    contenedorTareaAside.appendChild(tituloAside);
    contenedorTareaAside.appendChild(descripcionAside);

    contenedorTareaAside.addEventListener("click", ()=>{
        if(screen.width <= 600){
            aside.classList.toggle("asideVisible");
        }
        mostrarTexto(tarea, key);
    });

    contenedorTareasAside.appendChild(contenedorTareaAside);
}

botonAñadirTarea.addEventListener("click", añadirTarea);