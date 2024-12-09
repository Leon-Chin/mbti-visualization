import React from "react";
import ReactECharts from "echarts-for-react";

const StackedBarChart = ({ data }) => {
    // 提取分类和国家信息
    const categories = Object.keys(data[0].value)
    const countries = data.map((item) => item.country);

    // 数据转换为 ECharts 格式
    const seriesData = categories.map((category) => ({
        name: category,
        type: "bar",
        stack: "total", // 堆叠柱状图
        emphasis: {
            focus: "series",
        },
        data: data.map((item) => item[category]),
    }));

    const option = {
        title: {
            text: "Country Distributions",
            left: "center",
            textStyle: {
                fontSize: 24,
                fontWeight: "bold",
                color: "#444",
            },
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
            },
        },
        legend: {
            bottom: 0,
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
                rotate: 45, // 倾斜标签避免重叠
                textStyle: {
                    fontSize: 10,
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
    };

    return <ReactECharts option={option} style={{ height: 600, width: "100%" }} />;
};

export default StackedBarChart;
