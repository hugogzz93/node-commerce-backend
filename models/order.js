import { Model, transaction } from 'objection'
import Issue from './issue'

export default class Order extends Model {
  static tableName = 'orders'
  static jsonSchema = {
    type: 'object',
    required: ['vendor_id', 'client_id', 'order_group_id']
  }

  static relationMappings = {
    client: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user`,
      join: {
        from: 'orders.client_id',
        to: 'users.id'
      }
    }, 
    vendor:{
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user`,
      join: {
        from: 'orders.vendor_id',
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
    },
    orderGroup: {
      relation :Model.BelongsToOneRelation,
      modelClass: `${__dirname}/orderGroup`,
      join: {
        from: 'orders.order_group_id',
        to: 'order_groups.id'
      }
    }
  }

  allowsModificationFrom(user) {
    try {
      console.log('allows', user.id == this.vendor_id)
      return user.id == this.vendor_id
    } catch(e) {
      console.log('error', e)
      return false
    }
  }

  async createIssue(input) {
    return await Issue.query().insertGraph(input)
  }

  async $beforeInsert(context) {
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  async $beforeUpdate(context) {
    this.updatedAt = new Date()
  }

  async getTotal() {
    const orderItems = await this.$relatedQuery('orderItems')
    return orderItems.reduce((sum, e) => sum + e.price * e.amount, 0)
  }
}
