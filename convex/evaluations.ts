import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createEvaluation = mutation({
  args: { url: v.string() },
  handler: async (ctx, { url }) => {
    const now = Date.now();
    return await ctx.db.insert("evaluations", {
      url,
      status: "running",
      step: "queued",
      progress: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProgress = mutation({
  args: {
    evaluationId: v.id("evaluations"),
    step: v.string(),
    progress: v.number(),
  },
  handler: async (ctx, { evaluationId, step, progress }) => {
    await ctx.db.patch(evaluationId, {
      step,
      progress,
      updatedAt: Date.now(),
    });
  },
});

export const setCompleted = mutation({
  args: {
    evaluationId: v.id("evaluations"),
    result: v.any(),
  },
  handler: async (ctx, { evaluationId, result }) => {
    await ctx.db.patch(evaluationId, {
      status: "completed",
      step: "completed",
      progress: 100,
      result,
      updatedAt: Date.now(),
    });
  },
});

export const setFailed = mutation({
  args: {
    evaluationId: v.id("evaluations"),
    error: v.string(),
  },
  handler: async (ctx, { evaluationId, error }) => {
    await ctx.db.patch(evaluationId, {
      status: "failed",
      step: "failed",
      error,
      updatedAt: Date.now(),
    });
  },
});

export const getEvaluation = query({
  args: { id: v.id("evaluations") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
