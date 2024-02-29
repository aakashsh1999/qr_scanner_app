import React from 'react'
import { StatusBar } from 'expo-status-bar'
import {SafeAreaView, Pressable, Text,StyleSheet, View} from 'react-native'

function HomeScreen({navigation}) {

  return (
    <SafeAreaView style={styles.container}>
    <View>
      <Pressable style={styles.button} onPress={() => { navigation.navigate('OrderVerification') }}>
        <Text style={styles.text}>Verification</Text>
      </Pressable>
      <Pressable style={[styles.button, { marginTop: 50 }]} onPress={() => { navigation.navigate('DispatchScreen') }}>
        <Text style={styles.text}>Dispatch</Text>
      </Pressable>
    </View>
    <StatusBar style="auto" />
  </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    barcode_container: {
      height: 300,
      width: '100%'
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'black',
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
  });