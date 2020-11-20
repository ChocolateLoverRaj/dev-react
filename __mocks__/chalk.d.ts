import { SinonSpy } from 'sinon'
import chalk from 'chalk'

export function _reset(): void

declare namespace chalk {
  declare const keyword: SinonSpy<[typeof chalk.ForegroundColor], SinonSpy<[string], string>>
}

export default chalk
