import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql';

const ProductType =  new GrophQLObjectType({
  name: 'Product',
  fields: {
    name: {
      type: GraphQLString
    }
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      product: {
        type: ProductType,
        args: {
          id: {
            type: GrophQLInt 
          }
        } 
      }
    }
  })
})
