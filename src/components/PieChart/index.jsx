import React from 'react'
import ReactECharts from "echarts-for-react";
import { Empty } from "antd";
import { personalityColors } from '../../utils/personalityColors';

export default function PersonalityPieChart({ data, country }) {
    const countryRecord = data.filter((item) => item.country === country)[0];

    if (!countryRecord) {
        return <Empty description={`No data available for ${country}.`} />;
    }

    // 准备数据
    const seriesData = Object.keys(countryRecord.value).sort((a, b) => countryRecord.value[a] - countryRecord.value[b]).map((key) => ({
        name: key,
        value: countryRecord.value[key],
        itemStyle: {
            color: personalityColors[key]
        }
    }));

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}:({d}%)'
        },
        series: [
            {
                type: 'pie',
                label: {
                    position: 'inner',
                    fontSize: 14
                },
                radius: ["20%", '94%'],
                center: ['50%', '60%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                data: seriesData
            }
        ]
    };
    return (
        <ReactECharts option={option} style={{ height: 350, width: 350 }} />
    )
}
