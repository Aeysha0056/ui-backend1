const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

// graphql
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

// projects models
const Projects = require("./models/projects/projects");
const Imports = require("./models/projects/imports");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// -----------------------------
//        UI tabs data
// -----------------------------
app.use(
  "/graphql",
    graphqlHttp({
      schema: graphQlSchema,
      rootValue: graphQlResolvers,
      customFormatErrorFn: (err) => ({ message: err.message, status: err.status }),
      graphiql: true
    })
);

// -----------------------------
// UI projects and imports data
// -----------------------------

app.post("/project", (req, res, next) => {
  // body data not complete
  if (!req.body.name)
    return res.status(400).send({
      error: "invalid body data"
    });

  return new Projects({
    name: req.body.name,
    imports: []
  })
    .save()
    .then(result => {
      res.status(201).send(result);
    })
    .catch(err => {
      res.status(500).send({
        error: "Internal Server Error"
      });
    });
});

// create import for spcefic project
app.post("/import", (req, res, next) => {
  // check req body
  if (!req.body.projectId || !req.body.img || !req.body.store)
    return res.status(400).send({
      error: "invalid body data"
    });

  return Projects.findById(req.body.projectId)
    .then(project => {
      // create new import
      return new Imports({
        img: req.body.img,
        store: req.body.store
      })
        .save()
        .then(importRes => {
          // add the import id to the project imports
          project.imports.push(importRes);
          project.save();
          res.status(200).send({ project, import: importRes });
        })
        .catch(err => {
          res.status(500);
        });
    })
    .catch(err => {
      res.status(400).send({
        error: "project not exist"
      });
    });
});

// update import
app.put("/import/:importId", (req, res, next) => {
  // check req body
  if (!req.body.store)
    return res.status(400).send({
      error: "invalid body data"
    });

  return Imports.findByIdAndUpdate(
    req.params.importId,
    {
      store: req.body.store
    },
    { new: true, useFindAndModify: false }
  )
    .then(importRes => {
      if (!importRes) {
        return res.status(404).send({
          error: "import not found"
        });
      }
      res.send(importRes);
    })
    .catch(err => {
      res.status(500).send({
        error: "Server Error"
      });
    });
});

app.get("/import/:importId", (req, res, next) => {

  return Imports.findById(req.params.importId)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      return res.status(404).send({
        error: "import not found"
      });
    });
});

// get all imports
app.get("/import", (req, res, next) => {
  return Imports.find()
    .then(result => {
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).send({
        error: "Server Error"
      });
    });
});

// get all projects
app.get("/project", (req, res, next) => {
  return Projects.find()
    .then(result => {
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).send({
        error: "Server Error"
      });
    });
});

// -----------------------------
// mongoose connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-vm701.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useFindAndModify: false }
  )
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log("Connection ERROR::", err);
  });
