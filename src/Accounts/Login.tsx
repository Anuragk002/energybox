import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useContext, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import GlobalContext from '../Context';
import {login} from '../Endpoints';
import colors from '../utils/colors';
import {LocalStorage} from '../utils/helpers';

interface NavProps {
  replace: any;
}

function Login() {
  const navigation = useNavigation<NavProps>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');

  const {setUserData, setIsLoading} = useContext(GlobalContext);

  const handleLogin = async () => {
    if(email.trim()===''||password.trim()===''){
      Alert.alert('','Enter valid email and password');
      return;
    }
    setIsLoading(true);
    await axios
      .post(login, {email:email.trim().toLowerCase(), password})
      .then(async res => {
        if ((res.data.success)) {
          await LocalStorage.write(
            LocalStorage.Key.UserData,
            JSON.stringify(res?.data?.user),
          );
          setUserData(res?.data?.user);
          navigation.replace('HomeTab');
        } else {
          Alert.alert(
            'Login Failed',
            res?.data?.message,
          );
          setIsLoading(false)
        }
        // console.log(res.data);
      })
      .catch(err => console.log(err.message))
      // .finally(() => setIsLoading(false));
  };

  async function checkAuth(){
    const res=await LocalStorage.read(
      LocalStorage.Key.UserData,
      );
      if(res){
        setUserData(JSON.parse(res));
        navigation.replace('HomeTab')
      }
  }
  React.useEffect(() => {
    checkAuth()
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../assets/images/energy_box_logo.png')}
        />
        {/* <StatusBar style="auto" /> */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            value={email}
            placeholder="Email"
            placeholderTextColor={colors.font_primary}
            onChangeText={email => setEmail(email)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            value={password}
            placeholderTextColor={colors.font_primary}
            secureTextEntry={true}
            onChangeText={password => setPassword(password)}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_primary,
    alignItems: 'center',
    paddingTop: '30%',
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: colors.bg_white,
    borderWidth: 0.5,
    borderRadius: 10,
    width: '70%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center',
  },
  TextInput: {
    color: colors.font_primary,
    height: 50,
    flex: 1,
    padding: 10,
  },
  loginBtn: {
    width: '80%',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: colors.accent_primary,
  },
  loginText: {
    color: colors.font_secondary,
  },
});
export default Login;
