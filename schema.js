import { gql } from 'apollo-server'

const typeDefs = gql`

  type Query {
    products: [Product]
    users: [User]
    me: User
  }

  type Product {
    id: ID!
    name: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
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

  type UserUpdateResponse {
    success: Boolean!
    product: Product
  }

  type ProductConnection {
    cursor: String!
    hasMore: Boolean!
    products: [Product]
  }
`
export {typeDefs}




