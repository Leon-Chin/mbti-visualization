import React from "react";
import ReactECharts from "echarts-for-react";
import { personalityColors } from "../../utils/personalityColors";

const StackedBarChart = ({ data }) => {
    console.log("StackedBarChart", data);
    // 提取分类和国家信息
    const categories = Object.keys(data[0].value)
    console.log("categories", categories);
    const countries = data.map((item) => item.country);

    // 数据转换为 ECharts 格式
    const seriesData = categories.map((category) => ({
        name: category,
        type: "bar",
        stack: "total", // 堆叠柱状图
        emphasis: {
            focus: "series",
        },
        data: data.map((item) => item.value[category].toFixed(4)),
        itemStyle: {
            color: personalityColors[category]
        }
    }));

    const option = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
            },
        },
        legend: {
            top: 0,
            textStyle: {
                fontSize: 12,
            },
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "10%",
            containLabel: true,
        },
        xAxis: {
            type: "category",
            data: countries,
            axisLabel: {
                interval: 0, // 显示所有国家
                rotate: 90, // 倾斜标签避免重叠
                textStyle: {
                    fontSize: 8,
                },
            },
        },
        yAxis: {
            type: "value",
            max: 1, // 百分比制
            axisLabel: {
                formatter: "{value}",
            },
        },
        series: seriesData,
        barCategoryGap: "0%", // 类别间柱子无间隙
        barGap: "0%",
    };

    return <div style={{ marginBottom: 20, marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <ReactECharts option={option} style={{ height: 750, width: 1000 }} />
    </div>
};

export default StackedBarChart;
