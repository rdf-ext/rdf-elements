class TreeTraverser {
  constructor ({
    subject,
    predicate,
    object
  }) {
    this.subject = subject
    this.predicate = predicate
    this.object = object
  }

  traverse (tree) {
    this.travsereSubjects([...tree.nodes.values()])
  }

  travsereSubjects (subjects) {
    if (this.subject.filter) {
      subjects = subjects.filter(this.subject.filter)
    }

    if (this.subject.sort) {
      subjects = this.subject.sort(subjects)
    }

    for (const subject of subjects) {
      if (this.subject.start) {
        this.subject.start(subject)
      }

      this.traversePredicates([...subject.predicates.values()])

      if (this.subject.end) {
        this.subject.end(subject)
      }
    }
  }

  traversePredicates (predicates) {
    if (this.predicate.filter) {
      predicates = predicates.filter(this.predicate.filter)
    }

    if (this.predicate.sort) {
      predicates = this.predicate.sort(predicates)
    }

    for (const predicate of predicates) {
      if (this.predicate.start) {
        this.predicate.start(predicate)
      }

      this.traverseObjects([...predicate.objects.values()])

      if (this.predicate.end) {
        this.predicate.end(predicate)
      }
    }
  }

  traverseObjects (objects) {
    if (this.object.filter) {
      objects = objects.filter(this.object.filter)
    }

    if (this.object.sort) {
      objects = this.object.sort(objects)
    }

    if (this.object.start) {
      for (const object of objects) {
        this.object.start(object)
      }
    }
  }
}

export default TreeTraverser
