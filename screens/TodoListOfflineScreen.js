import { View, Text, FlatList, Button, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState, useContext } from "react";
import {
  loadTodos,
  addTodoOffline,
  updateTodoOffline,
  deleteTodoOffline,
  exportDatabase,
  debugPaths,
  checkDatabaseIntegrity  // ← Ajoutez ceci
} from "../services/database";
import { ThemeContext } from "../context/ThemeContext";

export default function TodoListOfflineScreen() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const refreshTodos = () => {
    setTodos(loadTodos());
  };
const handleExport = async () => {
  const success = await exportDatabase();
  if (success) {
    alert("✅ Base de données exportée ! Vous pouvez maintenant l'ouvrir avec DB Browser.");
  }
};
  const handleAddOrUpdate = () => {
    if (!title.trim()) return;
    
    if (editingId) {
      // UPDATE
      updateTodoOffline(editingId, title);
      setEditingId(null);
    } else {
      // ADD
      addTodoOffline(title);
    }
    
    setTitle("");
    refreshTodos();
  };

  const handleDelete = (id) => {
    deleteTodoOffline(id);
    refreshTodos();
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setEditingId(item.id);
  };

  const handleCancel = () => {
    setTitle("");
    setEditingId(null);
  };

  useEffect(() => {
    refreshTodos();
  }, []);

  const isDark = theme === "dark";

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Theme toggle */}
      <View style={styles.headerButtons}>
      <Button
    title={`Mode ${isDark ? "☀️ Light" : "🌙 Dark"}`}
    onPress={toggleTheme}
    color={isDark ? "#BB86FC" : "#6200EE"}
  />
  
  <Button
    title="📤 Exporter BDD"
    onPress={handleExport}
    color="#4CAF50"
  />
  
  <Button
    title="🔍 Debug"
    onPress={() => {
      debugPaths();
      alert("Consultez les logs dans Metro");
    }}
    color="#FF9800"
  />
  
  <Button
    title="✔️ Vérifier"
    onPress={() => {
      const isValid = checkDatabaseIntegrity();
      alert(isValid ? "✅ Base valide" : "❌ Base corrompue");
    }}
    color="#9C27B0"
  />
      </View>

      {/* Add / Update Form */}
      <View style={styles.formContainer}>
        <TextInput
          placeholder={editingId ? "Modifier la tâche" : "Nouvelle tâche offline"}
          placeholderTextColor={isDark ? "#999" : "#666"}
          value={title}
          onChangeText={setTitle}
          style={[
            styles.input,
            isDark && styles.darkInput
          ]}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={handleAddOrUpdate}
          >
            <Text style={styles.buttonText}>
              {editingId ? "✏️ Mettre à jour" : "➕ Ajouter"}
            </Text>
          </TouchableOpacity>
          
          {editingId && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>❌ Annuler</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Todo List */}
      {todos.length === 0 ? (
        <Text style={[styles.emptyText, isDark && styles.darkText]}>
          Aucune tâche disponible hors ligne
        </Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.todoItem, isDark && styles.darkTodoItem]}>
              <Text style={[styles.todoText, isDark && styles.darkText]}>
                {item.title}
              </Text>
              <View style={styles.todoActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.actionButtonText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.actionButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  headerButtons: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  formContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  darkInput: {
    backgroundColor: "#2C2C2C",
    borderColor: "#444",
    color: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#FF5252",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  darkText: {
    color: "#E0E0E0",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  todoActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    fontSize: 18,
  },
});