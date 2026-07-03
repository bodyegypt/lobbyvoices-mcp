# Lobby — AI Receptionist Toolkit (MCP server)

[![MCP Registry](https://img.shields.io/badge/MCP_Registry-com.lobbyvoices%2Freceptionist--toolkit-5be584)](https://registry.modelcontextprotocol.io/v0/servers?search=lobbyvoices)

The official MCP server for [Lobby](https://lobbyvoices.com/developers) — the bilingual AI front desk. It gives any AI agent eight **free, no-auth** receptionist tools, served remotely over Streamable HTTP. No key, no signup.

```
https://lobbyvoices.com/api/mcp
```

The remote endpoint above needs nothing installed — most MCP clients (Claude Code, Cursor, Claude Desktop) can call it directly over HTTP. This repo also ships `lobbyvoices-mcp`, a tiny stdio bridge (`npx`/Docker) for clients that only support local stdio servers.

## Connect

**Claude Code** (remote, no install)

```bash
claude mcp add --transport http lobbyvoices https://lobbyvoices.com/api/mcp
```

**Cursor · Claude Desktop · any MCP client** (remote, no install)

```json
{
  "mcpServers": {
    "lobbyvoices": { "url": "https://lobbyvoices.com/api/mcp" }
  }
}
```

**Stdio-only client — via `npx`**

```json
{
  "mcpServers": {
    "lobbyvoices": { "command": "npx", "args": ["-y", "lobbyvoices-mcp"] }
  }
}
```

**Stdio-only client — via Docker**

```bash
docker build -t lobbyvoices-mcp https://github.com/bodyegypt/lobbyvoices-mcp.git
```

```json
{
  "mcpServers": {
    "lobbyvoices": { "command": "docker", "args": ["run", "-i", "--rm", "lobbyvoices-mcp"] }
  }
}
```

The bridge does no protocol work itself — it's the maintained [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) package pointed at the production endpoint (see [`index.js`](./index.js)).

## Tools

| Tool | What it does |
|------|--------------|
| `write_phone_script` | Writes a business phone script — greeting, voicemail, on-hold, or jingle — in English, Mexican Spanish, or both. Ready to record. |
| `write_ivr_menu` | Builds a complete IVR / phone-menu script: greeting, numbered options, optional press-9 Spanish switch, operator line. |
| `generate_elevenlabs_agent_prompt` | Generates a production-grade system prompt for an ElevenLabs conversational agent acting as a phone receptionist. |
| `calculate_missed_call_cost` | Computes the revenue a business loses to missed calls (monthly + yearly) plus recovery math, break-even days, and ROI. |
| `simulate_receptionist_call` | Role-play a call against the receptionist call engine — you play the caller, get the transcript, outcome, and automatic EN/ES switch back. |
| `get_demo_call_number` | A real phone number anyone can call right now to hear the receptionist live, with suggested bilingual scripts. |
| `should_i_hire_a_receptionist` | Scores a business's phone coverage and returns a verdict — covered, AI front desk, or hybrid — with archetype and leak numbers. |
| `save_my_receptionist` | Saves a phone script, IVR menu, agent prompt, or simulated call built earlier in the conversation and emails it to the person, with the demo number and a signup link. Requires their explicit consent — only fires with `consent: true`. |

Every tool declares an `outputSchema` and returns `structuredContent`, so agents get typed JSON instead of text to parse.

## Try it with curl

```bash
curl -X POST https://lobbyvoices.com/api/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"calculate_missed_call_cost","arguments":{"callsPerWeek":75,"missedRatePct":33,"avgJobValue":380}}}'
```

## Also available as a plain REST API

The same capabilities are exposed as a free, no-key HTTP API — see the [developer docs](https://lobbyvoices.com/developers) and the [OpenAPI spec](https://lobbyvoices.com/api/v1/openapi.json).

## Fair use

No auth required. Per-IP rate limits (AI-backed tools: 2 requests/minute; math and template tools are generous) and hard input caps keep the service healthy. Building something bigger on top? [Tell us](https://lobbyvoices.com/contact).

## About Lobby

[Lobby](https://lobbyvoices.com) is an AI front desk for small businesses: it answers every inbound call 24/7, books appointments, captures leads, and speaks English and Mexican Spanish — switching mid-call when the caller does. This MCP server runs on the same production stack.
