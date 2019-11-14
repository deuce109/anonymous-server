import { Server } from "./index";
import { Express, Request, Response } from "express";
import { Database } from "../database";
import express = require("express");
import { readFileSync } from "fs";

export class ExpressServer implements Server {
  constructor(app: Express, port: number, db: Database) {
    //Allows us to access request.body as a JSON Object
    app.use(express.json());

    //Get all items for a specified app
    app.get("/:app/objects", async (req: Request, res: Response) => {
      let result = { result: await db.getAll(req.params.app) };
      res.send(result);
    });

    //Get specified item for a specified app
    app.get("/:app/objects/:id", async (req: Request, res: Response) => {
      let result = (await db.get(req.params.app, req.params.id)) || null;
      res.status(result != null ? 200 : 500).send(result);
    });

    //Overwrite a specific item for a specified app
    app.put("/:app/objects/:id", async (req: Request, res: Response) => {
      let success = await this.db.overwrite(
        req.params.app,
        req.params.id,
        req.body
      );
      res.status(success ? 200 : 500).send();
    });

    //Update a specific item for a specified app
    app.patch("/:app/objects/:id", async (req: Request, res: Response) => {
      let success = await this.db.update(
        req.params.app,
        req.params.id,
        req.body
      );
      res.status(success ? 200 : 500).send();
    });

    //Add a specific item for a specified app
    app.post("/:app/objects", async (req: Request, res: Response) => {
      console.log(JSON.stringify(req.body));
      db.insert(req.body, req.params.app);
      res.status(200).send();
    });

    //Delete a specific item for a specified app
    app.delete("/:app/objects/:id", async (req: Request, res: Response) => {
      let success: boolean = await this.db.delete(
        req.params.app,
        req.params.id
      );
      res.status(success ? 200 : 500).send();
    });

    app.get("/health", async (req: Request, res: Response) => {
      let health: any = {};
      health["serverStatus"] = "Up";
      health["databaseStatus"] = this.db.ping() ? "Connected" : "Disconnected";
      res.send(health);
    });

    app.get("/logs", async (req: Request, res: Response) => {
      let logs = readFileSync("./server.log");
      res.send(logs);
    });

    //Enable if not in production
    if (process.env.NODE_ENV !== "production") {
      //Endpoint to clear database for a specific app
      app.delete("/:app/objects", async (req: Request, res: Response) => {
        let success = await this.db.delAll(req.params.app);
        res.status(success ? 200 : 500).send();
      });
    }

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
