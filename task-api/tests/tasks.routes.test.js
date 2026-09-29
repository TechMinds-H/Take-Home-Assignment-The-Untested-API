const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

test('POST /', async () => {
  const res = await request(app).post('/tasks').send({ title: 'Buy milk' });
  expect(res.status).toBe(201);
  expect(res.body.title).toBe('Buy milk');
});

test('POST /tasks fails without a title', async () => {
  const res = await request(app).post('/tasks').send({ description: 'no title' });
  expect(res.status).toBe(400);
});

test('GET /', async () => {
  await request(app).post('/tasks').send({ title: 'A' });
  const res = await request(app).get('/tasks');
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test('DELETE /tasks/:id', async () => {
  const created = await request(app).post('/tasks').send({ title: 'Delete me' });
  const res = await request(app).delete(`/tasks/${created.body.id}`);
  expect(res.status).toBe(204);
});

test('DELETE /tasks/:id returns 404 for fake id', async () => {
  const res = await request(app).delete('/tasks/fake-id');
  expect(res.status).toBe(404);
});

test('PATCH /tasks/:id/complete', async () => {
  const created = await request(app).post('/tasks').send({ title: 'Finish' });
  const res = await request(app).patch(`/tasks/${created.body.id}/complete`);
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('done');
});

test('PATCH /tasks/:id/assign', async () => {
  const created = await request(app).post('/tasks').send({ title: 'Assign me' });
  const res = await request(app)
    .patch(`/tasks/${created.body.id}/assign`)
    .send({ assignee: 'Rohit' });
  expect(res.status).toBe(200);
  expect(res.body.assignee).toBe('Rohit');
});

test('PATCH /tasks/:id/assign rejects empty assignee', async () => {
  const created = await request(app).post('/tasks').send({ title: 'X' });
  const res = await request(app)
    .patch(`/tasks/${created.body.id}/assign`)
    .send({ assignee: '' });
  expect(res.status).toBe(400);
});

test('PATCH /tasks/:id/assign returns 404 for fake id', async () => {
  const res = await request(app)
    .patch('/tasks/fake-id/assign')
    .send({ assignee: 'Rohit' });
  expect(res.status).toBe(404);
});

test('GET /tasks?page=1&limit=10 returns paginated results', async () => {
  await request(app).post('/tasks').send({ title: 'A' });
  await request(app).post('/tasks').send({ title: 'B' });
  const res = await request(app).get('/tasks?page=1&limit=10');
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
});

test('PUT /tasks/:id', async () => {
  const created = await request(app).post('/tasks').send({ title: 'Old' });
  const res = await request(app).put(`/tasks/${created.body.id}`).send({ title: 'New' });
  expect(res.status).toBe(200);
  expect(res.body.title).toBe('New');
});

test('PUT /tasks/:id returns 404 for fake id', async () => {
  const res = await request(app).put('/tasks/fake-id').send({ title: 'X' });
  expect(res.status).toBe(404);
});

test('PUT /tasks/:id rejects invalid status', async () => {
  const created = await request(app).post('/tasks').send({ title: 'A' });
  const res = await request(app).put(`/tasks/${created.body.id}`).send({ status: 'weird' });
  expect(res.status).toBe(400);
});

test('PATCH /tasks/:id/complete returns 404 for fake id', async () => {
  const res = await request(app).patch('/tasks/fake-id/complete');
  expect(res.status).toBe(404);
});

test('POST /tasks rejects invalid priority', async () => {
  const res = await request(app).post('/tasks').send({ title: 'A', priority: 'urgent' });
  expect(res.status).toBe(400);
});

test('POST /tasks rejects invalid dueDate', async () => {
  const res = await request(app).post('/tasks').send({ title: 'A', dueDate: 'not-a-date' });
  expect(res.status).toBe(400);
});