import { Model } from 'objection'
import bcrypt from 'bcrypt'

export default class Product extends Model {
  static tableName = 'products'
  static jsonSchema = {
    type: 'object',
    required: ['name']
  }

  static relationMappings = {
    userProducts: {
      relation: Model.HasManyRelation, 
      modelClass: `${__dirname}/userProduct`,
      join: {
        from: 'products.id',
        to: 'user_product_items.product_id',
      }
    }
  }


  async userProductDeletionValridations(context) {
    const userProducts = await this.$relatedQuery('userProducts').eager('orderItems')
    if(userProducts.some(e => e.orderItems.length))
      throw new objection.ValidationError({
        message: "products that are part of orders can't be erased without migrating items to another product ",
        type: 'dependent relation',
        data: {
          product: this.id
        }
      })
  }

  async $beforeDelete(context) {
    await this.userProductDeletionValidations(context)
  }

  allowsModificationFrom(user) {
    return true
  }
}
