// src/pages/odoo/index.ts
// Barrel export – import all Odoo page objects from a single path.

export { BasePage }          from './base/BasePage';
export { LoginPage }         from './auth/LoginPage';
export { ProductListPage }   from './inventory/ProductListPage';
export { ProductFormPage }   from './inventory/ProductFormPage';
export { ReplenishmentPage } from './inventory/ReplenishmentPage';
export { RfqListPage }       from './purchase/RfqListPage';
export { RfqFormPage }       from './purchase/RfqFormPage';
