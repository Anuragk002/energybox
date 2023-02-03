import axios from 'axios';
import moment from 'moment';
import React, {Dispatch, useContext, useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomDropdown from '../../Components/CustomDropdown';
import DateRangePicker from '../../Components/DateRangePicker';
import GlobalContext from '../../Context';
import {
  allSensersByUserAndLocation,
  getAllParameters,
  getGraphDate,
  get_location,
} from '../../Endpoints';
import colors from '../../utils/colors';

function Reports() {
  const [graphData, setGraphData] = useState({});

  const today = moment().format('MM/DD/YYYY');
  const yesterday = moment().subtract(1, 'day').format('MM/DD/YYYY');
  const {userData, setIsLoading} = useContext(GlobalContext);

  const [fromDate, setFromDate] = useState<string>(today);
  const [toDate, setToDate] = useState<string>(today);

  const [sensorFieldDisabled, setSensorFieldDisabled] = useState(true);

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
  const [allDeviceType, setAllDeviceType] = useState([
    {
      value: 'DG',
      label: 'DG',
    },
    {
      value: 'Mains',
      label: 'Mains',
    },
    {
      value: 'Green',
      label: 'Green',
    },
  ]);

  const [location, setLocation] = useState({});
  const [parameter, setParameter] = useState({});
  const [sensor, setSensor] = useState({});
  const [grain, setGrain] = useState({});
  const [deviceType, setDeviceType] = useState({});

  const getGraphData = async () => {
    let d = {
      user_id: userData.id,
      date_range: fromDate + ' - ' + toDate,
      location_id: location.id,
      sensor_id: sensor.id,
      parameter_id: parameter.id,
      device_type:deviceType,
      grain: grain,
    };

    setIsLoading(true);

    await axios
      .post(getGraphDate, d)
      .then(async res => {
        // console.log(res?.data);
        setIsLoading(false)
        exportFile(res?.data.result)
      })
      .catch(err => console.log(err))
    
  };

  const getData = async () => {
    setIsLoading(true);
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

      setIsLoading(false);
  };
  const getSensorByLocation = async () => {
    setIsLoading(true);
    await axios
      .post(allSensersByUserAndLocation, {
        user_id: userData.id,
        location_id: location.id,
      })
      .then(async res => {
        if (Array.isArray(res?.data?.sensors))
          setAllSensors(res?.data?.sensors);
        else setAllSensors([]);
        setSensorFieldDisabled(false);
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
  };

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    if (location.id > -1) getSensorByLocation();
  }, [location]);

  const exportFile = async (data) => {
    if(Platform.OS==='android')
    try{
      // Check for Permission (check if permission is already given or not)
      let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

      if(!isPermitedExternalStorage){

        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage permission needed",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
            message:''
          }
        );

        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our exportDataToExcel function)
          exportDataToExcel(data);
          console.log("Permission granted");
        } else {
          // Permission denied
          Alert.alert('','Grant File Read/Write Permission First')
        }
      }else{
         // Already have Permission (calling our exportDataToExcel function)
         exportDataToExcel(data);
      }
    }catch(e){
      console.log('Error while checking permission');
      console.log(e);
      return
    }
    else{
      exportDataToExcel(data);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: colors.bg_primary,
        flexGrow: 1,
        justifyContent: 'space-between',
      }}
      bounces={true}>
      <View style={styles.container}>
        <Text style={styles.filterHeading}>Reports</Text>
        {/* <Seperator /> */}
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
            disabled={sensorFieldDisabled}
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
          <CustomDropdown
            placeholder="Select Device Type"
            data={allDeviceType}
            labelField="label"
            valueField="value"
            value={deviceType}
            setValue={x => setDeviceType(x.value)}
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
        <TouchableOpacity style={styles.btn} onPress={getGraphData}>
          <Text style={{color: 'white'}}>Export</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.bg_primary,
    // minHeight: '100%',
    paddingVertical: 15,
    
  },
  filterHeading: {
    fontSize: 22,
    color: colors.accent_primary,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    paddingHorizontal: 20,
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
export default Reports;

const exportDataToExcel = (sample_data_to_export) => {
  // Created Sample data

  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.json_to_sheet(sample_data_to_export)    
  XLSX.utils.book_append_sheet(wb,ws,"Users")
  const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
  const path=getPath();
  // Write generated excel to Storage
  RNFS.writeFile(path, wbout, 'ascii').then((r)=>{
    if(Platform.OS=='ios')
    {Share.share({
      url:path
    })}
    else
   {Alert.alert('','Saved to Downloads')}
  }).catch((e)=>{
    Alert.alert('','Error Exporting File'+e)
  });

}
function getPath(){
  let now = moment();
  if(Platform.OS==='ios')
  return RNFS.DocumentDirectoryPath+ `/EB_report_${now.format("DD_MMMM_HHmmss")}.xlsx`
  else if(Platform.OS==='android')
  return RNFS.DownloadDirectoryPath+ `/EB_report_${now.format("DD_MMMM_HHmmss")}.xlsx`
  else
  return '';
}