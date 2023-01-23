import { CSSProperties } from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../utils/colors';
import {shade} from '../utils/shadow';

interface RadioBtnType{
  onPress():void,
  selected:boolean,
  children:any,
  style?:object
}

const RadioButton = ({onPress, selected, children, style}:RadioBtnType) => {
  return (
    <View style={[styles.radioButtonContainer,style]}>
        <TouchableOpacity onPress={onPress} style={styles.radioButton}>
          {selected ? <Image style={{resizeMode:'cover', width:40,height:40}} source={require('../assets/images/radio_on.png')}/> : <Image style={{resizeMode:'cover', width:20,height:20}} source={require('../assets/images/radio_off.png')}/>}
        </TouchableOpacity>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.radioButtonText}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 45,
    marginBottom:5,
    // ...shade.shadow
  },
  radioButton: {
    width:25,
    height:25,
    // backgroundColor:'yellow',
    alignItems:'center',
    justifyContent:'center'
  },
  // radioButtonIcon: {
  //   height: 18,
  //   width: 18,
  //   borderRadius: 10,
  //   ...shade.innershadow,
  //   backgroundColor: '#2861b0',
  // },
  radioButtonText: {
    fontSize: 16,
    marginLeft: 16,
    color: colors.font_primary,
    fontWeight: 'bold',
  },
});
export default RadioButton;
