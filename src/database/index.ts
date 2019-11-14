export interface Database {
  connectionString: string;
  get: (appName: string, id: string) => Promise<any>;
  insert: (object: any, app: string) => Promise<any>;
  update: (appName: string, key: string, object) => Promise<any>;
  delete: (appName: string, key: string) => Promise<any>;
  getAll: (appName: string) => Promise<any[]>;
  delAll: (appName: string) => Promise<any>;
  overwrite: (appName: string, key: string, object: any) => Promise<any>;
  ping(): any;
}

export * from "./redis";
