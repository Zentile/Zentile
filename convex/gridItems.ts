import { query } from "./_generated/server";
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
