import { Redirect } from 'expo-router';

/** Route the app's root deep link directly to the passenger dashboard. */
export default function IndexRoute() {
  return <Redirect href="/(tabs)/home" />;
}
