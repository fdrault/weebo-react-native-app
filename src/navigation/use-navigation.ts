import { useNavigation as useReactNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationParamList } from './root-stack';

export const useNavigation = useReactNavigation<
  StackNavigationProp<NavigationParamList>
>;
