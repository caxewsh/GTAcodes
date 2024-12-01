import React, { useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

interface CheatFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CheatFilters = ({ categories, selectedCategory, onSelectCategory }: CheatFiltersProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const animatedScale = useRef(new Animated.Value(1)).current;

  const handleCategorySelect = (category: string | null) => {
    Haptics.selectionAsync();
    onSelectCategory(category);
  };

  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (!Array.isArray(categories)) {
    console.error('Categories must be an array');
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.filterRow}>
          <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === null && styles.filterButtonActive
              ]}
              onPress={() => handleCategorySelect(null)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={[
                styles.filterText,
                selectedCategory === null && styles.filterTextActive
              ]}>Tous</Text>
            </TouchableOpacity>
          </Animated.View>
          
          {categories.map((category) => (
            <Animated.View key={category} style={{ transform: [{ scale: animatedScale }] }}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedCategory === category && styles.filterButtonActive
                ]}
                onPress={() => handleCategorySelect(category)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <Text style={[
                  styles.filterText,
                  selectedCategory === category && styles.filterTextActive
                ]}>{category}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 60,
    width: '100%',
    backgroundColor: '#000',
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
  },
  filterButtonActive: {
    backgroundColor: '#E5F993',
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000',
  },
});

export default CheatFilters;