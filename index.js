require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/people");

app.use(express.json());

app.use(cors());
app.use(express.static("build"));
morgan.token("body", (req, res) =>
  req.method === "POST" ? JSON.stringify(req.body) : ""
);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/info", (req, res) => {
  res.send(
    "<p>Phonebook has info for " +
      Person.length +
      " people</p><br/>" +
      new Date()
  );
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const person = req.body;
  if (!person.name || !person.number) {
    return res.status(400).send({
      error: "content missing",
    });
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });
  newPerson
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((result) => res.json(result))
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
