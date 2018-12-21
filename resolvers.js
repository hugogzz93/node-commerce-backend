const Query = {
  users: async (_, { userQuery }, { dataSources }) => (
    await dataSources.userApi.where( userQuery )
  ),

  products: async (_, { productQuery }, { dataSources }) => (
    await dataSources.productApi.getAllProducts( productQuery )
  ),

  loginJWT: async (_, { auth_token }, { dataSources }) => (
    await dataSources.sessionApi.findByAuthToken(auth_token)
  )
}

const Mutation = {
  login: async (_, { email, password }, { dataSources }) => {
    return await dataSources.sessionApi.login({email, password})
  },
  
  createProduct: async (_, input, { dataSources }) => {
    return await dataSources.productApi.createProduct(input);
  },

  createUser: async (_, input, { dataSources }) => {
    return await dataSources.userApi.createUser(input.userInput)
  },

  updateUser: async (_, input, { dataSources }) => {
    return await dataSources.userApi.updateUsers(input.userQuery,
                                                 input.userInput,
                                                 input.viewer)
  }
}

export default { Query, Mutation }
