import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { getUserDetails } from '../utils/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../Module/Constants/Colors';
// import { ImageBackground } from 'react-native';

const { width } = Dimensions.get('window');

// function to calculate number of columns dynamically
const getNumColumns = () => {
  if (width >= 900) return 4; // tablet big screen
  if (width >= 600) return 3; // medium devices
  return 2; // default mobile
};

const MenuTreeScreen = () => {
  const [menuStack, setMenuStack] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMenuTree = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails && userDetails?.menuTree) {
          setMenuStack([userDetails?.menuTree]);
        }
      } catch (err) {
        console.log('Error fetching menu:', err);
      }
    };
    fetchMenuTree();
  }, []);

  const getIconName = iconName => {
    const glyphs = Icon.getRawGlyphMap?.() || Icon.glyphMap;
    return glyphs && glyphs[iconName] ? iconName : 'dashboard';
  };

  const currentMenu = menuStack[menuStack.length - 1] || [];

  const handlePress = item => {
    if (item.children?.length) {
      setMenuStack([...menuStack, item.children]);
    } else {
      console.log('item:', item.name);
      navigation.navigate(item.url); // use screen name
    }
  };

  const goBack = () => {
    if (menuStack.length > 1) {
      setMenuStack(menuStack.slice(0, -1));
    } else {
      navigation.goBack();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.box} onPress={() => handlePress(item)}>
      <View style={styles.iconContainer}>
        <Icon name={getIconName(item.icon)} size={40} style={styles.icon} />
      </View>
      <Text style={styles.boxText}>{item.name}</Text>

      {item.children?.length ? (
        <Icon
          name="chevron-right"
          size={24}
          color="#666"
          style={{ marginTop: 8 }}
        />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        {menuStack.length > 1 ? (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Icon name="arrow-back" size={24} color="#090748ff" />
            <Text style={styles.headerText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.headerText}>Menu</Text>
        )}
      </View>

      {/* FlatList with no ScrollView wrapping */}
      <FlatList
        data={currentMenu}
        keyExtractor={(item, index) =>
          item?.id ? `${item.id}-${index}` : `${item.name}-${index}`
        }
        renderItem={renderItem}
        numColumns={getNumColumns()}
        contentContainerStyle={styles.scrollContainer}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        // if needed for nested navigation screens
        nestedScrollEnabled={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            No menu items found
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default MenuTreeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2, // 👈 border thickness
    borderColor: Colors.primary, // 👈 border color (light gray)
  },
  headerText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContainer: {},
  box: {
    flex: 1,
    backgroundColor: '#edf2feff',
    borderRadius: 16,
    padding: 10,
    margin: 5,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderLeftWidth: 6,
    borderLeftColor: Colors.primary,
    minHeight: 50,
    maxWidth: (width - 64) / getNumColumns(),
  },
  iconContainer: {
    marginBottom: 2,
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a11414ff',
    textAlign: 'center',
  },
  icon: {
    color: Colors.primary,
  },
});
