import { gql } from 'apollo-server'

const typeDefs = gql`

  type Query {
    products(productQuery: ProductQuery): [Product]!
    users(userQuery: UserQuery): [User]!
    loginJWT(auth_token: String!): User
  }

  type Product {
    id: ID!
    name: String
    users: [User]
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String
    auth_token: String
    products: [Product]!
  }

  type Mutation {
    login(email: String!, password: String!): User
    createProduct(productInput: ProductInput!): Product
    createUser(userInput: UserInput!): User
    updateUser(userQuery: UserQuery!, userInput: UserInput!): [User]
  }

  input ProductInput {
    name: String!
    description: String!
  }

  input UserInput {
    name: String
    email: String
    password: String
  }

  input ProductQuery {
    id: ID
    name: String
    description: String,
    userQuery: UserQuery
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




