import { FavoriteEntry } from '@/module/favorite/favorite-service';
import { AnimeRow } from '@/module/search/anime-row';
import { springConfig } from '@/style/animation';
import { colors } from '@/style/color';
import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

const ITEM_HEIGHT = 96;

interface DraggableFavoriteListProps {
  items: FavoriteEntry[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  style?: StyleProp<ViewStyle>;
}

export const DraggableFavoriteList = (props: DraggableFavoriteListProps) => {
  const { items, onReorder, style } = props;
  const dragActiveIndex = useSharedValue(-1);
  const dragY = useSharedValue(0);
  // Tracks the visual row of each item (identity at rest, updated on drop before
  // the store re-renders so items spring from the right position).
  const order = useSharedValue(items.map((_, i) => i));

  // Once the store re-renders with the new items array (already in correct order),
  // reset order to identity — items are already at the right position so no visual jump.
  useEffect(() => {
    order.value = items.map((_, i) => i);
  }, [items, order]);

  return (
    <View style={[style, { height: items.length * ITEM_HEIGHT }]}>
      {items.map((item, index) => (
        <DraggableItem
          key={item.id}
          item={item}
          index={index}
          totalCount={items.length}
          dragActiveIndex={dragActiveIndex}
          dragY={dragY}
          order={order}
          onReorder={onReorder}
        />
      ))}
    </View>
  );
};

interface DraggableItemProps {
  item: FavoriteEntry;
  index: number;
  totalCount: number;
  dragActiveIndex: ReturnType<typeof useSharedValue<number>>;
  dragY: ReturnType<typeof useSharedValue<number>>;
  order: ReturnType<typeof useSharedValue<number[]>>;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const DraggableItem = (props: DraggableItemProps) => {
  const { item, index, totalCount, dragActiveIndex, dragY, order, onReorder } =
    props;

  const animatedStyle = useAnimatedStyle(() => {
    const active = dragActiveIndex.value;
    // top is always 0 — translateY carries the full vertical position so that
    // Reanimated can spring from the real current position on drop (not from 'top').
    const baseY = order.value[index] * ITEM_HEIGHT;

    if (active === index) {
      return {
        transform: [{ translateY: baseY + dragY.value }, { scale: 1.03 }],
      };
    }

    let targetY = baseY;
    if (active !== -1) {
      const to = Math.max(
        0,
        Math.min(
          totalCount - 1,
          Math.round(active + dragY.value / ITEM_HEIGHT),
        ),
      );
      if (active < to && index > active && index <= to) targetY -= ITEM_HEIGHT;
      if (active > to && index >= to && index < active) targetY += ITEM_HEIGHT;
    }

    return {
      transform: [
        { translateY: withSpring(targetY, springConfig.snappy) },
        { scale: 1 },
      ],
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      dragActiveIndex.value = index;
      dragY.value = 0;
    })
    .onUpdate(e => {
      dragY.value = e.translationY;
    })
    .onEnd(() => {
      const to = Math.max(
        0,
        Math.min(totalCount - 1, Math.round(index + dragY.value / ITEM_HEIGHT)),
      );
      if (to !== index) {
        const newOrder = [...order.value];
        const [removed] = newOrder.splice(index, 1);
        newOrder.splice(to, 0, removed);
        order.value = newOrder; // set before clearing active so spring starts correctly
        runOnJS(onReorder)(index, to);
      }
      dragActiveIndex.value = -1;
      dragY.value = 0;
    });

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      <GestureDetector gesture={gesture}>
        <View style={styles.handle}>
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </View>
      </GestureDetector>
      <AnimeRow anime={item.data} style={styles.row} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  item: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  handle: {
    width: 44,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    width: 18,
    height: 2,
    backgroundColor: colors.grey,
    marginVertical: 2,
    borderRadius: 1,
  },
  row: {
    flex: 1,
  },
});
