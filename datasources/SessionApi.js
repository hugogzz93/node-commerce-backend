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
    const user = await this.store.User.query().where({email}).first()
    if(!user) return null

    const match = await bcrypt.compare(password, user.password);
    if(!match) return null

    const auth_token = await this.getNewAuthTokenFor(user)
    return await user.constructor.query()
                                 .patchAndFetchById(user.id, {auth_token})
  }

  async logout({auth_token}) {
    const user = await this.store.User.query().where({email}).first()
    if(!user) return false

    await user.constructor.query().patchAndFetchById(user.id, {auth_token: null})
  }

  findByAuthToken(auth_token) {
    if(auth_token)
      return this.store.User.query().where({auth_token}).first()
    else
      null
  }

  getNewAuthTokenFor(user) {
    return bcrypt.hash(`user:${user.id}${new Date()}`, 1)
  }
}

