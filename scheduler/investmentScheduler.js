const cron = require("node-cron");
const investmentModel = require("../models/investModel");

// helper
const applyIncrease = (amount, percent) => {
  return amount + (amount * percent) / 100;
};

// PLAN CONFIG (clean + reusable)
const PLAN_CONFIG = {
  "SHORT TERM": { percent: 5, interval: 5 },
  "CLASSIC PLAN": { percent: 8, interval: 6 },
  "PRO PLAN": { percent: 10, interval: 7 },
  "Deriv Bot": { percent: 15, interval: 10 },
};

// run every minute
cron.schedule("* * * * *", async () => {
  try {
    const investments = await investmentModel.find({ status: "active" });
    const now = new Date();

    for (let inv of investments) {
      const config = PLAN_CONFIG[inv.plan?.name];

      if (!config) continue;

      const { percent, interval } = config;

      const lastTime = inv.lastCalculatedAt || inv.startDate;

      const diffMinutes = (now - lastTime) / (1000 * 60);

      // 🔥 handle MULTIPLE missed cycles
      const cycles = Math.floor(diffMinutes / interval);

      if (cycles > 0) {
        let baseAmount =
          inv.updatedAmount !== null && inv.updatedAmount !== undefined
            ? inv.updatedAmount
            : inv.amountInvested;

        // apply increase multiple times if needed
        for (let i = 0; i < cycles; i++) {
          baseAmount = applyIncrease(baseAmount, percent);
        }

        inv.updatedAmount = baseAmount;
        inv.lastCalculatedAt = new Date(
          lastTime.getTime() + cycles * interval * 60000
        );

        await inv.save();
      }
    }

    console.log("✅ Scheduler executed");
  } catch (err) {
    console.error("❌ Scheduler error:", err);
  }
});