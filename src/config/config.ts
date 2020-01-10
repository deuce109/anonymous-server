

export interface IConfig {
  data: IDataDefinition[]
  appName: string
  id: string
}

export interface IDataDefinition {
  name: string
  type: 'number' | 'string' | 'date' | 'boolean' | 'object' | 'array'
  objectDefinitions?: IDataDefinition[]
  dateFormat?: string
  numberFormat?: {
    type: 'decimal' | 'integer';
  }
  encryption: 'none' | 'symmetric' | 'asymmetric'
}