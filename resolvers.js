const Query = {
  users: async (_, { userQuery }, { dataSources }) => (
   await dataSources.userApi.where( userQuery )
  ),

  products: async (_, { userQuery, ...productQuery }, { dataSources }) => (
    await dataSources.productApi.like( productQuery )
                                .include({users: userQuery})
                                .runQuery()
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

  updateUser: async (_, input, { dataSources, token }) => {
    return await dataSources.userApi.updateUser(input.userQuery,
                                                input.userInput,
                                                {auth_token: token})
  },
  updateUserProducts: async (_, input, {dataSources: {userApi, productApi}, token }) => {
    try {
      const user = await userApi.find({auth_token: token})
      const addedProducts = await productApi.where(input.productAdditions)
      const removedProducts = await productApi.where(input.productRemovals)
      await user.addProducts(addedProducts)
      await user.removeProducts(removedProducts)
      return await user.getProducts()
    } catch(e) {
      return e
    }
  }
}

export default { Query, Mutation }
