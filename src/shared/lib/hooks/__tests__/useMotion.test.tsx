import React from 'react';
import { render } from '@testing-library/react-native';

import { useMotion } from '../useMotion';
import { MotionProvider } from '../../../ui/context/MotionContext';
import { motion, reducedMotionConfig } from '../../../constants/motion';


const mockUseReducedMotion = require('react-native-reanimated').useReducedMotion as jest.Mock;

function setupHook({
  preference,
  systemReduced,
}: {
  preference: 'system' | 'full' | 'reduced';
  systemReduced: boolean;
}) {
  mockUseReducedMotion.mockReturnValue(systemReduced);

  let captured: ReturnType<typeof useMotion>;

  function TestComponent() {
    captured = useMotion();
    return null;
  }

  render(
    <MotionProvider preference={preference}>
      <TestComponent />
    </MotionProvider>
  );
  return captured!;
}


beforeEach(() => jest.clearAllMocks());

describe('isReduced flag', () => {
  it('is true when preference is system and OS reports reduced motion', () => {
    const { isReduced } = setupHook({ preference: 'system', systemReduced: true });
    expect(isReduced).toBe(true);
  });

  it('is false when preference is full even if OS reports reduced motion', () => {
    const { isReduced } = setupHook({ preference: 'full', systemReduced: true });
    expect(isReduced).toBe(false);
  });

  it('is true when preference is reduced even if OS reports full motion', () => {
    const { isReduced } = setupHook({ preference: 'reduced', systemReduced: false });
    expect(isReduced).toBe(true);
  });

  it('is false when preference is system and OS reports full motion', () => {
    const { isReduced } = setupHook({ preference: 'system', systemReduced: false });
    expect(isReduced).toBe(false);
  });
});

describe('spring()', () => {
  it('returns timing-duration object when reduced', () => {
    const { spring } = setupHook({ preference: 'reduced', systemReduced: false });
    expect(spring('snappy')).toEqual({ duration: reducedMotionConfig.maxDuration });
  });

  it('returns full spring config when not reduced', () => {
    const { spring } = setupHook({ preference: 'full', systemReduced: false });
    expect(spring('snappy')).toEqual(motion.spring.snappy);
  });
});

describe('entering()', () => {
  it('returns the fallback entering animation when reduced', () => {
    const fakeAnim = {} as any;
    const { entering } = setupHook({ preference: 'reduced', systemReduced: false });
    expect(entering(fakeAnim)).toBe(reducedMotionConfig.fallbackEntering);
  });

  it('returns the original animation when not reduced', () => {
    const fakeAnim = {} as any;
    const { entering } = setupHook({ preference: 'full', systemReduced: false });
    expect(entering(fakeAnim)).toBe(fakeAnim);
  });
});

describe('exiting()', () => {
  it('returns the fallback exiting animation when reduced', () => {
    const fakeAnim = {} as any;
    const { exiting } = setupHook({ preference: 'reduced', systemReduced: false });
    expect(exiting(fakeAnim)).toBe(reducedMotionConfig.fallbackExiting);
  });
});

describe('timing()', () => {
  it('clamps duration to maxDuration when reduced', () => {
    const { timing } = setupHook({ preference: 'reduced', systemReduced: false });
    expect(timing(400).duration).toBeLessThanOrEqual(reducedMotionConfig.maxDuration);
  });

  it('returns original duration when not reduced', () => {
    const { timing } = setupHook({ preference: 'full', systemReduced: false });
    expect(timing(400).duration).toBe(400);
  });
});

describe('isReduced flag', () => {
  it('is true when preference is system and OS reports reduced motion', () => {
    const { isReduced } = setupHook({ preference: 'system', systemReduced: true });
    expect(isReduced).toBe(true);
  });

  it('is false when preference is full even if OS reports reduced motion', () => {
    const { isReduced } = setupHook({ preference: 'full', systemReduced: true });
    expect(isReduced).toBe(false);
  });

  it('is true when preference is reduced even if OS reports full motion', () => {
    const { isReduced } = setupHook({ preference: 'reduced', systemReduced: false });
    expect(isReduced).toBe(true);
  });

  it('is false when preference is system and OS reports full motion', () => {
    const { isReduced } = setupHook({ preference: 'system', systemReduced: false });
    expect(isReduced).toBe(false);
  });
});

describe('spring()', () => {
  it('returns timing-duration object when reduced', () => {
    const { spring } = setupHook({ preference: 'reduced', systemReduced: false });
    expect(spring('snappy')).toEqual({ duration: reducedMotionConfig.maxDuration });
  });

  it('returns full spring config when not reduced', () => {
    const { spring } = setupHook({ preference: 'full', systemReduced: false });
    expect(spring('snappy')).toEqual(motion.spring.snappy);
  });
});

describe('entering()', () => {
  it('returns the fallback entering animation when reduced', () => {
    const fakeAnim = {} as any;
    const { entering } = setupHook({ preference: 'reduced', systemReduced: false });
    expect(entering(fakeAnim)).toBe(reducedMotionConfig.fallbackEntering);
  });

  it('returns the original animation when not reduced', () => {
    const fakeAnim = {} as any;
    const { entering } = setupHook({ preference: 'full', systemReduced: false });
    expect(entering(fakeAnim)).toBe(fakeAnim);
  });
});

describe('exiting()', () => {
  it('returns the fallback exiting animation when reduced', () => {
    const fakeAnim = {} as any;
    const { exiting } = setupHook({ preference: 'reduced', systemReduced: false });
    expect(exiting(fakeAnim)).toBe(reducedMotionConfig.fallbackExiting);
  });
});

describe('timing()', () => {
  it('clamps duration to maxDuration when reduced', () => {
    const { timing } = setupHook({ preference: 'reduced', systemReduced: false });
    expect(timing(400).duration).toBeLessThanOrEqual(reducedMotionConfig.maxDuration);
  });

  it('returns original duration when not reduced', () => {
    const { timing } = setupHook({ preference: 'full', systemReduced: false });
    expect(timing(400).duration).toBe(400);
  });
});
