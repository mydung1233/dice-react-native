import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

const diceImages = {
  1: require('./assets/dice/dice-1.png'),
  2: require('./assets/dice/dice-2.png'),
  3: require('./assets/dice/dice-3.png'),
  4: require('./assets/dice/dice-4.png'),
  5: require('./assets/dice/dice-5.png'),
  6: require('./assets/dice/dice-6.png'),
};

const randomFace = () => Math.floor(Math.random() * 6) + 1;

// Ngưỡng lực lắc (đơn vị g). Tăng số này nếu thấy quá nhạy.
const SHAKE_THRESHOLD = 1.8;
const ROLL_DURATION = 800;

// Rung phản hồi, bọc try/catch vì bản web không hỗ trợ
const haptic = (fn) => {
  try {
    fn();
  } catch (e) {}
};

export default function App() {
  const [diceValue, setDiceValue] = useState(1);
  const [rollCount, setRollCount] = useState(0);
  const [shakeEnabled, setShakeEnabled] = useState(true);

  const spin = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const isRolling = useRef(false); // dùng ref để tránh closure cũ trong listener

  const rollDice = useCallback(() => {
    if (isRolling.current) return; // đang lăn thì bỏ qua
    isRolling.current = true;

    haptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

    spin.setValue(0);
    scale.setValue(1);

    // Đổi mặt liên tục trong lúc xoay cho giống xúc xắc đang lăn
    const flicker = setInterval(() => setDiceValue(randomFace()), 90);

    Animated.parallel([
      Animated.timing(spin, {
        toValue: 1,
        duration: ROLL_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.3,
          duration: ROLL_DURATION / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: ROLL_DURATION / 2,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      clearInterval(flicker);
      setDiceValue(randomFace()); // kết quả cuối cùng
      setRollCount((c) => c + 1);
      isRolling.current = false;
      haptic(() =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      );
    });
  }, [spin, scale]);

  // Lắc điện thoại để tung xúc xắc
  useEffect(() => {
    if (!shakeEnabled) return;

    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x * x + y * y + z * z);
      if (force > SHAKE_THRESHOLD) {
        rollDice();
      }
    });

    return () => subscription && subscription.remove();
  }, [shakeEnabled, rollDice]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'], // xoay 2 vòng
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6A1B9A" />

      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Dice</Text>
      </View>

      <View style={styles.body}>
        <Animated.Image
          source={diceImages[diceValue]}
          style={[
            styles.dice,
            { transform: [{ rotate }, { scale }] },
          ]}
        />

        <Text style={styles.result}>Kết quả: {diceValue}</Text>
        <Text style={styles.count}>Số lần lắc: {rollCount}</Text>

        <Pressable
          onPress={rollDice}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Lắc xúc xắc</Text>
        </Pressable>

        <Pressable
          onPress={() => setShakeEnabled((v) => !v)}
          style={styles.toggle}
        >
          <Text style={styles.toggleText}>
            Lắc điện thoại: {shakeEnabled ? 'BẬT' : 'TẮT'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
  },
  appBar: {
    height: 56,
    backgroundColor: '#6A1B9A',
    justifyContent: 'center',
    paddingHorizontal: 16,
    elevation: 4,
  },
  appBarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  result: {
    marginTop: 28,
    fontSize: 22,
    fontWeight: '500',
    color: '#4A148C',
  },
  count: {
    marginTop: 6,
    fontSize: 14,
    color: '#7B1FA2',
  },
  button: {
    marginTop: 28,
    backgroundColor: '#6A1B9A',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  toggle: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toggleText: {
    color: '#6A1B9A',
    fontSize: 15,
    fontWeight: '500',
  },
});