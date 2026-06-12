import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  createDemoJwt,
  filterResources,
  getCourseCode,
  getCredits,
  getDepartment,
  getStatusLabel,
  getUniqueValues,
  parseList,
} from '../src/courseCatalog.js'

const resources = [
  {
    id: 12,
    description: 'Automate the Boring Stuff with Python',
    types: ['tutorial'],
    topics: ['python'],
    levels: ['beginner'],
  },
  {
    id: 54,
    description: 'CSS Grids and Flexbox for Responsive Web Design',
    types: ['video', 'tutorial'],
    topics: ['css'],
    levels: ['beginner', 'intermediate'],
  },
  {
    id: 'local-123456',
    description: 'React State Management Guide',
    types: ['guide'],
    topics: ['react', 'javascript'],
    levels: ['intermediate'],
    isLocal: true,
  },
]

const decodeJwtPart = (tokenPart) =>
  JSON.parse(Buffer.from(tokenPart, 'base64url').toString('utf8'))

describe('course catalog helpers', () => {
  it('creates a JWT-shaped token with the account identity and catalog scope', () => {
    const token = createDemoJwt({
      email: 'student@example.com',
      name: 'Student',
    })
    const [header, payload, signature] = token.split('.')

    assert.equal(token.split('.').length, 3)
    assert.deepEqual(decodeJwtPart(header), { alg: 'HS256', typ: 'JWT' })
    assert.equal(decodeJwtPart(payload).sub, 'student@example.com')
    assert.equal(decodeJwtPart(payload).name, 'Student')
    assert.equal(decodeJwtPart(payload).scope, 'codingresources:read')
    assert.equal(Buffer.from(signature, 'base64url').toString('utf8'), 'course-api-demo-signature')
  })

  it('parses comma-separated form fields into trimmed tag arrays', () => {
    assert.deepEqual(parseList(' react, javascript, , frontend '), [
      'react',
      'javascript',
      'frontend',
    ])
  })

  it('derives course metadata used by cards and detail pages', () => {
    assert.equal(getCourseCode(resources[0]), 'CC-012')
    assert.equal(getCourseCode(resources[2]), 'NEW-3456')
    assert.equal(getDepartment(resources[1]), 'css')
    assert.equal(getCredits(resources[1]), 3)
    assert.equal(getStatusLabel(resources[0]), 'Open')
    assert.equal(getStatusLabel(resources[2]), 'Draft')
  })

  it('returns sorted unique filter values from resource arrays', () => {
    assert.deepEqual(getUniqueValues(resources, 'topics'), [
      'css',
      'javascript',
      'python',
      'react',
    ])
  })

  it('filters resources by query, topic, level, and type', () => {
    assert.deepEqual(
      filterResources({
        resources,
        searchQuery: 'state',
        topicFilter: 'react',
        levelFilter: 'intermediate',
        typeFilter: 'guide',
      }).map((resource) => resource.id),
      ['local-123456'],
    )

    assert.deepEqual(
      filterResources({
        resources,
        searchQuery: 'CC-054',
      }).map((resource) => resource.id),
      [54],
    )
  })
})
