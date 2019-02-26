import FileManager from './lib/FileManager'

const Query = {
  users: (_, { query = {} }, { dataSources: { userApi} }) => (
    userApi.query().where(query)
  ),

  products: (_, { query }, { dataSources: { productApi }}) => (
    productApi.query().where(builder => (
      query && query.id ? builder.where({id: query.id}) : builder
    )).andWhere(builder => (
      query && query.name ? builder.where('name', 'ilike', `%${query.name}%`) : builder
    ))
  ),

  userProducts: (_, { ids }, { dataSources }) => (
    dataSources.userProductApi.query().where(builder => (
      ids ? builder.whereIn('id', ids) : builder
    ))
  ),

  orders: (_, { ids }, { dataSources: { orderApi }}) => (
    orderApi.query().where(builder => (
      ids ? builder.whereIn('id', ids) : builder
    ))
  ),

  orderGroups: (_, { ids }, { dataSources: { orderApi }}) => (
    orderApi.orderGroupQuery().where(builder => (
      ids ? builder.whereIn('id', ids) : builder
    ))
  ),

  issues: (_, { ids }, { dataSources: { issueApi}}) => (
    issueApi.query().where(builder => (
      ids ? builder.whereIn('id', ids) : builder
    ))
  ),

  loginJWT: (_, { auth_token }, { dataSources }) => (
    dataSources.sessionApi.findByAuthToken(auth_token)
  ),
}

const Mutation = {
  login: (_, { email, password }, { dataSources }) => (
    dataSources.sessionApi.login({email, password})
  ),

  logout: (_, { auth_token }, { dataSources }) => (
    dataSources.sessionApi.logout({auth_token})
  ),

  createProduct: (_, {productInput}, { dataSources }) => (
    dataSources.productApi.create(productInput)
  ),

  createUser: (_, { userInput }, { dataSources }) => (
    dataSources.userApi.create(userInput)
  ),

  user: (_, {id}, { dataSources: {userApi} }) => (
    userApi.query().where({id}).first()
  ),

  product: (_, {id}, { dataSources: {productApi} }) => (
    productApi.query().where({id}).first()
  ),

  order: (_, { id }, { dataSources: { orderApi }}) => (
    id ? orderApi.query().where({id}).first() : {}
  ),
}

const Product = {
  users: (product, { query = {} }, { dataSources }) => {
    const userQuery = Object.assign({}, ...Object.keys(query).map(e => ({['users.' + e]: query[e]})))
    return dataSources.userApi.query()
     .join('user_product_items', 'users.id', '=', 'user_product_items.user_id')
     .where('user_product_items.product_id', product.id)
     .where(userQuery)
      .distinct(product.constructor.knex().raw('ON (users.id) users.*'))
  }
}

const User = {
  products: (user, { query = {} }, { dataSources }) => {
    const productQuery = Object.assign({}, ...Object.keys(query).map(e => ({['products.' + e]: query[e]})))
    return dataSources.productApi.query()
      .join('user_product_items', 'products.id',  '=', 'user_product_items.product_id')
      .where('user_product_items.user_id', user.id)
      .where(productQuery)
      .distinct(user.constructor.knex().raw('ON (products.id) products.*'))
  },
  userProducts: (user, {query = {}}) => {
    return user.$relatedQuery('userProducts').where(query)
  },
  orders: (user, {query = null}) => (
    user
  )
}

const UserOps = {
  addProducts: (user, {ids}, {dataSources: {userApi, ProductApi}}) => (
    user.$relatedQuery('products').relate(ids).then( async () =>
      user.$relatedQuery('products')
          .whereIn('products.id', ids)
          .select('products.id')
          .map(p => p.id)
    )
  ),
  removeProducts: async (user, {ids}, {dataSources}) => {
    await user.$relatedQuery('products').unrelate().whereIn('products.id', ids)
    const pids = await user.$relatedQuery('products').then(p => p.map(e => e.id))
    return ids.filter(id => !pids.includes(id))
  },
  updateUser: (user, {input}, { dataSources: { userApi }, viewer}) => {
    if(user.allowsModificationFrom(viewer))
      return userApi.query().patchAndFetchById(user.id, input)
    else
      return null
  },
  createUserProduct: async (user, { input: {product_id, name, price, image} }, {dataSources}) => {
    if(image) {
      const {stream, filename, mimetype, encoding} = await image
      return await FileManager
        .uploadFileForUser({id: user.id, filename, file: stream  })
        .then(async ref => {
          return await user.$relatedQuery('userProducts').insert({user_id: user.id, product_id: product_id, name, image: filename, price})
        })
    } else {
      return await user.$relatedQuery('userProducts').insert({user_id: user.id, product_id: product_id, name, price})
    }
  },
  updateUserProduct: async (user, { input: {id, image, ..._input} }, { dataSources }) => {
    if(image) {
      user.$relatedQuery('userProducts').where({id: id}).select('image')
          .then(([userProduct]) => FileManager.removeFileForUser({id: user.id, filename: userProduct.image}))
      const {stream, filename, mimetype, encoding} = await image
      console.log('filename', filename)
      await FileManager.uploadFileForUser({id: user.id, filename, file: stream})
      return await user.$relatedQuery('userProducts').patchAndFetchById(id, {..._input, image: filename})
    }
    return await user.$relatedQuery('userProducts').patchAndFetchById(id, {..._input})
  }
}

const ProductOps = {
  updateProduct: (product, {input}, {dataSources: {productApi}, viewer}) => {
    if(product.allowsModificationFrom(viewer))
      return productApi.query().patchAndFetchById(product.id, input)
    else
      return null
  }
}

const UserProduct = {
  user: (userProduct) => (
    userProduct.$relatedQuery('user')
  )
}

const UserOrderViewer = {
  orderGroups: (user, { query = {}}, {dataSources}) => (
    user.$relatedQuery('orderGroups').where(query)
  ),
  ordersAsClient: (user, { query = {} } ) => (
    user.$relatedQuery('ordersAsClient').where(query)
  ),
  ordersAsVendor: (user, { query = {}}, { dataSources }) => (
    user.$relatedQuery('ordersAsVendor').where(query)
  )
}

const OrderGroup = {
  orders: (orderGroup) => (
    orderGroup.$relatedQuery('orders')
  ),
  client: (orderGroup) => (
    orderGroup.$relatedQuery('client')
  ),
  total: (orderGroup) => (
    orderGroup.getTotal()
  )
}

const Order = {
  orderItems: (order, {ids = null}) => (
    order.$relatedQuery('orderItems').where(builder =>
      ids ? builder.whereIn('id', ids) : builder
    )
  ),
  client: (order) => (
    order.$relatedQuery('client')
  ),
  vendor: (order) => (
    order.$relatedQuery('vendor')
  ),
  total: (order) => (
    order.getTotal()
  ),
  issues: (order, {query}) => (
    order.$relatedQuery('issues').where({...query})
  ),
  trackingNumbers: (order) => (
    order.$relatedQuery('trackingNumbers')
  ),
}

const OrderItem = {
  userProduct: (orderItem) => (
    orderItem.$relatedQuery('userProduct')
  ),
}

const OrderOps = {
  createOrderGroup: (_, {input}, { dataSources: { orderApi }}) => (
    orderApi.createOrderGroup(input)
  ),
  createOrder: (_, {input}, { dataSources: { orderApi } }) => (
    orderApi.create(input)
  ),
  updateOrder: (order, {input}, {dataSources: {orderApi}}, { viewer }) => {
    if(order.allowsModificationFrom(viewer))
      return orderApi.query().patchAndFetchById(order.id, input)
    else
      return null
  },
  createIssue: async (order, {input}) => (
    await order.$relatedQuery('issues').insertGraph(input)
  ),
  trackingNumber: async (order, { id = null }) => {
    const number = await order.$relatedQuery('trackingNumbers').where({id}).first()
    return { order, number }
  }
}

const OrderTrackingNumberOps = {
  create: async ({order}, {input}) => (
    await order.$relatedQuery('trackingNumbers').insert(input)
  ),
  update: async ({number}, { input }) => (
    await number.$query().patchAndFetchById(number.id, input)
  ),
  delete: async ({number}) => {
    const status = await number.$query().delete().where({id: number.id})
    return !!status
  }
}

const Issue = {
  messages: (issue, _, { dataSources: { issueApi}}) => (
    issue.$relatedQuery('messages')
  ),
  newMessages: async (issue, { user_id }, { dataSources }) => {
    const lastMessage = await issue.getLastMessage()
    if(!lastMessage) return false
    const user = await dataSources.userApi.query().where({id: user_id}).first()
    const lastSeenMessageRecord = await user.$relatedQuery('last_seen_messages').where({issue_id: issue.id}).first()
    if(!lastSeenMessageRecord) return true
    console.log('lsm', lastSeenMessageRecord.issue_message_id, lastMessage.id)
    return lastSeenMessageRecord.issue_message_id != lastMessage.id
  }
}

const IssueMessage = {
  author: ( message, _, { dataSources: { userApi }}) => (
    userApi.query().where({id: message.author_id}).first()
  )
}

export default { 
   Query,
   Mutation,
   Product,
   User,
   Order,
   OrderGroup,
   UserProduct,
   UserOps,
   ProductOps,
   OrderOps,
   OrderTrackingNumberOps,
   UserOrderViewer,
   OrderItem,
   Issue,
   IssueMessage,
 }
