// src/lib/user.ts
import { db } from '@/lib/db'
import type { User } from '@prisma/client'

/**
 * Fetch a user record by email.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return db.user.findUnique({
    where: { email },
  })
}

/**
 * Fetch a user record by ID.
 */
export async function getUserById(id: string): Promise<User | null> {
  return db.user.findUnique({
    where: { id },
  })
}
