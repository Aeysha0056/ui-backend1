const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Tab {
    _id: ID!
    name: String!
    icon: String
    section: Section
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
    views: [View!]!
    tab(id: ID!): Tab
    section(id: ID!): Section
    value(id: ID!): Value
    view(id: ID!): View
  }

  type RootMutation {
    editTab(id: String!, name: String!): Tab
    addTab(name: String!, icon: String): Tab
    editSection(id: String!, name: String, type: String): Section
    addSection(tabId: String!, name: String!, type: String!): Section
    editValue(id: String!, name: String): Value
    addValue(sectionId: String!, name: String!): Value
    editView(id: String!, type: String, values: [String]): View
    addView(valueId: String!, type: String!, values: [String]!): View
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
