import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";
import { getUserDetails } from "../utils/auth";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// function to calculate number of columns dynamically
const getNumColumns = () => {
  if (width >= 900) return 4; // tablet big screen
  if (width >= 600) return 3; // medium devices
  return 2; // default mobile
};

const MenuTreeScreen = () => {
  const [menuStack, setMenuStack] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMenuTree = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails && userDetails?.menuTree) {
          setMenuItems(userDetails?.menuTree);
          setMenuStack([userDetails?.menuTree]);
        }
      } catch (err) {
        console.log("Error fetching menu:", err);
      }
    };
    fetchMenuTree();
  }, []);

  const getIconName = (iconName) => {
    const glyphs = Icon.getRawGlyphMap?.() || Icon.glyphMap;
    return glyphs && glyphs[iconName] ? iconName : "dashboard";
  };

  const currentMenu = menuStack[menuStack.length - 1] || [];

  const handlePress = (item) => {
    if (item.children?.length) {
      setMenuStack([...menuStack, item.children]);
    } else {
      console.log("item:", item.name);
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
        <Icon name={getIconName(item.icon)} size={40} color="#4A90E2" />
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
            <Icon name="arrow-back" size={24} color="#fff" />
            <Text style={styles.headerText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.headerText}>Menu</Text>
        )}
      </View>

      {/* Responsive Grid Menu */}
      <FlatList
        data={currentMenu}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={getNumColumns()}
        contentContainerStyle={styles.scrollContainer}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </SafeAreaView>
  );
};

export default MenuTreeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 16,
  },
  box: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    borderRadius: 16,
    padding: 16,
    margin: 8,
    alignItems: "center",
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderLeftWidth: 6,
    borderLeftColor: "#4a90e2",
    minHeight: 120,
    maxWidth: (width - 64) / getNumColumns(), // adjust based on screen width
  },
  iconContainer: {
    marginBottom: 8,
  },
  boxText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
