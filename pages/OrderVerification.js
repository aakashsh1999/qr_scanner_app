import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import {BarCodeScanner} from 'expo-barcode-scanner'

function OrderVerification({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
    return () =>{
      setHasPermission(null)
      setScanned(false)
    }
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
      if (data.items.length < 1) {
        setScanned(true);
        Alert.alert(
          `${data.awb_number}`,
          `AWB not Found.`,
          [
            {
              text: "ok",
              onPress: () => {
                setScanned(false);
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        if (data.is_scanned) {
          setScanned(true);
          Alert.alert(
            `${data.awb_number}`,
            `Already Scanned move forward`,
            [
              {
                text: "ok",
                onPress: () => {
                  setScanned(false);
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          setScanned(false);
          navigation.navigate("Task", { data: data, awb_number: awb_number });
        }
      }
    });
  }

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
    </View>)
}

export default OrderVerification;


const styles = StyleSheet.create({
    container:{
        flex:1,
        background:'#000000',
        alignItems:'center',
        justifyContent:'center'
    }
})

