const { app, BrowserWindow, ipcMain } = require('electron');
const db = require('./database.cjs');

// React පැත්තෙන් එවන දත්ත Database එකේ Save කිරීම
ipcMain.handle('add-item', async (event, item) => {
  const result = await db('items').insert(item);
  return result;
});

// Database එකේ ඇති සියලුම දත්ත ලබා ගැනීම
ipcMain.handle('get-items', async () => {
  return await db('items').select('*');
});