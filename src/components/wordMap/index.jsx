import { useEffect, useMemo, useState } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts';
import world from '../../world.json'
import RadarChart from "../radarChart";
import { Button, Segmented, Select } from "antd";
import PersonalityImage from "../PersonalitySVG";
import './index.css'
import { personalityColors } from "../../utils/personalityColors";
import { personalityRole_description } from "../../utils/personalityDescription";
import { regionCenters } from "../../utils/regionCenters";
import PersonalityPieChart from "../PieChart";
import { PieChartFilled, RadarChartOutlined } from "@ant-design/icons";

const MapWidth = 950
const MapHeight = 600

const MODEs = {
    mainPersonality: "main personality of countries",
    Extraverted_Introverted: "Extraverted vs. Introverted",
    Observant_Intuition: "Observant vs. Intuition",
    Thinking_Feeling: "Thinking vs. Feeling",
    Judging_Prospecting: "Judging vs. Prospecting"
}

const SUBVIEW = {
    pie: "Nightingale View",
    radar: "Radar View"
}

const WorldMap = ({ data }) => {

    // Register the world map if not preloaded
    useEffect(() => {
        echarts.registerMap("world", world); // Load GeoJSON for the world
    }, []);

    const [selectedCountry, setSelectedCountry] = useState('France');
    const [isOn, setOn] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(regionCenters.Europe);
    const [selectedPersonality, setSelectedPersonality] = useState('');

    const [mode, setMode] = useState(MODEs.mainPersonality);

    const [subView, setSubView] = useState(SUBVIEW.radar);

    // 准备 series 数据
    const mainPersonality_SeriesData = data.map((item) => ({
        name: item.country,
        value: item.max.value, // 最大值用于排序
        personality: item.max.key, // 人格类型
        itemStyle: {
            areaColor: personalityColors[item.max.key] || "rgb(238, 238, 238)", // 使用对应颜色
        },
    }))
    const categoryData = data.map((item) => {
        const { categoryRatios } = item;
        const { Extraverted, Introverted, Intuitive, Observant, Thinking, Feeling, Judging, Prospecting, } = categoryRatios
        return {
            country: item.country,
            Extraverted_Introverted: ((Extraverted - Introverted) * 100).toFixed(1),
            Observant_Intuition: ((Observant - Intuitive) * 100).toFixed(1),
            Thinking_Feeling: ((Thinking - Feeling) * 100).toFixed(1),
            Judging_Prospecting: ((Judging - Prospecting) * 100).toFixed(1),
        }
    })

    const Extraverted_Introverted_seriesData = categoryData.map(item => ({ name: item.country, value: item.Extraverted_Introverted, }))

    const EI_data = Extraverted_Introverted_seriesData.map(item => item.value)
    const EI_max = Math.max(...EI_data)
    const EI_min = Math.min(...EI_data)

    const Observant_Intuition_seriesData = categoryData.map(item => ({ name: item.country, value: item.Observant_Intuition, }))

    const OI_data = Observant_Intuition_seriesData.map(item => item.value)
    const OI_max = Math.max(...OI_data)
    const OI_min = Math.min(...OI_data)


    const Thinking_Feeling_seriesData = categoryData.map(item => ({ name: item.country, value: item.Thinking_Feeling, }))
    const TF_data = Thinking_Feeling_seriesData.map(item => item.value)
    const TF_max = Math.max(...TF_data)
    const TF_min = Math.min(...TF_data)

    const Judging_Prospecting_seriesData = categoryData.map(item => ({ name: item.country, value: item.Judging_Prospecting, }))
    const JP_data = Judging_Prospecting_seriesData.map(item => item.value)
    const JP_max = Math.max(...JP_data)
    const JP_min = Math.min(...JP_data)

    const getMinMax = (mode) => {
        if (mode === MODEs.Extraverted_Introverted) {
            return [EI_max, EI_min]
        } else if (mode === MODEs.Observant_Intuition) {
            return [OI_max, OI_min]
        } else if (mode === MODEs.Thinking_Feeling) {
            return [TF_max, TF_min]
        } else if (mode === MODEs.Judging_Prospecting) {
            return [JP_max, JP_min]
        }
    }

    const getEchartsData = (mode) => {
        if (mode === MODEs.mainPersonality) {
            return mainPersonality_SeriesData
        } else if (mode === MODEs.Extraverted_Introverted) {
            return Extraverted_Introverted_seriesData
        } else if (mode === MODEs.Observant_Intuition) {
            return Observant_Intuition_seriesData
        } else if (mode === MODEs.Thinking_Feeling) {
            return Thinking_Feeling_seriesData
        } else if (mode === MODEs.Judging_Prospecting) {
            return Judging_Prospecting_seriesData
        }
    }



    // ECharts 配置
    const options = useMemo(() => ({
        tooltip: {
            trigger: "item",
            formatter: (params) => {
                const country = data.find((d) => d.country === params.name);
                if (country) {
                    if (mode === MODEs.mainPersonality) {
                        return `<div>
                            <div style="font-size: 26px; font-weight: bold; color: #333; margin-bottom: 10px;">${country.country}</div>
                            <div style="font-size: 18px;">Main Personality: ${country.max.key} (${(100 * country.max.value).toFixed(1)} %)</div>
                        </div>`;
                    } else {
                        const twoCategoriesItem = mode.split("vs.");
                        const arr = twoCategoriesItem.map((item) => item.trim())
                        const [first, second] = arr
                        console.log(first, second);
                        return `<div>
                            <div style="font-size: 26px; font-weight: bold; color: #333; margin-bottom: 10px;">${country.country}</div>
                            <div style="font-size: 18px;">More ${params.value > 0 ? first : second} than ${params.value <= 0 ? first : second} (+${Math.abs(params.value.toFixed(1))}%)</div>
                        </div>`;
                    }
                } else {
                    return `${params.name} <br>No Information`;
                }
            },
        },
        series: [
            {
                name: "MBTI Personality Types",
                type: "map",
                map: "world",
                center: selectedRegion,
                zoom: selectedRegion[0] === 0 ? 1.5 : 3, // 放大地图，数值越大越聚焦
                geoIndex: 0,
                roam: true, // 禁止缩放和平移
                select: {
                    itemStyle: {
                        borderColor: "#999",
                        borderWidth: 0.5,
                    },
                },
                data: getEchartsData(mode),
                itemStyle: {
                    borderColor: "rgb(202, 202, 202)",
                    borderWidth: 2,
                },
                emphasis: {
                    itemStyle: {
                        areaColor: "#879cad",
                        borderWidth: 3
                    },
                }
            },
        ],
        visualMap: mode === MODEs.mainPersonality ? false : {
            min: getMinMax(mode)[1],
            max: getMinMax(mode)[0],
            left: "left",
            top: "bottom",
            inRange: {
                color: ["#9fdedb", "#93a9bc", "#92a1b7", "#8e8caa", "#8d83a5", "#8c779e"],
            }
        },
    }), [data, selectedRegion, mode]);

    return <div className="word-map" style={{ height: (MapHeight + 140), display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
        <div>Main MBTI Personality Types by Country</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>

            <Select
                key={"wordMapOption"}
                style={{ width: 120 }}
                size='large'
                options={Object.keys(regionCenters).map((key) => ({ value: key, label: key }))}
                onChange={(value) => {
                    console.log("region", value);
                    setSelectedRegion(regionCenters[value]);
                }}
                defaultValue={"Europe"}
            />
            <Select
                key={"modeOption"}
                style={{ width: 260 }}
                size='large'
                options={Object.values(MODEs).map((value) => ({ value: value, label: value }))}
                onChange={(value) => {
                    console.log("mode", value);
                    setMode(value);
                }}
                defaultValue={MODEs.mainPersonality}
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
                <div style={{ marginBottom: 18, display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginLeft: 10, fontSize: 20 }}>
                    <div style={{ fontSize: 20, fontWeight: 600, marginLeft: 36, userSelect: 'none', display: 'flex', alignItems: 'center' }}>
                        {selectedCountry}
                    </div>
                    <Button type="text" size='large' onClick={() => setOn(!isOn)}>{isOn ? "Hide" : "Show"}</Button>
                </div>
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
                {data.length !== 0 && <>
                    {subView === SUBVIEW.radar ? <RadarChart data={data} country={selectedCountry} /> :
                        <PersonalityPieChart data={data} country={selectedCountry} />}
                </>}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    {data.filter((item) => item.country === selectedCountry)[0] && <Segmented
                        options={[
                            { label: SUBVIEW.radar, value: SUBVIEW.radar, icon: <RadarChartOutlined /> },
                            { label: SUBVIEW.pie, value: SUBVIEW.pie, icon: <PieChartFilled /> },
                        ]}
                        value={subView} onChange={setSubView}
                    />}
                </div>
            </div>}
        </div>
    </div >
}

export default WorldMap