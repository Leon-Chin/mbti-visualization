import React, { useMemo } from 'react'
import ReactECharts from "echarts-for-react";
import { personalityColors } from '../../utils/personalityColors';

export default function SankeyChart({ data }) {
    console.log("SankeyChart", data);
    const Countries = ["United States", "China", "France", "Russia", "United Kingdom"]
    const Personalities = Object.keys(personalityColors).map(item => ({
        name: item, itemStyle: {
            color: personalityColors[item], // 自定义每个人格颜色
            areaColor: personalityColors[item]
        },
    }))
    const CountriesArr = Countries.map(item => ({ name: item, itemStyle: { color: '#767577' }, nodeWidth: 4 }))
    const LinksData = []
    data.forEach(item => {
        Object.keys(item.value).forEach(personality => {
            console.log(item.country, "Countries.includes(item.country)", Countries.includes(item.country));

            if (Countries.includes(item.country)) {
                const itemD = { source: personality, target: item.country, value: parseFloat((item.value[personality] * 100).toFixed(1)) }
                console.log("itemD", itemD);
                LinksData.push(itemD)
            }
        })
    })
    console.log(LinksData.length);
    console.log(LinksData);
    const option = useMemo(() => ({
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                if (params.dataType === 'edge') {
                    return `${params.data.source} → ${params.data.target}: ${params.data.value} %`;
                } else {
                    return params.data.name;
                }
            },
        },
        series: {
            type: 'sankey',
            // layout: 'none',
            emphasis: {
                focus: 'adjacency'
            },
            nodeWidth: 8,
            nodeGap: 2,
            lineStyle: {
                opacity: 0.6,
                color: 'source', // 连线颜色与源节点一致
                curveness: 0.5,
            },
            data: [...Personalities, ...CountriesArr],
            label: {
                position: 'right', // 将标签移到节点右侧
                distance: 2, // 调整标签和节点之间的距离
                fontSize: 10,
                fontWeight: 700,
                color: '#000', // 确保标签可见
            },
            links: LinksData
        }
    }), [data]);

    console.log("option", option);
    return (
        <ReactECharts option={option} style={{ height: 730, width: 300 }} />
    )
}
