const { test, expect } = require('@playwright/test');
const TodoMVCPage = require('../pages/todomvc.page');

test.describe('TodoMVC — Add Todo Flow', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMVCPage(page);
    await todoPage.goto();
  });

  test('TC-01: Adds a single todo item', async () => {
    await todoPage.addTodo('Buy milk');

    await expect(todoPage.getTodoItems()).toHaveCount(1);
    await expect(todoPage.getTodoItemAt(0)).toContainText('Buy milk');

    console.log('✓ TC-01 passed: Single todo item added');
  });

  test('TC-02: Input field clears after adding a todo', async () => {
    await todoPage.addTodo('Buy milk');

    await expect(todoPage.getNewTodoInput()).toHaveValue('');

    console.log('✓ TC-02 passed: Input cleared after submission');
  });

  test('TC-03: Adds multiple todo items', async () => {
    await todoPage.addTodos(['Buy milk', 'Walk the dog', 'Read a book']);

    await expect(todoPage.getTodoItems()).toHaveCount(3);
    await expect(todoPage.getTodoItemAt(0)).toContainText('Buy milk');
    await expect(todoPage.getTodoItemAt(1)).toContainText('Walk the dog');
    await expect(todoPage.getTodoItemAt(2)).toContainText('Read a book');

    console.log('✓ TC-03 passed: 3 todo items added in order');
  });

  test('TC-04: Item counter updates as todos are added', async () => {
    await todoPage.addTodo('Buy milk');
    await expect(todoPage.getItemCounter()).toContainText('1 item left');

    await todoPage.addTodo('Walk the dog');
    await expect(todoPage.getItemCounter()).toContainText('2 items left');

    await todoPage.addTodo('Read a book');
    await expect(todoPage.getItemCounter()).toContainText('3 items left');

    console.log('✓ TC-04 passed: Item counter increments correctly');
  });

  test('TC-05: Does not add a todo when input is empty', async () => {
    await todoPage.getNewTodoInput().press('Enter');

    await expect(todoPage.getTodoItems()).toHaveCount(0);

    console.log('✓ TC-05 passed: Empty input does not create a todo');
  });

  test('TC-06: Does not add a todo when input is only whitespace', async () => {
    await todoPage.getNewTodoInput().fill('   ');
    await todoPage.getNewTodoInput().press('Enter');

    await expect(todoPage.getTodoItems()).toHaveCount(0);

    console.log('✓ TC-06 passed: Whitespace-only input does not create a todo');
  });
});
