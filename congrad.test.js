const request = require('supertest');
const db = require('./data/dbConfig');
const hobbits = require('./api/hobbits/hobbits-model');
const server = require('./api/server.js');

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

afterAll(async () => {
    await db.destroy();
});

describe('hobbits model', () => {

    beforeEach(async () => {
        await db('hobbits').truncate();
    });

    it('should insert a new hobbit', async () => {
        const response = await request(server)
            .post('/hobbits')
            .send({ name: 'Bilbo' });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ id: expect.any(Number), name: 'Bilbo' });
    });

    it('should get all hobbits', async () => {
        await hobbits.insert({ name: 'Frodo' });
        await hobbits.insert({ name: 'Samwise' });
        const response = await request(server).get('/hobbits');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toHaveProperty('name', 'Frodo');
        expect(response.body[1]).toHaveProperty('name', 'Samwise');
    });

    it('should get a hobbit by id', async () => {
        const hobbit = await hobbits.insert({ name: 'Gandalf' });
        const response = await request(server).get(`/hobbits/${hobbit.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ id: hobbit.id, name: 'Gandalf' });
    });

    it('should update a hobbit', async () => {
        const hobbit = await hobbits.insert({ name: 'Legolas' });
        const response = await request(server)
            .put(`/hobbits/${hobbit.id}`)
            .send({ name: 'Legolas the Elf' });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ id: hobbit.id, name: 'Legolas the Elf' });
    });

    it('should remove a hobbit', async () => {
        const hobbit = await hobbits.insert({ name: 'Gimli' });
        const response = await request(server).delete(`/hobbits/${hobbit.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Hobbit deleted successfully" });
        const foundHobbit = await hobbits.getById(hobbit.id);
        expect(foundHobbit).toBeUndefined();
    });

})