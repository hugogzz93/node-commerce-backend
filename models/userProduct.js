import { Model } from 'objection'
import User from './user'

export default class UserProduct extends Model {
  static tableName = 'user_product_items'
  static jsonSchema = {
    type: 'object',
    required: ['user_id', 'product_id', 'name', 'price']
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user`,
      join: {
        from: 'user_product_items.user_id',
        to: 'users.id'
      }
    },
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/product`,
      join: {
        from: 'user_product_items.product_id',
        to: 'products.id'
      }
    },
    orderItems: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/orderItem`,
      join: {
        from: 'user_product_items.id',
        to: 'order_items.user_product_item_id'
      }
    }
  }

  async $beforeDelete(context) {
    await this.orderItemsBeforeDeletion(context)
  }

  async orderItemsBeforeDeletion(context) {
    const orderItems = this.relatedQuery('orderItems', context.trx)
    if(orderItems.length)
      throw new objection.ValidationError({
        message: "userProduct can't be deleted if it has orders, only archived",
        data: {
          userProduct: this.id,
          orderItems: orderItems.map(e => e.id)
        }
      })
  }
}
