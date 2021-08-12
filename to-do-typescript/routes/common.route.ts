import { CommonRoutesConfig } from "./config";
import express from "express";
import todoModel from "../model/todoModel";

export class CommonRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "CommonRoutes");
  }

  configureRoutes() {
    this.app
      .route("/fetchAllTasks")
      .get(async (req: express.Request, res: express.Response) => {
        var taskList = await todoModel.find();
        var responseObject = taskList.map((task) => task.task);
        res.send(responseObject);
      });
    return this.app;
  }
}
