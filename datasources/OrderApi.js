import { DataSource } from 'apollo-datasource'
import { transaction } from 'objection'

export default class OrderAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  query() {
    return this.store.User.query()
  }

  async create(input) {
    return await transaction(this.store.Order.knex(), async trx => {
      const userProducts = await this.store.UserProduct.query(trx).whereIn('id', input.order_items.map(e => e.user_product_id))
      const total = userProducts.reduce((sum, e) => sum + e.price * input.order_items.find(i => e.id == i.user_product_id).amount, 0)
      const order = await this.store.Order.query(trx).insert({user_id: input.user_id, total: total})

      for ( const itemInput of input.order_items ) {
        const userProduct = userProducts.find(e => e.id == itemInput.user_product_id)
        if(!userProduct) throw 'userProduct not found'
        await order.$relatedQuery('orderItems', trx).insert({
          order_id: order.id,
          user_product_item_id: itemInput.user_product_id,
          amount: itemInput.amount,
          price: userProduct.price
        })
      }
      return order
    })
  }
}
