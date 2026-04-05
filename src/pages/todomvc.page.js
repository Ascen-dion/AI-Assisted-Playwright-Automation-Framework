const loc = require('./locators/todomvc.locators');

const URL = 'https://demo.playwright.dev/todomvc';

/**
 * Page Object for the TodoMVC app.
 *
 * Encapsulates all user actions so tests stay free of
 * Playwright API details and locator strings.
 */
class TodoMVCPage {
  constructor(page) {
    this.page = page;
  }

  // ── Navigation ────────────────────────────────────────────────

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded' });
  }

  // ── Actions ───────────────────────────────────────────────────

  async addTodo(text) {
    await loc.newTodoInput(this.page).fill(text);
    await loc.newTodoInput(this.page).press('Enter');
  }

  async addTodos(texts) {
    for (const text of texts) {
      await this.addTodo(text);
    }
  }

  async completeTodo(index) {
    await loc.todoCheckboxAt(this.page, index).check();
  }

  async deleteTodo(index) {
    const item = loc.todoItemAt(this.page, index);
    await item.hover();
    await item.getByRole('button', { name: '×' }).click();
  }

  async clearCompleted() {
    await loc.clearCompletedBtn(this.page).click();
  }

  async filterBy(name) {
    await loc.filterLink(this.page, name).click();
  }

  async toggleAll() {
    await loc.toggleAllCheckbox(this.page).click();
  }

  // ── Queries ───────────────────────────────────────────────────

  getTodoItems() {
    return loc.todoItems(this.page);
  }

  getTodoItemAt(index) {
    return loc.todoItemAt(this.page, index);
  }

  getNewTodoInput() {
    return loc.newTodoInput(this.page);
  }

  getItemCounter() {
    return loc.itemCounter(this.page);
  }
}

module.exports = TodoMVCPage;
