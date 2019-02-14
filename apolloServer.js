import { ApolloServer } from 'apollo-server'
import { typeDefs }from './schema'
import resolvers from './resolvers'
import Store, { dataSources } from './datastore'

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
  console.log(`apollo ready at ${url}`)
}) 



