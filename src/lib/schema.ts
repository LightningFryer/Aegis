import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
	id: text("user_id").notNull().primaryKey(),
	provider_name: text("provider_name").notNull(),
	provider_id: text("provider_id"),
	profile_picture: text("profile_picture"),
	username: text("username").unique().notNull(),
    password_hash: text("password_hash"),
});

export const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull()
});
