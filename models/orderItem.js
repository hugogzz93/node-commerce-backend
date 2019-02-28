import objection, { Model } from 'objection'
import Store from '../datastore'

export default class OrderItem extends Model {
  static tableName = 'order_items'
  static jsonSchema = {
    type: 'object',
    required: [
      'order_id',
      'user_product_item_id',
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

  async validateItemVendorSameAsOrderVendor(userProduct, context) {
    const order = await this.$relatedQuery('order', context.trx)
    if(userProduct.user_id != order.vendor_id)
      throw new objection.ValidationError({
        message: 'orderItems have to be from the same vendor as the order vendor',
        type: 'custom relation error',
        data: {
          itemVendorId: userProduct.user_id,
          orderVendorId: order.vendor_id
        }
      })
  }

  async setSamePriceAsUserProduct(userProduct) {
    this.price = userProduct.price
  }

  validateItemStock(userProduct) {
    if(userProduct.stock < this.amount)
      throw new objection.ValidationError({
        message: 'orderItem amount exceeds available stock',
        type: 'InsufficientStock',
        data: {
          stock: userProduct.stock,
          amount: this.amount,
          userProductId: userProduct.id
        }
      })
  }

  async userProductHooks(orderItem, context) {
    const userProduct = await orderItem.$relatedQuery('userProduct')
    return Promise.all([
      orderItem.validateItemVendorSameAsOrderVendor(userProduct, context),
      orderItem.validateItemStock(userProduct, context),
      orderItem.setSamePriceAsUserProduct(userProduct, context)
    ])
  }

  $beforeInsert(context) {
    return Promise.all([
      this.userProductHooks(this, context),
      async () => await this.$relatedQuery('userProduct').then(up => {this.price = up.price; console.log('price', this.price)})
    ])
  }
}
