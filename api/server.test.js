const request = require('supertest');
const db = require('../data/dbConfig');
const hobbits = require('./hobbits/hobbits-model');
const server = require('./server.js');

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

beforeEach(async () => {
    await db.seed.run()
});


afterAll(async () => {
    await db.destroy();
});

describe('hobbits model', () => {

    it('should insert a new hobbit', async () => {
        const response = await request(server)
            .post('/hobbits')
            .send({ name: 'Bilbo' });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ id: expect.any(Number), name: 'Bilbo' });
    });

    it('should get all hobbits', async () => {
        const response = await request(server).get('/hobbits');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(4);
        expect(response.body[0]).toHaveProperty('name', 'sam');
        expect(response.body[1]).toHaveProperty('name', 'frodo');
    });

    it('should get a hobbit by id', async () => {
        let response = await request(server).get(`/hobbits/1`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ id: 1, name: 'sam' });
        response = await request(server).get(`/hobbits/2`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ id: 2, name: 'frodo' });
    });

    it('should update a hobbit', async () => {
        const response = await request(server)
            .put(`/hobbits/1`)
            .send({ name: 'sam the Elf' });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ id: 1, name: 'sam the Elf' });
    });

    it('should remove a hobbit', async () => {
        const response = await request(server).delete(`/hobbits/3`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Hobbit deleted successfully" });
        const foundHobbit = await db('hobbits').where({ id: 3 }).first();
        expect(foundHobbit).toBeUndefined();
    });

})