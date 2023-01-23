import {Platform, StyleSheet} from 'react-native';

export const shade = StyleSheet.create({
  shadow: {
    shadowColor: '#65aaf0',
    //ios
    shadowOffset: {
      width: 10,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    //android
    elevation: 12,
  },
  shadowlight: {
    shadowColor: '#65aaf0',
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 8,
  },
  
  innershadow: {
    margin: 10,
    backgroundColor: Platform.OS==='android'?'lightgrey':'transparent',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOpacity: 0.5,
    elevation:5
  }
});
