import React, { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { List, ActivityIndicator, Button } from "react-native-paper";

function Todo({ id, title, complete }) {
  const [loading, setLoading] = useState(false);

  async function toggleComplete() {
    try {
      setLoading(true);
      await firestore().collection("todos").doc(id).update({
        complete: !complete,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error toggling TODO completion: ", error);
      // Handle the error and provide user feedback if necessary.
      setLoading(false);
    }
  }

  async function deleteTodo() {
    try {
      setLoading(true);
      await firestore().collection("todos").doc(id).delete();
      setLoading(false);
    } catch (error) {
      console.error("Error deleting TODO: ", error);
      // Handle the error and provide user feedback if necessary.
      setLoading(false);
    }
  }

  return (
    <List.Item
      title={title}
      onPress={toggleComplete}
      left={(props) => (
        <List.Icon
          {...props}
          icon={loading ? "loading" : complete ? "check" : "cancel"}
          color={loading ? "gray" : complete ? "green" : "red"}
        />
      )}
      right={() => (
        <React.Fragment>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Button onPress={deleteTodo} icon="delete" />
          )}
        </React.Fragment>
      )}
    />
  );
}

export default Todo;
