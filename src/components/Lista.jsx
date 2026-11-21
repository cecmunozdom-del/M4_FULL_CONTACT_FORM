import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getDiscos, deleteDisco } from "../api";
import { GENEROS_VALIDOS, DISCOS_QUERY_KEYS } from "../validationFormat";

export function DiscosLista({ onEditar }) {

    //el estado inicial del filtro será TODOS los géneros
    const [generoFiltro, setGeneroFiltro] = useState("TODOS");
    const [mensajeLista, setMensajeLista] = useState("");
    const queryClient = useQueryClient();

    const {
        data, //datos a devolver
        isLoading, //estados que gestiona ahora TanStack Query
        isFetching,
        isError, 
        error,
    } = useQuery({
        queryKey: DISCOS_QUERY_KEYS.byGenre(generoFiltro), //la clave cambiará si se selecciona otro género
        queryFn: () => getDiscos(generoFiltro), //se ejecuta queryFn (se hace fetch) cuando toque
        //ambos resultados quedan guardados en caché
        placeholderData: keepPreviousData, //mantiene los discos anteriores mientras carga el nuevo filtro
    });


    const discos = data?.discos ?? []; //si no hay discos, coge el objeto vacío
    const discosCorruptosDescartados = data?.corruptosDescartados ?? 0; //si hubiera, coge los discos descartados

    //esto se ejecutará al pulsar "Eliminar"
    const deleteMutation = useMutation({
        mutationFn: deleteDisco,
        onSuccess: () => {
            //esto informa a la caché que está deasctualizada y vuelve
            //a hacer getDiscos (api.js) para obtener la actualizada
            queryClient.invalidateQueries({ queryKey: DISCOS_QUERY_KEYS.all });
            setMensajeLista("Disco eliminado correctamente."); //info para el cliente
            setTimeout(() => setMensajeLista(""), 3000); //desaparece tras x tiempo
        },
    });

    //corrección webArena -> mensaje de ¿estás seguro? al borrar:
    function manejarEliminar(disco) {
        const confirmado = window.confirm(
            `¿Seguro que quieres eliminar "${disco.title}" de ${disco.artist}?`
        );
        if (confirmado) {
            deleteMutation.mutate(disco);
        }
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
            {isFetching && !isLoading && <p> Actualizando...</p>}
        </div>


        {/* AVISOS AL USUARIO */}
        {discosCorruptosDescartados > 0 && (
            <p role="status" className="avisoCorruptos">
            Aviso de seguridad: Zod (safeParse) filtró {discosCorruptosDescartados} registro(s) corrupto(s) del servidor.
            </p>
        )}

        {mensajeLista && (
            <p role="status" className="exitoMSG">
            {mensajeLista}
            </p>
        )}

        {deleteMutation.isError && (
            <p role="alert" className="errorMSG">
            Error al eliminar: {deleteMutation.error.message}
            </p>
        )}


        {/* LISTADO DE RESULTADOS */}
        {isLoading ? ( //mensaje por si está cargando
            <h4>Cargando almacén de discos...</h4>
        ) : isError ? ( //mensaje or si da error la carga
        <h4 role="alert" className="errorMSG">
          Error: {error.message}
        </h4> 
        //si la carga ha sido exitosa:
        ) : discos.length === 0 ? (
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
                    onClick={() => manejarEliminar(disco)}
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