import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDiscos, deleteDisco } from "../api";
import { GENEROS_VALIDOS } from "../validationFormat";

export function DiscosLista({ onEditar }) {

    //el estado inicial del filtro será TODOS los géneros
    const [generoFiltro, setGeneroFiltro] = useState("TODOS");
    const queryClient = useQueryClient();

    const {
        data: discos = [], //para que discos.length no de error mientras llegan los datos
        isLoading, //estados que gestiona ahora TanStack Query
        isError, //estados que gestiona ahora TanStack Query
        error,
    } = useQuery({
        queryKey: ["discos", generoFiltro], //la clave cambiará si se selecciona otro género
        queryFn: () => getDiscos(generoFiltro), //se ejecuta queryFn (se hace fetch) cuando toque
        //ambos resultados quedan guardados en caché
    });


    //esto se ejecutará al pulsar "Eliminar"
    const deleteMutation = useMutation({
        mutationFn: deleteDisco,
        onSuccess: () => {
            //esto informa a la caché que está deasctualizada y vuelve
            //a hacer getDiscos (api.js) para obtener la actualizada
            queryClient.invalidateQueries({ queryKey: ["discos"] });
        },
    });


    //EARLY RETURNS
    if (isLoading) {
        return <h4>Cargando almacén de discos...</h4>;
    }

    if (isError) {
        return <h4 role="alert" className="errorMSG">Error: {error.message}</h4>;
    }


    return (
        <div id="contenedor">
        <h1>CATÁLOGO DE DISCOS</h1>

        {/* DESPLEGABLE DE FILTRO */}
        <div>
            <label htmlFor="filtro-genero">Filtrar por género: </label>
            <select
            id="filtro-genero"
            value={generoFiltro}
            onChange={(evento) => setGeneroFiltro(evento.target.value)}
            >
            <option value="TODOS">Todos</option>
            {GENEROS_VALIDOS.map((genero) => (
                <option key={genero} value={genero}>
                {genero}
                </option>
            ))}
            </select>
        </div>

        {/* LISTADO DE RESULTADOS */}
        {discos.length === 0 ? (
            <p>No hay discos que coincidan con tu búsqueda.</p>
        ) : (
            <ul>
            {/* cada "caja" de disco aparece con su info, y dos botones (editar y eliminar) */}
            {discos.map((disco) => (

                <li key={disco.id}>
                {disco.title} — {disco.artist} ({disco.genre}, {disco.format}, {disco.year}) — {disco.price} €

                <button type="button" className="botonEditar" onClick={() => onEditar(disco)}>
                    Editar
                </button>

                <button
                    type="button"
                    className="botonEliminar"
                    onClick={() => deleteMutation.mutate(disco)}
                    disabled={deleteMutation.isPending} //si ya se está borrando evita clicks duplicados
                >
                    Eliminar
                </button>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}