import { useEffect, EffectCallback } from 'react';

export function useMountEffect(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effect, []);
}
