import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
``;
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
const header = () => {
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert('Search clicked')}>
          <Icon name="search" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'blue',
    height: responsiveHeight(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, // space on both sides
    paddingTop: responsiveHeight(5),
  },
});
