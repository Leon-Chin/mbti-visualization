import { useEffect, useState } from "react";
import WorldMap from "./components/wordMap";
import { preprocessData } from "./utils/preprocessData";
import WordCloudChart from "./components/wordCloud";
import StackedBarChart from "./components/stackedBarChart";
import SankeyChart from "./components/SankeyChart";
import ZodiacChart from "./components/ZodiacChart";
import './App.css'
import MainContentBox from "./components/Layout/Content";
import ViewsSelection from "./components/Layout/ViewsButton";
import MBTIbg from "./icons/country-profiles.svg"
import Loader from "./components/Loader";
import { VIEWs } from "./utils/viewsOptions";
import { Button } from "antd";
import { HomeFilled } from "@ant-design/icons";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [selectedView, setSelectedView] = useState(VIEWs.homePage)
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
    <div className="app">
      <MainContentBox>
        {selectedView !== VIEWs.homePage && <div style={{ position: 'absolute', top: 10, left: 10 }} onClick={() => setSelectedView(VIEWs.homePage)}>
          <Button shape="circle" icon={<HomeFilled />} size={'large'} style={{ height: 60, width: 60 }} />
        </div>}
        {selectedView !== VIEWs.homePage && <>
          {loading ? <Loader /> : <>
            {selectedView === VIEWs.worldMap && <>{data && <WorldMap data={data} />}</>}
            {selectedView === VIEWs.countryInsight && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
              {(data && data.length !== 0) && <SankeyChart data={data} />}
              {(data && data.length !== 0) && <StackedBarChart data={data} />}
            </div>}
            {selectedView === VIEWs.wordCloud && <WordCloudChart />}
            {selectedView === VIEWs.zodiacInsight && <ZodiacChart />}
          </>}
        </>}
        {selectedView === VIEWs.homePage && <div style={{
          backgroundImage: `url(${MBTIbg})`, // 从 public 引用
          backgroundSize: 'contain', // 自动适应大小
          backgroundPosition: 'center bottom', // 居中
          backgroundRepeat: "no-repeat",
          transform: "translateY(50px)",
          height: '100%'
        }}>
          <div style={{ height: 800, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', gap: 60 }}>
            <div style={{ display: 'flex', fontSize: 46, fontWeight: 700, color: '#4c445a' }}>{("MBTI Visualization").toUpperCase()}</div>
            <ViewsSelection selectView={setSelectedView} />
            <div></div>
          </div>
        </div>}
      </MainContentBox>
    </div>
  )
}

export default App
