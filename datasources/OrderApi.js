import { DataSource } from 'apollo-datasource'

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
    const userProducts = await this.store.UserProduct.query().whereIn('id', input.order_items.map(e => e.user_product_id))
    const total = userProducts.reduce((sum, e) => sum + e.price * input.order_items.find(i => e.id == i.user_product_id).amount, 0)
    console.log('input:', input)
    const order = await this.store.Order.query().insert({user_id: input.user_id, total: total})
    input.order_items.forEach(async orderItemInput => {
      const userProduct = userProducts.find(e => e.id == orderItemInput.user_product_id)
      if(!userProduct) return
      await order.$relatedQuery('orderItems').insert({
        order_id: order.id,
        user_product_item_id: orderItemInput.user_product_id,
        amount: orderItemInput.amount,
        price: userProduct.price
      })
    })
    return order
  }
}
