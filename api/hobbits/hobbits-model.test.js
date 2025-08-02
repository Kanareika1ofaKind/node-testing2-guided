const db = require('../../data/dbConfig.js');
const hobbits = require('./hobbits-model.js');

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
});

afterAll(async () => {
    await db.destroy();
});

beforeEach(async () => {
    await db.seed.run()
})

describe('hobbits model', () => {

    it('should insert a new hobbit', async () => {
        const hobbit = { name: 'Bilbo' };
        const insertedHobbit = await hobbits.insert(hobbit);
        expect(insertedHobbit).toMatchObject({ id: expect.any(Number), name: 'Bilbo' });
    });

    it('should get all hobbits', async () => {
        const allHobbits = await hobbits.getAll();
        expect(allHobbits).toHaveLength(4);
        expect(allHobbits[0]).toHaveProperty('name', 'sam');
        expect(allHobbits[1]).toHaveProperty('name', 'frodo');
        expect(allHobbits[2]).toHaveProperty('name', 'pippin');
        expect(allHobbits[3]).toHaveProperty('name', 'merry');
    });

    it('should get a hobbit by id', async () => {
        let hobbit = await hobbits.getById(1);
        expect(hobbit).toMatchObject({ id: 1, name: 'sam' });
        hobbit = await hobbits.getById(2);
        expect(hobbit).toMatchObject({ id: 2, name: 'frodo' });
    });

    it('should update a hobbit', async () => {
        const hobbit = await db('hobbits').where({ id: 1 }).first();
        const updatedHobbit = await hobbits.update(hobbit.id, { name: 'Samwise the Brave' });
        expect(updatedHobbit).toMatchObject({ id: hobbit.id, name: 'Samwise the Brave' });
    });

    it('should remove a hobbit', async () => {
        const hobbit = await db('hobbits').where({ id: 3 }).first();
        const deletedHobbit = await hobbits.remove(hobbit.id);
        expect(deletedHobbit).toBe(1); // Expecting 1 row to be deleted
        const foundHobbit = await db('hobbits').where({ id: hobbit.id }).first();
        expect(foundHobbit).toBeUndefined(); // Should not find the deleted hobbit
    });

})