import { Op } from 'sequelize'

export default class QueryBuilder {
  constructor(raw_query) {
    this._raw_query = raw_query
    this._query = this._raw_query
  }

  addOperation( operation, operationHelper = x => x ) {
    if(!this._query) return this
    this._query = Object.assign( this._query,
      ...Object.keys(this._query)
        .filter(key => key != 'id')
        .map(
          key => ({[key]: { [operation]: operationHelper(this._query[key]) }})
        )
    )
    return this
  }

  iLike() {
    return this.addOperation(Op.iLike, val => `%${val}%`).query
  }

  Or() {
    return this.addOperation(Op.Or).query
  }

  get query() {
    return this._query
  }
}
