import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { radius } from '@/constants/Theme';

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 400;
const ROTATION_RANGE = 24;
const SPRING_CONFIG = { damping: 15, stiffness: 150 };
const EXIT_DURATION = 220;
const EXIT_DISTANCE = 420;

export type SwipeableCardHandle = {
  /** Animate card off to the left, then call `onSwipeLeft`. */
  swipeLeft: () => void;
  /** Animate card off to the right, then call `onSwipeRight`. */
  swipeRight: () => void;
};

type SwipeableCardProps = {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  enabled?: boolean;
};

function SwipeableCardImpl(
  { children, onSwipeLeft, onSwipeRight, enabled = true }: SwipeableCardProps,
  ref: React.ForwardedRef<SwipeableCardHandle>
) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const exitLock = useSharedValue(0);
    /** Prevents double-firing programmatic swipe from action buttons (JS thread). */
    const programmaticSwipeRef = useRef(false);

    const triggerSwipeLeft = useCallback(() => {
      onSwipeLeft();
    }, [onSwipeLeft]);

    const triggerSwipeRight = useCallback(() => {
      onSwipeRight();
    }, [onSwipeRight]);

    const animateExitLeft = useCallback(() => {
      if (programmaticSwipeRef.current) return;
      programmaticSwipeRef.current = true;
      exitLock.value = 1;
      translateY.value = withTiming(0, { duration: EXIT_DURATION });
      translateX.value = withTiming(-EXIT_DISTANCE, { duration: EXIT_DURATION }, (finished) => {
        if (finished) {
          runOnJS(triggerSwipeLeft)();
        } else {
          programmaticSwipeRef.current = false;
          exitLock.value = 0;
        }
      });
    }, [exitLock, translateX, translateY, triggerSwipeLeft]);

    const animateExitRight = useCallback(() => {
      if (programmaticSwipeRef.current) return;
      programmaticSwipeRef.current = true;
      exitLock.value = 1;
      translateY.value = withTiming(0, { duration: EXIT_DURATION });
      translateX.value = withTiming(EXIT_DISTANCE, { duration: EXIT_DURATION }, (finished) => {
        if (finished) {
          runOnJS(triggerSwipeRight)();
        } else {
          programmaticSwipeRef.current = false;
          exitLock.value = 0;
        }
      });
    }, [exitLock, translateX, translateY, triggerSwipeRight]);

    useImperativeHandle(
      ref,
      () => ({
        swipeLeft: () => {
          animateExitLeft();
        },
        swipeRight: () => {
          animateExitRight();
        },
      }),
      [animateExitLeft, animateExitRight]
    );

    /** Let parent ScrollView take vertical drags; only lock after clear horizontal intent. */
    const panGesture = Gesture.Pan()
      .activeOffsetX([-26, 26])
      .failOffsetY([-18, 18])
      .onUpdate((e) => {
        if (!enabled) return;
        if (exitLock.value === 1) return;
        translateX.value = e.translationX;
        translateY.value = e.translationY * 0.3;
      })
      .onEnd((e) => {
        if (!enabled) return;
        if (exitLock.value === 1) return;
        const shouldSwipeRight =
          translateX.value > SWIPE_THRESHOLD || e.velocityX > VELOCITY_THRESHOLD;
        const shouldSwipeLeft =
          translateX.value < -SWIPE_THRESHOLD || e.velocityX < -VELOCITY_THRESHOLD;

        if (shouldSwipeRight) {
          exitLock.value = 1;
          translateX.value = withTiming(EXIT_DISTANCE, { duration: 200 }, (finished) => {
            if (finished) {
              runOnJS(triggerSwipeRight)();
            } else {
              exitLock.value = 0;
            }
          });
          translateY.value = withTiming(0);
        } else if (shouldSwipeLeft) {
          exitLock.value = 1;
          translateX.value = withTiming(-EXIT_DISTANCE, { duration: 200 }, (finished) => {
            if (finished) {
              runOnJS(triggerSwipeLeft)();
            } else {
              exitLock.value = 0;
            }
          });
          translateY.value = withTiming(0);
        } else {
          translateX.value = withSpring(0, SPRING_CONFIG);
          translateY.value = withSpring(0, SPRING_CONFIG);
        }
      });

    const cardAnimatedStyle = useAnimatedStyle(() => {
      const rotate = interpolate(
        translateX.value,
        [-200, 0, 200],
        [-ROTATION_RANGE, 0, ROTATION_RANGE]
      );
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotate}deg` },
        ],
      };
    });

    const cardTintStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        translateX.value,
        [-120, -60, 0, 60, 120],
        [
          'rgba(239, 68, 68, 0.4)',
          'rgba(239, 68, 68, 0.15)',
          'transparent',
          'rgba(16, 185, 129, 0.15)',
          'rgba(16, 185, 129, 0.4)',
        ]
      );
      return { backgroundColor };
    });

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardWrap, cardAnimatedStyle]}>
          <Animated.View style={[styles.cardTint, cardTintStyle]} pointerEvents="none" />
          {children}
        </Animated.View>
      </GestureDetector>
    );
}

export const SwipeableCard = forwardRef<SwipeableCardHandle, SwipeableCardProps>(SwipeableCardImpl);

SwipeableCard.displayName = 'SwipeableCard';

export default SwipeableCard;

const styles = StyleSheet.create({
  cardWrap: {
    width: '100%',
    overflow: 'visible',
  },
  cardTint: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.xl,
    zIndex: 1,
  },
});
