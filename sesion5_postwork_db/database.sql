-- Crear base de datos 
CREATE DATABASE reccommendmovie;

-- Crear tabla de usuario
CREATE TABLE usuario (
    id VARCHAR(30) NOT NULL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    genero VARCHAR(10) NOT NULL,
    edad INT(2) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);
-- Crear tabla pelicula
CREATE TABLE pelicula(
    id VARCHAR(30) NOT NULL PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    duracion VARCHAR(10) NOT NULL,
    genero VARCHAR(30) NOT NULL,
    sinopsis VARCHAR(800) NOT NULL,
    director VARCHAR(300) NOT NULL,
    estreno VARCHAR(4) NOT NULL
);

-- Crear tabla critica
CREATE TABLE critica (
    id VARCHAR(30) NOT NULL PRIMARY KEY,
    idUsuario VARCHAR(30) NOT NULL,
    idPelicula VARCHAR(30) NOT NULL,
    nombrePelicula VARCHAR(40) NOT NULL,
    comentario VARCHAR(800),
    calificacion INT(1) NOT NULL,
    FOREIGN KEY(idUsuario) REFERENCES usuario(id),
    FOREIGN KEY(idPelicula) REFERENCES pelicula(id),
);