TP 7 React Native: Todo App with API Integration, Theme Persistence, and Offline Support
This project is a practical exercise (Travaux Pratiques) in React Native, demonstrating how to connect to a remote API, implement persistent theme switching using AsyncStorage, and support offline todo management with SQLite. It uses the JSONPlaceholder API for fetching sample todo items.
The app includes two main modes:

Online Mode: Fetches and displays todos from a remote API.
Offline Mode: Allows adding, updating, and (optionally) deleting todos stored locally in SQLite.

Features

Fetch todos from a remote API using either Axios or Fetch.
Display todos in a FlatList with loading indicator and error handling.
Light/Dark theme toggle with persistence across app restarts using AsyncStorage.
Offline todo management: Add, update, and view todos stored in a local SQLite database.
Additional exercise: Implement deletion of offline todos (with a trash button next to each item).

Prerequisites

Node.js and npm installed.
Expo CLI (for running the app): Install globally with npm install -g expo-cli.
An emulator or physical device for testing (Android/iOS).

Installation

Clone or download the project repository.
Navigate to the project directory:textcd your-project-folder
Install dependencies:textnpm install
Install specific Expo packages:textnpm install axios
npx expo install @react-native-async-storage/async-storage
npx expo install expo-sqlite

Project Structure

/services/api.js: Handles API requests to fetch todos (using Axios or Fetch).
/services/database.js: Manages SQLite database for offline todos (init, add, update, load).
/context/ThemeContext.js: Provides theme context and persistence with AsyncStorage.
/screens/TodoListFetchScreen.js: Screen for online todo fetching and display.
/screens/TodoListOfflineScreen.js: Screen for offline todo management.
App.js: Main app entry point, wraps components with ThemeProvider, and initializes SQLite.

Usage

Start the Expo development server:textnpx expo start
Run on an emulator or device:
Android: Press a in the Expo CLI.
iOS: Press i in the Expo CLI (requires Xcode on macOS).
Or scan the QR code with the Expo Go app on your phone.


Testing Online Mode

The app fetches 10 todos from the API on load.
Toggle the theme using the button (persists via AsyncStorage).
To test loading/error states:
Modify the API URL in /services/api.js to an invalid one (e.g., add a typo).
Add a delay in the fetch function to observe the loader (e.g., setTimeout).


Testing Offline Mode

Switch to offline mode by updating App.js to use TodoListOfflineScreen.
Add todos using the input field and "➕ Ajouter hors ligne" button.
Edit todos by tapping the edit (✏️) button next to an item.
View stored todos in a list.
For the additional exercise (deletion):
Add a delete function in /services/database.js (e.g., deleteTodoOffline(id) with DELETE FROM todos WHERE id = ?).
Add a 🗑️ button in the FlatList renderItem in /screens/TodoListOfflineScreen.js.
Call deleteTodoOffline(item.id) on press and refresh the list.


API Details

Endpoint: https://jsonplaceholder.typicode.com/todos?_limit=10
Methods: GET (fetches limited todos).
Libraries: Axios for promise-based requests; native Fetch as an alternative.

Database Details (SQLite)

Database Name: todos.db
Table: todos with columns id (INTEGER PRIMARY KEY) and title (TEXT).
Operations: Create table if not exists, insert, update, select all.

Troubleshooting

SQLite Initialization: Ensure initDB() runs on app start (handled in App.js with a loading state).
Theme Not Persisting: Check AsyncStorage permissions (should work out-of-the-box in Expo).
API Errors: Verify internet connection; the app shows an error message if the fetch fails.
Large Datasets: The app limits API fetches to 10 items for performance.

Additional Exercise: Implement Todo Deletion
To complete the supplementary task:

In /services/database.js, add:JavaScriptexport const deleteTodoOffline = (id) => {
  db.runSync("DELETE FROM todos WHERE id = ?", [id]);
};
In /screens/TodoListOfflineScreen.js, update the FlatList renderItem to include a delete button:JavaScript<View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
  <Text>{item.title}</Text>
  <Button title="✏️" onPress={() => { setTitle(item.title); setEditingId(item.id); }} />
  <Button title="🗑️" onPress={() => { deleteTodoOffline(item.id); refreshTodos(); }} />
</View>
Import deleteTodoOffline from ./services/database.

This enhances the offline mode with full CRUD operations.
License
This project is for educational purposes. Feel free to modify and experiment!
