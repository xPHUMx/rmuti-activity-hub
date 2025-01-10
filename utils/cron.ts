import cron from "node-cron";
import connectToDatabase from "./db";
import Activity from "../models/Activity";

connectToDatabase();

// Cron Job รันทุกนาที
cron.schedule("* * * * *", async () => {
  console.log("Running cron job to update activity status...");
  const now = new Date();

  const activities = await Activity.find({});
  for (const activity of activities) {
    if (activity.closeTime && new Date(activity.closeTime) < now) {
      if (activity.status !== "closed") {
        activity.status = "closed";
        await activity.save();
        console.log(`Activity ${activity.title} is now closed.`);
      }
    }
  }
});
