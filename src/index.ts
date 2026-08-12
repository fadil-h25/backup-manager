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
// API
// Auth
app.post('/api/login', loginController);

// Backup Target
app.post('/api/backup-targets', createBackupTargetController)
app.get('/api/backup-targets', getBackupTargetsController)
app.get('/api/backup-targets/:id', getBackupTargetByIdController)
app.put('/api/backup-targets/:id', updateBackupTargetController)
app.delete('/api/backup-targets/:id', deleteBackupTargetController)


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
