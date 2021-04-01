import fs from "fs-extra"
import path from 'path'
import * as Platform from './platform'
import * as asar from "asar"
import * as Diff from 'diff'
import os from 'os'
import natsort from "natsort";
import c from 'chalk'

const GREEN_ARROW = c.green('==>');

export const findAsarUnix = (...files) => files.find(file => fs.existsSync(file));

export const findAsarMac = () => findAsarUnix("/Applications/Franz.app/Contents/Resources/app.asar")

export const findAsarWindows = () => {
  const franzPath = path.join(os.homedir(), "AppData/Local/Programs/franz")
  if (!fs.existsSync(franzPath)) return undefined

  const apps = fs
    .readdirSync(franzPath)
    .filter((item) => item.match(/^app-\d+\.\d+\.\d+$/))

  let [app] = apps.sort(natsort({desc: true}))[0]
  if (!app) return undefined;
  
  app = path.join(franzPath, app, "resources/app.asar");
  return fs.existsSync(app) ? app : undefined;
}

export const findAsar = (dir) => {
  if (dir) return path.normalize(dir) + ".asar";

  const platform = Platform.getPlatform()

  switch(platform) {
    case Platform.Platforms.macOS:
      return findAsarMac();
    case Platform.Platforms.windows:
      return findAsarWindows();
  }
}

export const getAsarDir = (asarPath = null) => {
  const filePath = asarPath || findAsar()
  return path.join(
    path.dirname(filePath),
    path.basename(filePath, path.extname(filePath)),
  )
}

export const backupAsar = () => {
  const asarPath = findAsar()
  const backup = `${asarPath}.${+new Date()}.backup`
  fs.copySync(asarPath, backup)

  console.log(`${GREEN_ARROW} Backup app.asar ${c.green(asarPath)} -> ${c.green(backup)}`)

  return backup;
}

export const unpackAsar = () => {
  const asarPath = findAsar()
  const dir = getAsarDir(asarPath)

  console.log(`${GREEN_ARROW} Unpack ${c.green(asarPath)} -> ${c.green(dir)}`)

  asar.extractAll(asarPath, dir);
}

export const packAsar = async () => {
  const asarPath = findAsar()
  const dir = getAsarDir(asarPath)

  console.log(`${GREEN_ARROW} Pack ${c.green(dir)} -> ${c.green(asarPath)}`)

  return asar.createPackage(dir, asarPath)
}

export const removeUnpackedDir = () => {
  const dir = getAsarDir()

  console.log(`${GREEN_ARROW} Delete unpacked folder ${c.green(dir)}`)

  fs.removeSync(dir);
}

export function patch() {
  const patches = Diff.parsePatch(
    fs.readFileSync(
      path.resolve('./patch/premium.diff'), 
      'utf8'
    )
  )

  for(const patch of patches) 
    applyPatch(patch)
}

function applyPatch(patch) {
  const dir = getAsarDir()

  const patchDir = path.join(dir, patch.oldFileName)

  console.log(`${GREEN_ARROW} Apply patch ${c.green(patchDir)}`)

  const sourceData = fs.readFileSync(
    patchDir, 
    'utf8'
  )
  const sourcePatchedData = Diff.applyPatch(sourceData, patch)
  if (sourcePatchedData === false) throw new Error(`Can't patch ${patch.oldFileName}`)
  if (patch.oldFileName !== patch.newFileName) fs.unlinkSync(path.join(dir, patch.oldFileName))
  fs.writeFileSync(
    path.join(dir, patch.newFileName),
    sourcePatchedData,
    "utf8",
  );
}