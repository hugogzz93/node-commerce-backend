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
  }
})

server.listen(3001).then(( { url } ) => {
  console.log(`server ready at ${url}`)
}) 
