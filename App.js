import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView, ScrollView, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Task" component={Task} />
    </Stack.Navigator>
  )
}

const Home = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const awb_number = data;

    async function apiCalls() {
      const response = await fetch(
        `https://ops.anveshan.farm/api/v1/items/?awb=${data}`,
        {}
      );
      const json = await response.json();
      return json;
    }

    apiCalls().then((data) => {
      if (data.items.length < 1){
        setScanned(true);
        Alert.alert(
          `${data.awb_number}`,
          `AWB not Found.`,
          [
            {
              text: 'ok',
              onPress: () => {
                setScanned(false)
              },
            },
          ],
          { cancelable: false },
        )
      } else {
        const is_scanned = true;
       if (data.is_scanned) {
        setScanned(true);
        Alert.alert(
          `${data.awb_number}`,
          `Already Scanned move forward`,
          [
            {
              text: 'ok',
              onPress: () => {
                setScanned(false)
              },
            },
          ],
          { cancelable: false },
        )
       } else {
        navigation.navigate(
          'Task', { data: data, awb_number: awb_number }
        )
        setScanned(false)
       }
      }
    })
  };

  // 76541593332

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}


const Task = ({ route, navigation }) => {
  const { data, awb_number } = route.params;

  const get_items_json = (list_data) => {
    var l = [];
    for (let i = 0; i < list_data.length; i++) {
      l.push(
        {
          item: list_data[i],
          status: false
        }
      )
    }

    return l;
  };

  let items = get_items_json(data.items);
  
  const [list, setList] = useState(items)
  const [scanned, setScanned] = useState(false);


  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    let isItemIndex = list.findIndex(el => el.item.toLowerCase() === data.toLowerCase());
    if(isItemIndex== -1){
      setScanned(true);
      Alert.alert(
        `${awb_number}`,
        `Wrong Item Please Try Again.`,
        [
          {
            text: 'ok',
            onPress: () => {
              setScanned(false)
            },
          },
        ],
        { cancelable: false },
      )
      }else{
      setList(
        list => list.map(el  => {
          let obj={
            item: el.item,
            status:el.status,   
          }
          if(el.item.toLowerCase() === data.toLowerCase()){
            obj.status = true;
          }
          return obj
        })
      )
      setScanned(false)
    }
    
    let isScannedAll = list.every(el => el.status === true);
    if(isScannedAll){
      setScanned(true);

      async function mark_scanned_after_all_scanned(awb_number){
        methods = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
        const response = fetch(
          `https://ops.anveshan.farm/api/v1/items/?awb=${awb_number}&?isScanned=true`,
          methods,
        )
      }

      mark_scanned_after_all_scanned(awb_number);

      navigation.navigate(
        'Home'
      )

      return;
    }
  };

  return (
    <SafeAreaView styles={styles.container}>
      <View>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.barcode_container}
        />
      </View>
      <Text style={{
        textAlign: 'center'
        , fontSize: 30,
        paddingVertical: 10,
        marginHorizontal: 8,
        marginTop: 15,
        borderRadius: 8,
        color: 'white',
        backgroundColor: '#059142'

      }}>{awb_number}</Text>
      <ScrollView>
       {list.map((el, index) => <View key={index} style={{
          width: '100%',
          paddingVertical: 8,
          paddingHorizontal: 16,
          marginBottom: 15,
          marginTop: 10
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

          }}>
            <Text style={{
              fontSize: 25,
              fontWeight: 'bold',
              textTransform: 'uppercase'

            }}>{el.item}</Text>
           {el.status === true && <Icon name="check" size={30} color="#059142" /> }
            {/* <Icon name="remove" size={30} color="#900" /> */}
          </View>
          <View style={{
            borderWidth: 1,
            paddingHorizontal: 16,
            marginTop: 15,
            borderColor: 'grey'
          }}></View>
          
        </View>)}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

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
  }
});