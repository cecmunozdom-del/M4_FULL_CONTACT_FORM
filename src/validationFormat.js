//DEFINIMOS EL FORMATO VÁLIDO DE LAS ENTRADAS DEL FORMULARIO CON ZOD

import { z } from "zod";

export const FORMATOS_VALIDOS = ["CD", "Vinilo", "Cassette", "Digital"];
export const GENEROS_VALIDOS = ['Rock', 'Pop', 'Alternativo', 'Indie', 'Jazz', 'Blues', 
                                'Reggae', 'Electrónica', 'Hip-Hop', 'Rap', 'R&B', 'Metal', 'Reggaetón', 'Clásica'];

export const esquemaValidacion = z.object({

  //ID: número entero y que no se repita (0-infinito)
  id: z.union([
    z.coerce
      .number({ error: "El ID debe ser un número" })
      .int({ error: "El ID no puede tener decimales" })
      .min(0, "El ID no puede ser negativo"),
    z.string().min(1, "El ID es obligatorio"),
  ]),

  //titulo: string que tenga como mínimo una letra
  title: z.string().trim().min(1, "Se requiere un nombre de álbum."),

  //artista: igual que título, como mínimo una letra
  artist: z.string().trim().min(1, "Se requiere un nombre de artista."),

  //género: uno de los establecidos en el const
  genre: z.string().min(1, "Se requiere especificar un género musical.").refine((valor) =>
    GENEROS_VALIDOS.some( //comprueba si en los géneros válidos hay alguno que coincida (todo en minúsculas)
      (genero) => genero.toLowerCase() === valor.trim().toLowerCase()
    ),
    { message: "Género no registrado." }
  ),

  //formato: uno de los establecidos en el const
  format: z.string().min(1, "Se requiere especificar un formato.").refine((valor) =>
    FORMATOS_VALIDOS.some( //comprueba si en los géneros válidos hay alguno que coincida (todo en minúsculas)
      (formato) => formato.toLowerCase() === valor.trim().toLowerCase()
    ),
    { message: "Formato no registrado." }
  ),

  //año: dentro del rango [1900 - 2026]
  year: z.coerce //coerce transforma el string que recibe HTML en número
    .number({ error: 'El año debe ser un número' })
    .int('El año no puede tener decimales')
    .min(1900, 'El año mínimo es 1900')
    .max(2026, 'El año no puede ser superior a 2026'),

  //precio: rango entre [0 - 1000], por ponerle un límite
  price: z.coerce //coerce transforma el string que recibe HTML en número
    .number({ error: 'El precio debe ser un número' })
    .min(0, 'El precio no puede ser negativo')
    .max(1000, 'El precio máximo permitido es 1000 €'),

  
}); 
