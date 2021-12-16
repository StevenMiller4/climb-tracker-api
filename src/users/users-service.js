const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('ctracker_users')
    },
    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('ctracker_users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('ctracker_users').select('*').where('id', id).first()
    },
    deleteUser(knex, id) {
        return knex('ctracker_users')
            .where({ id })
            .delete()
    },
    updateUser(knex, id, newUserFields) {
        return knex('ctracker_users')
            .where({ id })
            .update(newUserFields)
    }
}

module.exports = UsersService