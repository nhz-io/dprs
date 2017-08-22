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
                this.resolved--
                this.unresolved++
            }
        }
        else {
            this.count++
            this.unresolved++
            nodes[node] = {}            
        }

        nodes[node][OK] = true
        nodes[node][RESOLVED] = false

        dependencies.forEach(dep => {
            if (!nodes[dep]) {
                nodes[dep] = {}
                this.count++
                this.unresolved++
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

    resolve(node) {
        const {nodes} = this

        if (!nodes[node] || !nodes[node][OK]) {
            this.add(node)
        }

        if (this.resolvable(node)) {
            nodes[node][RESOLVED] = true
            this.resolved++
            this.unresolved--
        }

        return nodes[node][RESOLVED] && true
    }

    reset() {
        this.nodes = {}
        this.count = 0
        this.resolved = 0
        this.unresolved = 0
    }
}
