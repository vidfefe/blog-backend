import { model, Schema } from "mongoose";
import { CommentSchema } from "./Comment.js";
const PostSchema = new Schema({
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
}, {
    timestamps: true,
});
PostSchema.virtual("viewsCount").get(function () {
    return this.views.length;
});
PostSchema.virtual("likesCount").get(function () {
    return this.likes.length;
});
PostSchema.virtual("isLikedByMe").get(function () {
    const uid = this.$locals.currentUserId;
    if (!uid)
        return false;
    return this.likes.some((id) => id.toString() === uid);
});
PostSchema.index({ _id: 1, likes: 1 }, { unique: true, sparse: true });
PostSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.likes;
        delete ret.views;
    },
});
export const PostModel = model("Post", PostSchema);
