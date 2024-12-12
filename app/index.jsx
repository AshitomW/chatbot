import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Models } from "../constants/constants";
import { router } from "expo-router";
const App = () => {
  const goToChat = (model) => {
    router.push({
      pathname: "chats/[model]",
      params: {
        model: model,
      },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.listItem}
      onPress={() => goToChat(item.name)}
    >
      <View style={{ justifyContent: "center" }}>
        <Text style={styles.header}>{item.name}</Text>
        <Text>{item.subtitle}</Text>
      </View>
      <View style={{ justifyContent: "center" }}>
        <Entypo name="chat" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ ...styles.header, textAlign: "center" }}>
        Available Bots
      </Text>
      <FlatList
        style={{ marginTop: 32 }}
        data={Models}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 8,
    justifyContent: "space-between",
  },
  header: {
    fontSize: 21,
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    height: 80,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  listItemText: {
    fontWeight: "medium",
    fontSize: 18,
    color: "#333",
  },
});

export default App;
