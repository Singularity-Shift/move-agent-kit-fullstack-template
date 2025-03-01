
# Project Setup and Instructions

This project is a multi-module application built with TypeScript, utilizing the Nx framework. It consists of a backend application, a frontend application, and shared libraries.

## Prerequisites

- Node.js and npm must be installed on your system. You can download them from [Node.js official website](https://nodejs.org/en/download/).

## Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```plaintext
# Server Configuration
BACKEND_PORT=3200

# Frontend port
PORT=3000

# Aptos network `mainnet` | `testnet`
APTOS_NETWORK=mainnet

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRED_TIME=3600

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key

# PANORA API KEY Configuration
PANORA_API_KEY=your_panora_api_key
```

Replace `your_jwt_secret_key`, `your_openai_api_key` and `your_panora_api_key` with your actual secret key and API key.

## Running the Project

### Using Nx

1. Install the dependencies for the entire workspace:

   ```bash
   npm install
   ```

2. Start the backend application:

   ```bash
   npx nx serve backend-app
   ```

3. Start the frontend application:

   ```bash
   npx nx dev frontend-app
   ```

## Building the Libraries

To build the shared libraries, run the following command:

```bash
npx nx build helpers
```

## Additional Information

- Ensure that the `.env` file is correctly configured with all necessary environment variables before starting the applications.
- The backend server will run on the port specified in the `BACKEND_PORT` environment variable.
- The frontend application will typically run on port 3000 by default, but this can be configured in the `next.config.js` file if needed.
