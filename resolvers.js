const Query = {
  users: async (_, { userQuery }, { dataSources }) => (
    await dataSources.userApi.getAllUsers( userQuery )
  ),

  products: async (_, { productQuery }, { dataSources }) => (
    await dataSources.productApi.getAllProducts( productQuery )
  )
}

const Mutation = {
  login: async (_, { email }, { dataSources }) => {
    const user = await dataSources.userApi.findOrCreateUser({ email })
    if(user) return new Buffer(email).toString('base64')
  },
  
  createProduct: async (_, input, { dataSources }) => {
    return await dataSources.productApi.createProduct(input);
  },

  createUser: async (_, input, { dataSources }) => {
    // return {name: Object.keys(input.userInput).join(','), email: 'world'}
    return await dataSources.userApi.createUser(input.userInput)
  }
}

export default { Query, Mutation }
