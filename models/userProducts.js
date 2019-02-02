import { Model } from 'objection'
import User from './user'

export default class UserProduct extends Model {
  static tableName = 'user_product_items'
  static jsonSchema = {
    type: 'object',
    required: ['user_id', 'product_id', 'name', 'price']
  }

  // static relationMappings = {
  //   user: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: `${__dirname}/user`,
  //     join: {
  //       from: 'user_product_items.id',
  //       to: 'users.id'
  //     }
  //   },
  //   product: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: `${__dirname}/product`,
  //     join: {
  //       from: 'user_product_items.id',
  //       to: 'products.id'
  //     }
  //   }
  // }
}
