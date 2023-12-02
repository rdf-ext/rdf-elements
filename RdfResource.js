import { html } from 'lit'
import RdfData from './src/RdfData.js'
import style from './src/style.js'
import termElement from './src/termElement.js'
import toTree from './src/toTree.js'

class RdfResource extends RdfData {
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
      this.subjects = toTree({ ...this.resource, processList: true })
    }

    return super.requestUpdate(name, oldValue, options)
  }

  render () {
    if (!this.subjects) {
      return html`<div></div>`
    }

    return this.subjects.map(subject => this.renderSubject({ subject }))
  }

  renderObjects ({ predicate, subject }) {
    if (predicate.type === 'single') {
      const object = predicate.objects[0]

      return termElement({
        click: () => this.clickObject({ object, predicate, subject }),
        label: object.label,
        term: object.term
      })
    }

    if (predicate.type === 'orderedList') {
      if (predicate.objects.length === 0) {
        return html`<p class="fst-italic">empty list</p>`
      }

      const links = predicate.objects.map(object => {
        const link = termElement({
          click: () => this.clickObject({ object, predicate, subject }),
          label: object.label,
          term: object.term
        })

        return html`<li>${link}</li>`
      })

      return html`<ol>${links}</ol>`
    }

    if (predicate.type === 'list') {
      const links = predicate.objects.map(object => {
        const link = termElement({
          click: () => this.clickObject({ object, predicate, subject }),
          label: object.label,
          term: object.term
        })

        return html`<li>${link}</li>`
      })

      return html`<ul>${links}</ul>`
    }
  }

  renderPredicate ({ predicate, subject }) {
    return html`
      <tr>
        <td>
          ${termElement({ term: predicate.term, click: () => this.clickPredicate({ predicate, subject }) })}
        </td>
        <td>
          ${this.renderObjects({ predicate, subject })}
        </td>
      </tr>
    `
  }

  renderSubject ({ subject }) {
    return html`
      <table data-subject="${subject.term.toCanonical()}" class="table table-bordered" style="table-layout: fixed;">
        <thead>
          <tr>
            <th>
              ${termElement({ term: subject.term, label: subject.label, click: () => this.clickSubject({ subject }) })}
            </th>
            <th>
              ${subject.types.map(type => termElement({ term: type, click: () => this.clickType({ subject, type }) }))}
            </th>
          </tr>
        </thead>
        <tbody>
          ${subject.predicates.map(predicate => this.renderPredicate({ predicate, subject }))}
        </tbody>
      </table>
    `
  }
}

export default RdfResource
