const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(req, res, next) {
  const { url, method } = req;

  const { id } = req.params;

  let existing = repositories.find(r => r.id === id);
  if (!existing)
    return res.status(400).send();
  return next();
}

app.use('/repositories/:id', validateId);


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo)

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  let existing = repositories.find(r => r.id === id);

  existing = { ...existing, title: title, url: url, techs: techs };
  
  return response.status(200).json(existing);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  let existing = repositories.findIndex(r => r.id === id);

  repositories.splice(existing, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  let existing = repositories.find(r => r.id === id);
  existing.likes += 1;
  return response.json(existing);
});

module.exports = app;
