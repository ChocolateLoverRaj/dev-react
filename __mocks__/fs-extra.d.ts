import { SinonSpy } from 'sinon'

export function _reset(): void

declare namespace fsExtra {
  declare const remove: SinonSpy<[string], Promise<void>>
}

export default fsExtra
