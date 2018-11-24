import express from 'express'
// import { graphqlHTTP } from 'express-graphql'
import  graphqlHTTP from 'express-graphql'
// const graphqlHTTP = require('express-graphql')
//
import schema from './schema'

const app = express()

app.listen(4000)
console.log(graphqlHTTP)
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))
console.log('listening...')
