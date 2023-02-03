import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Accounts/Login';
import Dashboard from './MainScreens/Dashboard/Dashboard';
import Controllers from './MainScreens/Controllers/Controllers';
import Alerts from './MainScreens/Alerts/Alerts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from './utils/colors';
import {SafeAreaView, useSafeArea} from 'react-native-safe-area-context';
import LoadingScreen from './Components/LoadingScreen';
import CustomDrawer from './Components/CustomDrawer';
import Settings from './MainScreens/Settings/Settings';
import Reports from './MainScreens/Reports/Reports';

const Tab = createBottomTabNavigator();

function CustomHeader(props: any) {
  const [showDrawer, setShowDrawer] = React.useState(false);
  return (
    <View
      style={{
        height: 70,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.bg_primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 999,
        ...styles.shadow,
        shadowOpacity: 0.1,
      }}>
      <TouchableOpacity onPress={() => setShowDrawer(true)}>
        <Image
          style={{marginLeft: -10}}
          source={require('./assets/images/drawer.png')}
        />
      </TouchableOpacity>
      <Image
        style={{height: 32, width: 150, resizeMode: 'contain'}}
        source={require('./assets/images/energy_box_logo.png')}
      />
      {/* <Ionicons
        style={styles.shadow}
        name={'search-outline'}
        size={30}
        color={'#0B6BB3'}
      /> */}
      <Image
                style={{height: 30,width:30,borderRadius:15,borderWidth:2,borderColor:colors.font_primary}}
                source={{
                  uri: 'https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg',
                }}></Image>
      <CustomDrawer show={showDrawer} setShow={setShowDrawer}/>
    </View>
  );
}

function HomeTab() {
  const insets = useSafeArea();
  return (
    <SafeAreaView style={{flex: 1}} edges={['top', 'left', 'right']}>
      <CustomHeader />
      <Tab.Navigator
        initialRouteName="Dashboard"
        backBehavior="initialRoute"
        screenOptions={{
          tabBarHideOnKeyboard:true,
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.bg_primary,
            height: 70 + insets.top,
          },
          headerTitleAlign: 'center',
          headerTitle: props => <CustomHeader {...props} />,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.bg_primary,
            height: 70 + insets.bottom,
            justifyContent: 'center',
            borderTopWidth: 2,
            borderTopColor: 'rgba(255,255,255,0.5)',
          },
        }}>
          <Tab.Screen
          name="Controllers"
          component={Controllers}
          options={({route}: any) => ({
            tabBarIcon: ({focused}) => (
              <Image
                source={require('./assets/images/bottomTab/controller.png')}
                style={{
                  tintColor: focused
                    ? colors.accent_primary
                    : colors.accent_secondary,
                }}
              />
            ),
          })}
        />
        <Tab.Screen
          name="Alerts"
          component={Alerts}
          options={({route}: any) => ({
            tabBarIcon: ({focused}) => (
              <Image
                source={require('./assets/images/bottomTab/alert.png')}
                style={{
                  tintColor: focused
                    ? colors.accent_primary
                    : colors.accent_secondary,
                    marginRight: 20,
                }}
              />
            ),
          })}
        />
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={({route}: any) => ({
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  // position:'absolute',
                  backgroundColor: focused
                    ? colors.accent_primary
                    : colors.accent_secondary,
                  width: 75,
                  height: 75,
                  borderRadius: 38,
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: -30,
                  ...styles.shadow,
                  borderWidth: 3,
                  borderColor: 'rgba(255,255,255,0.5)',
                }}>
                <Image
                  source={require('./assets/images/bottomTab/dashboard.png')}
                />
              </View>
            ),
            tabBarHideOnKeyboard:true
          })}
        />
        <Tab.Screen
          name="Reports"
          component={Reports}
          options={({route}: any) => ({
            tabBarIcon: ({focused}) => (
              <Image
                source={require('./assets/images/bottomTab/cloud-upload.png')}
                style={{
                  tintColor: focused
                    ? colors.accent_primary
                    : colors.accent_secondary,
                    marginLeft: 20,
                }}
              />
            ),
          })}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={({route}: any) => ({
            tabBarIcon: ({focused}) => (
              <Image
                source={require('./assets/images/bottomTab/pie-chart.png')}
                style={{
                  tintColor: focused
                    ? colors.accent_primary
                    : colors.accent_secondary,
                }}
              />
            ),
          })}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeTab"
          component={HomeTab}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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
