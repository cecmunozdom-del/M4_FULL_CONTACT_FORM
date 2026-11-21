import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDiscos, deleteDisco } from "../api";
import { GENEROS_VALIDOS } from "../validationFormat";

export function DiscosLista({ onEditar }) {
  const [generoFiltro, setGeneroFiltro] = useState("TODOS");
  const queryClient = useQueryClient();

  const {
    data: discos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["discos", generoFiltro],
    queryFn: () => getDiscos(generoFiltro),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDisco,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discos"] });
    },
  });

  if (isLoading) {
    return <h4>Cargando almacén de discos...</h4>;
  }

  if (isError) {
    return <h4 role="alert" style={{ color: "red" }}>Error: {error.message}</h4>;
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
          {discos.map((disco) => (
            <li key={disco.id}>
              <strong>{disco.title}</strong> — {disco.artist} ({disco.genre}, {disco.format}, {disco.year}) — {disco.price} €

              <button type="button" onClick={() => onEditar(disco)}>
                Editar
              </button>

              <button
                type="button"
                onClick={() => deleteMutation.mutate(disco.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Borrando..." : "Eliminar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}