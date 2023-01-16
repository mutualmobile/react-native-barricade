import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
