import { Server } from "./index";
import { Express, Request, Response } from "express";
import { Database } from "../database";
import { Stream } from "stream";
import { createReadStream, writeFileSync } from "fs";
export class ExpressServer implements Server {
  constructor(app: Express, port: number, db: Database) {
    app.get("/", (req: Request, res: Response) => {
      let file: Stream = createReadStream("./data.json");
      file.pipe(res);
    });

    app.get("/:id", (req: Request, res: Response) => {
      let filePathRegex: RegExp = /.*\..*/;
      if (!filePathRegex.test(req.params.id)) {
        writeFileSync("./data.json", JSON.stringify(req.params));
      }
      res.send("OK");
    });
    this.server = app;
    this.port = port;
    this.db = db;
  }

  listen(callback?: () => void) {
    let defaultLog = () => {
      console.log("Server running on port " + this.port);
    };
    this.server.listen(this.port, callback || defaultLog);
  }
  server: Express;
  port: number;
  db: Database;
}
