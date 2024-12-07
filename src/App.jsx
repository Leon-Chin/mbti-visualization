import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts';
import world from './world.json'
import { useEffect, useState } from "react";

const parseCSV = (text) => {
  const rows = text.split('\n').filter((row) => row.trim() !== ''); // Split by line and filter out empty rows
  let headers = rows[0].split(','); // Extract the headers from the first row
  headers = headers.map((header) => header.trim());

  const data = rows.slice(1).map((row) => {
    const values = row.split(','); // Split the row into values
    const obj = {};

    headers.forEach((header, index) => {
      const value = values[index]?.trim(); // Trim whitespace
      obj[header] = isNaN(Number(value)) ? value : Number(value); // Convert to number if possible
    });

    return obj; // Return the constructed object for this row
  });

  const concreteData = data.map((i) => {
    const country = i.Country; // Extract the country
    const removeObjectProperty = (obj, key) => {
      const newObj = { ...obj }; // Create a copy of the object
      delete newObj[key]; // Remove the specified property
      return newObj;
    };

    const newData = removeObjectProperty(i, 'Country'); // Remove "Country" from the data
    const value = {}; // Rebuild the object with numeric values
    Object.keys(newData).forEach((key) => {
      value[key] = Number(newData[key]);
    });


    return { country: country, value, max: { key: '', value: 0 }, min: { key: '', value: 1 } }; // Return data in the correct format
  });
  const mergeValuePairs = (data) => {
    return data.map((item) => {
      const mergedValue = {}; // 用于存放合并后的数据
      let max = { key: '', value: Number.NEGATIVE_INFINITY };
      let min = { key: '', value: Number.POSITIVE_INFINITY };
      Object.keys(item.value).forEach((key) => {
        const baseKey = key.split('-')[0]; // 提取前缀（例如，ENFJ）
        if (!mergedValue[baseKey]) {
          mergedValue[baseKey] = 0; // 初始化合并键
        }
        mergedValue[baseKey] += Number(item.value[key]); // 累加值
      });
      Object.keys(mergedValue).forEach((key) => {
        if (mergedValue[key] > max.value) {
          max = { key: key, value: mergedValue[key] };
        }
        if (mergedValue[key] < min.value) {
          min = { key: key, value: mergedValue[key] };
        }
      });

      return {
        country: item.country,
        value: mergedValue, // 更新合并后的值
        max: {
          key: max.key,
          value: max.value
        },
        min: {
          key: min.key,
          value: min.value
        }
      };
    });
  };
  const mergedData = mergeValuePairs(concreteData);
  return mergedData;
};


function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchCSV = async () => {
      try {
        setLoading(true); // 开始加载状态
        const response = await fetch('/data/countries.csv')
        const csvText = await response.text(); // 获取 CSV 文件内容
        const parsedData = parseCSV(csvText); // 调用自定义解析函数
        console.log(parsedData);
        setData(parsedData); // 缓存解析后的数据
        setLoading(false); // 停止加载状态
      } catch (error) {
        console.error('加载 CSV 文件失败:', error);
      }
    };

    fetchCSV();
  }, []);
  return (
    <>
      {data && <WorldMap data={data} />}
    </>
  )
}

const WorldMap = ({ data }) => {
  const MapWidth = 1000
  const MapHeight = 500
  useEffect(() => {
    console.log("data", data);
  })
  const personalityColors = {
    ENFJ: "#FFAA85",  // 温暖的橙粉色，展现热情与关怀
    ENFP: "#FFE27A",  // 柔和的阳光黄色，充满活力与创造力
    ENTJ: "#FF6D6D",  // 鲜明的玫瑰红，代表果断与领导力
    ENTP: "#78E08F",  // 清新的薄荷绿，充满机智与探索精神
    ESFJ: "#FFB5A7",  // 珊瑚粉橘色，展现温暖与真诚
    ESFP: "#FFCC99",  // 奶油橙色，活泼开朗，富有能量
    ESTJ: "#6DBEFF",  // 清爽的天蓝色，象征可靠与组织力
    ESTP: "#85C1E9",  // 淡淡的冰蓝色，表现大胆与行动力
    INFJ: "#C39BD3",  // 梦幻的淡紫色，深思熟虑与神秘感
    INFP: "#A8DFB8",  // 柔和的森林绿，理想主义与平和
    INTJ: "#7D83FF",  // 高级的紫蓝色，代表战略性与智慧
    INTP: "#95D9F0",  // 天空蓝，展现理性与好奇心
    ISFJ: "#F9D8C8",  // 柔美的奶茶色，温柔与保护感
    ISFP: "#B9FBC1",  // 温暖的薄荷绿，艺术性与自由随和
    ISTJ: "#BDC3C7",  // 柔和的浅灰色，稳重与传统
    ISTP: "#99CED3",  // 淡青色，独立与实用
  };

  // 准备 series 数据
  const seriesData = data.filter((item) => item.max.value !== null).map((item) => ({
    name: item.country,
    value: item.max.value, // 最大值用于排序
    // personality: item.max.key, // 人格类型
    itemStyle: {
      areaColor: personalityColors[item.max.key] || "rgb(238, 238, 238)", // 使用对应颜色
    },
  }));

  console.log("seriesData", seriesData);

  // ECharts 配置
  const options = {
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
    legend: {
      bottom: "5%", // 图例位置
      data: Object.keys(personalityColors),
      textStyle: {
        fontSize: 12,
      },
      formatter: (name) => {
        return name; // 显示人格类型
      },
    },

    series: [
      {
        name: "Country Data",
        type: "map",
        map: "world",
        roam: true, // 禁止缩放和平移
        emphasis: {
          label: {
            show: true,
          },
        },
        data: seriesData,
      },
    ],
    // visualMap: false, // 不需要颜色渐变
  };


  // Register the world map if not preloaded
  useEffect(() => {
    echarts.registerMap("world", world); // Load GeoJSON for the world
  }, []);

  // return data.length == 0 ? <></> : <ReactEcharts option={options} style={{ height: "800px", width: "1200px" }} />;
  return <div className="word-map" style={{ height: (MapHeight + 100), display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
    <div>Main MBTI Personality Types by Country</div>
    <div className="chart-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgb(249, 249, 249)',
      borderRadius: 20,
      boxShadow: '0 4px 8px rgba(0,0,0,0.6)',
      height: MapHeight,
      width: MapWidth
    }}>
      {data.length == 0 ? <></> : <ReactEcharts option={options} style={{ height: MapHeight, width: MapWidth }} />}
    </div>
  </div>
};


export default App
