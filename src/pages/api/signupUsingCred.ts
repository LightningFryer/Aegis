export const prerender = false;
import { lucia } from "@lib/auth";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { db } from "@lib/drizzle"
import { eq } from "drizzle-orm";

import type { APIContext } from "astro";
import { userTable } from "@lib/schema";

export async function POST(context: APIContext): Promise<Response> {
	const formData = await context.request.formData();
	const username = formData.get("username");
	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return new Response("Invalid username", {
			status: 400
		});
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length > 255) {
		return new Response("Invalid password", {
			status: 400
		});
	}

	const userId = generateIdFromEntropySize(10); // 16 characters long
	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	// Check if username is already used
	const existingUser = await db.query.userTable.findFirst({
        where: eq(userTable.username, username.toLowerCase())
    });

    if (existingUser) {
		return new Response("Username already exists", {
			status: 400
		});
	}

    await db.insert(userTable).values({
        id: userId,
		provider_name: "user_pass",
        username: username,
        password_hash: passwordHash,
    })

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return context.redirect("/");
}