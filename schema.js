import { gql } from 'apollo-server'

const typeDefs = gql`

  type Query {
    products(query: ProductQuery): [Product]!
    users(query: UserQuery): [User]!
    userProducts(ids: [ID]): [UserProduct]!
    orders(ids: [ID]): [Order]!
    orderGroups(ids: [ID]): [OrderGroup]!
    issues(ids: [ID]): [Issue]!
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
    orders: UserOrderViewer
  }

  enum OrderGroupStatus {
    in_progress
    delivered
    canceled
  }

  type OrderGroup {
    id: ID!
    client_id: ID!
    client: User!
    orders: [Order]!
    total: Float
    createdAt: String
    status: OrderGroupStatus
  }

  enum OrderStatus {
    in_progress
    in_transit
    delivered
    canceled
  }

  type Order {
    id: ID!
    vendor_id: ID!
    client_id: ID!
    vendor: User!
    client: User!
    total: Float
    orderItems(ids: [ID]): [OrderItem]!
    status: OrderStatus
    createdAt: String
    issues(query: IssueQuery): [Issue]!
    trackingNumbers: [TrackingNumber]!
  }

  type UserOrderViewer {
    orderGroups(query: OrderGroupQuery): [OrderGroup]!
    ordersAsClient(query: OrderQuery): [Order]!
    ordersAsVendor(query: OrderQuery): [Order]!
  }

  type UserProduct {
    id: ID!
    user_id: ID!
    product_id: ID!
    name: String!
    price: Float!
    image: String
    user: User!
    stock: Int
  }

  type OrderItem {
    id: ID!
    price: Float!
    amount: Int!
    status: String
    userProduct: UserProduct!
  }

  type Mutation {
    login(email: String!, password: String!): User
    logout(auth_token: String!): Boolean
    user(id: ID): UserOps,
    product(id: ID): ProductOps
    order(id: ID): OrderOps
    issue(id: ID!): IssueOps
    userProduct(id: ID!): UserProductOps
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
    stock: Int
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

  input OrderGroupQuery {
    id: ID
  }

  input OrderQuery {
    id: ID
  }

  enum IssueStatus {
    open
    closed
  }
  
  input IssueQuery {
    id: ID
    status: IssueStatus
  }

  input OrderGroupInput {
    client_id: ID
    orders: [OrderInput]
  }

  input OrderInput {
    status: OrderStatus
    client_id: ID
    vendor_id: ID
    orderItems: [OrderItemInput]
  }

  input OrderItemInput {
    user_product_item_id: ID!
    amount: Int!
    status: String
  }

  input TrackingNumberInput {
    value: String
  }

  type Issue {
    id: ID!
    order_id: ID!
    status: String!
    createdAt: String!
    messages: [IssueMessage]!
    newMessages(user_id: ID!): Boolean!
  }

  type IssueMessage {
    id: ID!
    author_id: ID!
    issue_id: ID!
    body: String!
    author: User!
  }

  type IssueOps {
    close: Issue
  }

  input IssueInput {
    creator_id: ID!
    attendee_id: ID!
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
    create(input: ProductInput!): Product
    updateProduct(input: ProductInput!): Product
  }

  type UserProductOps {
    update(input: UserProductInput!): UserProduct!
  }

  type OrderOps {
    createOrderGroup(input: OrderGroupInput!): OrderGroup
    updateOrder(input: OrderInput!): Order
    createOrder(input: OrderInput!): Order
    createIssue(input: IssueInput!): Issue
    trackingNumber(id: ID): OrderTrackingNumberOps
  }

  type OrderTrackingNumberOps {
    create(input: TrackingNumberInput): TrackingNumber
    update(input: TrackingNumberInput): TrackingNumber
    delete: Boolean
  }

  type TrackingNumber {
    id: ID
    order_id: ID
    value: String
    createdAt: String
    updateAt: String
  }

`
export {typeDefs}
