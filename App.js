import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./pages/HomeSreen";
import DispatchScreen from "./pages/DispatchScreen";
import Task from './pages/Task'
import OrderVerification from "./pages/OrderVerification";
import { enableScreens } from 'react-native-screens';


const Stack = createStackNavigator();

export default function App() {
  enableScreens()
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="DispatchScreen"
          component={DispatchScreen}
        />
        <Stack.Screen name="OrderVerification" component={OrderVerification} />
        <Stack.Screen name="Task" component={Task} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#ffffff",
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
});
