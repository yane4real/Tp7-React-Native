import * as SQLite from "expo-sqlite";
import { File, Directory, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

let db = null;

export const initDB = () => {
  try {
    if (!db) {
      db = SQLite.openDatabaseSync("todos.db");
      
      db.execSync(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL
        );
      `);
      
      console.log("✅ Base de données initialisée");
    }
    return db;
  } catch (error) {
    console.error("❌ Erreur initialisation DB:", error);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    initDB();
  }
  return db;
};

export const addTodoOffline = (title) => {
  const database = getDB();
  database.runSync(
    "INSERT INTO todos (id, title) VALUES (?, ?)",
    [Date.now(), title]
  );
};

export const updateTodoOffline = (id, title) => {
  const database = getDB();
  database.runSync(
    "UPDATE todos SET title = ? WHERE id = ?",
    [title, id]
  );
};

export const deleteTodoOffline = (id) => {
  const database = getDB();
  database.runSync("DELETE FROM todos WHERE id = ?", [id]);
};

export const loadTodos = () => {
  const database = getDB();
  return database.getAllSync("SELECT * FROM todos");
};

// ✅ EXPORT CORRIGÉ - Compatible avec DB Browser for SQLite
export const exportDatabase = async () => {
  try {
    const database = getDB();
    
    // Vérifier qu'il y a des données
    const todos = loadTodos();
    if (todos.length === 0) {
      alert("⚠️ La base est vide. Ajoutez au moins une tâche d'abord.");
      return false;
    }

    console.log("📊 Exportation de", todos.length, "tâches");

    // IMPORTANT : Forcer l'écriture de toutes les transactions en attente
    database.execSync("PRAGMA wal_checkpoint(FULL);");
    
    // Fermer proprement la connexion
    database.closeSync();
    
    // Attendre que le fichier soit complètement écrit
    await new Promise(resolve => setTimeout(resolve, 200));

    // Chercher le fichier SQLite
    const possiblePaths = [
      new File(Paths.document, "SQLite", "todos.db"),
      new File(Paths.document, "todos.db"),
    ];

    let sourceFile = null;

    for (const filePath of possiblePaths) {
      console.log("🔍 Recherche:", filePath.uri);
      if (filePath.exists && filePath.size > 0) {
        sourceFile = filePath;
        console.log("✅ Fichier trouvé:", filePath.uri);
        console.log("📏 Taille:", filePath.size, "bytes");
        break;
      }
    }

    if (!sourceFile) {
      // Réouvrir la base
      db = SQLite.openDatabaseSync("todos.db");
      alert("❌ Impossible de localiser le fichier de base de données");
      return false;
    }

    // Créer le nom du fichier avec timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const exportFileName = `todos_backup_${timestamp}.db`;
    
    // Créer le fichier de destination dans le cache
    const exportFile = new File(Paths.cache, exportFileName);

    console.log("📂 Copie vers:", exportFile.uri);

    // Copier le fichier
    sourceFile.copy(exportFile);

    // Vérifier que la copie est réussie
    if (!exportFile.exists || exportFile.size === 0) {
      db = SQLite.openDatabaseSync("todos.db");
      alert("❌ Échec de la copie du fichier");
      return false;
    }

    console.log("✅ Fichier copié avec succès");
    console.log("📏 Taille finale:", exportFile.size, "bytes");

    // Réouvrir la base pour l'utilisation normale
    db = SQLite.openDatabaseSync("todos.db");

    // Partager le fichier
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(exportFile.uri, {
        mimeType: 'application/x-sqlite3',
        dialogTitle: `Exporter ${exportFileName}`,
        UTI: 'public.database'
      });
      
      alert(`✅ Base exportée !\n\nFichier: ${exportFileName}\nTâches: ${todos.length}\nTaille: ${exportFile.size} bytes\n\nVous pouvez maintenant l'ouvrir avec DB Browser for SQLite.`);
      return true;
    } else {
      alert("❌ Le partage n'est pas disponible sur cet appareil");
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'export:", error);
    console.error("Stack:", error.stack);
    
    // Réouvrir la base en cas d'erreur
    try {
      db = SQLite.openDatabaseSync("todos.db");
    } catch (reopenError) {
      console.error("❌ Impossible de réouvrir la base:", reopenError);
    }
    
    alert(`❌ Erreur lors de l'export:\n${error.message}`);
    return false;
  }
};

// ✨ Fonction de debug complète
export const debugPaths = () => {
  try {
    console.log("\n=== 🔍 DEBUG FILESYSTEM ===");
    console.log("📁 Document Directory:", Paths.document.uri);
    console.log("📁 Cache Directory:", Paths.cache.uri);
    
    // Vérifier tous les emplacements possibles
    const locations = [
      { name: "SQLite/todos.db", file: new File(Paths.document, "SQLite", "todos.db") },
      { name: "todos.db", file: new File(Paths.document, "todos.db") },
    ];
    
    console.log("\n📂 Fichiers de base de données:");
    for (const location of locations) {
      console.log(`\n  ${location.name}:`);
      console.log(`    URI: ${location.file.uri}`);
      console.log(`    Existe: ${location.file.exists ? '✅' : '❌'}`);
      if (location.file.exists) {
        console.log(`    Taille: ${location.file.size} bytes`);
        console.log(`    Type MIME: ${location.file.type || 'non défini'}`);
        console.log(`    Modifié: ${new Date(location.file.modificationTime).toLocaleString()}`);
      }
    }
    
    // Contenu de la base
    console.log("\n📊 Contenu de la base de données:");
    const todos = loadTodos();
    console.log(`  Total: ${todos.length} tâche(s)`);
    
    if (todos.length > 0) {
      console.log("\n  Liste des tâches:");
      todos.forEach((todo, index) => {
        console.log(`    ${index + 1}. [ID:${todo.id}] ${todo.title}`);
      });
    }
    
    // Informations sur la base
    const database = getDB();
    console.log("\n💾 État de la base:");
    console.log(`  Connexion ouverte: ${database ? '✅' : '❌'}`);
    
    console.log("\n=== FIN DEBUG ===\n");
    
    return true;
  } catch (error) {
    console.error("❌ Erreur pendant le debug:", error);
    return false;
  }
};

// ✨ BONUS : Fonction pour vérifier l'intégrité de la base
export const checkDatabaseIntegrity = () => {
  try {
    const database = getDB();
    const result = database.getFirstSync("PRAGMA integrity_check;");
    console.log("🔍 Intégrité de la base:", result);
    return result.integrity_check === "ok";
  } catch (error) {
    console.error("❌ Erreur vérification intégrité:", error);
    return false;
  }
};