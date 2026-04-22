import mongoose, { Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    _id: { type: String, required: true },
    /** New practice tokens per user per UTC week; `0` = unlimited. */
    freePracticeStartsPerWeek: { type: Number, default: 0, min: 0 },
  },
  { collection: "site_settings" }
);

export type SiteSettingsDocument = mongoose.InferSchemaType<typeof SiteSettingsSchema>;

const SiteSettingsModel =
  (models.SiteSettings as mongoose.Model<SiteSettingsDocument>) ||
  model<SiteSettingsDocument>("SiteSettings", SiteSettingsSchema);

export default SiteSettingsModel;
