import React, { useMemo, useState } from 'react'
import ReactECharts from "echarts-for-react";
import { personalityColors } from '../../utils/personalityColors';
import { Select } from 'antd';
const MAX_COUNT = 5;
export default function SankeyChart({ data }) {
    const Countries = ["United States", "China", "France", "Russia", "United Kingdom"]
    const [selectedCountries, setSelectedCountries] = useState([...Countries]);
    const suffix = (<>
        <span>
            {selectedCountries.length} / {MAX_COUNT}
        </span>
    </>)
    const allCountries = data.map(item => ({ value: item.country, label: item.country }))
    console.log(allCountries);
    const Personalities = Object.keys(personalityColors).map(item => ({
        name: item, itemStyle: {
            color: personalityColors[item], // 自定义每个人格颜色
            areaColor: personalityColors[item]
        },
    }))
    const CountriesArr = useMemo(() => selectedCountries.map(item => ({ name: item, itemStyle: { color: '#767577' }, nodeWidth: 4 })), [selectedCountries])
    const LinksData = useMemo(() => {
        const res = []
        data.forEach(item => {
            Object.keys(item.value).forEach(personality => {
                if (selectedCountries.includes(item.country)) {
                    const itemD = { source: personality, target: item.country, value: parseFloat((item.value[personality] * 100).toFixed(1)) }
                    res.push(itemD)
                }
            })
        })
        return [...res]
    }, [data, selectedCountries])
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
    }), [data, selectedCountries, CountriesArr, Personalities, LinksData]);

    return (
        <div>
            <Select
                mode="multiple"
                maxCount={MAX_COUNT}
                value={selectedCountries}
                style={{
                    width: 300,
                }}
                onChange={setSelectedCountries}
                suffixIcon={suffix}
                placeholder="Please select country"
                options={allCountries}
            />
            {
                selectedCountries.length === 0 ? <div style={{ textAlign: 'center', height: 700, width: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> Please select Country ~ </div> :
                    <ReactECharts option={option} style={{ height: 700, width: 300 }} />
            }
        </div>
    )
}
