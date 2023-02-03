import React, { useRef, useState } from 'react';
import {Dimensions, PanResponder, ScrollView, View} from 'react-native';
import { Circle, G, Line, Rect, Svg as SvgText } from 'react-native-svg';
import {Grid, LineChart, XAxis, YAxis} from 'react-native-svg-charts';
import colors from '../../utils/colors';
interface ChartPro {
  data: any;
}
function Chart(props: ChartPro) {
  const data = props.data
    ? props.data.map(x => ({date:new Date(x.date).getTime(), visits: +x.visits}))
    : [];

  const contentInset = {top: 55, bottom: 20};
  return (
    <View style={{flexDirection:'row',backgroundColor: colors.bg_primary}}>
    <YAxis
      data={data}
      contentInset={contentInset}
      svg={{
        fill: 'grey',
        fontSize: 10,
      }}
      yAccessor={x => x.item.visits}
      numberOfTicks={10}
      // formatLabel={(value) => `${value}`}
    />
    <ScrollView
      horizontal={true}
      contentContainerStyle={{
        backgroundColor: colors.bg_primary,
        paddingVertical: 20,
        paddingRight: 10,
        height: 450,
        flexDirection: 'row',
        width: 1000,
      }}>
      <LineChart
        style={{flex: 1, marginLeft: 16}}
        data={data}
        yAccessor={x => x.item.visits}
        xAccessor={({item}) => new Date(item.date).getTime()}
        svg={{stroke: 'rgb(134, 65, 244)'}}
        contentInset={contentInset}>
        <Grid />
        <XAxis
          style={{marginHorizontal: -20, height: 100}}
          data={data}
          numberOfTicks={40}
          xAccessor={({item}) => new Date(item.date).getTime()}
          formatLabel={(value, index) => getTimeString(value)}
          svg={{fontSize: 10, fill: 'black', rotation: -90, translateY: 30, translateX:10}}
        />
      </LineChart>
    </ScrollView>
    </View>
  );
}

export default Chart;

function stringToTimeObj(x) {
  let d = new Date();
  let [hours, minutes, seconds] = x.split(':');
  d.setHours(+hours);
  d.setMinutes(minutes);
  d.setSeconds(seconds);
  return d;
}

function getTimeString(x) {
  var now = new Date(x);
  return (
    now.getHours() +
    ': ' +
    (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()) +
    ': ' +
    (now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds())
  );
}
