import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join, resolve } from 'path'

interface Component {
  id: string
  name: string
  type: 'agent' | 'skill' | 'command' | 'mcp'
  description: string
  path: string
  content: string
}

async function generateData() {
  const rootDir = resolve(process.cwd(), '..')
  const components: Component[] = []

  // Read agents
  try {
    const agentsDir = join(rootDir, 'agents')
    const agentFiles = await readdir(agentsDir)
    for (const file of agentFiles) {
      if (file.endsWith('.md')) {
        const content = await readFile(join(agentsDir, file), 'utf-8')
        const name = file.replace('.md', '').replace(/-/g, ' ')
        const descMatch = content.match(/##\s*(?:Purpose|Description)[:\s]*([^\n]+)/i)
        components.push({
          id: `agent-${file.replace('.md', '')}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          type: 'agent',
          description: descMatch?.[1] || 'AI agent for specialized tasks',
          path: `agents/${file}`,
          content
        })
      }
    }
  } catch (e) {
    console.error('Error reading agents:', e)
  }

  // Read skills
  try {
    const skillsDir = join(rootDir, 'skills')
    const skillDirs = await readdir(skillsDir)
    for (const dir of skillDirs) {
      const skillFile = join(skillsDir, dir, 'SKILL.md')
      try {
        const content = await readFile(skillFile, 'utf-8')
        const descMatch = content.match(/##\s*(?:Description|Purpose)[:\s]*([^\n]+)/i)
        components.push({
          id: `skill-${dir}`,
          name: dir.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          type: 'skill',
          description: descMatch?.[1] || 'Pattern/skill for development',
          path: `skills/${dir}/SKILL.md`,
          content
        })
      } catch {}
    }
  } catch (e) {
    console.error('Error reading skills:', e)
  }

  // Read commands
  try {
    const commandsDir = join(rootDir, 'commands')
    const commandFiles = await readdir(commandsDir)
    for (const file of commandFiles) {
      if (file.endsWith('.md')) {
        const content = await readFile(join(commandsDir, file), 'utf-8')
        const name = file.replace('.md', '')
        const descMatch = content.match(/##\s*(?:Description|Purpose)[:\s]*([^\n]+)/i)
        components.push({
          id: `command-${name}`,
          name: '/' + name,
          type: 'command',
          description: descMatch?.[1] || 'Scaffold command',
          path: `commands/${file}`,
          content
        })
      }
    }
  } catch (e) {
    console.error('Error reading commands:', e)
  }

  // Read MCP config
  try {
    const mcpFile = join(rootDir, '.mcp.json')
    const mcpContent = await readFile(mcpFile, 'utf-8')
    const mcp = JSON.parse(mcpContent)
    if (mcp.mcpServers) {
      for (const [name, config] of Object.entries(mcp.mcpServers)) {
        components.push({
          id: `mcp-${name}`,
          name: name,
          type: 'mcp',
          description: (config as any).type === 'http' ? `HTTP: ${(config as any).url}` : 'stdio server',
          path: '.mcp.json',
          content: JSON.stringify(config, null, 2)
        })
      }
    }
  } catch (e) {
    console.error('Error reading MCP config:', e)
  }

  // Write the data file
  await mkdir(join(process.cwd(), 'app', 'data'), { recursive: true })
  await writeFile(
    join(process.cwd(), 'app', 'data', 'components.json'),
    JSON.stringify(components, null, 2)
  )

  console.log(`Generated data for ${components.length} components`)
}

generateData()
