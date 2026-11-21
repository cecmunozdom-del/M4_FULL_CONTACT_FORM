//aquí incluimos las 4 opciones de CRUD (GET, POST, PUT, DELETE)
//bonus de safeParse

import { z } from "zod";
import { esquemaValidacion } from "./validationFormat";

const API_URL = "http://localhost:3001/records";


//READ -> obtener cierto disco
export async function getDiscos(plataforma) {
    
    //se podría usar algo llamado encodeURIComponent(), que sirve para filtrar caracteres especiales (como tildes o &) en formato seguro
    const url = genero && genero !== "TODOS" ? `${API_URL}?genre=${genero}` : API_URL;
    const response = await fetch(url);

    if(!response.ok){
        throw new Error("Error al cargar los datos.");
    }
    
    const datosBruto = await response.json(); //.json()->lee el texto JSON y lo convierte en array JS

    //validación de datos con safeParse
    const resultado = z.array(esquemaValidacion).safeParse(datosBruto);

    //TODO: demostar cómo atrapa un dato corrupto
    if(!resultado.success){
        throw new Error("Error: datos corruptos detectados.");
    }

    return resultado.data; //datos ya limpios y validados con Zod
}


//CREATE -> crear nuevo disco
export async function createDisco(nuevoDisco){
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nuevoDisco, id: String(nuevoDisco.id) }),
        //JSON.stringify->convierte objeto de JS en una cadena de texto JSON
    });

    if(!response.ok){
        throw new Error("Error al crear nuevo disco.");
    }
    
    return response.json();
}


//UPDATE -> modificar disco existente
export async function updateDisco(discoActualizar) {
    const response = await fetch(`${API_URL}/${discoActualizar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...discoActualizar, id: String(discoActualizar.id) }),
    });

    if(!response.ok){
        throw new Error("Error al actualizr este disco.");
    }
    
    return response.json();
}


//DELETE -> borrar cierto disco
export async function deleteDisco (discoEliminar) {
    const response = await fetch(`${API_URL}/${discoEliminar.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...discoEliminar, id: String(discoEliminar.id) }),
    });

    if(!response.ok){
        throw new Error("Error al eliminar este disco.");
    }
}