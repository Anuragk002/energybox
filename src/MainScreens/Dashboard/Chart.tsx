import React from 'react'
import { View } from 'react-native'
import { AreaChart, Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import colors from '../../utils/colors'
// import * as shape from 'd3-shape'
function Chart(props) {
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
 
        const contentInset = { top: 20, bottom: 20 }
 
        return (
            <View style={{ backgroundColor:colors.bg_primary,paddingVertical:40,height: 450, flexDirection: 'row' }}>
                <YAxis
                    data={data}
                    contentInset={contentInset}
                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    numberOfTicks={10}
                    formatLabel={(value) => `${value}`}
                />
                <LineChart
                    style={{ flex: 1, marginLeft: 16 }}
                    data={data}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={contentInset}
                >
                  <Grid/>
                  <XAxis
                    style={{ marginHorizontal: -10 }}
                    data={data}
                    formatLabel={(value, index) => value}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />
                </LineChart>
            </View>
        )
}

export default Chart;
        