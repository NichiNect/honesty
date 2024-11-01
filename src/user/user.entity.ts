import { mysqlEnum, mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";

export const UserRoleEnum = {
    Admin: 'admin',
    Staff: 'staff'
} as const;

export const UserEntity = mysqlTable('users', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: mysqlEnum(['admin', 'staff']),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});