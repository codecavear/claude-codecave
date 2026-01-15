# claude-codecave

Codecave organization Claude Code plugin for full-stack development with Nuxt 4, Drizzle ORM, and PostgreSQL.

## Installation

```bash
# Clone to your Claude Code plugins directory
git clone https://github.com/codecave/claude-codecave ~/.claude/plugins/codecave

# Or on Windows
git clone https://github.com/codecave/claude-codecave %USERPROFILE%\.claude\plugins\codecave
```

Then enable the plugin in Claude Code settings.

## Contents

### Agents

| Agent | Use Case |
|-------|----------|
| `nuxt-ui-builder` | Vue components, pages, Nuxt UI 4 patterns |
| `drizzle-postgres-expert` | Database schema, migrations, queries |
| `drizzle-nitro-test-writer` | API endpoint testing |
| `nitro-api-builder` | Server routes, validation, error handling |
| `threejs-scene-builder` | 3D scenes, games, Three.js development |

### Skills

| Skill | Triggers |
|-------|----------|
| `nuxt-ui-patterns` | "build form", "create modal", "add table" |
| `landing-page` | "create landing page", "add hero", "features section" |
| `drizzle-postgres` | "create table", "add column", "write query" |
| `nitro-testing` | "write tests", "test API" |
| `threejs-development` | "create scene", "add 3D", "build game" |

### Commands

| Command | Description |
|---------|-------------|
| `/new-nuxt-project` | Scaffold new Nuxt 4 project with conventions |
| `/new-landing-page` | Create landing page with sections and i18n |
| `/new-api-endpoint` | Create API endpoint with validation |
| `/new-drizzle-table` | Add database table with proper patterns |

### MCP Servers

Pre-configured MCP servers:
- **nuxt-remote** - Nuxt documentation
- **nuxt-ui-remote** - Nuxt UI component docs
- **nano-banan-pro** - (requires API key)
- **threejs** - Three.js scene manipulation

## MCP Configuration

Copy configs from `mcp-servers/configs/` to your project:

```bash
# For Nuxt-only projects
cp mcp-servers/configs/nuxt-dev.json .mcp.json

# For full-stack projects
cp mcp-servers/configs/full-stack.json .mcp.json
```

## Environment Variables

For MCP servers that require authentication:

```bash
# Nano Banan Pro
export NANO_BANAN_PRO_KEY=your-api-key
```

## Project Templates

Use `templates/CLAUDE.md.template` as a starting point for new project documentation.

## Tech Stack

This plugin is optimized for:
- **Frontend**: Nuxt 4, Vue 3, Nuxt UI 4, Tailwind CSS
- **Backend**: Nitro, Drizzle ORM, PostgreSQL
- **Auth**: nuxt-auth-utils, Google OAuth
- **Package Manager**: Bun
- **3D**: Three.js

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add agents/skills/commands following existing patterns
4. Submit a pull request

## License

MIT
