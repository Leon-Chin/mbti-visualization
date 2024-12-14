import React from 'react'
import ReactECharts from "echarts-for-react";
import data from './mbti_zodiac_data.json';
import { personalityColors } from '../../utils/personalityColors';
import { zodiacColors } from '../../utils/zodiacColors';

const result_p_z = { name: "", children: [] };
const result_z_p = { name: "", children: [] };

// 用于按 Personality 分组
const personalityGroups = {};
const zodiacGroups = {};

// 分组数据
data.forEach((item) => {
    const { Personality, Zodiac, Count } = item;
    if (!personalityGroups[Personality]) {
        personalityGroups[Personality] = [];
    }
    personalityGroups[Personality].push({
        name: Zodiac,
        value: Count,
        Symbol: 'circle',
        symbolSize: Math.pow(Count, 1 / 2) * 6,
        itemStyle: {
            color: zodiacColors[Zodiac],
            borderWidth: 0,
        },
        lineStyle: {
            width: 2,
        }

    });

    if (!zodiacGroups[Zodiac]) {
        zodiacGroups[Zodiac] = [];
    }
    zodiacGroups[Zodiac].push({
        name: Personality,
        value: Count,
        symbol: 'circle',
        symbolSize: Math.pow(Count, 1 / 2) * 6,
        itemStyle: {
            color: personalityColors[Personality],
            borderWidth: 0,
        },
        lineStyle: {
            width: 2,
        }
    });
});


// 生成嵌套结构
for (const [zodiac, personalities] of Object.entries(zodiacGroups)) {
    result_z_p.children.push({
        name: zodiac, children: personalities, symbolSize: 6, lineStyle: {
            width: 4,
        }
    });
}


// 生成嵌套结构
for (const [personality, zodiacs] of Object.entries(personalityGroups)) {
    result_p_z.children.push({
        name: personality,
        children: zodiacs,
        symbolSize: 6,
        expandAndCollapse: false,
        lineStyle: {
            width: 4,
        },
    });
}

export default function ZodiacChart() {
    const option_p_z = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: "tree",
                layout: "radial",
                symbolSize: 10,
                edgeShape: "curve",
                initialTreeDepth: 3,
                expandAndCollapse: false,
                roam: false,
                data: [result_p_z],
                lineStyle: {
                    curveness: 0.5,
                },
            },
        ],
    };
    const option_z_p = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: "tree",
                layout: "radial",
                symbolSize: 10,
                edgeShape: "curve",
                initialTreeDepth: 3,
                expandAndCollapse: false,
                roam: false,
                data: [result_z_p],
                lineStyle: {
                    curveness: 0.5,
                },
            },
        ],
    };

    return (
        <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end', height: 900 }}>
                <ReactECharts
                    option={option_p_z}
                    style={{ height: 600, width: 600 }}
                />
            </div>
            <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end', justifyContent: 'flex-start', height: 900 }}>
                <ReactECharts
                    option={option_z_p}
                    style={{ height: 600, width: 600 }}
                />
            </div>
        </div>
    )
}
