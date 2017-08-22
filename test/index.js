/* eslint-disable func-names, no-invalid-this, no-magic-numbers */
const test = require('ava')
const DependencyResolver = require('..')

test('constructor', t => {
    const dprs = new DependencyResolver()

    t.true(dprs instanceof DependencyResolver)
    t.is(dprs.allCount, 0)
    t.is(dprs.resolvedCount, 0)
    t.is(dprs.unresolvedCount, 0)
    t.deepEqual(dprs.nodes, {})
})

test('add', t => {
    const dprs = new DependencyResolver()

    t.deepEqual(dprs.nodes, {})

    dprs.add('foobar', ['foo', 'bar'])

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    dprs.add('foo', ['bar'])

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    dprs.add('bar')

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

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
    
    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    dprs.add('foo', ['bar'])

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    dprs.add('bar')

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    t.false(dprs.resolvable('missing'))

    t.true(dprs.resolvable('bar'))

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    t.false(dprs.resolvable('foo'))

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    t.false(dprs.resolvable('foobar'))

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)
})

test('resolve', t => {
    const dprs = new DependencyResolver()

    t.deepEqual(dprs.nodes, {})

    dprs.add('foobar', ['foo', 'bar'])

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    dprs.add('foo', ['bar'])

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    t.false(dprs.resolve('foobar'))    

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    t.false(dprs.resolve('foo'))

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    t.false(dprs.resolve('bar'))

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    dprs.add('bar')

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 3)
    t.is(dprs.resolvedCount, 0)

    t.true(dprs.resolve('bar'))

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 2)
    t.is(dprs.resolvedCount, 1)

    t.false(dprs.resolve('foobar'))

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 2)
    t.is(dprs.resolvedCount, 1)

    t.true(dprs.resolve('foo'))

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 1)
    t.is(dprs.resolvedCount, 2)

    t.true(dprs.resolve('foobar'))    

    t.is(dprs.allCount, 3)
    t.is(dprs.unresolvedCount, 0)
    t.is(dprs.resolvedCount, 3)
})


test('resolved/unresolved/all', t => {
    const dprs = new DependencyResolver()

    t.deepEqual(dprs.all(), [])

    dprs.add('foobar', ['foo', 'bar'])

    t.deepEqual(dprs.all(), ['foobar', 'foo', 'bar'])
    
    dprs.add('foo', ['bar'])
    dprs.add('bar')

    t.deepEqual(dprs.unresolved(), ['foobar', 'foo', 'bar'])
    t.deepEqual(dprs.resolved(), [])

    dprs.resolve('bar')

    t.deepEqual(dprs.unresolved(), ['foobar', 'foo'])
    t.deepEqual(dprs.resolved(), ['bar'])

    dprs.resolve('foobar')
    
    t.deepEqual(dprs.unresolved(), ['foobar', 'foo'])
    t.deepEqual(dprs.resolved(), ['bar'])

    dprs.resolve('foo')

    t.deepEqual(dprs.unresolved(), ['foobar'])
    t.deepEqual(dprs.resolved(), ['foo', 'bar'])

    dprs.resolve('foobar')

    t.deepEqual(dprs.unresolved(), [])
    t.deepEqual(dprs.resolved(), ['foobar', 'foo', 'bar'])
})
