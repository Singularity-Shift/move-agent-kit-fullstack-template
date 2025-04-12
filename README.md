
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

# EMOJICOIN FUN CONFIG
NEXT_PUBLIC_APTOS_NETWORK=mainnet
NEXT_PUBLIC_MODULE_ADDRESS="0xface729284ae5729100b3a9ad7f7cc025ea09739cd6e7252aff0beb53619cafe"
NEXT_PUBLIC_REWARDS_MODULE_ADDRESS="0xbabe32dbe1cb44c30363894da9f49957d6e2b94a06f2fc5c20a9d1b9e54cface"
NEXT_PUBLIC_INTEGRATOR_ADDRESS="0x99994f5124fa5cc95538217780cbfc01e4c4f842dfcc453890755b2ce4779999"
NEXT_PUBLIC_ARENA_MODULE_ADDRESS="0x0" # Emojicoin arena is not on mainnet yet.
NEXT_PUBLIC_INTEGRATOR_FEE_RATE_BPS="100"

// OPTIONAL
INTEGRATOR_FEE_ADDRESS=[YOUR ADDRESS]
INTEGRATOR_FEE_PORCENTAGE="1" // Cannot be more than 2
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
   npx nx run backend-app:serve
   ```

3. Start the frontend application:

   ```bash
   npx nx run frontend-app:dev
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
