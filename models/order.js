import { Model } from 'objection'
import User from './user'

export default class Order extends Model {
  static tableName = 'orders'
  static jsonSchema = {
    type: 'object',
    required: ['user_id', 'total']
  }
  
  static relationMappings = {
    userProducts: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/userProducts`,
      join: {
        from: 'orders.id',
        through: {
          from : 'orders_user_product_items.order_id',
          to : 'orders_user_product_items.user_product_item_id',
        },
        to: 'user_product_items.id'
      }
    }
  }
}
