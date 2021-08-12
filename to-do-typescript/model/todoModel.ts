import { Schema, model, Model } from "mongoose";

interface todo {
  task: string;
  completed: boolean;
}

const schema = new Schema<todo>({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

var todoModel = model<todo>("backend_task", schema);

export default todoModel;
