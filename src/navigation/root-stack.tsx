import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { DetailScreen } from '../module/detail/detail-screen';
import { FavoriteScreen } from '../module/favorite/favorite-screen';
import { HomeScreen } from '../module/home/home-screen';
import { SearchScreen } from '../module/search/search-screen';
import { Route } from './route';

const Tab = createBottomTabNavigator();

const RootStack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{headerShown: false}}>
    <Tab.Screen name={Route.Home} component={HomeScreen} />
    <Tab.Screen name={Route.Search} component={SearchScreen} />
    <Tab.Screen name={Route.Favorite} component={FavoriteScreen} />
  </Tab.Navigator>
);

function TabNavigation() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name={Route.Tab}
        options={{ headerShown: false }}
        component={TabNavigator}
      />
      <RootStack.Screen name={Route.Detail} component={DetailScreen} />
    </RootStack.Navigator>
  );
}

export type NavigationParamList = {
  [Route.Home]: undefined;
  [Route.Search]: undefined;
  [Route.Favorite]: undefined;
  [Route.Tab]: undefined;
  [Route.Detail]: undefined;
};

export const Navigation = TabNavigation;
