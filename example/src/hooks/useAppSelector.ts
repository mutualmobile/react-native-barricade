import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../redux';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
