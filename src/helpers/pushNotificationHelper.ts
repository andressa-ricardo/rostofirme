import { Expo } from "expo-server-sdk";

const expo = new Expo();

export const sendPushNotification = async (
  pushToken: string,
  title: string,
  body: string
) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  const message = {
    to: pushToken,
    sound: "default",
    title,
    body,
  };

  try {
    await expo.sendPushNotificationsAsync([message]);
    console.log("Push notification sent successfully");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};
