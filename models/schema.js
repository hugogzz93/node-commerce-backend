import knex from 'knex'
import connection from '../knexfile'
import bcrypt from 'bcrypt'
import { Model } from 'objection'

const knexConnection = knex(connection)

Model.knex(knexConnection)


const saltRounds = 10
const encrypt = async string => {
  const salt = await bcrypt.genSalt(saltRounds)
  return  bcrypt.hash(string, salt)
}

class User extends Model {
  static tableName = 'users';
  static jsonSchema = {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    }
  };

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

  // static relationMappings = {
  //   products: {
  //     relation: 
  //   }
  // };
}

export { User }
