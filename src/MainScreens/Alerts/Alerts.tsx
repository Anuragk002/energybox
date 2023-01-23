import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import colors from '../../utils/colors';
import Feather from 'react-native-vector-icons/Feather';
import {shade} from '../../utils/shadow';
import AddAlertModal from './AddAlertModal';
import GlobalContext from '../../Context';
import axios from 'axios';
import {getAllParameters, get_alerts} from '../../Endpoints';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function Alerts() {
  const [visible, setVisible] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const {setIsLoading} = useContext(GlobalContext);

  const getData = async () => {
    setIsLoading(true);
    await axios
      .get(get_alerts) //remove hardcoded id
      .then(async res => {
        // console.log('controllerss', res?.data?.allAlerts);
        setAlerts(res?.data?.allAlerts);
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
    // triggerRefresh1(Math.random());
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{fontSize: 25, color: colors.font_grey, fontWeight: 'bold'}}>
          Alerts
        </Text>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Image source={require('../../assets/images/plusred.png')} />
        </TouchableOpacity>
      </View>
      {alerts.map((data, index) => (
        <AlertListCard data={data} key={index} />
      ))}
      <AddAlertModal show={visible} setShow={setVisible} />
      <View style={{height: 50}}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg_primary,
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  shadow: {
    shadowColor: '#000',
    //ios
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8.3,
    //android
    elevation: 12,
  },
  listText: {
    paddingVertical: 5,
    color: colors.font_primary,
  },
});
export default Alerts;

interface AlertData {
  data: {
    id: number;
    event_name: string;
    alert_type: string;
    location_id: string;
    event_type: string;
    event_condition: string;
    event_value: string;
    parameter_id: string;
    duration: string;
    days: string;
    time_from: string;
    time_to: string;
    repeat_every: string;
    mobile_numbers: string;
    email_ids: string;
    customer_id: string;
    created_at: string;
    updated_at: string;
  };
}

function AlertListCard({data}: AlertData) {
  const [full, showFull] = useState(false);
  return (
    <View
      style={{
        ...shade.shadowlight,
        backgroundColor: colors.bg_primary,
        marginVertical: 5,
        borderWidth: 1.5,
        padding: 10,
        borderColor: colors.border_light,
        borderRadius: 10,
      }}>
      <Pressable
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          showFull(prev => !prev);
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{fontSize: 22, fontWeight: '500', color: colors.font_primary}}>
          {data.event_name}
        </Text>
        <Feather
          name={full ? 'chevron-down' : 'chevron-right'}
          size={30}
          color={colors.font_primary}
        />
      </Pressable>
      {full && (
        <View>
          <Text style={styles.listText}>Type : {data?.alert_type}</Text>
          <Text style={styles.listText}>Location : {data?.location_id}</Text>
          <Text style={styles.listText}>
            Event Condition : {data?.event_condition}
          </Text>
          <Text style={styles.listText}>Day : {data?.days.toString()}</Text>
          <Text style={styles.listText}>Duration : {data?.duration} Mins</Text>
          <Text style={styles.listText}>
            Timing : {data?.time_from}-{data?.time_to}
          </Text>
          <Text style={styles.listText}>
            Repeat Every : {data?.repeat_every} Mins
          </Text>
          <Text style={styles.listText}>
            Mobile Numbers : {data?.mobile_numbers}
          </Text>
          <Text style={styles.listText}>Email IDs : {data?.email_ids}</Text>
        </View>
      )}
    </View>
  );
}
