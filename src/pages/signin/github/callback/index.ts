export const prerender = false;
import { github, lucia } from "../../../../auth";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { db } from "../../../../drizzle";

import type { APIContext } from "astro";
import { userTable } from "../../../../schema";
import { and, eq } from "drizzle-orm";

export async function GET(context: APIContext): Promise<Response> {
	const code = context.url.searchParams.get("code");
	const state = context.url.searchParams.get("state");
	const storedState = context.cookies.get("github_oauth_state")?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const githubUser: GitHubUser = await githubUserResponse.json();

        const existingAccount = await db.query.userTable.findFirst({
            where: and(eq(userTable.provider_name, "github"), eq(userTable.provider_id, githubUser.id))
        });

		if (existingAccount) {
			const session = await lucia.createSession(existingAccount.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			return context.redirect("/");
		}

		const userId = generateIdFromEntropySize(10); // 16 characters long

        await db.insert(userTable).values({
            id: userId,
            provider_name: "github",
            provider_id: githubUser.id,
            username: githubUser.login,
        });

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		return context.redirect("/");
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			console.log(e);
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		console.log(e);
		return new Response(null, {
			status: 500
		});
	}
}

interface GitHubUser {
	id: string;
	login: string;
}