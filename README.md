# API de recomendacion de peliculas
Este proyecto es una API REST construida en NODEJS que tiene como objetivo obtener recomendaciones de peliculas.
Criticos pueden dar su calificacion y su respectiva reseña a las peliculas agregadas por los administradores y los 
demas usuarios pueden ver estas recomendaciones para poder elegir las peliculas que mas les pueden gustar.

### ¿Qué tipos de usuario existen?
* Admin -> 0
* Critico -> 1
* Usuario -> 2
## ¿Qué acciones puede realizar cada usuario?
* Admin
* Crear registros de películas
* Eliminar registros de películas
* Listar registros de películas
* Editar registros de películas
* Crítico
* Crear reseñas de películas
* Eliminar reseñas de películas 
* Modificar reseñas de películas
* Usuario
* Listar reseñas de películas
## ¿Qué información se necesita?
## Pelicula
 * ID de la película
* Nombre de la película
* Duración
* Género
* Sinopsis
* Director
* Estreno
* Poster
* idCriticas
* Estrellas

## Critica
* ID Critica
* ID Usuario
* ID Pelicula
* Nombre de la pelicula
* Comentario
* Calificacion

## Usuario
* Username
* Nombre del usuario
* Apellido
* Edad
* Género
* Email
* Tipo de usuario



## ¿Cuáles son las principales entidades?

* Tres entidades principales, las peliculas que seran nuestros datos y un super usuario que heredara caracteristicas y permisos hacia los demas usuarios

* Críticas
* Películas
* Usuarios

## ¿Qué características tiene cada entidad?

Las películas tendrán información que las defina como nombre, genero, duracion, director, año de estreno, etc para que los usuarios puedan tener más opciones para asi poder filtrar el tipo de peliculas que le sean mas de agrado. 
Las críticas tendran caracteristicas como reseña y calificación, el campo de reseña será opcional mientras que el de calificación será obligatorio. 
Los usuarios es otra entidad y se clasifican en Admin que es el unico que puede agregar peliculas, eliminarlas y editarlas, Crítico que es el unico usuario que puede añadir, eliminar y reseñas y los usuarios “normales” que son lo unico que pueden hacer es listar peliculas asi como filtrar sus búsqueda. Todos los usuarios tienen información adicional como nombre, género, edad, ocupación, etc. De esta manera los usuarios pueden ver que características tienen los críticos que escriben las reseñas y ver a qué público están dirigidas las películas.
Todos los usuarios son capaces de listar películas, y cada entidad posee un ID unico para poder relacionarse entre entidades. Así a cada ID de película corresponden IDs de usuarios únicos. De esta manera una película no recibe dos críticas del mismo usuario.
¿Qué funcionalidades tiene cada entidad?

La entidad de peliculas tiene las funciones de agregar, eliminar, modificar y obtener todas las peliculas ademas de filtrar por caracteristicas.
La entidad de críticas tiene las funciones de agregar, eliminar, modificar y obtener todas las reseñas, asi como filtrar segun sus caracteristicas.
La entidad de usuarios tiene las funciones de agregar, modificar y obtener todos los usuarios asi como filtrar por características o campos.

## Historias de usuario
* "Como Admin quiero agregar, editar, listar y eliminar registros de peliculas para su consulta por otros usuarios"
* “Como Crítico quiero agregar ,editar, listar y eliminar críticas de peliculas para su consulta por otros usuarios”
* “Como Usuario quiero listar registros de peliculas para ver su información”.

## ¿Qué espero que haga el proyecto?
 
CRUD básico y algunas consultas extra con filtros

Queremos crear nuestra base de datos o peliculas, registrandolas (Crear)
Queremos darles un id unico
Queremos poder consultar la info de cada pelicula, con determinados filtros dependiendo de su informacion (leerla)
Queremos añadir un comentario/reseña sobre la pelicula y una calificacion (actualizar)
Queremos como admin poder borrar registros (borrar)
Queremos poder añadir usuarios con distintas características
Queremos poder listar esos usuarios
Queremos actualizar los datos para que cambien los permisos u otros atributos


