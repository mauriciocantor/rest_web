import request from 'supertest';
import {testServer} from '../../test-server.';
import {prisma} from "../../../src/data/postgres";

describe('Todo`s routes testing', ()=>{

    beforeAll(async ()=>{
        await testServer.start();
    });

    afterAll(()=>{
       testServer.close();
    });

    beforeEach(async ()=>{
        await prisma.todo.deleteMany();
    });

    const todo1 = {text: 'Hola Mundo 1'};
    const todo2 = {text: 'Hola Mundo 2'};

    test('should get all todos',async()=>{
        await prisma.todo.createMany({
            data: [todo1, todo2]
        });

        const {body} = await request(testServer.app)
            .get('/api/todo')
            .expect(200)
        ;

        expect(body.todos).toBeInstanceOf(Array);
        expect(body.todos.length).toBe(2);
        expect(body.todos[0].text).toBe(todo1.text);
        expect(body.todos[1].text).toBe(todo2.text);
    });

    test('should return a todo api/todo/:id',async ()=>{
        const todo = await prisma.todo.create({
            data: todo1
        });

        const response = await request(testServer.app)
            .get(`/api/todo/${todo.id}`)
            .expect(200);

        expect(response.body.todo).toEqual(todo);

    });

    test('should return a 404 NotFound api/todo/:id',async ()=>{
        const {body} = await request(testServer.app)
            .get(`/api/todo/-1`)
            .expect(404);

        expect(body).toEqual({ error: 'Todo with id -1 not found' });
    });

    test('should create todo way POST api/todo/',async ()=>{
        const {body} = await request(testServer.app)
            .post('/api/todo')
            .send(todo1)
            .expect(201);

        expect(body.todo).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null
        })
    });

    test('should create not contain text api/todo/',async ()=>{
        const {body} = await request(testServer.app)
            .post('/api/todo')
            .send({text:null})
            .expect(400);

        expect(body).toEqual({ error: 'Text property is required' })
    });

    test('should create with text empty api/todo/',async ()=>{
        const {body} = await request(testServer.app)
            .post('/api/todo')
            .send({text:''})
            .expect(400);

        expect(body).toEqual({ error: 'Text property is required' })
    });

    test('should updated todo way PUT api/todo/:id',async ()=>{
        const todo = await prisma.todo.create({
            data: todo1
        });
        const {body} = await request(testServer.app)
            .put(`/api/todo/${todo.id}`)
            .send({
                text:'Hola Mundo Updated',
                completedAt: '2023-12-31'
            })
            .expect(200);

        expect(body.todo).toEqual({
            id: expect.any(Number),
            text: 'Hola Mundo Updated',
            completedAt: '2023-12-31T00:00:00.000Z'
        });

    });

    test('should return 404 if Todo not found api/todo/:id',async ()=>{
        const {body} = await request(testServer.app)
            .put(`/api/todo/-1`)
            .send({
                text:'Hola Mundo Updated',
                completedAt: '2023-12-31'
            })
            .expect(404);

        expect(body).toEqual({ error: 'Id -1 not found' });

    });

    test('should return an updated TODO only the date api/todo/:id',async ()=>{
        const todo = await prisma.todo.create({
            data: todo1
        });
        const {body} = await request(testServer.app)
            .put(`/api/todo/${todo.id}`)
            .send({
                completedAt: '2023-11-29'
            })
            .expect(200);

        expect(body.todo).toEqual({
            id: todo.id,
            text: todo1.text,
            completedAt: '2023-11-29T00:00:00.000Z'
        });
    });

    test('Should delete a TODO api/todo/:id', async ()=>{
        const todo = await prisma.todo.create({
            data: todo1
        });
        const {body} = await request(testServer.app)
            .delete(`/api/todo/${todo.id}`)
            .expect(200);

        expect(body.todo).toEqual(todo);
    });

    test('Should return 404 if todo do not exist api/todo/:id', async ()=>{
        const {body} = await request(testServer.app)
            .delete(`/api/todo/-1`)
            .expect(404);

        expect(body).toEqual({ error: 'Id -1 not found' });
    });
});