import { FlatList, Text, ActivityIndicator, Button, View, StyleSheet } from "react-native";
import { useEffect, useState, useContext } from "react";
import { fetchTodosFetch } from "../services/api";
import { ThemeContext } from "../context/ThemeContext";

export default function TodoListFetchScreen() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    fetchTodosFetch()
      .then(setTodos)
      .catch(() => setError("Impossible de charger les tâches"))
      .finally(() => setLoading(false));
  }, []);

  const isDark = theme === "dark";

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Chargement des tâches...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title={`Mode ${isDark ? "☀️ Light" : "🌙 Dark"}`}
          onPress={toggleTheme}
          color={isDark ? "#BB86FC" : "#6200EE"}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.todoItem, isDark && styles.darkTodoItem]}>
            <Text style={[styles.todoText, isDark && styles.darkText]}>
              {item.completed ? "✅" : "⭕"} {item.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  darkText: {
    color: "#E0E0E0",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  errorText: {
    color: "#C62828",
    fontSize: 16,
    textAlign: "center",
  },
  todoItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  darkTodoItem: {
    backgroundColor: "#1E1E1E",
    borderBottomColor: "#333",
  },
  todoText: {
    fontSize: 16,
    color: "#000",
  },
});