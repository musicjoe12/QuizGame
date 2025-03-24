import React from 'react';
import '../Css/TopslotIndicators.css';

import twoBar from '../Images/twoBar.png';
import oneBar from '../Images/oneBar.png';
import fiveBar from '../Images/fiveBar.png';
import tenBar from '../Images/tenBar.png';
import cointossBar from '../Images/cointossBar.png';
import plinkoBar from '../Images/plinkoBar.png';

const numberResults = {
    Result1: oneBar,
    Result2: twoBar,
    Result5: fiveBar,
    Result10: tenBar
};

const bonusResults = {
    ResultCF: cointossBar,
    ResultPC: plinkoBar
};

const TopslotIndicators = ({ result }) => {
    return (
        <div className="indicator-wrapper">
            <div className="result-grid numbers-grid">
                {Object.keys(numberResults).map((key) => (
                    <img
                        key={key}
                        src={numberResults[key]}
                        alt={`Result ${key}`}
                        className={`result-image ${result === key ? 'flip' : ''}`}
                    />
                ))}
            </div>

            <div className="result-grid bonus-grid">
                {Object.keys(bonusResults).map((key) => (
                    <img
                        key={key}
                        src={bonusResults[key]}
                        alt={`Result ${key}`}
                        className={`result-image ${result === key ? 'flip' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TopslotIndicators;
