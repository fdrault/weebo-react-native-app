import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface GridProps<T> {
  style?: StyleProp<ViewStyle>;
  rowSize: number;
  rowGap: number;
  columnGap: number;
  data: T[];
  renderItem: (it: T, index?: number, data?: T[]) => React.ReactNode;
}

const repeat = <T,>(length: number, factory: (index: number) => T) =>
  new Array(length).fill(null).map((_, index) => factory(index));

export const Grid = <T,>(props: GridProps<T>) => {
  const { style, rowSize, data, renderItem, rowGap, columnGap } = props;
  if (!rowSize || rowSize <= 0 || data.length === 0) return null;

  const nbElements = data.length;
  const nbRows = Math.ceil(nbElements / rowSize);
  return (
    <View style={[style, { rowGap }]}>
      {repeat(nbRows, rowIndex => {
        return (
          <View key={`${rowIndex}`} style={[styles.container, { columnGap }]}>
            {repeat(rowSize, columnIndex => {
              const itemIndex = rowIndex * rowSize + columnIndex;
              return (
                <View key={`${itemIndex}`} style={[styles.columnFill]}>
                  {itemIndex < nbElements
                    ? renderItem(data[itemIndex], itemIndex, data)
                    : null}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  columnFill: {
    flexDirection: 'column',
    flexBasis: 0,
    flexGrow: 1,
  },
});
