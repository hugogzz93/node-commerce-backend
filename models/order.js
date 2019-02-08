import { Model } from 'objection'
import User from './user'

export default class Order extends Model {
  static tableName = 'orders'
  static jsonSchema = {
    type: 'object',
    required: ['user_id', 'total']
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user`,
      join: {
        from: 'orders.user_id',
        to: 'users.id'
      }
    }, 
    orderItems: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/orderItem`,
      join: {
        from: 'orders.id',
        to: 'order_items.order_id'
      }
    }
  }

  allowsModificationFrom(user) {
    try {
      console.log('allows', user.id == this.user_id)
      return user.id == this.user_id
    } catch(e) {
      console.log('error', e)
      return false
    }
  }
}
