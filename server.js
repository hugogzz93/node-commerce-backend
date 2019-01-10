import { ApolloServer } from 'apollo-server'
import { typeDefs }from './schema'
import resolvers from './resolvers'
import UserApi from './datasources/UserApi'
import ProductApi from './datasources/ProductApi'
import SessionApi from './datasources/SessionApi'
import knex from 'knex'
import connection from './knexfile'
import store from './datastore'

const dataSources = {
  userApi: new UserApi({ store }),
  productApi: new ProductApi({ store }),
  sessionApi: new SessionApi({ store })
}

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  dataSources: () => dataSources,
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
  context: async ({req}) => {
    const token = req.headers.authorization || ''
    const viewer = await dataSources.sessionApi.findByAuthToken(token)
    return { viewer }
  }
})

server.listen(3001).then(( { url } ) => {
  console.log(`server ready at ${url}`)
}) 
