import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import colors from '../utils/colors';

interface CustomDropdownType{
  placeholder?:string,
  data:any,
  labelField:string,
  valueField:string,
  value:any,
  setValue:any
}

function CustomDropdown({placeholder='Select item',data:location_data,labelField,valueField, value,setValue}:CustomDropdownType) {
  const [isFocus, setIsFocus] = useState(false);
  // const location_data = [
  //   {label: 'Item 1', value: '1'},
  //   {label: 'Item 2', value: '2'},
  //   {label: 'Item 3', value: '3'},
  //   {label: 'Item 4', value: '4'},
  //   {label: 'Item 5', value: '5'},
  //   {label: 'Item 6', value: '6'},
  //   {label: 'Item 7', value: '7'},
  //   {label: 'Item 8', value: '8'},
  // ];
    return (
        <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={location_data}
                search
                maxHeight={300}
                labelField={labelField}
                valueField={valueField}
                placeholder={!isFocus ? placeholder : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setValue(item);
                  setIsFocus(false);
                }}
                // renderLeftIcon={() => (
                //   <AntDesign
                //     style={styles.icon}
                //     color={isFocus ? 'blue' : 'black'}
                //     name="Safety"
                //     size={20}
                //   />
                // )}
              />
    );
}
const styles = StyleSheet.create({
      //dropdown start
  dropdown: {
    height: 50,
    borderColor: colors.border_light,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 18,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.font_grey,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.font_grey,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  //dropdown end
})
export default CustomDropdown;