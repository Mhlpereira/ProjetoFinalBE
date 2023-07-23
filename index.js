"use strict";
import express from "express";
import { v4 as uuid } from 'uuid';

const usuarios = [];

let usuarioLogado;
let valido = false;

const app = express();
app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).send("Seja bem vindo ao app!");
});

app.post("/cadastro", function (req, res) {
  if (req.body.nome === "" || req.body.email === "" || req.body.senha === "") {
    res.status(400).send("Preencha corretamente os campos");
  }

  const emailExistente = usuarios.some(usuario => usuario.email === req.body.email);
  if (emailExistente) {
    res.status(400).send("Email já utilizado");
  } else {
    const novoUsuario = {
      identificador: uuid(),
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      recados: [],
    };
    usuarios.push(novoUsuario);
    res.status(200).send("Usuario cadastrado com sucesso");
  }
});

app.post("/login", function (req, res) {
  const login = {
    email: req.body.email,
    senha: req.body.senha,
  };

  const usuarioEncontrado = usuarios.find(usuario => usuario.email === login.email && usuario.senha === login.senha);
  if (usuarioEncontrado) {
    usuarioLogado = usuarioEncontrado;
    valido = true;
    res.status(200).send("Login realizado com sucesso. Seja bem vindo " + usuarioLogado.nome);
  } else {
    res.status(400).send("Verifique os dados e tente novamente");
  }
});

app.get("/recados", function (req, res) {
  if (valido) {
    const recadosUsuarioLogado = usuarioLogado.recados;
    if (recadosUsuarioLogado.length === 0) {
      res.status(400).send("Usuário ainda não tem registro de recados");
    } else {
      res.status(200).send(recadosUsuarioLogado);
    }
  } else {
    res.status(400).send("É necessário fazer o login para exibir os recados");
  }
});

app.post("/recados", function (req, res) {
  if (valido) {
    if (req.body.titulo === "" || req.body.descricao === "") {
      res.status(400).send("Preencha os campos corretamente");
    } else {
      const novoRecado = {
        id: usuarioLogado.recados.length,
        titulo: req.body.titulo,
        descricao: req.body.descricao,
      };
      usuarioLogado.recados.push(novoRecado);
      res.status(200).send("Recado registrado");
    }
  } else {
    res.status(400).send("É necessário fazer login para criar recados");
  }
});

app.put("/recados", function (req, res) {
  if (valido) {
    const idRecado = req.body.id;
    const recadoAtualizado = usuarioLogado.recados.find(recado => recado.id === idRecado);

    if (!recadoAtualizado) {
      res.status(400).send("Não existe nenhum recado com o ID inserido.");
    } else {
      recadoAtualizado.titulo = req.body.titulo;
      recadoAtualizado.descricao = req.body.descricao;
      res.status(200).send("Recado atualizado com sucesso");
    }
  } else {
    res.status(400).send("É necessário fazer login para atualizar um recado");
  }
});

app.delete("/recados", function (req, res) {
  if (valido) {
    const idRecado = req.body.id;
    const recadoEncontrado = usuarioLogado.recados.find(recado => recado.id === idRecado);

    if (!recadoEncontrado) {
      res.status(400).send("Não existe nenhum recado com o ID inserido.");
    } else {
      usuarioLogado.recados = usuarioLogado.recados.filter(recado => recado.id !== idRecado);
      res.status(200).send("Recado deletado com sucesso");
    }
  } else {
    res.status(400).send("É necessário fazer login para deletar recado");
  }
});

app.listen(3000, function () {
  console.log("Aplicação rodando: http://localhost:3000/");
});
