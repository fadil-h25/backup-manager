import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { loginController } from './controllers/auth.controller.js'

const app = new Hono()

//inisialisi database

import { initDatabase } from './db/index.js'
import { LoginPage } from './pages/login/index.js'
import {
  createBackupTargetController,
  getBackupTargetByIdController,
  getBackupTargetsController, deleteBackupTargetController, updateBackupTargetController
} from './controllers/backup-target.controller.js'
import { DashboardPage } from './pages/dashboard/index.js'
import { BackupTargetsPage } from './pages/backup-target/index.js'
import { BackupTargetCreatePage } from './pages/backup-target/create.js'
import { BackupTargetEditPage } from './pages/backup-target/edit.js'
import { getBackupTargetById } from './services/backup-target.service.js'
import { testMySQLConnectionController } from './controllers/mysql.controller.js'
import { createBackupController, getBackupHistoryController } from './controllers/backup.controller.js'
import { BackupHistoryPage } from './pages/backup-history/index.js'
initDatabase();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// UI
app.get('/login', (c) => {
  return c.html(LoginPage())
});
app.get('/dashboard', (c) => {
  return c.html(DashboardPage());
});
app.get('/backup-targets', (c) => {
  return c.html(BackupTargetsPage());
});
app.get('/backup-targets/create', (c) => {
  return c.html(BackupTargetCreatePage());
});
app.get('/backup-targets/:id/edit', (c) => {
  const id = Number(c.req.param('id'));
  const target = getBackupTargetById(id);
  if (!target) {
    return c.text('Backup target tidak ditemukan.', 404);
  }
  return c.html(BackupTargetEditPage({ target }));
});
app.get('/backup-history', (c) => {
  return c.html(BackupHistoryPage());
});

// API
// Auth
app.post('/api/login', loginController);

// Backup Target
app.post('/api/backup-targets', createBackupTargetController)
app.get('/api/backup-targets', getBackupTargetsController)
app.get('/api/backup-targets/:id', getBackupTargetByIdController)
app.put('/api/backup-targets/:id', updateBackupTargetController)
app.delete('/api/backup-targets/:id', deleteBackupTargetController)

// MysQL Connection Test
app.get(
  '/api/backup-targets/:id/test-connection',
  testMySQLConnectionController
);

// Backup
app.post(
  '/api/backup-targets/:id/backup',
  createBackupController
);
app.get(
  '/api/backup-history',
  getBackupHistoryController
);


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
