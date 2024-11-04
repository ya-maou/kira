// src/core/databaseService.js
import db from './database.js';

// Example function to fetch menu items by name
export async function getMenuItemsByName(name) {
  const query = 'SELECT * FROM menu WHERE name = ?';
  const [rows] = await db.query(query, [name]);
  return rows;
}

// Function to fetch all menu items
export async function getAllMenuItems() {
  const query = 'SELECT * FROM menu';
  const [rows] = await db.query(query);
  return rows;
}

// Function to add a new menu item (e.g., name and price)
export async function addMenuItem(name, price) {
  const query = 'INSERT INTO menu (name, price) VALUES (?, ?)';
  const [result] = await db.query(query, [name, price]);
  return result;
}

// Function to update an existing menu item
export async function updateMenuItem(id, name, price) {
  const query = 'UPDATE menu SET name = ?, price = ? WHERE id = ?';
  const [result] = await db.query(query, [name, price, id]);
  return result;
}

// Function to delete a menu item by ID
export async function deleteMenuItem(id) {
  const query = 'DELETE FROM menu WHERE id = ?';
  const [result] = await db.query(query, [id]);
  return result;
}
