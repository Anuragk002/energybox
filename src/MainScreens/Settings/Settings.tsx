import axios from 'axios';
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import GlobalContext from '../../Context';
import { profile_edit } from '../../Endpoints';
import colors from '../../utils/colors';

interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const Settings = () => {
  const {userData,setUserData, setIsLoading} = useContext(GlobalContext);
  const u:User=userData;
  const [name, setName] = useState(u.name);
  const [email, setEmail] = useState(u.email);
  const [companyName, setCompanyName] = useState(u.company_name);
  const [companyEmail, setCompanyEmail] = useState(u.company_email);
  const [companyPhone, setCompanyPhone] = useState(u.company_phone);
  const [address1, setAddress1] = useState(u.address1);
  const [address2, setAddress2] = useState(u.address2);
  const [city, setCity] = useState(u.city);
  const [state, setState] = useState(u.state);
  const [zip, setZip] = useState(u.zip);
  const [country, setCountry] = useState(u.country);

  const onSubmit=async()=>{
    let d={
      user_id: u.id,
      name: name,
      email: email,
      company_name: companyName,
      company_email: companyEmail,
      company_phone: companyPhone,
      address1: address1,
      address2: address2,
      city: city,
      state: state,
      zip: zip,
      country: country,
    }
    setIsLoading(true);
    await axios
      .post(profile_edit, d)
      .then(async res => {
        console.log(res);
        if (res.data.success)  {
          setUserData({...userData,name: name,
            email: email,
            company_name: companyName,
            company_email: companyEmail,
            company_phone: companyPhone,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            zip: zip,
            country: country,})
          Alert.alert(
            "",'Updated'
          );
        } 
      })
      .finally(()=>setIsLoading(false))
      .catch(err => console.log(err));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
      <ScrollView contentContainerStyle={{paddingBottom: 50,backgroundColor:colors.bg_primary}}>
        <View style={styles.container}>
        <Text style={styles.alertHeading}>Profile Details</Text>
          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Company Name:</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={setCompanyName}
          />
          <Text style={styles.label}>Company Email:</Text>
          <TextInput
            style={styles.input}
            value={companyEmail}
            onChangeText={setCompanyEmail}
          />
          <Text style={styles.label}>Company Phone:</Text>
          <TextInput
            style={styles.input}
            value={companyPhone}
            onChangeText={setCompanyPhone}
          />
          <Text style={styles.label}>Address Line 1:</Text>
          <TextInput
            style={styles.input}
            value={address1}
            onChangeText={setAddress1}
          />
          <Text style={styles.label}>Address Line 2:</Text>
          <TextInput
            style={styles.input}
            value={address2}
            onChangeText={setAddress2}
          />
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
          />
          <Text style={styles.label}>Zip</Text>
          <TextInput
            style={styles.input}
            value={zip}
            onChangeText={setZip}
          />
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
          />
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={onSubmit}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor:colors.bg_primary
  },
  alertHeading: {
    fontSize: 22,
    color: colors.accent_primary,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: colors.font_primary,
    marginTop: 20,
  },
  input: {
    height: 45,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    // padding: 15,
    borderColor: colors.border_light,
    borderRadius: 5,
    color:colors.font_grey
  },
  button: {
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: colors.accent_primary,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Settings;
