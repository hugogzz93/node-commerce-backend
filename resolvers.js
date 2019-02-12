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

  loginJWT: (_, { auth_token }, { dataSources }) => (
    dataSources.sessionApi.findByAuthToken(auth_token)
  )
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
  users: async (product, {query = {}}) => {
    const {id = null, ...userQuery} = query
    if(id)
      userQuery.user_id = id
    return await product.$relatedQuery('users').where(userQuery)
  }
}

const User = {
  products: (user, {productQuery = {}}) => {
    const {id = null, ...query} = productQuery;
    if(id)
      query.product_id = id
    return user.$relatedQuery('products').where(query)
  },
  userProducts: (user, {query}) => {
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
    const {stream, filename, mimetype, encoding} = await image
    return await FileManager
      .uploadFileForUser({id: user.id, filename, file: stream  })
      .then(async ref => {
        return await user.$relatedQuery('userProducts').insert({user_id: user.id, product_id: product_id, name, image: filename, price})
      })
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

const UserProductOps = {
  update: (userProduct, { input }, { dataSources }) => {
    userProduct
  }
}

const OrderViewer = {
  createdOrders: (user, { query = {} } ) => (
    user.$relatedQuery('orders').where(query)
  )
}

const Order = {
  orderItems: (order, {ids = null}) => (
    order.$relatedQuery('orderItems').where(builder =>
      ids ? builder.whereIn('id', ids) : builder
    )
  ),
  user: (order) => (
    order.$relatedQuery('user')
  )
}

const OrderItem = {
  userProduct: (orderItem) => (
    orderItem.$relatedQuery('userProduct')
  )
}

const OrderOps = {
  createOrder: (_, {input}, { dataSources: { orderApi } }) => (
    orderApi.create(input)
  ),
  updateOrder: (order, {input}, {dataSources: {orderApi}}, { viewer }) => {
    if(order.allowsModificationFrom(viewer))
      return orderApi.query().patchAndFetchById(ordor.id, input)
    else
      return null
  },
  createIssue: (order, {input}) => {
    return order.createIssue(input)
  }
}

const Issue = {
  messages: (issue, _, { dataSources: { issueApi}}, { viewer }) => {
    return issue.$relatedQuery('messages')
  }
}

export default { 
   Query,
   Mutation,
   Product,
   User,
   UserOps,
   ProductOps,
   Order,
   OrderOps,
   OrderViewer,
   OrderItem,
   Issue,
 }
