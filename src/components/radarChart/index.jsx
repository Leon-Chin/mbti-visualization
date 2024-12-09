import React from "react";
import ReactECharts from "echarts-for-react";
import { Empty } from "antd";

const RadarChart = ({ data, country }) => {
    const countryRecord = data.filter((item) => item.country === country)[0];
    if (!countryRecord) {
        return <Empty description={`No data available for ${country}.`} />;
    }
    const maxValue = Math.max(...Object.values(countryRecord.value));
    // 准备数据
    const indicator = Object.keys(countryRecord.value).map((key) => ({
        name: key,
        max: maxValue, // 假设最大值为 1
    }));
    const radarValues = Object.values(countryRecord.value).map(value => value.toFixed(3))

    const option = {
        // title: {
        //     text: `Country: ${country}`
        // },
        tooltip: {
            // show: true, // 启用 tooltip
            trigger: "item",
            // formatter: (params) => {
            //     console.log("params", params);
            //     const value = params.value.map((v) => v.toFixed(2)).join(", ");
            //     return `Values: ${value}`;
            // },
        },
        // legend: {},
        radar: [
            {
                indicator: indicator,
                // center: ['25%', '50%'],
                radius: 120,
                startAngle: 90,
                splitNumber: 4,
                shape: 'circle',
                axisName: {
                    formatter: '{value}',
                    color: '#969dad'
                },
                splitArea: {
                    areaStyle: {
                        color: ['#e6ecf5'],
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                        shadowBlur: 10
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#ffffff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#ffffff'
                    }
                }
            },
        ],
        series: [
            {
                type: 'radar',
                emphasis: {
                    lineStyle: {
                        width: 4
                    }
                },
                data: [
                    {
                        value: radarValues,
                        name: "Personalities",
                        // symbol: 'none',
                        label: {
                            show: true,
                            formatter: function (params) {
                                return params.value;
                            }
                        }
                    },
                ]
            },
        ]
    };

    return <ReactECharts option={option} style={{ height: 350, width: 350 }} />;
};

export default RadarChart;
