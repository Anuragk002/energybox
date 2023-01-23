import moment from 'moment';
import React, {useState} from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import colors from '../utils/colors';
function DateRangePicker(props) {
  const {fromDate,setFromDate,toDate,setToDate}=props;

  const [isDate1PickerVisible, setDate1PickerVisibility] = useState(false);
  const [isDate2PickerVisible, setDate2PickerVisibility] = useState(false);
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);

  const hideDatePicker = () => {
    setDate1PickerVisibility(false);
    setDate2PickerVisibility(false);
  };

  const handleConfirm1 = date => {
    setFromDate(moment(date).format('MM/DD/YYYY'));
    setDate1PickerVisibility(false);
    // setDate2PickerVisibility(true);
  };

  const handleConfirm2 = date => {
    setToDate(moment(date).format('MM/DD/YYYY'));
    setDate2PickerVisibility(false);
  };

  return (
    <View style={styles.inputBox}>
      <TouchableOpacity
        style={styles.dateinput}
        onPress={() => setDate1PickerVisibility(true)}>
        {!fromDate ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <Text>From</Text>
            <Image
              style={{}}
              source={require('../assets/images/calendar.png')}
            />
          </View>
        ) : (
          <Text numberOfLines={1} style={styles.dateText}>
            {fromDate}
          </Text>
        )}
      </TouchableOpacity>
      <Text style={{fontWeight: 'bold'}}>--</Text>
      <TouchableOpacity
        style={styles.dateinput}
        onPress={() => setDate2PickerVisibility(true)}>
        {!toDate ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <Text>Till</Text>
            <Image
              style={{}}
              source={require('../assets/images/calendar.png')}
            />
          </View>
        ) : (
          <Text numberOfLines={1} style={styles.dateText}>
            {toDate}
          </Text>
        )}
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDate1PickerVisible}
        mode="date"
        onConfirm={handleConfirm1}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDate2PickerVisible}
        mode="date"
        onConfirm={handleConfirm2}
        onCancel={hideDatePicker}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  inputBox: {
    borderWidth: 1,
    padding: 5,
    borderColor: colors.border_light,
    borderRadius: 5,
    marginBottom: 18,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: 55,
  },
  dateinput: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
  },
  dateText: {},
});
export default DateRangePicker;
