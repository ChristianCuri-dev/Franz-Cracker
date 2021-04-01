import * as Patcher from './patcher'

import * as Info from './info'

(async () => {
  Info.showInfo();

  Patcher.backupAsar()
  Patcher.unpackAsar()
  Patcher.patch()
  await Patcher.packAsar()
  Patcher.removeUnpackedDir()
})()