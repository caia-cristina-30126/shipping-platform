import { makeSchema } from 'nexus'
import path from 'path'
import * as allTypes from './resolvers' 

export const schema = makeSchema({
  types: allTypes,
  outputs: {
   schema: path.resolve(__dirname, './schema.graphql'), 
    typegen: path.resolve(__dirname, '/generated/nexus.ts'),
  },
    contextType: {                                    
    module: path.join(__dirname, "../context"),        
    export: "Context",                              
  },
})