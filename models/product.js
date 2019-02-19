import { Model } from 'objection'
import bcrypt from 'bcrypt'

export default class Product extends Model {
  static tableName = 'products'
  static jsonSchema = {
    type: 'object',
    required: ['name']
  }

  static relationMappings = {
    userProducts: {
      relation: Model.HasManyRelation, 
      modelClass: `${__dirname}/userProduct`,
      join: {
        from: 'products.id',
        to: 'user_products.product_id',
      }
    }
  }


  allowsModificationFrom(user) {
    return true
  }
}
