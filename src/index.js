const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function RepositoryExists(request, response, next) {
  const {id} = request.params
  const repository = repositories.find(target => target.id === id)
  if (!repository) return response.status(404).json({error: "Repository does not exist."})
  request.repository = repository
  return next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", RepositoryExists, (request, response) => {
  const {title, url, techs} = request.body;

  const repository = request.repository

  repository.title = title
  repository.url = url
  repository.techs = techs

  return response.json(repository);
});

app.delete("/repositories/:id", RepositoryExists, (request, response) => {
  const {repository} = request
  repositories.splice(repositories.indexOf(repository), 1)
  return response.status(204).send();
});

app.post("/repositories/:id/like", RepositoryExists, (request, response) => {
  const {repository} = request
  repository.likes++
  return response.status(201).json(repository);
});

module.exports = app;
