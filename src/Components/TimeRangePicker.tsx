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
import colors from '../utils/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
function TimeRangePicker(props) {
  const {fromTime,setFromTime,toTime,setToTime}=props;
  const [isTime1PickerVisible, setTime1PickerVisibility] = useState(false);
  const [isTime2PickerVisible, setTime2PickerVisibility] = useState(false);

  const hideTimePicker = () => {
    setTime1PickerVisibility(false);
    setTime2PickerVisibility(false);
  };

  const handleConfirm1 = time => {
    setFromTime(time.toString().slice(16,21));
    setTime1PickerVisibility(false);
  };

  const handleConfirm2 = time => {
    setToTime(time.toString().slice(16,21));
    setTime2PickerVisibility(false);
  };

  return (
    <View style={styles.inputBox}>
      <TouchableOpacity
        style={styles.timeinput}
        onPress={() => setTime1PickerVisibility(true)}>
        {!fromTime ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <Text>Start Time</Text>
            <Image
              style={{}}
              source={require('../assets/images/clock.png')}
            />
          </View>
        ) : (
          <Text numberOfLines={1} style={styles.timeText}>
            {fromTime}
          </Text>
        )}
      </TouchableOpacity>
      <Text style={{fontWeight: 'bold'}}>--</Text>
      <TouchableOpacity
        style={styles.timeinput}
        onPress={() => setTime2PickerVisibility(true)}>
        {!toTime ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <Text>End Time</Text>
            <Image
              style={{}}
              source={require('../assets/images/clock.png')}
            />
          </View>
        ) : (
          <Text numberOfLines={1} style={styles.timeText}>
            {toTime}
          </Text>
        )}
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTime1PickerVisible}
        mode="time"
        onConfirm={handleConfirm1}
        onCancel={hideTimePicker}
      />
      <DateTimePickerModal
        isVisible={isTime2PickerVisible}
        mode="time"
        onConfirm={handleConfirm2}
        onCancel={hideTimePicker}
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
  timeinput: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
  },
  timeText: {},
});
export default TimeRangePicker;
