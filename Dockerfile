# lobbyvoices-mcp — stdio bridge to the remote Lobby MCP server
# (https://lobbyvoices.com/api/mcp). This image exists for MCP clients that
# only support running a local process (and for Glama's Docker build/deploy
# flow); it carries no application logic of its own — see index.js.
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY index.js ./

ENTRYPOINT ["node", "index.js"]
