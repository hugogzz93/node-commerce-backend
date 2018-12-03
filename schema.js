import { gql } from 'apollo-server'

const typeDefs = gql`

  type Query {
    products(productQuery: ProductQuery): [Product]!
    users(userQuery: UserQuery): [User]!
  }

  type Product {
    id: ID!
    name: String
    users: [User]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    products: [Product]!
  }

  type Mutation {
    login(email: String!): String
    createProduct(productInput: ProductInput!): Product
    createUser(userInput: UserInput!): User
  }

  input ProductInput {
    name: String!
    description: String!
  }

  input UserInput {
    name: String!
    email: String!
  }

  input ProductQuery {
    id: ID
    name: String
    description: String
  }

  input UserQuery {
    id: ID
    name: String
    email: String
  }

  type ProductConnection {
    cursor: String!
    hasMore: Boolean!
    products: [Product]
  }
`
export {typeDefs}




