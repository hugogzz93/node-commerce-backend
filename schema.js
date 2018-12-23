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
    phone: String
    country: String
    city: String
    street: String
    street_2: String
    street_number: String
    zipcode: String
    description: String
    products: [Product]!
  }

  type Mutation {
    login(email: String!, password: String!): User
    createProduct(productInput: ProductInput!): Product
    createUser(userInput: UserInput!): User
    updateUser(userQuery: UserQuery!,
               userInput: UserInput!): [User]
  }

  input ProductInput {
    name: String!
    description: String!
  }

  input UserInput {
    name: String
    email: String
    password: String
    phone: String
    country: String
    city: String
    street: String
    street_2: String
    street_number: String
    zipcode: String
    description: String
  }

  input ProductQuery {
    id: ID
    name: String
    description: String
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

  input Viewer {
    auth_token: String!
  }
`
export {typeDefs}
