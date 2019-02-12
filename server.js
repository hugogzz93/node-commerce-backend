import { ApolloServer } from 'apollo-server'
import { typeDefs }from './schema'
import resolvers from './resolvers'
import UserApi from './datasources/UserApi'
import ProductApi from './datasources/ProductApi'
import SessionApi from './datasources/SessionApi'
import OrderApi from './datasources/OrderApi'
import UserProductApi from './datasources/UserProductApi'
import IssueApi from './datasources/IssueApi'
import knex from 'knex'
import connection from './knexfile'
import store from './datastore'
import fs from 'fs'
import FileManager from './lib/FileManager'
import express from 'express'

const dataSources = {
  userApi: new UserApi({ store }),
  productApi: new ProductApi({ store }),
  sessionApi: new SessionApi({ store }),
  orderApi: new OrderApi({store}),
  userProductApi: new UserProductApi({store}),
  issueApi: new UserApi({store}),
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
  console.log(`graphql ready at ${url}`)
}) 

const app = express()
 
app.get("/download", async (request, response) => {
  const stream = await FileManager.getFileForUser({
    id: request.query.id,
    fileName: request.query.filename
  }).catch(err => {
    if(error)
      return response.status(500).send(error)
  })

  stream.pipe(response)
});
 
app.listen(3002, () => console.log('express listening on 3002 '))
