import { getDb } from './src/lib/db.ts';
import bcrypt from 'bcryptjs';

async function run() {
  const db = await getDb();
  const hash = await bcrypt.hash('testpass', 10);
  await db.request()
    .input('Email', 'test@example.com')
    .input('PasswordHash', hash)
    .query("INSERT INTO Users (Email, PasswordHash, DisplayName, IsVerified, AcademicLevel, Faculty) VALUES (@Email, @PasswordHash, 'Test User', 1, '1', 'IT')");
  console.log("User inserted");
}
run().catch(console.error);
