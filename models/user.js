import { Model } from 'objection'
import Product from './product'
import bcrypt from 'bcrypt'

const saltRounds = 10
const encrypt = async string => {
  const salt = await bcrypt.genSalt(saltRounds)
  return  bcrypt.hash(string, salt)
}

export default class User extends Model {
  static tableName = 'users';
  static jsonSchema = {
    type: 'object',
    required: ['name', 'email']
  };


  static relationMappings = {
    products: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/product`,
      join: {
        from: 'users.id',
        through: {
          from: 'users_products.user_id',
          to: 'users_products.product_id'
        },
        to: 'products.id'
      }
    },
    userProducts: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/userProducts`,
      join: {
        from: 'users.id',
        to: 'user_product_items.user_id'
      }
    },
    orderGroups: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/orderGroup`,
      join: {
        from: 'users.id',
        to: 'order_groups.client_id'
      }
    },
    ordersAsClient: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/order`,
      join: {
        from: 'users.id',
        to: 'orders.client_id'
      }
    },
    ordersAsVendor: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/order`,
      join: {
        from: 'users.id',
        to: 'orders.vendor_id'
      }
    },
    createdIssues: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/issue`,
      join: {
        from: 'users.id',
        to: 'issues.creator_id'
      }
    },
    attendingIssues: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/issue`,
      join: {
        from: 'users.id',
        to: 'issues.attendee_id'
      }
    }
  }

  async $beforeInsert(context) {
    if(this.password) {
      this.password_salt = await bcrypt.genSalt(saltRounds)
      this.password = await bcrypt.hash(this.password, this.password_salt)
    }
    return super.$beforeInsert(context)
  };

  async $beforeUpdate(context) {
    if(this.password) {
      this.password_salt = await bcrypt.genSalt(saltRounds)
      this.password = await bcrypt.hash(this.password, this.password_salt)
    }
    return super.$beforeUpdate(context)
  };

  allowsModificationFrom(user) {
    try {
      console.log('allows', user.id == this.id)
      return user.id == this.id
    } catch(e) {
      console.log('error', e)
      return false
    }
  }

  addProduct(product) {
    return this.$relatedQuery('products').relate(product)
  }

  removeProduct(product) {
    return this.$relatedQuery('products').unrelate(product)
  }

}

