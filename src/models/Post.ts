import { Document, model, Schema, Types } from "mongoose";

import { CommentDocument, CommentSchema } from "./Comment";

export interface Post {
  title: string;
  text: string;
  tags: string[];
  views: Types.ObjectId[];
  likes: Types.ObjectId[];
  likesCount?: number;
  imageUrl: string;
  user: Types.ObjectId;
  comments: Types.DocumentArray<CommentDocument>;
  createdAt: Date;
  updatedAt: Date;
}

export type PostDocument = Document<Types.ObjectId> & Post;

const PostSchema = new Schema<PostDocument>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
    },
    comments: {
      type: [CommentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.virtual("viewsCount").get(function (this: PostDocument) {
  return this.views.length;
});

PostSchema.virtual("likesCount").get(function (this: PostDocument) {
  return this.likes.length;
});

PostSchema.virtual("isLikedByMe").get(function (this: PostDocument) {
  const uid = this.$locals.currentUserId as string | undefined;
  if (!uid) return false;
  return this.likes.some((id) => id.toString() === uid);
});

PostSchema.index({ _id: 1, likes: 1 }, { unique: true, sparse: true });

PostSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.likes;
    delete ret.views;
  },
});

export const PostModel = model<PostDocument>("Post", PostSchema);
