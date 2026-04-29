# antpos_todo

Todo app created by AntPos

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Usage

### Development

To run the application in development mode, use the following command:

```bash
pnpm run dev
```

This will start the server with auto-reloading enabled.

### Production

To build and run the application in production mode, use the following commands:

```bash
pnpm run build
pnpm start
```

## Scripts

- `dev`: Starts the development server with file watching.
- `build`: Compiles the TypeScript code to JavaScript.
- `start`: Starts the production server.
- `test`: Runs the test suite using Vitest.

## Dependencies

- **bcrypt**: For hashing passwords.
- **cookie-parser**: For parsing cookies.
- **cors**: For enabling Cross-Origin Resource Sharing.
- **express**: The web framework used.
- **express-handlebars**: For templating email.
- **jsonwebtoken**: For generating and verifying JSON Web Tokens.
- **mongoose**: For interacting with MongoDB.
- **morgan**: For logging HTTP requests.
- **nodemailer**: For sending emails.
- **nodemailer-express-handlebars**: For using handlebars with nodemailer.
- **zod**: For data validation.

## Dev Dependencies

- **@eslint/js**: Eslint js plugin.
- **@types/bcrypt**: Type definitions for bcrypt.
- **@types/cookie-parser**: Type definitions for cookie-parser.
- **@types/cors**: Type definitions for cors.
- **@types/express**: Type definitions for express.
- **@types/jsonwebtoken**: Type definitions for jsonwebtoken.
- **@types/morgan**: Type definitions for morgan.
- **@types/node**: Type definitions for Node.js.
- **@types/nodemailer**: Type definitions for nodemailer.
- **@types/nodemailer-express-handlebars**: Type definitions for nodemailer-express-handlebars.
- **eslint**: For linting the code.
- **eslint-plugin-prettier**: For integrating Prettier with ESLint.
- **globals**: For global variables.
- **prettier**: For code formatting.
- **typescript**: The programming language used.
- **typescript-eslint**: For using ESLint with TypeScript.
- **vitest**: For running tests.

## License

This project is licensed under the ISC License.
