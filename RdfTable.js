import { html } from 'lit'
import * as ns from './src/namespaces.js'
import RdfData from './src/RdfData.js'
import style from './src/style.js'
import termElement from './src/termElement.js'
import toTree from './src/toTree.js'

class RdfTable extends RdfData {
  static get properties () {
    return {
      resource: {
        type: Object
      },
      scrollToSubject: {
        type: Boolean,
        default: false
      }
    }
  }

  static get styles () {
    return [style()]
  }

  constructor () {
    super()

    this.subjects = null
  }

  requestUpdate (name, oldValue, options) {
    if (name === 'resource') {
      this.subjects = toTree({ ...this.resource, processList: false })
    }

    return super.requestUpdate(name, oldValue, options)
  }

  render () {
    if (!this.subjects) {
      return html`<div></div>`
    }

    const rows = this.subjects.flatMap(subject => {
      const types = subject.types.map(type => {
        const object = { term: type }
        const predicate = { term: ns.rdf.type }

        return this.renderRow({ object, predicate, subject, type })
      })

      const content = subject.predicates.flatMap(predicate => {
        return predicate.objects.map(object => {
          return this.renderRow({ object, predicate, subject })
        })
      })

      return [...types, ...content]
    })

    return html`<table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th>subject</th>
          <th>predicate</th>
          <th>object</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`
  }

  renderRow ({ object, predicate, subject, type }) {
    const subjectLink = termElement({
      click: () => this.clickSubject({ subject }),
      label: subject.label,
      term: subject.term
    })

    const predicateLink = termElement({
      click: () => this.clickPredicate({ predicate, subject }),
      label: predicate.label,
      term: predicate.term
    })

    let objectLink

    if (type) {
      objectLink = termElement({
        click: () => this.clickType({ subject, type }),
        label: object.label,
        term: object.term
      })
    } else {
      objectLink = termElement({
        click: () => this.clickObject({ object, predicate, subject }),
        label: object.label,
        term: object.term
      })
    }

    return html`
      <tr>
        <td data-subject="${subject.term.toCanonical()}">${subjectLink}</td>
        <td>${predicateLink}</td>
        <td>${objectLink}</td>
      </tr>`
  }
}

export default RdfTable
