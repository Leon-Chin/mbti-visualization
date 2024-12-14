import React from 'react';
import styled from 'styled-components';
import countryIcon from '../../../icons/icons8-country-96.png';
import earthIcon from '../../../icons/icons8-earth-planet-96.png';
import libraIcon from '../../../icons/icons8-libra-96.png';
import wordCloudIcon from '../../../icons/icons8-mix-words-96.png';
import { VIEWs } from '../../../utils/viewsOptions';
const ViewsSelection = ({ selectView }) => {
  return (
    <StyledWrapper>
      <div className="container">
        <div data-text="Global Map" onClick={() => selectView(VIEWs.worldMap)} style={{ '--r': '-15deg' }} className="glass">
          <img src={earthIcon} alt="Global Map Icon" />
        </div>
        <div data-text="Country Insights" onClick={() => selectView(VIEWs.countryInsight)} style={{ '--r': '-5deg' }} className="glass">
          <img src={countryIcon} alt="Country Insights Icon" />
        </div>
        <div data-text="Zodiac Insights" onClick={() => selectView(VIEWs.zodiacInsight)} style={{ '--r': '5deg' }} className="glass">
          <img src={libraIcon} alt="Zodiac Insights Icon" />
        </div>
        <div data-text="Wordcloud Analysis" onClick={() => selectView(VIEWs.wordCloud)} style={{ '--r': '25deg' }} className="glass">
          <img src={wordCloudIcon} alt="Wordclouds Icon" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container .glass {
    position: relative;
    width: 280px;
    height: 300px;
    background: linear-gradient(#fff2, transparent);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
    border-radius: 10px;
    margin: 0 -25px;
    backdrop-filter: blur(10px);
    transform: rotate(calc(var(--r, 0deg)));
  }

  .container:hover .glass {
    transform: rotate(0deg);
    margin: 0 10px;
  }

  .container .glass::before {
    content: attr(data-text);
    font-size: 24px;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #686d77;
  }

  .container .glass svg {
    font-size: 2.5em;
    fill: #333;
  }
  .container .glass:hover{
    cursor: pointer;
  }
`;

export default ViewsSelection;
