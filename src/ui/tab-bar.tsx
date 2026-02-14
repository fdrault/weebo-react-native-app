import { colors } from '@/style/color';
import { font } from '@/style/font';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface TabItem {
  icon: ImageSourcePropType;
  label: string;
  routeIndex: number;
}

const tabs: TabItem[] = [
  {
    icon: require('@images/24-home.png'),
    label: 'Accueil',
    routeIndex: 0,
  },
  {
    icon: require('@images/24-magnifier.png'),
    label: 'Recherche',
    routeIndex: 1,
  },
  {
    icon: require('@images/24-heart.png'),
    label: 'Favoris',
    routeIndex: 2,
  },
];

export const TabBar = (props: BottomTabBarProps) => {
  return (
    <View style={[styles.tabBar]}>
      {tabs.map(tab => RenderTab(tab, props))}
    </View>
  );
};

const RenderTab = (tabItem: TabItem, bottomBarProps: BottomTabBarProps) => {
  const { state, descriptors, navigation } = bottomBarProps;
  const route = state.routes[tabItem.routeIndex];
  const { options } = descriptors[route.key];
  const isFocused = state.index === tabItem.routeIndex;
  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({ name: route.name, merge: true, params: undefined });
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  return (
    <TouchableOpacity
      key={tabItem.label}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabContainer}
    >
      <Tab label={tabItem.label} icon={tabItem.icon} isFocused={isFocused} />
    </TouchableOpacity>
  );
};

interface TabProps {
  icon: ImageSourcePropType;
  label: string;
  style?: StyleProp<ViewStyle>;
  isFocused?: boolean;
}
const Tab = React.memo(
  (props: TabProps) => {
    const { icon, label, isFocused, style } = props;
    return (
      <View style={style}>
        <View style={[styles.centered]}>
          <Image
            source={icon}
            style={[
              {
                tintColor: isFocused ? colors.purple : colors.blueGrey,
              },
              styles.icon,
            ]}
          />
          <Text
            style={[styles.label, isFocused ? styles.labelFocused : undefined]}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {label}
          </Text>
        </View>
      </View>
    );
  },
  (a, b) => a.isFocused === b.isFocused,
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.purple90,
    paddingVertical: 16,
  },
  tabContainer: {
    flex: 1,
  },
  centered: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    ...StyleSheet.flatten(font.medium),
    fontSize: 11,
    color: colors.blueGrey,
  },
  labelFocused: {
    color: colors.purple,
  },
  unsafeFooterArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
  },
});
