function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'First User',
            password: 'password01'
        },
        {
            id: 2,
            username: 'Second User',
            password: 'password02'
        },
        {
            id: 3,
            username: 'Third User',
            password: 'password03'
        },
    ]
}

module.exports = {
    makeUsersArray,
}