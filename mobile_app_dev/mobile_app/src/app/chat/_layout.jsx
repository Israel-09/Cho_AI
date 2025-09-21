import { Stack } from "expo-router";

const chatLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="home" />
  );
};
export default chatLayout;
