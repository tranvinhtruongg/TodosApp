import React, { useState, useEffect } from "react";
import { FlatList, View, Text } from "react-native";
import {
  Appbar,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import Todo from "./src/Todo";

function App() {
  const [todo, setTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const ref = firestore().collection("todos");

  async function addTodo() {
    try {
      await ref.add({
        title: todo,
        complete: false,
      });
      setTodo("");
    } catch (error) {
      console.error("Error adding TODO: ", error);
      // Handle the error and provide user feedback if necessary.
    }
  }

  useEffect(() => {
    const unsubscribe = ref.onSnapshot((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        const { title, complete } = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });

      setTodos(list);
      setLoading(false);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts.
      unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar>
        <Appbar.Content title="TODOs List" />
      </Appbar>

      {loading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Todo {...item} />}
        />
      )}

      <TextInput
        label={"New TODO"}
        value={todo}
        onChangeText={(text) => setTodo(text)}
      />
      <Button onPress={addTodo}>Add TODO</Button>
    </View>
  );
}

export default App;
