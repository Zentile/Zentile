import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listGridItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("gridItems")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();
  },
});

export const getGridItemsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gridItems")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();
  },
});

/**
 * GRID TILE MUTATIONS
 */
export const createGridItem = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("gridItems", {
      ...args,
      isActive: true,
    });
  },
});

export const updateGridItem = mutation({
  args: {
    id: v.id("gridItems"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteGridItem = mutation({
  args: { id: v.id("gridItems") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});