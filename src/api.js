//aquí se aíslan las peticiones fetch a la "API"
//incluimos las 4 opciones de CRUD (GET, POST, PUT, DELETE)
//bonus de safeParse

import { esquemaValidacion } from "./validationFormat";

//tengo mi propia "base de datos" en un archivo JSON (DB.json)
const API_URL = "http://localhost:3001/records";


//READ -> obtener cierto disco
export async function getDiscos(genero) {
    
    //se puede usar algo llamado encodeURIComponent(), que sirve para filtrar caracteres 
    //especiales (como tildes o &) en formato seguro
    const url = genero && genero !== "TODOS" ? `${API_URL}?genre=${encodeURIComponent(genero)}` : API_URL;
    const response = await fetch(url);

    if(!response.ok){
        throw new Error("Error al cargar los datos.");
    }
    
    const datosBruto = await response.json(); //.json()->lee el texto JSON y lo convierte en array JS

    //validación de datos con safeParse
    const discosValidos = [];
    const discosCorruptos = [];

    for (const discoActual of datosBruto) {
        const resultado = esquemaValidacion.safeParse(discoActual);

        if (resultado.success) {
            //datos válidos en este disco en concreto
            discosValidos.push(resultado.data);
        } else {
            //datos corruptos
            discosCorruptos.push(discoActual);
        }
  }

  if (discosCorruptos.length > 0) {
    console.warn(`Se han descartado ${discosCorruptos.length} disco(s) con datos corruptos:`, discosCorruptos);
  }

  //devolvemos los discos limpios junto con el conteo de descartados para avisar en la UI
  return {
    discos: discosValidos,
    corruptosDescartados: discosCorruptos.length,
  };
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
        //para una petición DELETE no se necesita header ni body, solo con el método y el ID basta
    });

    if(!response.ok){
        throw new Error("Error al eliminar este disco.");
    }

    //en esta caso no hace falta devolver nada
}