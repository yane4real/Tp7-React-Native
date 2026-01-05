import { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ActivityIndicator, Button, Text } from "react-native";
import { initDB } from "./services/database";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import TodoListOfflineScreen from "./screens/TodoListOfflineScreen";
import TodoListFetchScreen from "./screens/TodoListFetchScreen";

function MainApp() {
  const { theme } = useContext(ThemeContext);
  const [mode, setMode] = useState("online");
  const isDark = theme === "dark";

  return (
    <View style={[styles.container, isDark ? styles.dark : styles.light]}>
      <View style={styles.modeSelector}>
        <Text style={[styles.modeTitle, isDark && styles.darkText]}>
          Mode actuel : {mode === "online" ? "📡 En ligne (API)" : "💾 Hors ligne (SQLite)"}
        </Text>
        <View style={styles.buttonGroup}>
          <Button
            title="📡 Mode En ligne"
            onPress={() => setMode("online")}
            color={mode === "online" ? "#4CAF50" : "#999"}
          />
          <Button
            title="💾 Mode Hors ligne"
            onPress={() => setMode("offline")}
            color={mode === "offline" ? "#2196F3" : "#999"}
          />
        </View>
      </View>

      {mode === "online" ? <TodoListFetchScreen /> : <TodoListOfflineScreen />}
    </View>
  );
}

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const prepareDb = async () => {
      try {
        console.log("🔄 Initialisation de la base de données...");
        await initDB();
        console.log("✅ Base de données prête");
        setDbReady(true);
      } catch (err) {
        console.error("❌ Erreur initialisation:", err);
        setError(err.message);
      }
    };
    prepareDb();
  }, []);

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>❌ Erreur: {error}</Text>
        <Button title="Réessayer" onPress={() => window.location.reload()} />
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Initialisation de la base de données...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  light: {
    backgroundColor: "#ffffff",
  },
  dark: {
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    color: "#F44336",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modeSelector: {
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#6200EE",
    backgroundColor: "#F5F5F5",
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#000",
  },
  darkText: {
    color: "#E0E0E0",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
});