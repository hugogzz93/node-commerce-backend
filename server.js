import { ApolloServer } from 'apollo-server'
import { typeDefs }from './schema'
import resolvers from './resolvers'
import UserApi from './datasources/UserApi'
import ProductApi from './datasources/ProductApi'

import { createStore } from './datastore'

const store = createStore()

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  dataSources: () => ({
    userApi: new UserApi({ store }),
    productApi: new ProductApi({ store })
  }),
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
  context: async ({req}) => {
    return {}
    // const auth = ( req.headers && req.headers.authorization) || ''
    // const email = new Buffer(auth, 'base64').toString('ascii')
    //
    // const users = await store.users.findOrCreate({ where: { email }})
    // const user = users && users[0] ? users[0] : null
    // return { user: { ...user.dataValues }}
  }
})

server.listen(3001).then(( { url } ) => {
  console.log(`server ready at ${url}`)
}) 
