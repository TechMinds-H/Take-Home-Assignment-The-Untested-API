const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

test('creates a task with default values', () => {
  const task = taskService.create({ title: 'Test task' });
  expect(task.status).toBe('todo');
  expect(task.priority).toBe('medium');
});

test('pagination page 1 should return items', () => {
  taskService.create({ title: 'Task 1' });
  taskService.create({ title: 'Task 2' });
  const result = taskService.getPaginated(1, 10);
  expect(result).toHaveLength(2);
});

test('getStats counts tasks by status', () => {
  taskService.create({ title: 'A', status: 'todo' });
  taskService.create({ title: 'B', status: 'in_progress' });
  taskService.create({ title: 'C', status: 'done' });
  const stats = taskService.getStats();
  expect(stats.todo).toBe(1);
  expect(stats.in_progress).toBe(1);
  expect(stats.done).toBe(1);
});

test('update changes task fields', () => {
  const task = taskService.create({ title: 'Old title' });
  const updated = taskService.update(task.id, { title: 'New title' });
  expect(updated.title).toBe('New title');
});

test('update returns null for non-existent task', () => {
  const result = taskService.update('fake-id', { title: 'X' });
  expect(result).toBeNull();
});