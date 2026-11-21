import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDisco, updateDisco } from '../api';

import { FORMATOS_VALIDOS, GENEROS_VALIDOS, esquemaValidacion } from '../validationFormat';

export function FormularioDiscos({ discoAEditar, onTerminarEdicion }) {

    const queryClient = useQueryClient();

    //React Hook Form + las restricciones de Zod
    const{
        register, 
        handleSubmit,
        reset,
        formState: { errors }, //mensajes de error de Zod
    } = useForm({
        resolver: zodResolver(esquemaValidacion),
    });


    useEffect(() => {
        if(discoAEditar){
            //se rellenan los campos del disco a editar con lo que ya había
            reset(discoAEditar);
        }else{
            //todo vacío
            reset({ id: "", title: "", artist: "", genre: "", format: "", year: "", price: "" });
        }
    }, [discoAEditar, reset]); //esto se ejecuta cuando hay un cambio en discoAEditar???


    //mutación para crear POST
    const createMutation = useMutation({
        mutationFn: createDisco,
        onSuccess: () => {
            queryClient.invalidateQueries ({ queryKey: ["discos"] });
            reset();
        }
    });


    //mutación para actualizar PUT
    const updateMutation = useMutation({
        mutationFn: updateDisco,
        onSuccess: () => {
            queryClient.invalidateQueries ({ queryKey: ["discos"] });
            onTerminarEdicion();
        }
    });



    //solo se hace OnSubmit si los datos son buenos
    async function onSubmit(datosValidos) {
        if (discoAEditar) {
            updateMutation.mutate(datosValidos);
        } else {
            createMutation.mutate(datosValidos);
        }
    }

    //para saber si está guardando
    const estaGuardando = createMutation.isPending || updateMutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>{discoAEditar ? "Editar Disco" : "Registrar Nuevo Disco"}</h2>


            {/* ID */}
            <div>
                <label htmlFor='id'> ID: </label>
                {/* para evitar que el usuario modifque el id al editar un disco */}
                <input id="id" type="number" disabled={!!discoAEditar} {... register("id")} aria-invalid={!!errors.id} />
                {errors.id && <p role="alert" style={{ color: "red" }}>{errors.id.message}</p>} {/* para mostrar un mensaje de error */}
            </div>


            {/* TITULO */}
            <div>
                <label htmlFor='title'> Título del album: </label>
                <input id="title" type="text" {... register("title")} aria-invalid={!!errors.title} />
                {errors.title && <p role="alert" style={{ color: "red" }}>{errors.title.message}</p>} {/* para mostrar un mensaje de error */}
            </div>


            {/* ARTISTA */}
            <div>
                <label htmlFor='artist'> Artista: </label>
                <input id="artist" type="text" {... register("artist")} aria-invalid={!!errors.artist} />
                {errors.artist && <p role="alert" style={{ color: "red" }}>{errors.artist.message}</p>} {/* para mostrar un mensaje de error */}
            </div>
            
            
            {/* GÉNERO */}
            <div>
                <label htmlFor="genre">Género:</label>
                <select id="genre" {...register("genre")} aria-invalid={!!errors.genre} >
                    <option value=""> Selecciona un género </option>
                    {/* le damos a elegir al usuario entre los distintos géneros */}
                    {GENEROS_VALIDOS.map((genero) => (
                    <option key={genero} value={genero}>
                        {genero} 
                    </option>
                    ))}
                </select>
                {errors.genre && <p role="alert" style={{ color: "red" }}>{errors.genre.message}</p>}
            </div>

            {/* FORMATO */}
            <div>
                <label htmlFor="format">Formato:</label>
                <select id="format" {...register("format")} aria-invalid={!!errors.format}>
                {/* le damos a elegir al usuario entre los distintos formatos */}
                    <option value=""> Selecciona un formato </option>
                    {FORMATOS_VALIDOS.map((formato) => (
                    <option key={formato} value={formato}> 
                        {formato} 
                    </option>
                    ))}
                </select>
                {errors.format && <p role="alert" style={{ color: "red" }}>{errors.format.message}</p>}
            </div>
            
            {/* AÑO */}
            <div>
                <label htmlFor="year"> Año de lanzamiento: </label>
                <input id="year" type="number" {...register("year")} aria-invalid={!!errors.year}/>
                {errors.year && <p role="alert" style={{ color: "red" }}>{errors.year.message}</p>}
            </div>


            {/* PRECIO */}
            <div>
                <label htmlFor="price"> Precio: </label>
                <input id="price" step="0.01" type="number" {...register("price")} aria-invalid={!!errors.price}/>
                {errors.price && <p role="alert" style={{ color: "red" }}>{errors.price.message}</p>}
            </div>

            <button type="submit" disabled={estaGuardando}>
                {estaGuardando
                ? "Guardando..."
                : "Guardar Disco"}
            </button>

        </form>

    );

}



