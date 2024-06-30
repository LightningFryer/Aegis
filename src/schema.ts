import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
    google_id: integer("google_id").unique().default(0),
	username: text("username").unique(),
    password_hash: text("password_hash"),
	email: text("email"),
	email_verified: integer("email_verified").default(0),
	profile_picture: text("profile_picture").default(""),
});

export const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull()
});
