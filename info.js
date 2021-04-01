import c from 'chalk'
import * as figlet from 'figlet'

const pack = require('./package.json')

export function showInfo() {
  console.log('')
  console.log(figlet.textSync('Franz Cracker', 'ANSI Shadow'))
  console.log(`${c.bold('• Description')}: ${pack.description}`)
  console.log(`${c.bold("• Version")}: ${pack.version}`)
  console.log(`${c.bold("• Author")}: ${pack.author}`)
  console.log(`${c.bold("• License")}: ${pack.license}`)
  console.log(`${c.bold("• Home Page")}: ${pack.homepage}`)
  console.log('')
}