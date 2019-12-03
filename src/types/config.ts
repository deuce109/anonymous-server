export interface IConfig {
  data: IDataDefinition[]
  appName: string
  id: string
}

export interface IDataDefinition {
  name: string
  type: 'number' | 'string' | 'date' | 'boolean' | 'object' | 'array'
  objectDefinition?: IDataDefinition
  dateFormat?: string
  numberFormat?: {
    type: 'decimal' | 'integer';
    decimalPoints?: number;
  }
  encryption: 'none' | 'symmetric' | 'asymmetric'
}
