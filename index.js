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
            this.allCount++
            this.unresolvedCount++
            nodes[node] = {}            
        }

        nodes[node][OK] = true
        nodes[node][RESOLVED] = false

        dependencies.forEach(dep => {
            if (!nodes[dep]) {
                nodes[dep] = {}
                this.allCount++
                this.unresolvedCount++
            }

            nodes[node][dep] = nodes[dep]

            return node
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
        this.resolvedCount++
        this.unresolvedCount--

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
        this.allCount = 0
        this.resolvedCount = 0
        this.unresolvedCount = 0
    }
}
