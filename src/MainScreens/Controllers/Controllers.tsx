import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import colors from '../../utils/colors';
import {Button} from 'react-native-paper';
import axios from 'axios';
import {
  automate_on_off,
  controller_onoff,
  getControllers,
} from '../../Endpoints';
import {IUser} from '../../../App';
import GlobalContext from '../../Context';
import AddAutomate from './AutomateModal';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function Controllers() {
  const [conData, setConData] = useState([]);
  const [refresh, triggerRefresh] = useState(0);
  const [refresh1, triggerRefresh1] = useState(0);
  const {userData, setIsLoading} = useContext(GlobalContext);
  const getData = async () => {
    setIsLoading(true);
    await axios
      .post(getControllers, {userid: userData.id}) //remove hardcoded id
      .then(async res => {
        // console.log('controllerss', res?.data?.controllers);
        setConData(res?.data?.controllers);
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
    console.log('parentUpdated!');
    triggerRefresh1(Math.random());
  };
  useEffect(() => {
    console.log(userData);
    getData();
  }, [refresh]);

  const [refreshInterval, setRefreshInterval] = useState(120000);
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(getData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  //refresh control
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(false);
    getData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{fontSize: 25, color: colors.font_grey, fontWeight: 'bold'}}>
          Controllers
        </Text>
      </View>
      {conData.map((d, index) => (
        <ControllerListCard
          key={index + refresh1}
          data={d}
          updateParent={triggerRefresh}
        />
      ))}
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
});
export default Controllers;

const ControllerListCard = ({data, updateParent}) => {
  const [on, setOn] = useState<boolean>(data.is_activated);
  const [automate, setAutomate] = useState(
    data.controller_automate == 1 ? true : false,
  );
  const [automateModal, showAutomateModal] = useState(false);
  const [openBottom, setOpenBottom] = useState(false);
  const {setIsLoading} = useContext(GlobalContext);

  const handleToggle = async () => {
    setIsLoading(true);
    await axios
      .post(controller_onoff, {
        controller_did: data.controller_deviceid,
        controller_id: data.controller_details.id,
        status: on ? 'false' : 'true',
      })
      .then(async res => {
        if (res.data.success) {
          updateParent(Math.random());
        } else setIsLoading(false);
      })
      .catch(err => console.log(err));
    // .finally(() => setIsLoading(false));
  };
  const handleAutomate = async () => {
    if (!automate) {
      showAutomateModal(true);
      // setAutomate(true);
    } else {
      setIsLoading(true);
      await axios
        .post(automate_on_off, {id: data.id, automate_status: '0'})
        .then(async res => {
          if (res?.data?.status == true) setAutomate(false);
          console.log('automateoffon', res?.data);
          // setConData(res?.data?.controllers);
        })
        .catch(err => console.log(err))
        .finally(() => setIsLoading(false));
    }
  };
  return (
    <View
      style={{
        // ...shade.shadowlight,
        backgroundColor: colors.bg_primary,
        marginVertical: 8,
        borderWidth: 1.5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: colors.border_light,
        borderRadius: 8,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.font_primary,
              marginBottom: 3,
            }}>
            {data.controller_name}
          </Text>
          <Text
            style={{fontSize: 14, fontWeight: '500', color: colors.font_grey}}>
            {data.controller_desc}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Image
            style={{}}
            source={
              on
                ? require('../../assets/images/ondot.png')
                : require('../../assets/images/offdot.png')
            }
          />
          <Pressable
            onPress={() => {
              handleToggle();
            }}>
            <Image
              style={{width: 80}}
              source={
                on
                  ? require('../../assets/images/ontoggle.png')
                  : require('../../assets/images/offtoggle.png')
              }
            />
          </Pressable>
        </View>
      </View>
      <View>
        {/* {openBottom && ( */}
        <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: colors.font_primary,
            }}>
            Automate{'\n'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: colors.font_grey,
            }}>
            {data.automate_time.days.join(',')}
            {'\n'}
            {data.automate_time.start_time} - {data.automate_time.end_time}
          </Text>
          <TouchableOpacity onPress={handleAutomate}>
            <Image
              style={{}}
              source={
                automate
                  ? require('../../assets/images/ontoggle.png')
                  : require('../../assets/images/offtoggle.png')
              }
            />
          </TouchableOpacity>
        </View>
        {/* )} */}
        {/* <Button
          style={{
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          icon={openBottom ? 'chevron-up' : 'chevron-down'}
          onPress={() => {
            setOpenBottom(prev => !prev);
            LayoutAnimation.configureNext({
              duration: 500,
              create: {type: 'linear', property: 'opacity'},
              update: {type: 'linear', springDamping: 0.4},
              delete: {type: 'linear', property: 'opacity'},
            });
          }}>
          <View></View>
        </Button> */}
        <AddAutomate
          show={automateModal}
          setShow={showAutomateModal}
          data={data?.automate_time}
          cid={data.id}
          updateParent={updateParent}
        />
      </View>
    </View>
  );
};
