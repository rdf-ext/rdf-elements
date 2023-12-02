import rdf from 'rdf-ext'

const rdfns = rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const rdfs = rdf.namespace('http://www.w3.org/2000/01/rdf-schema#')
const schema = rdf.namespace('http://schema.org/')

export {
  rdfns as rdf,
  rdfs,
  schema
}
