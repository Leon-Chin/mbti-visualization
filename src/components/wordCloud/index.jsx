import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import d3Cloud from 'd3-cloud'; // 使用 D3 的词云布局库
import personalityData from './processed_d3_data_top200.json';
import PersonalityImage from '../PersonalitySVG';

const WordCloud = ({ words, personality }) => {
    const svgRef = useRef();

    const maxFrequencyNumber = words[0].size
    const width = 210; // 宽度
    const height = 120; // 高度
    const colorScale = [
        'rgb(54, 22, 65)',
        'rgb(125, 176, 92)',
        'rgb(89, 149, 107)',
        'rgb(200, 203, 99)',
        'rgb(76, 93, 101)',
    ]
    useEffect(() => {
        // 配置词云布局
        const layout = d3Cloud()
            .size([width, height])
            .words(words.map((d) => ({ text: d.text, size: d.size })))
            .padding(2)
            .rotate(() => 0)
            .fontSize((d) => d.size / maxFrequencyNumber * 40) // 动态字体大小
            .on('end', draw);

        layout.start();

        function draw(words) {
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove(); // 清空之前的内容

            svg
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`)
                .selectAll('text')
                .data(words)
                .enter()
                .append('text')
                .style('font-size', (d) => `${d.size}px`)
                .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * colorScale.length)]) // 颜色随机分配
                // .style('fill', () => colorScale[Math.floor(Math.random() * colorScale.length)]) // 颜色随机分配
                .attr('text-anchor', 'middle')
                .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
                .text((d) => d.text);
        }

    }, [words, personality]);

    return <>
        <svg ref={svgRef}></svg>;
    </>
};


const WordCloudChart = () => {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: 40, marginBottom: 20 }}>
        <div
            style={{
                width: 1200,
                marginBottom: 30,
                display: 'flex',
                justifyContent: 'center',
                fontSize: 36,
                gap: 4
            }}
        >
            <span style={{ color: "#444", fontWeight: 600 }}>16 Personalities Wordclouds Analysis</span>
            <span style={{ color: "#444", fontWeight: 100 }}>Wordclouds Imagination</span>
        </div>
        <div
            style={{
                width: 1200,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)', // 设置为 4 列布局
                gap: '20px', // 每个单元之间的间距w
                justifyItems: 'center', // 水平居中对齐
                alignItems: 'center', // 垂直居中对齐
            }}
        >
            {Object.keys(personalityData).map((type, i) => (
                <a key={type + i} className="personality-description" href={`https://www.16personalities.com/${type.toLowerCase()}-personality`} style={{ display: 'flex', padding: 6, alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <div
                        key={type}
                        style={{
                            display: 'flex',
                            flexDirection: 'row', // 垂直布局，角色和词云堆叠
                            alignItems: 'center', // 垂直居中对齐
                            justifyContent: 'center',
                        }}
                    >
                        {/* 左侧显示角色或图标 */}
                        <div style={{ width: 60, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', }}>
                            <PersonalityImage width={60} height={60} type={type} />
                            <div style={{ color: '#797f8c' }}>
                                {type}
                            </div>
                        </div>
                        {/* 右侧显示词云 */}
                        < WordCloud key={type} personality={type} words={personalityData[type]} />
                    </div>
                </a>
            ))}
        </div>
    </div >

};

export default WordCloudChart;
