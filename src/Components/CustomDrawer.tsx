import { useNavigation } from '@react-navigation/native';
import React, {Dispatch, useContext} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GlobalContext from '../Context';
import colors from '../utils/colors';
import { LocalStorage } from '../utils/helpers';
interface propsType {
  show: boolean;
  setShow: Dispatch<boolean>;
}
interface NavProps {
  navigate: any;
  replace: any;
}
function CustomDrawer({show, setShow}: propsType) {
  const {userData,setUserData} = useContext(GlobalContext);
  const navigation = useNavigation<NavProps>();
  const handleLogout=async()=>{
    await LocalStorage.delete(LocalStorage.Key.UserData);
    setUserData(null)
    navigation.replace('Login');
  }
  return (
    <Modal
      useNativeDriver={true} 
      style={{width: '100%', alignItems: 'flex-start', flex: 1}}
      isVisible={show}
      animationIn="slideInLeft"
      animationOut={'slideOutLeft'}
      backdropColor={'#0566AF'}
      backdropOpacity={0.4}
      onBackdropPress={() => setShow(false)}>
      <SafeAreaView style={{flex: 1, width: '70%', marginLeft: -18}}>
        <ScrollView
          contentContainerStyle={{
            backgroundColor: colors.bg_white,
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
          bounces={true}>
          <View style={styles.container}>
            <View style={styles.userView}>
              <Image
                style={styles.profileImg}
                source={{
                  uri: 'https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg',
                }}></Image>
              <Text style={styles.username}>{userData?.name}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                padding: 20,
                backgroundColor: "#ebeff5",
                marginVertical: 20,
                flexDirection:'row',
                alignItems:'center',
              }}>
              <Text
                style={{
                  color: colors.accent_primary,
                  fontSize: 22,
                  fontWeight: 'bold',
                }}>
                Log Out
              </Text>
              <Ionicons
                style={{marginLeft:20}}
                name={'log-out'}
                size={22}
                color={colors.accent_primary}
              />
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
    paddingVertical: 20,
  },
  userView: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:''
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  username: {
    marginLeft: 20,
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.accent_secondary,
  },
});
export default CustomDrawer;
