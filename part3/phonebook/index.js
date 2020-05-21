const morgan = require("morgan");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/Person");

app.use(cors());
app.use(express.json());
morgan.token("custom", (req, res) => {
  return "POST" === req.method ? JSON.stringify(req.body) : " ";
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :custom"
  )
);
app.use(express.static("build"));

let { persons } = require("./db.json");

app.get("/info", async (req, res) => {
  const count = await Person.estimatedDocumentCount({});
  const response = `
  <p>Phonebook has info for ${count} people</p>
  <p>${new Date()}</p>
  `;
  res.send(response);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", async (req, res) => {
  const person = await Person.findById(req.params.id);
  if (!person) {
    return res.sendStatus(404);
  }
  res.json(person);
});

app.post("/api/persons", async (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({
      error: "The name or number is missing",
    });
  }
  const personExists = await Person.findOne({ name: name });
  if (personExists) {
    return res.status(400).json({
      error: "The name already exists in the phonebook",
    });
  }
  const person = {
    name,
    number,
  };
  const newPerson = await new Person(person);
  await newPerson.save();
  res.json(newPerson);
});

app.delete("/api/persons/:id", async (req, res) => {
  const personExists = await Person.findById(req.params.id);
  if (!personExists) {
    return res.status(400).json({
      error: "The person not exists in the phonebook",
    });
  }
  await Person.findByIdAndRemove(req.params.id);
  res.json({ success: true });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
