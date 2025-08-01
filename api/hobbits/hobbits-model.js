const db = require('../../data/dbConfig.js')

module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById,
}

function getAll() {
  return db('hobbits')
}

function getById(id) {

    return db('hobbits')
        .where({ id })
        .first()

}

async function insert(hobbit) {
    const [id] = await db('hobbits').insert(hobbit)
    return getById(id)
}

async function update(id, changes) {

    await db('hobbits')
        .where({ id })
        .update(changes)
    
    return getById(id)

}

function remove(id) {

    return db('hobbits')
        .where({ id })
        .del()

}
