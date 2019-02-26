import { Model } from 'objection'

export default class TrackingNumber extends Model {
  static tableName = 'tracking_numbers'
  static jsonSchema = {
    type: 'object',
    required: ['value']
  }

  static relationMappings = {
    order: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/order`,
      join: {
        from: 'tracking_numbers.order_id',
        to: 'orders.id'
      }
    }
  }

  $beforeInsert() {
    this.updatedAt = new Date()
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}
