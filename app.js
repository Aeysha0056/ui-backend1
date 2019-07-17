const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Tab = require("./models/tab");
const Section = require("./models/section");
const Value = require("./models/value");
const View = require("./models/view");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
      type Tab {
          _id: ID!
          name: String!
          icon: String!
          section: Section!
      }

      type Section {
          _id: ID!
          name: String!
          type: String!
          values: [Value!]
      }

      type Value {
          _id: ID!
          name: String!
          view: View
      }

      type View {
          _id: ID!
          type: String!
          values: [String]
      }

      type RootQuery {
        tabs: [Tab!]!
        sections: [Section!]!
        values: [Value!]!
      }

      schema {
        query: RootQuery
      }
    `),
    rootValue: {
      tabs: () => {
        // read data
        return Tab.find()
          .populate({
            path: "section",
            populate: {
              path: "values",
              populate: {
                path: "view"
              }
            }
          })
          .then(tabs => {
            return tabs.map(tab => {
              return {
                ...tab._doc,
                section: {
                  ...tab._doc.section._doc
                }
              };
            });
          })
          .catch(err => {
            throw err;
          });
      }
    },
    graphiql: true
  })
);

// mongoose connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-vm701.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log("Connection ERROR::", err);
  });
