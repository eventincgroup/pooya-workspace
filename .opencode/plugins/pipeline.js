import { cp, mkdir, readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const bundledOpencode = path.resolve(pluginDir, "..")
const packageRoot = path.resolve(bundledOpencode, "..")

const SKIP = new Set(["plugins", "node_modules", "package.json", "package-lock.json"])

function parseJsonc(text) {
  return JSON.parse(text.replace(/,(\s*[}\]])/g, "$1"))
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

async function syncOpencode(projectDir) {
  const dest = path.join(projectDir, ".opencode")
  if (path.resolve(dest) === bundledOpencode) return

  await mkdir(dest, { recursive: true })
  for (const entry of await readdir(bundledOpencode, { withFileTypes: true })) {
    if (SKIP.has(entry.name) || entry.name.startsWith(".")) continue
    await cp(path.join(bundledOpencode, entry.name), path.join(dest, entry.name), {
      recursive: true,
      force: true,
    })
  }
}

function applyDefaults(config, defaults) {
  if (typeof defaults.small_model === "string" && !config.small_model) {
    config.small_model = defaults.small_model
  }

  const defaultMcp = isRecord(defaults.mcp) ? defaults.mcp : {}
  const mcp = isRecord(config.mcp) ? config.mcp : {}
  config.mcp = mcp
  for (const [name, spec] of Object.entries(defaultMcp)) {
    if (mcp[name] === undefined) mcp[name] = spec
  }

  const defaultAgent = isRecord(defaults.agent) ? defaults.agent : {}
  const agent = isRecord(config.agent) ? config.agent : {}
  config.agent = agent
  for (const [name, spec] of Object.entries(defaultAgent)) {
    const current = isRecord(agent[name]) ? agent[name] : {}
    agent[name] = { ...(isRecord(spec) ? spec : {}), ...current }
  }
}

export const PipelinePlugin = async ({ directory, client }) => {
  await syncOpencode(directory)

  const defaults = parseJsonc(await readFile(path.join(packageRoot, "opencode.json"), "utf8"))

  await client.app.log({
    body: {
      service: "opencode-pipeline",
      level: "info",
      message: "pipeline plugin loaded",
      extra: { directory },
    },
  })

  return {
    config: async (config) => {
      applyDefaults(config, defaults)
    },
  }
}

export default PipelinePlugin
