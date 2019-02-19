import { Model, transaction } from 'objection'

export default class OrderGroup extends Model {
  static tableName = 'order_groups'
  static jsonSchema = {
    type: 'object',
    required: ['client_id']
  }

  static relationMappings = {
    client: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user`,
      join: {
        from: 'order_groups.client_id',
        to: 'users.id'
      }
    },
    orders: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/order`,
      join: {
        from: 'order_groups.id',
        to: 'orders.order_group_id'
      }
    }
  }

  async $beforeInsert(context) {
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  async $beforeUpdate(context) {
    this.updatedAt = new Date()
  }

  async getTotal() {
    let sum = 0
    const orders = await this.$relatedQuery('orders')
    for(const order of orders) {
      const total = await order.getTotal()
      sum += total
    }
    return sum
  }
}
