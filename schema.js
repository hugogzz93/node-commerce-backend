import { gql } from 'apollo-server'

const typeDefs = gql`

  type Query {
    products(query: ProductQuery): [Product]!
    users(query: UserQuery): [User]!
    loginJWT(auth_token: String!): User
  }

  type Product {
    id: ID!
    name: String
    users(query: UserQuery): [User]
    description: String
  }

  type User {
    id: ID!
    name: String
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
    products(productQuery: ProductQuery): [Product]!
    userProducts(query: UserProductQuery): [UserProduct]!
  }

  type UserProduct {
    id: ID!
    user_id: ID!
    product_id: ID!
    name: String!
    price: Float!
    image: String
  }

  type Mutation {
    login(email: String!, password: String!): User
    logout(auth_token: String!): Boolean
    createProduct(input: ProductInput!): Product
    createUser(input: UserInput!): User
    user(id: ID): UserOps,
    product(id: ID): ProductOps
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  input ProductInput {
    name: String
    description: String
  }

  input UserProductInput {
    id: ID
    user_id: ID
    product_id: ID
    name: String
    price: Float
    image: Upload
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
  }

  input UserQuery {
    id: ID
    name: String
    email: String
  }

  input UserProductQuery {
    id: ID
    product_id: ID
    name: String
  }

  type ProductConnection {
    cursor: String!
    hasMore: Boolean!
    products: [Product]
  }

  input Viewer {
    auth_token: String!
  }

  type UserOps {
    addProducts(ids: [ID]!): [ID]!
    removeProducts(ids: [ID]!): [ID]!
    updateUser(input: UserInput!): User
    createUserProduct(input: UserProductInput!): UserProduct
    updateUserProduct(id: ID, input: UserProductInput!): UserProduct
  }

  type ProductOps {
    updateProduct(input: ProductInput!): Product
  }

`
export {typeDefs}
