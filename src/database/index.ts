export interface Database {
  connectionString: string;
  get: (selector: (object: any, key?: any) => any) => any;
  insert: (object: any) => void;
  update: (selector: (object: any, key?: any) => any, object) => void;
  delete: (selector: (object: any, key?: any) => any) => void;
  getAll: () => any[];
}

export * from "./redis";
