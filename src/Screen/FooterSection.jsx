// components/FooterSection.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../Module/Constants/Colors';

const FooterSection = ({ onHomePress }) => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>© 2025 Bihar Municipal Corporation</Text>
      <Text style={styles.footerSubText}>
        Developed & Maintained by Your Company
      </Text>

      {/* ✅ Social Links Row */}
      <View style={styles.iconRow}>
        <TouchableOpacity onPress={onHomePress}>
          <Icon name="home" size={22} color="#fff" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://facebook.com')}
        >
          <Icon name="facebook" size={22} color="#fff" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://instagram.com')}
        >
          <Icon name="instagram" size={22} color="#fff" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://youtube.com')}
        >
          <Icon
            name="youtube-play"
            size={22}
            color="#fff"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://twitter.com')}
        >
          <Icon name="twitter" size={22} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  footerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  footerSubText: {
    color: '#D9E6F2',
    fontSize: 15,
    marginTop: 3,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default FooterSection;
