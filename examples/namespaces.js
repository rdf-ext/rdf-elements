import rdf from 'rdf-ext'

const ex = rdf.namespace('http://example.org/')
const house = rdf.namespace('https://housemd.rdf-ext.org/')
const rdfns = rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const schema = rdf.namespace('http://schema.org/')

export {
  ex,
  house,
  rdfns as rdf,
  schema
}
