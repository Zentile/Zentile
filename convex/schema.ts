import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Example table for grid items
  gridItems: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    order: v.optional(v.number()),
    isActive: v.boolean(),
  }).index("by_category", ["category"])
    .index("by_order", ["order"])
    .index("by_active", ["isActive"]),

  // Example table for site configuration
  siteConfig: defineTable({
    key: v.string(),
    value: v.any(),
    description: v.optional(v.string()),
  }).index("by_key", ["key"]),
});
