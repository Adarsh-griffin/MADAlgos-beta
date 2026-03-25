import mongoose, { Schema, model, models } from "mongoose";

export interface TimeSlotDocument {
  id: number;
  /** e.g. "Mon–Fri" or "Weekend" */
  dayLabel: string;
  startTime: string;
  endTime: string;
  /** Human label for emails */
  displayLabel: string;
}

const TimeSlotSchema = new Schema<TimeSlotDocument>(
  {
    id: { type: Number, required: true, unique: true },
    dayLabel: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    displayLabel: { type: String, required: true },
  },
  { collection: "time_slots" }
);

const TimeSlotModel =
  (models.TimeSlot as mongoose.Model<TimeSlotDocument>) ||
  model<TimeSlotDocument>("TimeSlot", TimeSlotSchema);

export default TimeSlotModel;
