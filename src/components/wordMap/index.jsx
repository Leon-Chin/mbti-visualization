import { useEffect, useMemo, useState } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts';
import world from '../../world.json'
import RadarChart from "../radarChart";
import { Button, Select } from "antd";
import PersonalityImage from "../PersonalitySVG";
import './index.css'

const personalityColors = {
    ENFJ: "#607443",  // 温暖的橙粉色，展现热情与关怀
    ENFP: "#47765f",  // 柔和的阳光黄色，充满活力与创造力
    ENTJ: "#6d4f5e",  // 鲜明的玫瑰红，代表果断与领导力
    ENTP: "#4e3141",  // 清新的薄荷绿，充满机智与探索精神
    ESFJ: "#579db6",  // 珊瑚粉橘色，展现温暖与真诚
    ESFP: "#987926",  // 奶油橙色，活泼开朗，富有能量
    ESTJ: "#3a7477",  // 清爽的天蓝色，象征可靠与组织力
    ESTP: "#b7912f",  // 淡淡的冰蓝色，表现大胆与行动力
    INFJ: "#a1c176",  // 梦幻的淡紫色，深思熟虑与神秘感
    INFP: "#6bad8c",  // 柔和的森林绿，理想主义与平和
    INTJ: "#6d4f5e",  // 高级的紫蓝色，代表战略性与智慧
    INTP: "#8e647a",  // 天空蓝，展现理性与好奇心
    ISFJ: "#87c8cb",  // 柔美的奶茶色，温柔与保护感
    ISFP: "#80641e",  // 温暖的薄荷绿，艺术性与自由随和
    ISTJ: "#8f8f8f",  // 柔和的浅灰色，稳重与传统
    ISTP: "#9b7d2e",  // 淡青色，独立与实用
};

const personalityRole_description = {
    ENFJ: {
        role: 'Protagonist',
        description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
    },
    ENFP: {
        role: 'Campaigner',
        description: 'Enthusiastic, creative, and sociable free spirits, who can always find a reason to smile.',
    },
    ENTJ: {
        role: 'Commander',
        description: 'Bold, imaginative, and strong-willed leaders, always finding a way – or making one.',
    },
    ENTP: {
        role: 'Debater',
        description: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
    },
    ESFJ: {
        role: 'Consul',
        description: 'Extraordinarily caring, social, and popular people, always eager to help.',
    },
    ESFP: {
        role: 'Entertainer',
        description: 'Spontaneous, energetic, and enthusiastic people – life is never boring around them.',
    },
    ESTJ: {
        role: 'Executive',
        description: 'Excellent administrators, unsurpassed at managing things – or people.',
    },
    ESTP: {
        role: 'Entrepreneur',
        description: 'Smart, energetic, and very perceptive people, who truly enjoy living on the edge.',
    },
    INFJ: {
        role: 'Advocate',
        description: 'Quiet and mystical, yet very inspiring and tireless idealists.',
    },
    INFP: {
        role: 'Mediator',
        description: 'Poetic, kind, and altruistic people, always eager to help a good cause.',
    },
    INTJ: {
        role: 'Architect',
        description: 'Imaginative and strategic thinkers, with a plan for everything.',
    },
    INTP: {
        role: 'Logician',
        description: 'Innovative inventors with an unquenchable thirst for knowledge.',
    },
    ISFJ: {
        role: 'Defender',
        description: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
    },
    ISFP: {
        role: 'Adventurer',
        description: 'Flexible and charming artists, always ready to explore and experience something new.',
    },
    ISTJ: {
        role: 'Logistician',
        description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.',
    },
    ISTP: {
        role: 'Virtuoso',
        description: 'Bold and practical experimenters, masters of all kinds of tools.',
    },
};


const regionCenters = {
    Asia: [100, 20],
    Europe: [10, 50],
    Americas: [-100, 40],
    Africa: [20, 10],
    Oceania: [140, -25],
    Global: [0, 0],
};

const WorldMap = ({ data }) => {

    // Register the world map if not preloaded
    useEffect(() => {
        echarts.registerMap("world", world); // Load GeoJSON for the world
    }, []);

    const [selectedCountry, setSelectedCountry] = useState('France');
    const [isOn, setOn] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(regionCenters.Europe);
    const [selectedPersonality, setSelectedPersonality] = useState('');

    const MapWidth = 950
    const MapHeight = 600
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
                    return `
              <b>${country.country}</b><br>
              Max Personality: ${country.max.key} (${(100 * country.max.value).toFixed(1)} %)<br>
              Min Personality: ${country.min.key} (${(100 * country.min.value).toFixed(1)} %)`;
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
                roam: false, // 禁止缩放和平移
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


    // return data.length == 0 ? <></> : <ReactEcharts option={options} style={{ height: "800px", width: "1200px" }} />;
    return <div className="word-map" style={{ height: (MapHeight + 140), display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
        <div>Main MBTI Personality Types by Country</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Select
                style={{ width: 100 }}
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
                        console.log(params.data.personality);
                        setSelectedPersonality(params.data.personality)
                    },
                }} />}
            </div>
            {isOn && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
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
                <Button type="text" size='large' onClick={() => setOn(!isOn)}>{isOn ? "Hide Radar Chart" : "Show Radar Chart"}</Button>
            </div>}
        </div>
    </div >
}

export default WorldMap