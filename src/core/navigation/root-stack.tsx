import { Route } from '@/core/navigation/route';
import {
  DetailScreen,
  DetailScreenParams,
} from '@/module/detail/detail-screen';
import { FavoriteScreen } from '@/module/favorite/favorite-screen';
import { HomeScreen } from '@/module/home/home-screen';
import { SearchScreen } from '@/module/search/search-screen';
import { TabBar } from '@/ui/tab-bar';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

const RootStack = createStackNavigator<NavigationParamList>();

const renderTabBar = (props: BottomTabBarProps) => <TabBar {...props} />;

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
    <Tab.Screen name={Route.Home} component={HomeScreen} />
    <Tab.Screen name={Route.Search} component={SearchScreen} />
    <Tab.Screen name={Route.Favorite} component={FavoriteScreen} />
  </Tab.Navigator>
);

function TabNavigation() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name={Route.Tab} component={TabNavigator} />
      <RootStack.Screen name={Route.Detail} component={DetailScreen} />
    </RootStack.Navigator>
  );
}

export type NavigationParamList = {
  [Route.Home]: undefined;
  [Route.Search]: undefined;
  [Route.Favorite]: undefined;
  [Route.Tab]: undefined;
  [Route.Detail]: DetailScreenParams;
};

export const Navigation = TabNavigation;
