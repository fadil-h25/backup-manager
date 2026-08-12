import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

// Lokasi file database
const dbPath = path.join(process.cwd(), 'database.db')

// Koneksi database
export const db = new Database(dbPath)

// Inisialisasi tabel dan user default
export const initDatabase = () => {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS backup_targets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        database_name TEXT NOT NULL,
        host TEXT NOT NULL,
        port INTEGER NOT NULL DEFAULT 3306,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
  `)

    // Cek apakah sudah ada user
    const userCheck = db
        .prepare('SELECT COUNT(*) as count FROM users')
        .get() as { count: number }

    // Jika belum ada user, buat admin default
    if (userCheck.count === 0) {
        const hashedPassword = bcrypt.hashSync('admin123', 10)

        db.prepare(`
      INSERT INTO users (nama, email, password)
      VALUES (?, ?, ?)
    `).run(
            'Admin Instansi',
            'admin@gmail.com',
            hashedPassword
        )

        console.log('User default berhasil dibuat: admin@gmail.com / admin123')
    }

    console.log('Database SQLite siap digunakan.')
}