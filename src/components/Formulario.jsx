import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDisco, updateDisco } from '../api';

import { FORMATOS_VALIDOS, GENEROS_VALIDOS, DISCOS_QUERY_KEYS, esquemaValidacion } from '../validationFormat';

const VALORES_INICIALES = {
  id: "",
  title: "",
  artist: "",
  genre: "",
  format: "",
  year: "",
  price: "",
};

export function FormularioDiscos({ discoAEditar, onTerminarEdicion }) {

    const queryClient = useQueryClient();
    const [mensajeExito, setMensajeExito] = useState("");

    //corrección webArena->info para el usuario: mensajes de éxito
    function mostrarExito(texto) {
        setMensajeExito(texto);
        setTimeout(() => setMensajeExito(""), 3000);
    }

    //React Hook Form + las restricciones de Zod
    const{
        register, //devuelve { name, ref, onChange, onBlur } para conectar cada input y select con el formulario
        handleSubmit, //ejecuta la validación y si todo es válido, llama a onSubmit
        reset, //para rellenar o vaciar campos del formulario de golpe
        setError,
        formState: { errors }, //mensajes de error que Zod va guardando
    } = useForm({
        //para validar los campos del formulario con Zod:
        resolver: zodResolver(esquemaValidacion), 
        defaultValues: VALORES_INICIALES,
    });

    //cada vez que se le de a "Editar" este código se ejecutará
    //cambiando el estado de la prop (en App.jsx)
    useEffect(() => {
        if(discoAEditar){
            //se rellenan los campos del disco a editar con lo que ya había
            reset(discoAEditar);
        }else{
            //todo vacío
            reset(VALORES_INICIALES);
        }
    }, [discoAEditar, reset]); //esto se ejecuta cuando hay un cambio en discoAEditar


    //mutación para crear POST
    const createMutation = useMutation({
        mutationFn: createDisco,
        onSuccess: () => {
            //si tiene éxito, invalida la caché (para refrescar) y vacía el formulario
            queryClient.invalidateQueries({ queryKey: DISCOS_QUERY_KEYS.all });
            reset(VALORES_INICIALES);
            mostrarExito("¡Disco registrado correctamente!");
        }
    });


    //mutación para actualizar PUT
    const updateMutation = useMutation({
        mutationFn: updateDisco,
        onSuccess: () => {
            //si tiene éxito, invalida la caché (para refrescar), y llama a onTerminarEdicion en App.jsx
            queryClient.invalidateQueries({ queryKey: DISCOS_QUERY_KEYS.all });
            onTerminarEdicion(); //discoAEditar pasará a null
            mostrarExito("¡Cambios guardados correctamente!");
        }
    });


    //solo se hace OnSubmit si los datos son buenos
    async function onSubmit(datosValidos) {
        if (discoAEditar) {
            updateMutation.mutate(datosValidos);
        } else {
            //miramos los discos ya guardados para evitar repetir IDs:
            const discosActuales = queryClient.getQueriesData({ queryKey: DISCOS_QUERY_KEYS.all });
            
            //recorre todos los discos (dos campos, clave y objeto -> ordenados por parejas "discos" y "corruptos descartados")
            //se queda solo con el seugndo campo, en concreto con data.discos (si lo hay), único array plan con flatmap
            const todosLosDiscos = discosActuales.flatMap(([, data]) => data?.discos ?? []); 
            const existeID = todosLosDiscos.some((disco) => Number(disco.id) === datosValidos.id);
            
            if(existeID){
                //el primer argumento del setError debe ser id
                setError("id", {message: `El ID ${datosValidos.id} ya está registrado. Elige otro.`});
                return;
            }

            createMutation.mutate(datosValidos);
        }
    }


    //comprobaciones de estados:
    const estaGuardando = createMutation.isPending || updateMutation.isPending;
    const errorMutacion = createMutation.error || updateMutation.error;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>{discoAEditar ? "EDITAR DISCO" : "REGISTRAR NUEVO DISCO"}</h2>


            {/* ID */}
            <div>
                <label htmlFor='id'> ID: </label>
                {/* para evitar que el usuario modifque el id al editar un disco */}
                <input id="id" type="number" disabled={!!discoAEditar} {... register("id")} 
                aria-invalid={!!errors.id} 
                aria-describedby={errors.id ? "error-id" : undefined}
                />
                {errors.id && (<p id="error-id" role="alert" className='errorMSG'> {errors.id.message} </p>)} {/* para mostrar un mensaje de error */}
            </div>


            {/* TITULO */}
            <div>
                <label htmlFor='title'> Título del album: </label>
                <input id="title" type="text" {... register("title")} 
                aria-invalid={!!errors.title} 
                aria-describedby={errors.title ? "error-title" : undefined}
                />
                {errors.title && (<p id="error-title" role="alert" className="errorMSG">{errors.title.message}</p>)}
            </div>


            {/* ARTISTA */}
            <div>
                <label htmlFor='artist'> Artista: </label>
                <input id="artist" type="text" {... register("artist")} 
                aria-invalid={!!errors.artist} 
                aria-describedby={errors.artist ? "error-artist" : undefined}
                />
                {errors.artist && (<p id="error-artist" role="alert" className="errorMSG">{errors.artist.message}</p>)}
            </div>
            
            
            {/* GÉNERO */}
            <div>
                <label htmlFor="genre">Género:</label>
                <select id="genre" {...register("genre")} 
                aria-invalid={!!errors.genre} 
                aria-describedby={errors.genre ? "error-genre" : undefined}
                >
                    <option value=""> Selecciona un género </option>
                    {/* le damos a elegir al usuario entre los distintos géneros */}
                    {GENEROS_VALIDOS.map((genero) => (
                    <option key={genero} value={genero}>
                        {genero} 
                    </option>
                    ))}
                </select>
                {errors.genre && (<p id="error-genre" role="alert" className="errorMSG">{errors.genre.message}</p>)}
            </div>

            {/* FORMATO */}
            <div>
                <label htmlFor="format">Formato:</label>
                <select id="format" {...register("format")} 
                aria-invalid={!!errors.format}
                aria-describedby={errors.format ? "error-format" : undefined}
                >
                {/* le damos a elegir al usuario entre los distintos formatos */}
                    <option value=""> Selecciona un formato </option>
                    {FORMATOS_VALIDOS.map((formato) => (
                    <option key={formato} value={formato}> 
                        {formato} 
                    </option>
                    ))}
                </select>
                {errors.format && (<p id="error-format" role="alert" className="errorMSG">{errors.format.message}</p>)}
            </div>
            

            {/* AÑO */}
            <div>
                <label htmlFor="year"> Año de lanzamiento: </label>
                <input id="year" type="number" {...register("year")} 
                aria-invalid={!!errors.year}
                aria-describedby={errors.year ? "error-year" : undefined}
                />
                {errors.year && (<p id="error-year" role="alert" className="errorMSG">{errors.year.message} </p>)}
            </div>


            {/* PRECIO */}
            <div>
                <label htmlFor="price"> Precio: </label>
                <input id="price" step="0.01" type="number" {...register("price")} 
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? "error-price" : undefined}
                />
                {errors.price && (<p id="error-price" role="alert" className="errorMSG"> {errors.price.message} </p>)}
            </div>

            <button type="submit" className='botonSubmit' disabled={estaGuardando}>
                {estaGuardando
                ? "Guardando..."
                : discoAEditar
                ? "Actualizar Disco"
                : "Guardar Disco"}
            </button>


            {/* info para el usuario en caso de error o éxito */}
            {mensajeExito && (
                <p role="status" className="exitoMSG">
                {mensajeExito}
                </p>
            )}

            {errorMutacion && (
                <p role="alert" className="errorMSG">
                Error en la operación: {errorMutacion.message}
                </p>
            )}


        </form>

    );

}



