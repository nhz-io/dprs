/* eslint-disable no-invalid-this, consistent-this */

'use strict'

const OK = Symbol.for('OK')
const RESOLVED = Symbol.for('RESOLVED')

module.exports = class DependencyResolver {
    constructor() {
        this.reset()

        Object.defineProperties(this, {
            unresolvedCount: {
                enumerable: true,
                get: () => this.unresolved().length
            },
            resolvedCount: {
                enumerable: true,
                get: () => this.resolved().length
            },
            allCount: {
                enumerable: true,
                get: () => this.all().length
            },
        })
    }

    add(node, dependencies = []) {
        const {nodes} = this

        nodes[node] = nodes[node] || {}
        nodes[node][OK] = true
        nodes[node][RESOLVED] = false

        dependencies.forEach(dep => {
            nodes[dep] = nodes[dep] || {}
            nodes[node][dep] = nodes[dep]
        })

        return this
    }

    resolvable(node) {
        const {nodes} = this

        if (!nodes[node] || !nodes[node][OK]) {
            return false
        }

        return !Object.keys(nodes[node]).find(key => !nodes[node][key][RESOLVED])
    }

    resolve(node) {
        const {nodes} = this

        if (!this.resolvable(node)) {
            return false
        }
        
        nodes[node][RESOLVED] = true

        return true
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
    }
}
