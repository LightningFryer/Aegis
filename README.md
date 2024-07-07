# Aegis 
A barebones template for a website with complete authentication functionality using Astro, Drizzle ORM and Lucia-Auth.

## Tech Stack
- Astro
- Drizzle ORM (using Turso db)
- Lucia-auth

## Database Schema Structure

### User Table
Stores user information
| Column | Description | Datatype |
| -------- | ------------- | ------ |
| `id` | Generated during callback | `integer` |
| `username` | Username of the user either retrieved from form data or provided by OAuth provider during callback | `string` |
| `provider_name` | Can be `user_pass` for username/passwd auth or the OAuth provider's name like `github` | `string` |
| `provider_id` | Kept as null for `user_pass` auth otherwise it is provided by the OAuth provider during the callback | `integer` or `null` |
| `profile_picture` | Kept as null for `user_pass` auth otherwise a string to url of user's profile picture is provided by OAuth provider at callback | `string` or `null` |
| `password_hash` | User's hashed password which can be retireved and decrypted during user login. Kept as `null` for OAuth authentication | `string` or `null` |
| `sessions` | A foreign key referencing the session table | - |

### Session Table
Stores user session data
| Column | Description | Datatype |
| -------- | ------------- | ------ |
| `id` | Session id | `number` |
| `user_id` | Same as the `id` from user table | `number` |
| `expires_at` | The time at which the session will expire | `number` |
| `user` | A foreign key referencing the user table | - |

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
