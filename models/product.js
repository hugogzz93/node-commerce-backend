import { Model } from 'objection'
import bcrypt from 'bcrypt'

export default class Product extends Model {
  static tableName = 'products'
  static jsonSchema = {
    type: 'object',
    required: ['name']
  }

  static relationMappings = {
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/user`,
      join: {
        from: 'products.id',
        through: {
          from: 'users_products.product_id',
          to: 'users_products.user_id'
        },
        to: 'users.id',
      }
    }
  }


  allowsModificationFrom(user) {
    return true
  }
}
