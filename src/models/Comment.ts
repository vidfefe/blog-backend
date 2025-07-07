import { Document, model, Schema, Types } from "mongoose";

export interface Comment {
  text: String;
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CommentDocument = Document<Types.ObjectId> & Comment;

export const CommentSchema = new Schema<CommentDocument>(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

export const CommentModel = model<CommentDocument>("Comment", CommentSchema);
