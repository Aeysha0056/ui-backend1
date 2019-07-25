const { buildSchema } = require("graphql");

module.exports = buildSchema(`
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
`);
