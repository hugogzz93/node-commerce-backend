import { ApolloServer } from 'apollo-server'
import { typeDefs }from './schema'
import resolvers from './resolvers'
import UserApi from './datasources/UserApi'
import ProductApi from './datasources/ProductApi'
import SessionApi from './datasources/SessionApi'
import { createStore } from './datastore'

const store = createStore()
// store.User.findAll().then(async r => {
//   r.forEach(r => r.update({password: 'test'}))
// })

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  dataSources: () => ({
    userApi: new UserApi({ store }),
    productApi: new ProductApi({ store }),
    sessionApi: new SessionApi({ store })
  }),
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
  context: ({req}) => {
    const token = req.headers.authorization || ''
    return { token }
  }
})

server.listen(3001).then(( { url } ) => {
  console.log(`server ready at ${url}`)
}) 
