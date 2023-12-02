# rdf-elements

[![build status](https://img.shields.io/github/actions/workflow/status/rdf-ext/rdf-elements/test.yaml?branch=master)](https://github.com/rdf-ext/rdf-elements/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/rdf-elements.svg)](https://www.npmjs.com/package/rdf-elements)

The `rdf-elements` package provides [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) based on [Lit](https://lit.dev/) to handle [RDF/JS](https://rdf.js.org/) data.

See the [examples](https://examples.rdf-ext.org/rdf-elements/) page for more details.

The following libraries have been utilized in this project:

- The `RdfEditor` and `SparqlEditor` components are based on [CodeMirror](https://codemirror.net/) editor.
- Turtle language support for `RdfEditor` is based on [SHACLed Turtle](https://github.com/BruJu/shacled-turtle).
- [SPARQL.js](https://www.npmjs.com/package/sparqljs) takes care of the SPARQL syntax validation.
- The `RdfNetwork` component used [Cytoscape.js](https://js.cytoscape.org/) for the visualization.
