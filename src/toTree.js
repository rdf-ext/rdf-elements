import { combine, fixed, pageRank, pathDepth, prioritized, sortObjects } from '@rdfjs/score'
import Tree from '@rdfjs/tree'
import * as ns from './namespaces.js'
import TreeTraverser from './TreeTraverser.js'

function compareTerm (a, b) {
  return a.toString().localeCompare(b.toString())
}

function compareTermSort (objects) {
  return objects.sort((a, b) => compareTerm(a.term, b.term))
}

function findLabel (tree, node) {
  if (!node || !node.predicates) {
    return null
  }

  const labels = node.predicates.get(ns.rdfs.label) || node.predicates.get(ns.schema.name)

  if (!labels) {
    return null
  }

  return [...labels.objects.keys()][0].value
}

function findTypes (tree, node) {
  const type = node.predicates.get(ns.rdf.type)

  if (!type) {
    return []
  }

  return [...type.objects.keys()]
}

function toTree ({ dataset, processList, term }) {
  const tree = new Tree(dataset)

  const subjects = []
  let subject
  let predicate

  const subjectSort = subjects => {
    const score = prioritized([
      fixed(term),
      combine.prioritized([pathDepth(), pageRank()])
    ])

    return sortObjects({ objects: subjects, dataset, score })
  }

  const traverser = new TreeTraverser({
    subject: {
      filter: subject => subject.isSubject && !subject.isListItem,
      sort: subjectSort,
      start: node => {
        subject = {
          term: node.term,
          label: findLabel(tree, node),
          types: findTypes(tree, node),
          predicates: []
        }

        subjects.push(subject)
      }
    },
    predicate: {
      filter: predicate => !ns.rdf.type.equals(predicate.term),
      sort: compareTermSort,
      start: node => {
        predicate = {
          term: node.term,
          objects: []
        }

        subject.predicates.push(predicate)
      }
    },
    object: {
      filter: object => !object.isListItem || object.isListRoot,
      sort: compareTermSort,
      start: object => {
        const objects = predicate.objects

        if (object.isListRoot) {
          if (processList) {
            predicate.type = 'orderedList'

            for (const itemNode of object.items) {
              objects.push({
                term: itemNode.item.term,
                label: findLabel(tree, itemNode)
              })
            }
          } else {
            for (const itemNode of object.items) {
              objects.push({
                term: itemNode.term,
                label: findLabel(tree, itemNode)
              })
              objects.push({
                term: itemNode.item.term,
                label: findLabel(tree, itemNode)
              })
            }

            objects.push({
              term: ns.rdf.nil,
              label: 'nil'
            })
          }
        } else {
          if (objects.length > 0) {
            predicate.type = 'list'
          } else {
            predicate.type = 'single'
          }

          objects.push({
            term: object.term,
            label: findLabel(tree, object)
          })
        }
      }
    }
  })

  traverser.traverse(tree)

  return subjects
}

export default toTree
