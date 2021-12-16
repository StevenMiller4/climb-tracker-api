require('dotenv').config()
const UsersService = require('../src/users/users-service')
const knex = require('knex')
const { expect } = require('chai')
const { makeUsersArray } = require('./users.fixtures')

describe(`Users service object`, function() {

    let db

    const testUsers = makeUsersArray()

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('ctracker_users').truncate())

    afterEach(() => db('ctracker_users').truncate())

    after(() => db.destroy())

    context(`Given 'ctracker_users' has data`, () => {

        beforeEach(() => {
            return db
                .into('ctracker_users')
                .insert(testUsers)
        })

        it(`getAllUsers() resolves all users from 'ctracker_users' table`, () => {
            return UsersService.getAllUsers(db)
                .then(actual => {
                    expect(actual).to.eql(testUsers)
                })
        })

        it(`getById() resolves a user by id from 'ctracker_users' table`, () => {
            const thirdId = 3
            const thirdTestUser = testUsers[thirdId - 1]
            return UsersService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        username: thirdTestUser.username,
                        password: thirdTestUser.password,
                    })
                })
        })

        it(`deleteUser() removes a user by id from 'ctracker_user' table`, () => {
            const user_id = 3
            return UsersService.deleteUser(db, user_id)
                .then(() => UsersService.getAllUsers(db))
                .then(allUsers => {
                    const expected = testUsers.filter(user => user.id !== user_id)
                    expect(allUsers).to.eql(expected)
                })
        })

        it(`updateUser() updates a user from the 'ctracker_user' table`, () => {
            const idOfUserToUpdate = 3
            const newUserData = {
                username: 'updated',
                password: 'updatedpassword',
            }
            return UsersService.updateUser(db, idOfUserToUpdate, newUserData)
                .then(() => UsersService.getById(db, idOfUserToUpdate))
                .then(user => {
                    expect(user).to.eql({
                        id: idOfUserToUpdate,
                        ...newUserData,
                    })
                })
        })

    })

    context(`Given 'ctracker_users' has no data`, () => {

        it(`getAllUsers() resolves an empty array`, () => {
            return UsersService.getAllUsers(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertUser() inserts a new user and resolves the new user with an 'id'`, () => {
            const newUser = {
                username: 'Test',
                password: 'Test password',
            }
            return UsersService.insertUser(db, newUser)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        username: newUser.username,
                        password: newUser.password,
                    })
                })
        })

    })

})