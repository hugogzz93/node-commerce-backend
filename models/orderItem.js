import { Model } from 'objection'

export default class OrderItem extends Model {
  static tableName = 'order_items'
  static jsonSchema = {
    type: 'object',
    required: [
      'order_id',
      'user_product_item_id',
      'price',
      'amount',
    ]
  }

  static relationMappings = {
    order: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/order`,
      join: {
        from: 'order_items.order_id',
        to: 'orders.id'
      }
    },
    userProduct: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/userProducts`,
      join: {
        from: 'order_items.user_product_item_id',
        to: 'user_product_items.id'
      }
    }
  }
}
