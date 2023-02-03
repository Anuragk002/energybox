import React, {Dispatch, useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Checkbox} from 'react-native-paper';
import RadioButton from '../../Components/RadioButton';
import colors from '../../utils/colors';
import CustomDropdown from '../../Components/CustomDropdown';
import Modal from 'react-native-modal/dist/modal';
import TimeRangePicker from '../../Components/TimeRangePicker';
import axios from 'axios';
import {add_alert, getAllParameters, get_location} from '../../Endpoints';
import GlobalContext from '../../Context';
interface propsType {
  show: boolean;
  setShow: Dispatch<boolean>;
  updateParent: Dispatch<number>;
}
function AddAlertModal({show, setShow, updateParent}: propsType) {
  const {userData, setIsLoading} = useContext(GlobalContext);
  //radio defaults
  const days: string[] = [];
  const [fromTime, setFromTime] = useState<string>('');
  const [toTime, setToTime] = useState<string>('');
  const [alertType, setAlertType] = useState([
    {id: 1, value: true, name: 'Simple Alert', selected: false},
    {id: 2, value: false, name: 'Advance Alert', selected: false},
  ]);
  const [defineEvent, setDefineEvent] = useState([
    {id: 1, value: true, name: 'M.D. Breach(kW)', selected: false},
    {id: 2, value: false, name: 'PF Penalty', selected: false},
  ]);
  const [duration, setDuration] = useState([
    {id: 1, value: 2, name: '2 Min', selected: false},
    {id: 2, value: 5, name: '5 Min', selected: false},
    {id: 3, value: 10, name: '10 Min', selected: false},
    {id: 4, value: 15, name: '15 Min', selected: false},
    {id: 5, value: 30, name: '30 Min', selected: false},
    {id: 6, value: 60, name: '1 Hr', selected: false},
    {id: 7, value: 1440, name: '1 Day', selected: false},
  ]);
  const [repeatEvery, setRepeatEvery] = useState([
    {id: 1, value: 15, name: '15 Min', selected: false},
    {id: 2, value: 30, name: '30 Min', selected: false},
    {id: 3, value: 60, name: '1 Hr', selected: false},
    {id: 4, value: 360, name: '6 Hr', selected: false},
    {id: 5, value: 1440, name: '1 Day', selected: false},
  ]);

  const handleAllChecked = () => {
    if (!allChecked) {
      setAllChecked(true);
      setSunday(true);
      setMonday(true);
      setTuesday(true);
      setWednesday(true);
      setThursday(true);
      setFriday(true);
      setSaturday(true);
    } else {
      setAllChecked(false);
      setAllChecked(false);
      setSunday(false);
      setMonday(false);
      setTuesday(false);
      setWednesday(false);
      setThursday(false);
      setFriday(false);
      setSaturday(false);
    }
  };

  //end-- radio defaults
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [sunday, setSunday] = useState<boolean>(days.includes('Sunday'));
  const [monday, setMonday] = useState<boolean>(days.includes('Monday'));
  const [tuesday, setTuesday] = useState<boolean>(days.includes('Tuesday'));
  const [wednesday, setWednesday] = useState<boolean>(
    days.includes('Wednesday'),
  );
  const [thursday, setThursday] = useState<boolean>(days.includes('Thursday'));
  const [friday, setFriday] = useState<boolean>(days.includes('Friday'));
  const [saturday, setSaturday] = useState<boolean>(days.includes('Saturday'));
  useEffect(() => {
    if (
      !sunday ||
      !monday ||
      !tuesday ||
      !wednesday ||
      !thursday ||
      !friday ||
      !saturday
    )
      setAllChecked(false);
    if (
      sunday &&
      monday &&
      tuesday &&
      wednesday &&
      thursday &&
      friday &&
      saturday
    )
      setAllChecked(true);
  }, [sunday, monday, tuesday, wednesday, thursday, friday, saturday]);
  //radio handle
  const getRadioValue = (d: any) => {
    return d.find(x => x.selected).value;
  };
  const daysText = () => {
    let ar = [];
    if (sunday) ar.push('Sunday');
    if (monday) ar.push('Monday');
    if (tuesday) ar.push('Tuesday');
    if (wednesday) ar.push('Wednesday');
    if (thursday) ar.push('Thursday');
    if (friday) ar.push('Friday');
    if (saturday) ar.push('Saturday');
    return ar;
  };
  const handleAlertType = item => {
    let updatedState = alertType.map(alertTypeItem =>
      alertTypeItem.id === item.id
        ? {...alertTypeItem, selected: true}
        : {...alertTypeItem, selected: false},
    );
    setAlertType(updatedState);
  };
  const handleDefineEvent = item => {
    let updatedState = defineEvent.map(defineEventItem =>
      defineEventItem.id === item.id
        ? {...defineEventItem, selected: true}
        : {...defineEventItem, selected: false},
    );
    setDefineEvent(updatedState);
  };
  const handleDuration = item => {
    let updatedState = duration.map(durationItem =>
      durationItem.id === item.id
        ? {...durationItem, selected: true}
        : {...durationItem, selected: false},
    );
    setDuration(updatedState);
  };
  const handleRepeatEvery = item => {
    let updatedState = repeatEvery.map(repeatEveryItem =>
      repeatEveryItem.id === item.id
        ? {...repeatEveryItem, selected: true}
        : {...repeatEveryItem, selected: false},
    );
    setRepeatEvery(updatedState);
  };
  //end-- radio handle

  const [allLocations, setAllLocations] = useState([]);
  const [allParameters, setAllParameters] = useState([]);
  const [allOperators, setAllOperators] = useState([
    {
      value: '=',
      label: '=',
    },
    {
      value: '>',
      label: '>',
    },
    {
      value: '<',
      label: '<',
    },
    {
      value: '>=',
      label: '>=',
    },
    {
      value: '<=',
      label: '<=',
    },
  ]);

  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState({});
  const [parameter, setParameter] = useState({});
  const [operator, setOperator] = useState('');
  const [eventValue, setEventValue] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const getData = async () => {
    
    await axios
      .get(get_location + '?userid=' + userData.id) //remove hardcoded id
      .then(async res => {
        setAllLocations(res?.data?.locations);
      })
      .catch(err => console.log(err))
    
    await axios
      .get(getAllParameters) //remove hardcoded id
      .then(async res => {
        // console.log('Parameters', res?.data?.Parameters);
        setAllParameters(res?.data?.Parameters);
      })
      .catch(err => console.log(err))
  };
  React.useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    let d = {
      user_id: userData.id,
      event_name: eventName,
      location: location.id,
      parameter: parameter.id,
      event_condition: operator,
      event_value: eventValue,
      duration: getRadioValue(duration),
      days: daysText(),
      time_from: fromTime,
      time_to: toTime,
      repeat_every: getRadioValue(repeatEvery),
      mobile: mobile,
      email: email,
    };
    console.log(d);
    setIsLoading(true);
    await axios
      .post(add_alert, d)
      .then(async res => {
        console.log(res);
        if (res.data.status)  {
          updateParent(Math.random());
          setShow(false);
        } else setIsLoading(false);
      })
      .finally(()=>setIsLoading(false))
      .catch(err => console.log(err));
  };
  return (
    <Modal useNativeDriver={true}  isVisible={show} animationIn="zoomIn" animationOut="zoomOut">
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView style={{}}>
            <View style={styles.rootView}>
              <Text style={styles.alertHeading}>Add New Alert</Text>
              <Seperator />
              <View style={{padding: 20}}>
                <Text style={styles.lable}>Event Name</Text>
                <TextInput
                  placeholder="Enter Event Name"
                  style={styles.inputBox}
                  onChangeText={setEventName}
                />
                <Seperator />
                {/* <Text style={styles.lable}>Alert Type</Text>
              {alertType.map(item => (
                <RadioButton
                  onPress={() => handleAlertType(item)}
                  selected={item.selected}
                  key={item.id}>
                  {item.name}
                </RadioButton>
              ))}
              <Seperator /> */}
                <Text style={styles.lable}>Select Location</Text>
                <CustomDropdown
                  placeholder="Select Location"
                  data={allLocations}
                  labelField="location_name"
                  valueField="id"
                  value={location?.id}
                  setValue={setLocation}
                />
                <Seperator />
                <Text style={styles.lable}>Define Event</Text>
                <CustomDropdown
                  placeholder="Select Parameter"
                  data={allParameters}
                  labelField="parameter_name"
                  valueField="id"
                  value={parameter?.id}
                  setValue={setParameter}
                />
                <CustomDropdown
                  placeholder="select = >= <="
                  data={allOperators}
                  labelField="label"
                  valueField="value"
                  value={operator}
                  setValue={r => setOperator(r.value)}
                />
                <TextInput
                  placeholder="Value"
                  style={styles.inputBox}
                  onChangeText={setEventValue}
                />
                <Seperator />
                {/* <Text style={styles.lable}>Define Event</Text>
              {defineEvent.map(item => (
                <RadioButton
                  onPress={() => handleDefineEvent(item)}
                  selected={item.selected}
                  key={item.id}>
                  {item.name}
                </RadioButton>
              ))} */}

                <Text style={styles.lable}>Duration</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {duration.map(item => (
                    <RadioButton
                      style={{width: '30%'}}
                      onPress={() => handleDuration(item)}
                      selected={item.selected}
                      key={item.id}>
                      {item.name}
                    </RadioButton>
                  ))}
                </View>
                <Seperator1 />
                <Text style={styles.lable}>On Days</Text>
                <Checkbox.Item
                  mode="android"
                  style={styles.dayStyle}
                  color={colors.accent_primary}
                  labelStyle={{fontWeight: 'bold', ...styles.dayLabel}}
                  label="All Days"
                  status={allChecked ? 'checked' : 'unchecked'}
                  onPress={handleAllChecked}
                />
                <Checkbox.Item
                  mode="android"
                  style={styles.dayStyle}
                  labelStyle={styles.dayLabel}
                  label="Sunday"
                  status={sunday ? 'checked' : 'unchecked'}
                  onPress={() => setSunday(prev => !prev)}
                />
                <Checkbox.Item
                  mode="android"
                  style={styles.dayStyle}
                  labelStyle={styles.dayLabel}
                  label="Monday"
                  status={monday ? 'checked' : 'unchecked'}
                  onPress={() => setMonday(prev => !prev)}
                />
                <Checkbox.Item
                  mode="android"
                  style={styles.dayStyle}
                  labelStyle={styles.dayLabel}
                  label="Tuesday"
                  status={tuesday ? 'checked' : 'unchecked'}
                  onPress={() => setTuesday(prev => !prev)}
                />
                <Checkbox.Item
                  mode="android"
                  style={styles.dayStyle}
                  labelStyle={styles.dayLabel}
                  label="Wednesday"
                  status={wednesday ? 'checked' : 'unchecked'}
                  onPress={() => setWednesday(prev => !prev)}
                />
                <Checkbox.Item
                  mode="android"
                  style={styles.dayStyle}
                  labelStyle={styles.dayLabel}
                  label="Thursday"
                  status={thursday ? 'checked' : 'unchecked'}
                  onPress={() => setThursday(prev => !prev)}
                />
                <Checkbox.Item
                  mode="android"
                  style={styles.dayStyle}
                  labelStyle={styles.dayLabel}
                  label="Friday"
                  status={friday ? 'checked' : 'unchecked'}
                  onPress={() => setFriday(prev => !prev)}
                />
                <Checkbox.Item
                  mode="android"
                  style={styles.dayStyle}
                  labelStyle={styles.dayLabel}
                  label="Saturday"
                  status={saturday ? 'checked' : 'unchecked'}
                  onPress={() => setSaturday(prev => !prev)}
                />
                <Seperator1 />
                <Text style={styles.lable}>During Time</Text>
                <TimeRangePicker
                  fromTime={fromTime}
                  setFromTime={setFromTime}
                  toTime={toTime}
                  setToTime={setToTime}
                />
                <Seperator />
                <Text style={styles.lable}>Repeat Every</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {repeatEvery.map(item => (
                    <RadioButton
                      style={{width: '30%'}}
                      onPress={() => handleRepeatEvery(item)}
                      selected={item.selected}
                      key={item.id}>
                      {item.name}
                    </RadioButton>
                  ))}
                </View>
                <Seperator1 />
                <Text style={styles.lable}>SMS Log</Text>
                <TextInput
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholder="Enter Mobile Number"
                  style={styles.inputBox}
                  onChangeText={setMobile}
                />
                <Seperator />
                <Text style={styles.lable}>Email Log</Text>
                <TextInput
                  keyboardType="email-address"
                  placeholder="Enter Email"
                  style={styles.inputBox}
                  onChangeText={setEmail}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity style={styles.btn} onPress={handleSave}>
                    <Text style={{color: 'white'}}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnCancel}
                    onPress={() => setShow(false)}>
                    <Text style={{color: 'white'}}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  rootView: {
    borderRadius: 15,
    marginTop: 15,
    backgroundColor: colors.bg_white,
    paddingVertical: 20,
    width: '88%',
    alignSelf: 'center',
    minHeight: 500,
  },
  alertHeading: {
    fontSize: 22,
    color: colors.accent_primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  lable: {
    fontSize: 15,
    color: colors.font_primary,
    marginBottom: 10,
  },
  inputBox: {
    borderWidth: 1,
    padding: 15,
    borderColor: colors.border_light,
    borderRadius: 5,
    marginBottom: 18,
  },
  dayStyle: {
    borderBottomWidth: 1,
    borderBottomColor: colors.font_grey,
  },
  dayLabel: {
    color: colors.font_primary,
  },
  btn: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: colors.accent_primary,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  btnCancel: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: colors.accent_secondary,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
export default AddAlertModal;

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
function Seperator1() {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        marginVertical: 15,
        borderBottomColor: colors.border_light,
      }}></View>
  );
}
