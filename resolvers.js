const Query = {
  me: async (_,__,{ dataSources }) => {
    return await dataSources.userApi.findOrCreate()
  }, 
  users: async (_, __, { dataSources }) => {
    return await dataSources.userApi.getAllUsers()
  },

  products: async (_, __, { dataSources }) => {
    return await dataSources.productApi.getAllProducts()
  }
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
