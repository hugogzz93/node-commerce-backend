const Query = {
  users: async (_, { query = {} }, { dataSources: { userApi} }) => (
    await userApi.query().where(query)
  ),

  products: async (_, { query }, { dataSources: { productApi }}) => (
    await productApi.query().where(builder => (
      query && query.id ? builder.where({id: query.id}) : builder
    )).andWhere(builder => (
      query && query.name ? builder.where('name', 'ilike', `%${query.name}%`) : builder
    ))
  ),

  loginJWT: async (_, { auth_token }, { dataSources }) => (
    await dataSources.sessionApi.findByAuthToken(auth_token)
  )
}

const Mutation = {
  login: async (_, { email, password }, { dataSources }) => {
    return await dataSources.sessionApi.login({email, password})
  },

  createProduct: async (_, {productInput}, { dataSources }) => {
    return await dataSources.productApi.create(productInput);
  },

  createUser: async (_, { userInput }, { dataSources }) => {
    return await dataSources.userApi.create(userInput)
  },

  user: async (_, {id}, { dataSources: {userApi} }) => (
    await userApi.query().where({id}).first()
  ),

  product: async (_, {id}, { dataSources: {productApi} }) => (
    await productApi.query().where({id}).first()
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
  products: async (user, {productQuery = {}}) => {
    const {id = null, ...query} = productQuery;
    if(id)
      productQuery.product_id = id
    return await user.$relatedQuery('products').where(query)
  }
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
  removeProducts: async (user, {ids}, dataSources) => {
    await user.$relatedQuery('products').unrelate().whereIn('products.id', ids)
    const pids = await user.$relatedQuery('products').then(p => p.map(e => e.id))
    return ids.filter(id => !pids.includes(id))
  },
  updateUser: async (user, {input}, { dataSources: { userApi }, viewer}) => {
    if(user.allowsModificationFrom(viewer))
      return await userApi.query().patchAndFetchById(user.id, input)
    else
      return null
  }
}

const ProductOps = {
  updateProduct: async (product, {input}, {dataSources: {productApi}, viewer}) => {
    if(product.allowsModificationFrom(viewer))
      return await productApi.query().patchAndFetchById(product.id, input)
    else
      return null
  }
}

export default { Query, Mutation, Product, User, UserOps, ProductOps }
