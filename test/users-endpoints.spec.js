const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')

describe(`Users Endpoints`, function() {

    let db

    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after(`disconnect from db`, () => db.destroy())

    before(`clean the table`, () => db('ctracker_users').truncate())

    afterEach(`cleanup`, () => db('ctracker_users').truncate())

    describe(`GET /users`, () => {

        context(`Given no users`, () => {

            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/users')
                    .expect(200, [])
            })

        })

        context(`Given there are users in the database`, () => {
        
            const testUsers = makeUsersArray()
    
            beforeEach(`insert users`, () => {
                return db
                    .into('ctracker_users')
                    .insert(testUsers)
            })
    
            it(`GET /users responds with 200 and all of the users`, () => {
                return supertest(app)
                    .get('/users')
                    .expect(200, testUsers)
            })

        })

    })
    
    describe(`GET /users/:user_id`, () => {

        context(`Given no articles`, () => {

            it(`responds with 404`, () => {
                const user_id = 123456
                return supertest(app)
                    .get(`/users/${user_id}`)
                    .expect(404, { error: { message: `User doesn't exist` } })
            })

        })

        context(`Given there are users in the database`, () => {

            const testUsers = makeUsersArray()

            beforeEach('insert users', () => {
                return db
                    .into('ctracker_users')
                    .insert(testUsers)
            })

            it(`GET /users/:user_id responds with 200 and the specified user`, () => {
                const user_id = 2
                const expectedUser = testUsers[user_id - 1]
                return supertest(app)
                    .get(`/users/${user_id}`)
                    .expect(200, expectedUser)
            })

        })

    })

})