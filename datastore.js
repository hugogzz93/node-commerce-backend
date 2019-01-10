import knex from 'knex'
import { Model } from 'objection'
import connection from './knexfile'
import User from './models/user'
import Product from './models/product'

const knexConnection = knex(connection)
Model.knex(knexConnection)

export default { User, Product };

