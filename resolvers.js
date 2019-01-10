const Query = {
  users: async (_, { userQuery }, { dataSources: { userApi} }) => (
    await userApi.query().where({...userQuery})
  ),

  products: async (_, { productQuery }, { dataSources: { productApi }}) => (
    await productApi.query().where(builder => (
      productQuery && productQuery.id ? builder.where({id: productQuery.id}) : builder
    )).andWhere(builder => (
      productQuery && productQuery.name ? builder.where('name', 'ilike', `%${productQuery.name}%`) : builder
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
  users: async (product, {userQuery = {}}) => {
    const {id = null, ...query} = userQuery
    if(id)
      query.user_id = id
    return await product.$relatedQuery('users').where(query)
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
  addProducts: async (user, {ids}, {dataSources: {userApi, ProductApi}}) => (
    (await user.$relatedQuery('products').relate(ids) ).length
  ),
  removeProducts: async (user, {ids}, dataSources) => (
    await user.$relatedQuery('products').unrelate().whereIn('products.id', ids)
  ),
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
