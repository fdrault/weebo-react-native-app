import { NavigationContainer } from '@react-navigation/native';
import { Navigation } from './navigation/root-stack';

export function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
