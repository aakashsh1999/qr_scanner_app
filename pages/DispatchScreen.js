import React, {useState, useEffect} from 'react'
import {View, Text, SafeAreaView, StyleSheet, Alert} from 'react-native'
import {BarCodeScanner, Constants} from 'expo-barcode-scanner'

function DispatchScreen({navigation}) {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [awbNumber, setawbNumber] = useState(null);
  
    useEffect(() => {
      const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      };
  
      getBarCodeScannerPermissions();
    }, []);
  
    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      setawbNumber(data);
      // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
  
    const dispatchAPIMark = async () => {
      const methods = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
      const response = await fetch(
        `https://ops.anveshan.farm/api/v1/items/?awb=${awbNumber}&isDispatch=true`,
        methods,
      )
    }
  
    if (scanned) {
      dispatchAPIMark()
      Alert.alert(
        `${awbNumber}`,
        `Successfully Dispatched.`,
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
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {/* {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />} */}
      </SafeAreaView>
    )
  
}

export default DispatchScreen


const styles= StyleSheet.create({
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
})