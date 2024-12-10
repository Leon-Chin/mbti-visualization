import { useEffect, useMemo, useState } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts';
import world from '../../world.json'
import RadarChart from "../radarChart";
import { Button, Select } from "antd";
import PersonalityImage from "../PersonalitySVG";
import './index.css'
import { personalityColors } from "../../utils/personalityColors";
import { personalityRole_description } from "../../utils/personalityDescription";
import { regionCenters } from "../../utils/regionCenters";

const MapWidth = 950
const MapHeight = 600


const WorldMap = ({ data }) => {

    // Register the world map if not preloaded
    useEffect(() => {
        echarts.registerMap("world", world); // Load GeoJSON for the world
    }, []);

    const [selectedCountry, setSelectedCountry] = useState('France');
    const [isOn, setOn] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(regionCenters.Europe);
    const [selectedPersonality, setSelectedPersonality] = useState('');

    // 准备 series 数据
    const seriesData = data.map((item) => ({
        name: item.country,
        value: item.max.value, // 最大值用于排序
        personality: item.max.key, // 人格类型
        itemStyle: {
            areaColor: personalityColors[item.max.key] || "rgb(238, 238, 238)", // 使用对应颜色
        },
    }));

    // ECharts 配置
    const options = useMemo(() => ({
        tooltip: {
            trigger: "item",
            formatter: (params) => {
                const country = data.find((d) => d.country === params.name);
                if (country) {
                    return `<div>
                        <div style="font-size: 26px; font-weight: bold; color: #333; margin-bottom: 10px;">${country.country}</div>
                        <div style="font-size: 18px;">Main Personality: ${country.max.key} (${(100 * country.max.value).toFixed(1)} %)</div>
                    </div>`;
                }
                return `${params.name} <br>
          No Information`;
            },
        },
        series: [
            {
                name: "MBTI Personality Types",
                type: "map",
                map: "world",
                center: selectedRegion, // 聚焦到亚洲：经度 100，纬度 30
                zoom: selectedRegion[0] === 0 ? 1.5 : 3, // 放大地图，数值越大越聚焦
                geoIndex: 0,
                roam: true, // 禁止缩放和平移
                select: {
                    itemStyle: {
                        borderColor: "#999",
                        borderWidth: 0.5,
                    },
                },
                data: seriesData,
                itemStyle: {
                    borderColor: "rgb(202, 202, 202)",
                    borderWidth: 2,
                },
            },
        ],
        visualMap: false, // 不需要颜色渐变
    }), [data, selectedRegion]);

    return <div className="word-map" style={{ height: (MapHeight + 140), display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
        <div>Main MBTI Personality Types by Country</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Select
                style={{ width: 120 }}
                size='large'
                options={Object.keys(regionCenters).map((key) => ({ value: key, label: key }))}
                onChange={(value) => {
                    setSelectedRegion(regionCenters[value]);
                    // setOn(false)
                }}
                defaultValue={"Europe"}
            />
        </div>
        {/* {isOn ?  */}
        < div style={isOn ? {
            width: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10
        } : {}}>
            <div className="chart-container" style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                backgroundColor: 'rgb(249, 249, 249)',
                borderRadius: 20,
                gap: 100,
                boxShadow: '0 4px 8px rgba(0,0,0,0.6)',
                height: MapHeight,
                width: MapWidth,
                overflow: 'hidden'
            }}>
                {data.length == 0 ? <></> : <ReactEcharts option={options} style={{ height: MapHeight, width: MapWidth }} onEvents={{
                    click: (params) => {
                        console.log("Clicked country:", params);
                        setOn(true)
                        setSelectedCountry(params.name);
                        params.data?.personality ? setSelectedPersonality(params.data.personality) : setSelectedPersonality(null);
                        console.log(params.data?.personality);
                    },
                }} />}
            </div>
            {isOn && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ marginBottom: 18, userSelect: 'none', display: 'flex', width: "100%", marginTop: 10, marginLeft: 10, fontSize: 20 }}>Selected Country: {selectedCountry}</div>
                {selectedPersonality && <a className="personality-description" href={`https://www.16personalities.com/${selectedPersonality.toLowerCase()}-personality`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <PersonalityImage width={160} height={160} type={selectedPersonality} />
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 10, paddingRight: 10 }}>
                        <div style={{ color: personalityColors[selectedPersonality.toUpperCase()], fontSize: 38, fontWeight: 600, }}>{personalityRole_description[selectedPersonality.toUpperCase()].role}</div>
                        <div style={{ color: "#363c4a", fontSize: 26, fontWeight: 400, }}>
                            {selectedPersonality}
                        </div>
                        <div style={{ color: '#797f8c', width: 170, textAlign: 'center' }}>{personalityRole_description[selectedPersonality.toUpperCase()].description}</div>
                    </div>
                </a>}
                {data.length == 0 ? <></> : <RadarChart data={data} country={selectedCountry} />}
                <Button type="text" size='large' onClick={() => setOn(!isOn)}>{isOn ? "Hide" : "Show"}</Button>
            </div>}
        </div>
    </div >
}

export default WorldMap