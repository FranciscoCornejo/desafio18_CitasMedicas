const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const _ = require("lodash");
const chalk = require("chalk");
const app = express();
const port = 3000;

let usuarios = [];

// Endpoint para registrar un nuevo usuario
app.post("/registro", async (req, res) => {
  try {
    const respuesta = await axios.get("https://randomuser.me/api/");
    const datosUsuario = respuesta.results;

    const usuario = {
      id: uuidv4().slice(0, 6),
      nombre: datosUsuario.name.first,
      apellido: datosUsuario.name.last,
      genero: datosUsuario.gender,
      timestamp: moment().format(),
    };

    usuarios.push(usuario);

    console.log(chalk.green("Usuario registrado:"));
    console.log(usuario);

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el usuario");
  }
});

// Función para imprimir la lista de usuarios con Chalk
function imprimirUsuarios(usuarios) {
  const mujeres = usuarios.filter((usuario) => usuario.gender === "female");
  const hombres = usuarios.filter((usuario) => usuario.gender === "male");

  const formatoUsuario = (usuario, indice) =>
    `${indice + 1}. Nombre: ${usuario.name} - Apellido: ${usuario.last} - ID: ${
      usuario.id
    } - Timestamp: ${usuario.timestamp}`;

  console.log(chalk.blue.bgWhite("Mujeres:"));
  mujeres.forEach((usuario, indice) => {
    console.log(chalk.blue.bgWhite(formatoUsuario(usuario, indice)));
  });

  console.log(chalk.blue.bgWhite("\nHombres:"));
  hombres.forEach((usuario, indice) => {
    console.log(chalk.blue.bgWhite(formatoUsuario(usuario, indice)));
  });
}

// Endpoint para consultar todos los usuarios
app.get("/usuarios", (req, res) => {
  const usuariosAgrupados = _.groupBy(usuarios, "gender");

  console.log(chalk.green("Lista de usuarios:"));
  imprimirUsuarios(usuarios);

  res.json(usuariosAgrupados);
});

app.listen(port, () => {
  console.log(
    `Servidor corriendo en el puerto http://localhost:${port}/usuarios`
  );
});
