const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");

const sendEmail = require("../utils/sendEmail");

// 8 AM everyday
cron.schedule("0 8 * * *", async () => {
  // Send emails to all people who got requests the prev day

  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interesetd",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];

    for (const email of listOfEmails) {
      // send Emails
      //   const res = await sendEmail.run(
      //     email,
      //     "New Friend Requests pending for" + email,
      //     "Please login to devtinder.uk and accept or reject the requests"
      //   );
    }
  } catch (err) {
    console.error(err);
  }
});
