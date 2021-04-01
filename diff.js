const Diff = require('diff')
const path = require('path')
const fs = require('fs')

const original = fs.readFileSync(path.resolve('./ServerApi.js'), 'utf8')
const patched = fs.readFileSync(path.resolve('./ServerApi.patch.js'), 'utf8')

const diff = Diff.createTwoFilesPatch('api/server/ServerApi.js', 'api/server/ServerApi.js', original, patched)

fs.writeFileSync(path.resolve('./patch/premium.diff'), diff.split('\n').splice(2).join('\n'))

console.log(`Finished`)