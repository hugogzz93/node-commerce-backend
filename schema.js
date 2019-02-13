import { gql } from 'apollo-server'

const typeDefs = gql`

  type Query {
    products(query: ProductQuery): [Product]!
    users(query: UserQuery): [User]!
    userProducts(ids: [ID]): [UserProduct]!
    orders(ids: [ID]): [Order]!
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
    orders: OrderViewer
  }

  type Order {
    id: ID!
    user_id: ID!
    total: Float
    orderItems(ids: [ID]): [OrderItem]!
    user: User!
    status: String
    createdAt: String
  }

  type OrderViewer {
    createdOrders(query: OrderQuery): [Order]!
    attendingOrders(query: OrderQuery): [Order]!
  }

  type UserProduct {
    id: ID!
    user_id: ID!
    product_id: ID!
    name: String!
    price: Float!
    image: String
    user: User!
  }

  type OrderItem {
    id: ID!
    price: Float!
    amount: Int!
    status: String
    userProduct: UserProduct!
    issues: [Issue]!
  }

  type Mutation {
    login(email: String!, password: String!): User
    logout(auth_token: String!): Boolean
    createProduct(input: ProductInput!): Product
    createUser(input: UserInput!): User
    user(id: ID): UserOps,
    product(id: ID): ProductOps
    order(id: ID): OrderOps
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

  input OrderQuery {
    id: ID
  }

  input OrderInput {
    status: String
    user_id: ID!
    order_items: [OrderItemInput]!
  }

  input OrderItemInput {
    user_product_id: ID!
    amount: Int!
    status: String
  }

  type Issue {
    id: ID!
    order_item_id: ID!
    status: String!
    createdAt: String!
    messages: [IssueMessage]!
  }

  type IssueMessage {
    id: ID!
    author_id: ID!
    issue_id: ID!
    body: String!
  }

  input IssueInput {
    order_item_id: ID!
    messages: [IssueMessageInput]
  }

  input IssueMessageInput {
    author_id: ID!
    body: String
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

  type OrderOps {
    updateOrder(input: OrderInput!): Order
    createOrder(input: OrderInput!): Order
    createIssue(input: IssueInput!): Issue
  }

`
export {typeDefs}
