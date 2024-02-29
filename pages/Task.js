import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Feather } from "@expo/vector-icons";

const Task = ({ route, navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
    return () =>{
      setHasPermission(null)
    }
  }, []);
  const {data,  awb_number } = route.params;

  const get_items_json = (list_data) => {
    var l = [];
    for (let i = 0; i < list_data.length; i++) {
      l.push({
        item: list_data[i],
        status: false,
      });
    }

    return l;
  };

  let items =  get_items_json(data.items)

  const [list, setList] = useState(items);
  const [scanned, setScanned] = useState(false);
  const [finalArray, setFinalArray] = useState([]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    let isItemIndex = list.findIndex(
      (el) => el.item.toLowerCase() === data.toLowerCase()
    );
    if (isItemIndex == -1) {
      setScanned(true);
      Alert.alert(
        `${awb_number}`,
        `Wrong Item Please Try Again.`,
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
      let updateItem = list.find(
        (el) => el.item.toLowerCase() === data.toLowerCase()
      );
      let isFirstItem = false;
      const tempArray = list.filter((a) => {
        if (isFirstItem) {
          return true;
        }
        isFirstItem = a.item.toLowerCase() === data.toLowerCase();
        return !isFirstItem;
      });
      updateItem.status = true;
      setFinalArray([...finalArray, updateItem]);
      console.log(finalArray);
      setList(tempArray);
      Alert.alert(`${updateItem.item} is scanned.`, "", [
        {
          text: "Ok",
          onPress: () => {
            setScanned(false);
          },
        },
      ]);
    }

    let isScannedAll = list.every((el) => el.status === true);
    if (isScannedAll) {
      setScanned(true);

      async function mark_scanned_after_all_scanned(awb_number) {
        methods = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };
        const response = fetch(
          `https://ops.anveshan.farm/api/v1/items/?awb=${awb_number}&isScanned=true`,
          methods
        );
      }

      mark_scanned_after_all_scanned(awb_number);

      navigation.navigate("OrderVerification");

      return;
    }
  };

  
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <>
      <SafeAreaView>
        <View>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{
              width:'100%',
              height:250,
              justifyContent:'center'
            }}
          />
        </View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            paddingVertical: 10,
            marginHorizontal: 8,
            marginTop: 15,
            borderRadius: 8,
            color: "white",
            backgroundColor: "#059142",
          }}
        >
          {awb_number}
        </Text>
      </SafeAreaView>
      <ScrollView>
        {list.map((el, index) => (
          <View
            key={index}
            style={{
              width: "100%",
              paddingVertical: 8,
              paddingHorizontal: 16,
              marginBottom: 15,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {el.item}
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                paddingHorizontal: 16,
                marginTop: 15,
                borderColor: "grey",
              }}
            ></View>
          </View>
        ))}
      </ScrollView>
      {finalArray.length > 0 && (
        <View
          style={{
            width: "100%",
            padding: 8,
            backgroundColor: "red",
            marginTop: 12,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "white",
              textAlign: "center",
            }}
          >
            Completed
          </Text>
        </View>
      )}
      <ScrollView>
        {finalArray.length > 0 &&
          finalArray.map((el, index) => (
            <View
              key={index}
              style={{
                width: "100%",
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginBottom: 15,
                marginTop: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {el.item}
                </Text>
                {el.status === true && (
                  <Feather name="check" size={30} color="#059142" />
                )}
              </View>
              <View
                style={{
                  borderWidth: 1,
                  paddingHorizontal: 16,
                  marginTop: 15,
                  borderColor: "grey",
                }}
              ></View>
            </View>
          ))}
      </ScrollView>
    </>
  );
};

export default Task;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
