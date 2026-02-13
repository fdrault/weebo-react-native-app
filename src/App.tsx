import { NavigationContainer } from '@react-navigation/native';
import { Navigation } from './core/navigation/root-stack';

export function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
