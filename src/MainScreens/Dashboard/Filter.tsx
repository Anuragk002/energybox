import axios from 'axios';
import moment from 'moment';
import React, {Dispatch, useContext, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import {Button as RNPButton} from 'react-native-paper';
import CustomDropdown from '../../Components/CustomDropdown';
import DateRangePicker from '../../Components/DateRangePicker';
import GlobalContext from '../../Context';
import {
  allSensersByUser,
  getAllParameters,
  getGraphDate,
  get_location,
} from '../../Endpoints';
import colors from '../../utils/colors';

interface propsType {
  show: boolean;
  setShow: Dispatch<boolean>;
  graphData: any;
  setGraphData: Dispatch<any>;
}
function Filter({show, setShow,graphData,setGraphData}: propsType) {
  const today=moment().format('MM/DD/YYYY');
  const yesterday=moment().subtract(1, 'day').format('MM/DD/YYYY');
  const {userData, setIsLoading} = useContext(GlobalContext);

  const [fromDate, setFromDate] = useState<string>(
    yesterday
  );
  const [toDate, setToDate] = useState<string>(today);

  const [allLocations, setAllLocations] = useState([]);
  const [allParameters, setAllParameters] = useState([]);
  const [allSensors, setAllSensors] = useState([]);
  const [allGrain, setAllGrain] = useState([
    {
      value: '15',
      label: '15 Min',
    },
    {
      value: '30',
      label: '30 Min',
    },
    {
      value: '45',
      label: '45 Min',
    },
    {
      value: '60',
      label: '60 Min',
    },
  ]);

  const [location, setLocation] = useState({});
  const [parameter, setParameter] = useState({});
  const [sensor, setSensor] = useState({});
  const [grain, setGrain] = useState({});

  const getGraphData = async (filter = false) => {
    // let d = {
    //   user_id: userData.id,
    //   date_range: fromDate + ' - ' + toDate,
    //   location_id: location.id,
    //   sensor_id: sensor.id,
    //   parameter_id: parameter.id,
    //   grain: grain,
    // };
    setIsLoading(true)
    let d={
      user_id: 4,
      date_range: "01/15/2021 - 01/16/2023",
      location_id: 19,
      sensor_id: 10,
      parameter_id: 3,
      grain: "15",
    }
    let defaultData = {
      user_id: userData.id,
      date_range: yesterday + ' - ' + today,
    };
    await axios
      .post(getGraphDate, filter ? d : defaultData)
      .then(async res => {
        // console.log(res?.data);
        setGraphData(res?.data);
      })
      .catch(err => console.log(err));
      setIsLoading(false)
      setShow(false)
  };

  const getData = async () => {
    await axios
      .get(get_location + '?userid=' + userData.id)
      .then(async res => {
        setAllLocations(res?.data?.locations);
      })
      .catch(err => console.log(err));

    await axios
      .get(getAllParameters)
      .then(async res => {
        setAllParameters(res?.data?.Parameters);
      })
      .catch(err => console.log(err));

    await axios
      .post(allSensersByUser)
      .then(async res => {
        setAllSensors(res?.data?.sensors);
      })
      .catch(err => console.log(err));
  };
  React.useEffect(() => {
    getData();
    getGraphData();
  }, []);

  const handleApply = () => {
    getGraphData(true);
  };
  const handleReset = () => {
    // setShow(false);
    getGraphData(false);
    setShow(false)
  };
  return (
    <Modal
      useNativeDriver={true}
      style={{width: '100%', alignItems: 'flex-end', flex: 1}}
      isVisible={show}
      animationIn="slideInRight"
      animationOut={'slideOutRight'}
      backdropColor={'#0566AF'}
      backdropOpacity={0.4}
      onBackdropPress={() => setShow(false)}>
      <SafeAreaView style={{flex: 1, width: '88%', marginRight: 20}}>
        <ScrollView
          contentContainerStyle={{
            backgroundColor: colors.bg_white,
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
          bounces={true}>
          <View style={styles.container}>
            <Text style={styles.filterHeading}>Filter</Text>
            <Seperator />
            <View style={{paddingHorizontal: 20}}>
              <Text style={styles.lable}>Date Range</Text>
              <DateRangePicker
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
              />
              <Text style={styles.lable}>Location</Text>
              <CustomDropdown
                placeholder="Select Location"
                data={allLocations}
                labelField="location_name"
                valueField="id"
                value={location?.id}
                setValue={setLocation}
              />
              <Text style={styles.lable}>Sensor</Text>
              <CustomDropdown
                placeholder="Select Sensor"
                data={allSensors}
                labelField="sensor_name"
                valueField="id"
                value={sensor?.id}
                setValue={setSensor}
              />
              <Text style={styles.lable}>Parameter</Text>
              <CustomDropdown
                placeholder="Select Parameter"
                data={allParameters}
                labelField="parameter_name"
                valueField="id"
                value={parameter?.id}
                setValue={setParameter}
              />
              <Text style={styles.lable}>Grain</Text>
              <CustomDropdown
                placeholder="Select Grain"
                data={allGrain}
                labelField="label"
                valueField="value"
                value={grain}
                setValue={x => setGrain(x.value)}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingHorizontal: 30,
              marginBottom: 30,
            }}>
            <TouchableOpacity style={styles.btnCancel} onPress={handleReset}>
              <Text style={{color: 'white'}}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleApply}>
              <Text style={{color: 'white'}}>Apply</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.bg_white,
    // minHeight: '100%',
    paddingVertical: 15,
  },
  filterHeading: {
    fontSize: 22,
    color: colors.accent_primary,
    // fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 15,
  },
  lable: {
    fontSize: 15,
    color: colors.font_primary,
    marginBottom: 10,
  },
  btn: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: colors.accent_primary,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  btnCancel: {
    marginRight: 10,
    padding: 15,
    borderRadius: 5,
    backgroundColor: colors.accent_secondary,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
export default Filter;

function Seperator() {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        marginBottom: 15,
        borderBottomColor: colors.border_light,
      }}></View>
  );
}
