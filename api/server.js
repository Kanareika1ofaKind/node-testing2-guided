const express = require("express");

const Hobbits = require("./hobbits/hobbits-model.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

server.get("/hobbits", (req, res) => {
  Hobbits.getAll()
    .then(hobbits => {
      res.status(200).json(hobbits);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/hobbits/:id", (req, res) => {

  const { id } = req.params;
  Hobbits.getById(id)
    .then(hobbit => {
      if (hobbit) {
        res.status(200).json(hobbit);
      } else {
        res.status(404).json({ message: "Hobbit not found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });

});

server.post("/hobbits", (req, res) => {

  const hobbitData = req.body;
  Hobbits.insert(hobbitData)
    .then(newHobbit => {
      res.status(201).json(newHobbit);
    })
    .catch(error => {
      res.status(500).json(error);
    });

});

server.delete("/hobbits/:id", (req, res) => {

  const { id } = req.params;
  Hobbits.remove(id)
    .then(deletedCount => {
      if (deletedCount) {
        res.status(200).json({ message: "Hobbit deleted successfully" });
      } else {
        res.status(404).json({ message: "Hobbit not found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });

});

server.put("/hobbits/:id", (req, res) => {

  const { id } = req.params;
  const changes = req.body;
  Hobbits.update(id, changes)
    .then(updatedHobbit => {
      if (updatedHobbit) {
        res.status(200).json(updatedHobbit);
      } else {
        res.status(404).json({ message: "Hobbit not found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });

});

module.exports = server;