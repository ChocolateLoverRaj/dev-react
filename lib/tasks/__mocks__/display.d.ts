import { SinonSpy } from 'sinon'

export function _reset(): void

class Display {
  update: SinonSpy<[Array<string>], Promise<void>>
  close: SinonSpy<[], Promise<void>>
}

export default Display
