import readCreateDir from '../read-create-dir.js'
import { SinonSpy } from 'sinon'

type ReadDir = typeof readCreateDir

export function _reset(): void

declare const spy: SinonSpy<Parameters<ReadDir>, ReturnType<ReadDir>>

export default spy
