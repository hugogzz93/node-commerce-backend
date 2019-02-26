import knex from 'knex'
import { Model } from 'objection'
import connection from './knexfile'
import User from './models/user'
import Product from './models/product'
import UserProduct from './models/userProducts'
import Order from './models/order'
import OrderGroup from './models/orderGroup'
import Issue from './models/issue'
import IssueMessage from './models/issueMessage'
import LastSeenMessage from './models/lastSeenMessage'
import TrackingNumber from './models/TrackingNumber'

import UserApi from './datasources/UserApi'
import ProductApi from './datasources/ProductApi'
import SessionApi from './datasources/SessionApi'
import OrderApi from './datasources/OrderApi'
import UserProductApi from './datasources/UserProductApi'
import IssueApi from './datasources/IssueApi'

const knexConnection = knex(connection)
Model.knex(knexConnection)

const store = { 
  User,
  Product,
  UserProduct,
  Order,
  OrderGroup,
  Issue,
  IssueMessage,
  LastSeenMessage,
  TrackingNumber,
}

export default store
export const dataSources = {
  userApi: new UserApi({ store }),
  productApi: new ProductApi({ store }),
  sessionApi: new SessionApi({ store }),
  orderApi: new OrderApi({store}),
  userProductApi: new UserProductApi({store}),
  issueApi: new IssueApi({store}),
}

