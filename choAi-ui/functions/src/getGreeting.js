const functions = require("firebase-functions");
const moment = require("moment-timezone");

exports.getGreeting = functions.https.onCall(async (data, context) => {
  try {
    let timeZone;

    if (data.timeZone) {
      timeZone = data.timeZone;
    } else if (data.locale) {
      const now = moment().tz(moment.tz.guess(data.locale));
      const hour = now.hour();
      return getGreetingBasedOnHour(hour);
    } else {
      const nowUTC = moment.utc();
      return getGreetingBasedOnHour(nowUTC.hour());
    }
    if (timeZone) {
      const nowInClientTZ = moment().tz(timeZone);
      const hour = nowInClientTZ.hour();
      return getGreetingBasedOnHour(hour);
    }
  } catch (error) {
    console.error("Error getting greeting:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Could not determine the greeting."
    );
  }
});

function getGreetingBasedOnHour(hour) {
  if (hour >= 0 && hour < 12) {
    return "GOOD MORNING";
  } else if (hour >= 12 && hour < 17) {
    return "GOOD AFTERNOON";
  } else {
    return "GOOD EVENING";
  }
}
