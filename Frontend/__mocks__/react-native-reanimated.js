const React = require('react');
const RN = require('react-native');

const Easing = {
  bezier: (..._args) => () => 0,
  out: (fn) => fn,
  in: (fn) => fn,
  inOut: (fn) => fn,
  ease: () => 0,
};

const FadeIn = { duration: (t) => ({ duration: t }) };
const FadeOut = { duration: (t) => ({ duration: t }) };
const FadeInDown = FadeIn;
const FadeOutDown = FadeOut;

const useSharedValue = (v) => ({ value: v });
const withSpring = (v) => v;
const withTiming = (v) => v;
const withRepeat = (v) => v;
const withSequence = (v) => v;

function useAnimatedStyle(fn) {
  // Return a proxy so reading properties calls the style function to get current values
  return new Proxy({}, {
    get(_, prop) {
      const res = fn();
      return res ? res[prop] : undefined;
    }
  });
}

const useAnimatedProps = (fn) => fn();
const useDerivedValue = (fn) => ({ value: typeof fn === 'function' ? fn() : undefined });
const useReducedMotion = () => false;

const createAnimatedComponent = (Comp) => Comp;

const runOnJS = (fn) => fn;

// Minimal useEvent implementation used by gesture-handler's useAnimatedGesture
const useEvent = (handler) => {
  return React.useCallback((event) => {
    try {
      if (typeof handler === 'function') handler(event);
      else if (handler && typeof handler.handler === 'function') handler.handler(event);
    } catch (e) {
      // swallow in tests
    }
  }, [handler]);
};

module.exports = {
  __esModule: true,
  default: {
    createAnimatedComponent,
    View: RN.View,
    Text: RN.Text,
    Image: RN.Image,
  },
  Easing,
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeOutDown,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  useReducedMotion,
  createAnimatedComponent,
  runOnJS,
  useEvent,
};
