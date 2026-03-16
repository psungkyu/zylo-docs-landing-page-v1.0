import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  evaluations: defineTable({
    url: v.string(),
    status: v.union(v.literal("running"), v.literal("completed"), v.literal("failed")),
    step: v.string(),
    progress: v.number(),
    result: v.optional(v.any()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_status", ["status"]),
});
