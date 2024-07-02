import { Lucia } from "lucia";
import { adapter } from "./drizzle";
import { GitHub } from "arctic";
import { config } from "dotenv"

config({
	path: ".env"
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: import.meta.env.PROD
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			username: attributes.username,
			provider: attributes.provider_name,
			email: attributes.email,
            picture: attributes.profile_picture,
		};
	}
});

export const github = new GitHub(process.env.GITHUB_CLIENT_ID!, process.env.GITHUB_CLIENT_SECRET!)

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
	provider_name: string;
	email?: string | null;
    profile_picture?: string | null;
}