import { ApolloServer } from 'apollo-server'
import { typeDefs }from './schema'
import resolvers from './resolvers'
import UserApi from './datasources/UserApi'
import ProductApi from './datasources/ProductApi'
import SessionApi from './datasources/SessionApi'
import knex from 'knex'
import connection from './knexfile'
import store from './datastore'
import fs from 'fs'
import FileManager from './lib/FileManager'
import express from 'express'

const dataSources = {
  userApi: new UserApi({ store }),
  productApi: new ProductApi({ store }),
  sessionApi: new SessionApi({ store })
}

// var data = fs.readFileSync('/Users/hugo/Desktop/Test.png');
// FileManager.uploadFile({bucket: 'halo', filename: 'dacara', file: data}).then(suc => console.log('added:', suc))

// const bucket = 'test'
// minioClient.makeBucket(bucket, 'us-east-1', function(err) {
//   if (err) return console.log('Error creating bucket.', err)
//   console.log('Bucket created successfully in "us-east-1".')
// })

// var data = fs.readFileSync('/Users/hugo/Desktop/Test.png');
// minioClient.putObject(bucket, 'hello-file', data, function(err, etag) {
//   return console.log(err, etag) // err should be null
// })


// store.User.query().patch({password: 'test'})
//                   .then(res => console.log('tets0a'))
//                   .catch(err => console.log('err', err))

// store.User.query({id: 1}).then(us => {
//   console.log(us)
// })

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
