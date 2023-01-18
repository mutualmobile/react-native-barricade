import { Animated, FlatList } from 'react-native';

jest.spyOn(Animated, 'FlatList', 'get').mockImplementation(() => FlatList);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
