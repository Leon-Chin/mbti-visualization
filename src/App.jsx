import { useEffect, useState } from "react";
import WorldMap from "./components/wordMap";
import { preprocessData } from "./utils/preprocessData";
import WordCloudChart from "./components/wordCloud";
import RadarChart from "./components/radarChart";
import StackedBarChart from "./components/stackedBarChart";



function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchCSV = async () => {
      try {
        setLoading(true); // 开始加载状态
        const response = await fetch('/data/countries.csv')
        const csvText = await response.text(); // 获取 CSV 文件内容
        const parsedData = preprocessData(csvText); // 调用自定义解析函数
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
      {(data && data.length !== 0) && <StackedBarChart data={data} />}
      <WordCloudChart />
    </>
  )
}

export default App
