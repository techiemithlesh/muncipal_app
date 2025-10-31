// Pagination.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
// import Colors from '../Constants/Colors';
import Colors from '../Module/Constants/Colors';
const Pagination = ({ page, lastPage, total, onNext, onPrev }) => {
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.pageButton,
          { backgroundColor: page === 1 ? '#ccc' : Colors.primary },
        ]}
        disabled={page === 1}
        onPress={onPrev}
      >
        <Text style={styles.pageButtonText}>Previous</Text>
      </TouchableOpacity>

      <Text style={styles.pageInfo}>
        Page {page} of {lastPage} ({total} total)
      </Text>

      <TouchableOpacity
        style={[
          styles.pageButton,
          { backgroundColor: page === lastPage ? '#ccc' : Colors.primary },
        ]}
        disabled={page === lastPage}
        onPress={onNext}
      >
        <Text style={styles.pageButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveHeight(2),
    backgroundColor: '#ffffff', // white background
    borderWidth: 1,
    borderColor: '#ddd', // light gray border
    borderRadius: 8,
    padding: 10,

    // Shadow for Android
    elevation: 4,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
  },
});
