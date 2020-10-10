import { PluginObj } from '@babel/core'

declare function createPlugin(map: Map<string, string>): PluginObj

export default createPlugin
