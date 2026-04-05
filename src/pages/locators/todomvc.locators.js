/**
 * Locator definitions for https://demo.playwright.dev/todomvc
 *
 * Centralised here so a DOM change only needs fixing in one place.
 * Each exported function takes a `page` and returns a Playwright Locator.
 */

/** Input field for creating a new todo */
const newTodoInput = (page) =>
  page.getByRole('textbox', { name: 'What needs to be done?' });

/** All todo list items */
const todoItems = (page) => page.getByTestId('todo-item');

/** A specific todo item by its 0-based index */
const todoItemAt = (page, index) => todoItems(page).nth(index);

/** The label text inside a todo item by index */
const todoLabelAt = (page, index) =>
  todoItemAt(page, index).getByRole('generic').filter({ hasNotText: '×' }).first();

/** Checkbox to toggle a todo item at index */
const todoCheckboxAt = (page, index) =>
  todoItemAt(page, index).getByRole('checkbox', { name: 'Toggle Todo' });

/** "X items left" counter in the footer */
const itemCounter = (page) => page.locator('.todo-count');

/** Filter links: All | Active | Completed */
const filterLink = (page, name) => page.getByRole('link', { name });

/** "Clear completed" button */
const clearCompletedBtn = (page) =>
  page.getByRole('button', { name: 'Clear completed' });

/** "Mark all as complete" toggle */
const toggleAllCheckbox = (page) =>
  page.getByRole('checkbox', { name: /Mark all as complete/i });

module.exports = {
  newTodoInput,
  todoItems,
  todoItemAt,
  todoLabelAt,
  todoCheckboxAt,
  itemCounter,
  filterLink,
  clearCompletedBtn,
  toggleAllCheckbox,
};
