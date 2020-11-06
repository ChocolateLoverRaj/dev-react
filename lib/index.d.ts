import { Application } from 'express'

declare class DevReact {
  constructor(inputDir: string)

  inputDir: string
  server: Application

  watch(): Promise<void>
}

export default DevReact
