import { DataSource } from 'apollo-datasource'
import { Op } from 'sequelize'
import bcrypt from 'bcrypt'

export default class SessionApi extends DataSource {
  constructor({store}) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async login({email, password}) {
    let user = await this.store.User.find({where: {email}})
    if(!user) return null

    const match = await bcrypt.compare(password, user.dataValues.password);
    if(!match) return null

    return await this.setNewAuthToken(user)
  }

  async setNewAuthToken(user) {
    const auth_token = await bcrypt.hash(`user:${user.id}${new Date()}`, 1)
    return await user.update({auth_token})
  }
}

