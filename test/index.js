/* eslint-disable func-names, no-invalid-this, no-magic-numbers */
const test = require('ava')
const DependencyResolver = require('..')

test('constructor', t => {
    const dprs = new DependencyResolver()

    t.true(dprs instanceof DependencyResolver)
    t.is(dprs.count, 0)
    t.is(dprs.resolved, 0)
    t.is(dprs.unresolved, 0)
    t.deepEqual(dprs.nodes, {})
})

test('add', t => {
    const dprs = new DependencyResolver()

    t.deepEqual(dprs.nodes, {})

    dprs.add('foobar', ['foo', 'bar'])

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    dprs.add('foo', ['bar'])

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    dprs.add('bar')

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    t.deepEqual(JSON.parse(JSON.stringify(dprs.nodes)), {
        foobar: {
            foo: {
                bar: {},
            },
            bar: {},
        },
        foo: {
            bar: {},
        },
        bar: {},
    })
})

test('resolvable', t => {
    const dprs = new DependencyResolver()

    t.deepEqual(dprs.nodes, {})

    dprs.add('foobar', ['foo', 'bar'])
    
    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    dprs.add('foo', ['bar'])

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    dprs.add('bar')

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    t.false(dprs.resolvable('missing'))

    t.true(dprs.resolvable('bar'))

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    t.false(dprs.resolvable('foo'))

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    t.false(dprs.resolvable('foobar'))

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)
})

test('resolve', t => {
    const dprs = new DependencyResolver()

    t.deepEqual(dprs.nodes, {})

    dprs.add('foobar', ['foo', 'bar'])

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    dprs.add('foo', ['bar'])

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    t.false(dprs.resolve('foobar'))    

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    t.false(dprs.resolve('foo'))

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    t.true(dprs.resolve('bar'))

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 2)
    t.is(dprs.resolved, 1)

    dprs.add('bar')

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 3)
    t.is(dprs.resolved, 0)

    t.true(dprs.resolve('bar'))

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 2)
    t.is(dprs.resolved, 1)

    t.false(dprs.resolve('foobar'))

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 2)
    t.is(dprs.resolved, 1)

    t.true(dprs.resolve('foo'))

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 1)
    t.is(dprs.resolved, 2)

    t.true(dprs.resolve('foobar'))    

    t.is(dprs.count, 3)
    t.is(dprs.unresolved, 0)
    t.is(dprs.resolved, 3)
})
