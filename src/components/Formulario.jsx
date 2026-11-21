import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FORMATOS_VALIDOS, GENEROS_VALIDOS, esquemaValidacion } from '../validationFormat';

export function FormularioAlbum() {

    //React Hook Form + las restricciones de Zod
    const{
        register, 
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }, //mensajes de error de Zod
    } = useForm({
        resolver: zodResolver(esquemaValidacion),
    });


//solo se hace OnSubmit si los datos son buenos
  async function onSubmit(datosValidos) {
    console.log("Datos de album válidos: ", datosValidos);
    reset(); //para vaciar los inputs
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate> {/* para que es ese noValidate? */}
    <h2> Registrar Nuevo Disco </h2>


    {/* ID */}
    <div>
        <label htmlFor='id'> ID: </label>
        <input id="id" type="number" {... register("id")} aria-invalid={!!errors.id} />
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
        <select id="genre" {...register("genre")}aria-invalid={!!errors.genre} >
            <option value=""> Selecciona un género </option>
            {/* le damos a elegir al usuario entre los distintos géneros */}
            {GENEROS_VALIDOS.map((genero) => (
            <option value={genero}> {genero} </option>
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
            <option value={formato}> {formato} </option>
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
        <input id="year" type="number" {...register("pric")} aria-invalid={!!errors.price}/>
        {errors.price && <p role="alert" style={{ color: "red" }}>{errors.price.message}</p>}
    </div>

    <button type="submit">Guardar disco</button>

    </form>

  );

}



