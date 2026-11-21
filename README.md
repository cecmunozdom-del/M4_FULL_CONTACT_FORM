# FULL CONTACT FORMS - GREENYURI RECORDS
Misión M4 · Full Contact Form Valida o MUERE — Web Development I. 


## Cómo probarlo
La app simula la gestión de una tienda de discos, con una base de datos propia en JSON donde se almacenan los distintos discos a la venta, con sus diferentes características (estilos, autores, formatos...). Mediante el formulario modo CRUD se permite añadir, eliminar, modificar y filtrar por género los discos "en stock". Para ponerlo en funcionamiento se arrancan dos terminales en paralelo, una que lanza la "base de datos" con el comando: npx json-server DB.json --port 3001, y otra que lanza la app con el comando: npm run dev.

COMPROBACIÓN DE DATO CORRUPTO:
Esta app emplea limpieza de datos con Zod y safeParse, de forma que se muestran por pantalla el número de discos con datos corruptos detectados en la base de datos en todo momento.


## Uso de IA
Utilicé Gemini para que me explicase cosas acerca de TanStack Query, cómo funcionaba, y cómo se juntaba junto con Zod y React Hook Form. También me ayudó a pensar como podía dividir este trabajo, ya que, aunque sabía que iba a tener mi archivo json a modo de base de datos, mi script con validaciones, mi script de api con los procesos asíncronos, y al menos un componente de formulario, no estaba del todo segura de si era una buena base o un buen camino por el que empezar.

Ya dentro de la programación, me ayudó a corregir errores y a avanzar en el código, con propuestas como el uso de encodeURIComponent para pasar caracteres de forma segura, y el pasar a string los ID con json-server, ya que "al enviar a json-server en el POST y en el PUT, envíalo convertido a texto con String(nuevoDisco.id) porque las versiones nuevas de json-server usan IDs en formato texto para las rutas"
Me corrigió también que el uso de keys en option era necesario en mi caso ya que estaban dentro de un map, que para setError el primer elemento debe ser un ID, y que podía usar step en el input del formulario del precio para establecer los decimales.

Gracias a Gemini también pude solucionar el siguient error: Uncaught SyntaxError: Identifier '__vite__injectQuery' has already been declared. No sabía porqué estaba ocurriendo, y resultaba que era por tener imports duplicados en varias partes del código.

Sobre todo me sirvió de gran ayuda en la programación de los componentes Formulario y Lista, y su uso de TanStack Query que no entendía del todo al principio. Le pedí a Gemini ejemplos de cómo podía hacer ciertas cosas, o le pedía que me corrigiera ciertas partes, de forma que no solo funcionase la web, sino que también pudiera yo llevarme una base sólida y un aprendizaje útil sobre el tema.

Me sirvió también de ayuda con el css en general, aunque la versión final está ajustada y modificada por mí a mi gusto. Las unidades de distancias las he dejado en rem ya que es bastante estándar y me pareció correcto, pero las unidades del tamaño de las letras las cambié a em ya que es lo que yo suelo usar.

Por último, tras la primera corrección de WebArena, Gemini me ayudó bastante a aplicar todos los cambios que requería mi página web, y a entender porqué y cómo mejoraban la arquitectura y el funcionamiento, además de la UX. Por ejemplo, el juntar las query keys en una constante para no repetirlas por todos los códigos, el separar los datos corruptos de los correctos para evitar que eso parase todo el funcionamiento del programa, o la creación de nuevos estados para mostrar mensajes e información útil al usuario (como un mensaje de confirmación si se ha guardado correctamente un nuevo disco).

Algunos ejemplos de prompts:
"¿Podrías explicarme cómo funciona TanStackQuery, y ayudarme a aplicarlo en esta app que estoy haciendo?"
"¿En setError es estrictamente necesario que el primer elemento sea "id"? No lo entiendo." De hecho sí es necesario, con React Hook Form, setError tiene una estructura fija, y en mi caso ese primer elemento debe ser "id", ya que es el argumento que uso también en register("id") en los inputs del formulario, de forma que RHF puede saber en qué entrada de error debe guardar el mensaje.
"Me ha salido esta línea sola en DB.json y no sé qué significa: "$schema": "./node_modules/json-server/schema.json"". Es una plantilla de ayuda para VSCode que añade automáticamente json-server. Le dice a VSCode qué estructura debe esperar, y subraya en rojo o amarillo errores que haya en el archivo en tiempo real. No afecta en nada y se puede quitar, pero he comprobado que cada vez que se abre la app, se vuelve a añadir automáticamente.


## Autopsia
1. Una decisión complicada con la que me he topado ha sido cómo validar bien los IDs, ya que me dí cuenta de que json, aunque recibiera el id de cierto nuevo disco al registrarlo, lo ignoraba y empleaba un id propio formado por letras aleatorias, de forma que al coger los datos guardados daba error por detección de datos corruptos. Esto es una característica de la versión concreta de json-server que estoy empleando, y al no querer modificarla, mi solución inicial fue emplear un union y permitir la entrada de strings en el campo de id. No fue la solución más precisa, y tras unas correcciones, Gemini me ayudó a buscar una solución más realista: en esta versión, si json-server aplica un id alfanumérico aleatorio, mi app lo percibe como dato corrupto al no ser un número entero, y por tanto detectará el disco como corrupto en general. 

2. Otra decisión que tuve que tomar fue acerca de cómo mostrar feedback al usuario, en el sentido de mensajes de éxito, error, etc. Al inicio, en Lista.jsx se mostraba cierta información al usuario mediante alerts, pero tras unas correcciones y gracias al consejo de Gemini puse un estado que iba cambiando según se necesitasen mostrar los mensajes de la lista respectivos al usuario. También en Formulario añadí un estado para guardar mensajes de éxito, que previamente tampoco mostraba.