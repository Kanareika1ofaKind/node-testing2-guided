const db = require('../../data/dbConfig.js');
const hobbits = require('./hobbits-model.js');

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
});

afterAll(async () => {
    await db.destroy();
});

describe('hobbits model', () => {
    beforeEach(async () => {
        await db('hobbits').truncate();
    });

    it('should insert a new hobbit', async () => {
        const hobbit = { name: 'Bilbo' };
        const insertedHobbit = await hobbits.insert(hobbit);
        expect(insertedHobbit).toMatchObject({ id: expect.any(Number), name: 'Bilbo' });
    });

    it('should get all hobbits', async () => {
        await hobbits.insert({ name: 'Frodo' });
        await hobbits.insert({ name: 'Samwise' });
        const allHobbits = await hobbits.getAll();
        expect(allHobbits).toHaveLength(2);
        expect(allHobbits[0]).toHaveProperty('name', 'Frodo');
        expect(allHobbits[1]).toHaveProperty('name', 'Samwise');
    });

    it('should get a hobbit by id', async () => {
        const hobbit = await hobbits.insert({ name: 'Gandalf' });
        const foundHobbit = await hobbits.getById(hobbit.id);
        expect(foundHobbit).toMatchObject({ id: hobbit.id, name: 'Gandalf' });
    });

    it('should update a hobbit', async () => {
        const hobbit = await hobbits.insert({ name: 'Legolas' });
        const updatedHobbit = await hobbits.update(hobbit.id, { name: 'Legolas the Elf' });
        expect(updatedHobbit).toMatchObject({ id: hobbit.id, name: 'Legolas the Elf' });
    });

    it('should remove a hobbit', async () => {
        const hobbit = await hobbits.insert({ name: 'Gimli' });
        const deletedCount = await hobbits.remove(hobbit.id);
        expect(deletedCount).toBe(1);
        const foundHobbit = await hobbits.getById(hobbit.id);
        expect(foundHobbit).toBeUndefined();
    });

})