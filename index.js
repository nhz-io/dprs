/* eslint-disable no-invalid-this, consistent-this */

'use strict'

const OK = Symbol.for('OK')
const RESOLVED = Symbol.for('RESOLVED')

module.exports = class DependencyResolver {
    constructor() {
        this.reset()
    }

    add(node, dependencies = []) {
        const {nodes} = this

        if (nodes[node]) {
            if (nodes[node][RESOLVED]) {
                this.resolvedCount--
                this.unresolvedCount++
            }
        }
        else {
            this.count++
            this.unresolvedCount++
            nodes[node] = {}            
        }

        nodes[node][OK] = true
        nodes[node][RESOLVED] = false

        dependencies.forEach(dep => {
            if (!nodes[dep]) {
                nodes[dep] = {}
                this.count++
                this.unresolvedCount++
            }

            nodes[node][dep] = nodes[dep]

            return node
        })

        return this
    }

    resolvable(node) {
        const {nodes} = this

        if (!nodes[node]) {
            return false
        }

        return !Object.keys(nodes[node]).find(key => !nodes[node][key][RESOLVED])
    }

    resolve(node, dependencies = []) {
        const {nodes} = this

        this.add(node, dependencies)

        if (this.resolvable(node)) {
            nodes[node][RESOLVED] = true
            this.resolvedCount++
            this.unresolvedCount--
        }

        return nodes[node][RESOLVED] && true
    }

    all() {
        return Object.keys(this.nodes)
    }

    resolved() {
        return this.all().filter(node => this.nodes[node][RESOLVED])
    }

    unresolved() {
        return this.all().filter(node => !this.nodes[node][RESOLVED])
    }

    reset() {
        this.nodes = {}
        this.count = 0
        this.resolvedCount = 0
        this.unresolvedCount = 0
    }
}
