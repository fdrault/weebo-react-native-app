import { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/spring';

export const springConfig = {
  snappy: {
    stiffness: 150,
    damping: 20,
    mass: 1,
  },
  switch: {
    stiffness: 600,
    damping: 49,
    mass: 1,
  },
} satisfies { [key: string]: SpringConfig };
