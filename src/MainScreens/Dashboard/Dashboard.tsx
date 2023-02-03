import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../utils/colors';
import {shade} from '../../utils/shadow';
import Filter from './Filter';

import Chart from './Chart';
import {LocalStorage} from '../../utils/helpers';
import {Button, DataTable, SegmentedButtons} from 'react-native-paper';
import axios from 'axios';
import {
  get_active_inactive_sensor,
  get_active_inactive_sensor_count,
} from '../../Endpoints';
import GlobalContext from '../../Context';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface SummaryObj {
  total: number;
  active: number;
  inactive: number;
}
function Dashboard() {
  const {userData, setIsLoading} = useContext(GlobalContext);
  const [graphData,setGraphData]=useState({});

  const [showFilter, setShowFilter] = useState(false);
  const [showSensors, setShowSensors] = useState(false);

  const [active, setActive] = useState(true);


  const [summaryData, setSummaryData] = useState<SummaryObj>();

  const [activeSensors, setActiveSensors] = useState([]);
  const [inactiveSensors, setInactiveSensors] = useState([]);

  const getTableData = async () => {
    // setIsLoading(true);

    await axios
      .get(get_active_inactive_sensor_count + '?user_id=' + userData.id)
      .then(async res => {
        setSummaryData(res?.data?.sensors);
      })
      .catch(err => console.log(err));

    await axios
      .get(
        get_active_inactive_sensor +
          '?user_id=' +
          userData.id +
          '&is_active=true',
      )
      .then(async res => {
        setActiveSensors(res?.data?.sensors);
      })
      .catch(err => console.log(err));

    await axios
      .get(
        get_active_inactive_sensor +
          '?user_id=' +
          userData.id +
          '&is_active=false',
      )
      .then(async res => {
        setInactiveSensors(res?.data?.sensors);
      })
      .catch(err => console.log(err));
      setIsLoading(false)
    // setIsLoading(false);
  };
  React.useEffect(() => {
    setIsLoading(true)
    getTableData();
  }, []);

  const [refreshInterval, setRefreshInterval] = useState(120000);
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(getTableData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoCard}>
        <View>
          <Text style={styles.lable}>Total Purchases</Text>
          <Text
            style={{color: 'deepskyblue', fontSize: 20, fontWeight: 'bold'}}>
            {summaryData?.total}
          </Text>
        </View>
        <View>
          <Text style={styles.lable}>Active</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                ...styles.indicator,
                backgroundColor: 'green',
              }}
            />
            <Text style={{color: 'green', fontSize: 20, fontWeight: 'bold'}}>
              {summaryData?.active}
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.lable}>Inactive</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                ...styles.indicator,
                backgroundColor: 'red',
              }}
            />
            <Text style={{color: 'red', fontSize: 20, fontWeight: 'bold'}}>
              {summaryData?.inactive}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          marginHorizontal: 20,
          ...shade.shadowlight,
        }}>
        <TouchableOpacity
          style={styles.sensorBtnContainer}
          onPress={() => {
            setShowSensors(true);
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
          }}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={
              showSensors
                ? ['#166FFF', '#09B2FF']
                : [colors.border_light, colors.border_light]
            }
            style={styles.sensorBtn}>
            <Text style={{...styles.buttonText, color: colors.font_secondary}}>
              All Sensors
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sensorBtnContainer}
          onPress={() => {
            setShowSensors(false);
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
          }}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={
              showSensors
                ? [colors.border_light, colors.border_light]
                : ['#166FFF', '#09B2FF']
            }
            style={styles.sensorBtn}>
            <Text style={styles.buttonText}>Hide Sensors</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View
        style={{
          ...styles.centered,
          backgroundColor: colors.border_light,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
        <View
          style={{
            ...styles.centered,
          }}>
          <View style={{marginRight: 15}}>
            <Text style={styles.countLable}>Yesterdays Count</Text>
            <Text style={styles.countValue}>{graphData?.yesterdayKwh}</Text>
          </View>
          <View>
            <Text style={styles.countLable}>Todays Count</Text>
            <Text style={styles.countValue}>{graphData?.todayKwh}</Text>
          </View>
        </View>
        <View
          style={{
            ...styles.centered,
          }}>
          <TouchableOpacity>
            <Image
              style={{marginRight: 15}}
              source={require('../../assets/images/download.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilter(true)}>
            <Image
              style={{}}
              source={require('../../assets/images/filter.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      {showSensors && (
        <View>
          <View
            style={{
              paddingHorizontal: 50,
              paddingVertical: 20,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Button
              style={{width: 120, borderRadius: 0, height: 42}}
              mode={active ? 'contained' : 'outlined'}
              onPress={() => setActive(true)}>
              Active
            </Button>
            <Button
              style={{width: 120, borderRadius: 0, height: 42}}
              mode={!active ? 'contained' : 'outlined'}
              onPress={() => setActive(false)}>
              In Active
            </Button>
          </View>
          <View style={{paddingBottom: 20, paddingHorizontal: 20}}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Sensor Name</DataTable.Title>
                <DataTable.Title numeric>KW</DataTable.Title>
                <DataTable.Title numeric>KWh</DataTable.Title>
                <DataTable.Title numeric>Last Comm.</DataTable.Title>
              </DataTable.Header>
              {active &&
                activeSensors.map((x, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{x?.sensor_name}</DataTable.Cell>
                    <DataTable.Cell numeric>{x?.kw}</DataTable.Cell>
                    <DataTable.Cell numeric>{x?.today_kwh}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {x?.last_communicated}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              {!active &&
                inactiveSensors.map((x, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{x?.sensor_name}</DataTable.Cell>
                    <DataTable.Cell numeric>{x?.kw}</DataTable.Cell>
                    <DataTable.Cell numeric>{x?.today_kwh}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {x?.last_communicated}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
            </DataTable>
          </View>
        </View>
      )}
      <Filter show={showFilter} setShow={setShowFilter} graphData={graphData} setGraphData={setGraphData}/>
      <View style={{flex: 1, backgroundColor: 'white', height: 500}}>
        <Chart data={graphData?.result}/>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  centered: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.bg_primary,
    flex: 1,
    // padding: 20,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    ...shade.shadow,
    opacity: 1,
    backgroundColor: colors.bg_primary,
    marginBottom: 20,
  },
  indicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginRight: 10,
  },
  lable: {
    fontSize: 15,
    color: colors.font_primary,
  },

  sensorBtn: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 7,
    height: 45,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorBtnContainer: {
    width: '45%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    // fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: '#ffffff',
  },
  countLable: {
    color: colors.font_grey,
    fontSize: 12,
    marginBottom: 8,
  },
  countValue: {fontSize: 16, color: colors.font_primary, fontWeight: 'bold'},
});
export default Dashboard;
