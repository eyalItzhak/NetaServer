import mongoose from "mongoose";

interface RoomAttrs {
  title: string;
  description: string;
  initialCode: string;
  solution: string;
}

enum Roles {
  Student = "Student",
  Mentor = "Mentor",
}

interface RoomModel extends mongoose.Model<RoomDoc> {
  build(attrs: RoomAttrs): RoomDoc;
}

interface RoomDoc extends mongoose.Document {
  title: string;
  description: string;
  initialCode: string;
  solution: string;
}

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    initialCode: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

roomSchema.statics.build = (attrs: RoomAttrs) => {
  return new Room(attrs);
};

const Room = mongoose.model<RoomDoc, RoomModel>("Room", roomSchema);

export { Room, Roles };
