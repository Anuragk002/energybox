import React, {Dispatch, useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
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
import {add_automate_time} from '../../Endpoints';
import GlobalContext from '../../Context';

interface propsType {
  show: boolean;
  setShow: Dispatch<boolean>;
  data: any;
  updateParent: Dispatch<number>;
  cid: number;
}
function AddAutomate({show, setShow, data, cid, updateParent}: propsType) {
  //radio defaults
  // const [days,setDays]=useState(data.days);
  const {setIsLoading} = useContext(GlobalContext);
  const {days, start_time, end_time} = data;
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

  const [fromTime, setFromTime] = useState<string>(start_time);
  const [toTime, setToTime] = useState<string>(end_time);

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

  const handleSave = async () => {
    // console.log('obj', {
    //   id: cid,
    //   days: daysText(),
    //   start_hr: start_time.slice(0, 2),
    //   start_min: start_time.slice(-2),
    //   end_hr: end_time.slice(0, 2),
    //   end_min: end_time.slice(-2),
    // });
    setShow(false);
    setIsLoading(true);
    await axios
      .post(add_automate_time, {
        id: cid,
        days: daysText(),
        start_hr: start_time.slice(0, 2),
        start_min: start_time.slice(-2),
        end_hr: end_time.slice(0, 2),
        end_min: end_time.slice(-2),
      })
      .then(async res => {
        updateParent(Math.random());
        // if (res.data.success) {
        //   updateParent(Math.random());
        // } else setIsLoading(false);
      })
      .catch(err => console.log(err));
  };

  return (
    <Modal
      useNativeDriver={true} 
      isVisible={show}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackdropPress={() => setShow(false)}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{}}>
          <View style={styles.rootView}>
            <Text style={styles.automateHeading}>Automate</Text>
            <Seperator />
            <View style={{paddingHorizontal: 20,marginBottom:20}}>
              <Checkbox.Item
                mode="android"
                style={styles.dayLabel}
                color={colors.accent_primary}
                labelStyle={{fontWeight: 'bold'}}
                label="All Days"
                status={allChecked ? 'checked' : 'unchecked'}
                onPress={handleAllChecked}
              />
              <Checkbox.Item
                mode="android"
                style={styles.dayLabel}
                label="Sunday"
                status={sunday ? 'checked' : 'unchecked'}
                onPress={() => setSunday(prev => !prev)}
              />
              <Checkbox.Item
                mode="android"
                style={styles.dayLabel}
                label="Monday"
                status={monday ? 'checked' : 'unchecked'}
                onPress={() => setMonday(prev => !prev)}
              />
              <Checkbox.Item
                mode="android"
                style={styles.dayLabel}
                label="Tuesday"
                status={tuesday ? 'checked' : 'unchecked'}
                onPress={() => setTuesday(prev => !prev)}
              />
              <Checkbox.Item
                mode="android"
                style={styles.dayLabel}
                label="Wednesday"
                status={wednesday ? 'checked' : 'unchecked'}
                onPress={() => setWednesday(prev => !prev)}
              />
              <Checkbox.Item
                mode="android"
                style={styles.dayLabel}
                label="Thursday"
                status={thursday ? 'checked' : 'unchecked'}
                onPress={() => setThursday(prev => !prev)}
              />
              <Checkbox.Item
                mode="android"
                style={styles.dayLabel}
                label="Friday"
                status={friday ? 'checked' : 'unchecked'}
                onPress={() => setFriday(prev => !prev)}
              />
              <Checkbox.Item
                mode="android"
                style={styles.dayLabel}
                label="Saturday"
                status={saturday ? 'checked' : 'unchecked'}
                onPress={() => setSaturday(prev => !prev)}
              />
            </View>
            <TimeRangePicker
              fromTime={fromTime}
              setFromTime={setFromTime}
              toTime={toTime}
              setToTime={setToTime}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
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
          <Button icon="close" textColor="white" onPress={() => setShow(false)}>
            <Text>Close</Text>
          </Button>
        </ScrollView>
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
    minHeight: 600,
  },
  automateHeading: {
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
  dayRoot: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderBottomColor: colors.font_grey,
    borderBottomWidth: 1,
  },
  dayLabel: {
    borderBottomWidth: 1,
    borderBottomColor: colors.font_grey,
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
export default AddAutomate;

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
