# Railway MCP Server Deployment

This directory contains templates for deploying custom MCP servers to Railway.

## Future MCP Servers

When you need to deploy a custom MCP server:

1. Create a new directory for your server
2. Add the required files:
   - `package.json` - Dependencies
   - `tsconfig.json` - TypeScript config
   - `src/index.ts` - MCP server entry
   - `Dockerfile` - Container build
   - `railway.json` - Railway config

## Template Structure

```
my-mcp-server/
├── package.json
├── tsconfig.json
├── Dockerfile
├── railway.json
└── src/
    └── index.ts
```

## Railway Configuration (railway.json)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## Dockerfile Template

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

## MCP Server Entry (src/index.ts)

```ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = new Server({
  name: 'my-mcp-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
})

// Define tools
server.setRequestHandler(/* ... */)

// Start server
const transport = new StdioServerTransport()
await server.connect(transport)
```

## Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd my-mcp-server
railway up
```
