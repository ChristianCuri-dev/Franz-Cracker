export const Platforms = {
  linux: 1,
  windows: 2,
  macOS: 3
}

export const getPlatform = () => {
  if (process.platform === 'linux') return Platforms.linux
  if (process.platform === 'darwin') return Platforms.macOS
  if (process.platform === 'win32') return Platforms.windows

  console.error(`Unsupported platform`)

  return process.exit(1)
}