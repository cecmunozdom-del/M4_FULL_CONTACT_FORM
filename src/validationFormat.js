//DEFINIMOS EL FORMATO VÁLIDO DE LAS ENTRADAS DEL FORMULARIO CON ZOD

import { z } from "zod";

export const FORMATOS_VALIDOS = ["CD", "Vinilo", "Cassette", "Digital"];
export const GENEROS_VALIDOS = ['Rock', 'Pop', 'Alternativo', 'Indie', 'Jazz', 'Blues', 
                                'Reggae', 'Electrónica', 'Hip-Hop', 'Rap', 'R&B', 'Metal', 'Reggaetón', 'Clásica'];

//centralizamos aquí las claves de TanStack Query para no repetirlas por toda la app
export const DISCOS_QUERY_KEYS = {
  all: ["discos"],
  byGenre: (genero) => ["discos", genero],
};

export const esquemaValidacion = z.object({

  //ID: número entero y que no se repita (0-infinito) (el union es necesario, si no dará error)
  id: z.coerce
      .number({ message: "El ID debe ser un número." })
      .int({ message: "El ID no puede tener decimales." })
      .min(0, "El ID no puede ser negativo."),

  //titulo: string que tenga como mínimo una letra
  title: z.string().trim().min(1, "Se requiere un nombre de álbum."),

  //artista: igual que título, como mínimo una letra
  artist: z.string().trim().min(1, "Se requiere un nombre de artista."),

  //género: uno de los establecidos en el const
  genre: z.enum(GENEROS_VALIDOS, {
      message: "Selecciona un género musical válido.",
    }),
  //formato: uno de los establecidos en el const
  format: z.enum(FORMATOS_VALIDOS, {
      message: "Selecciona un formato válido.",
    }),

  //año: dentro del rango [1900 - 2026]
  year: z.coerce //coerce transforma el string que recibe HTML en número
    .number({ error: 'El año debe ser un número' })
    .int('El año no puede tener decimales')
    .min(1900, 'El año mínimo es 1900')
    .max(new Date().getFullYear(), `El año no puede ser superior a ${new Date().getFullYear()}.`),

  //precio: rango entre [0 - 1000], por ponerle un límite
  price: z.coerce //coerce transforma el string que recibe HTML en número
    .number({ error: 'El precio debe ser un número' })
    .min(0, 'El precio no puede ser negativo')
    .max(1000, 'El precio máximo permitido es 1000 €'),

  
}); 
