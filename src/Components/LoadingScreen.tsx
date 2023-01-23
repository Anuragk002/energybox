import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import GlobalContext from '../Context';

const LoadingScreen: React.FC<{isLoading: boolean}> = ({isLoading}) => {
  if (isLoading)
    return (
      <Modal visible={true} transparent={true} >
        <View style={styles.modalContainer}>
          <ActivityIndicator size={'large'} color="orange" />
        </View>
      </Modal>
    );
  else return <React.Fragment></React.Fragment>;
};
const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems:'center'
  },
});

export default LoadingScreen;
