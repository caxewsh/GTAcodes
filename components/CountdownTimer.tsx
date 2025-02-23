import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const AnimatedTimeUnit = ({ value, label, initialValue = 0 }: { value: number, label: string, initialValue?: number }) => {
  const animatedValue = React.useRef(new Animated.Value(initialValue)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value,
      useNativeDriver: true,
      friction: 8,
      tension: 8,
    }).start();
  }, [value]);

  return (
    <View style={styles.timeUnit}>
      <Animated.Text 
        style={[
          styles.number,
          {
            transform: [{
              translateY: animatedValue.interpolate({
                inputRange: [value - 1, value, value + 1],
                outputRange: [20, 0, -20],
              })
            }],
            opacity: animatedValue.interpolate({
              inputRange: [value - 1, value, value + 1],
              outputRange: [0, 1, 0],
            })
          }
        ]}
      >
        {value.toString().padStart(2, '0')}
      </Animated.Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const timerRef = React.useRef<NodeJS.Timeout>();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ 
    days: 365, // Default approximate value
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
        if (!isInitialized) setIsInitialized(true);
      }
    };

    calculateTimeLeft(); // Initial calculation
    timerRef.current = setInterval(calculateTimeLeft, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [targetDate]);

  return (
    <View style={styles.container}>
      <AnimatedTimeUnit value={timeLeft.days} label="JOURS" initialValue={365} />
      <AnimatedTimeUnit value={timeLeft.hours} label="HEURES" initialValue={23} />
      <AnimatedTimeUnit value={timeLeft.minutes} label="MINUTES" initialValue={59} />
      <AnimatedTimeUnit value={timeLeft.seconds} label="SECONDES" initialValue={59} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: 70,
    overflow: 'hidden',
  },
  number: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  label: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
}); 