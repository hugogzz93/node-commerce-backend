import knex from 'knex'
import { Model } from 'objection'
import connection from './knexfile'
import User from './models/user'
import Product from './models/product'
import UserProduct from './models/userProducts'
import Order from './models/Order'

const knexConnection = knex(connection)
Model.knex(knexConnection)

export default { User, Product, UserProduct, Order };

