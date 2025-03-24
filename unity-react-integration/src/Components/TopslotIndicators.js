import React, { useEffect, useState } from 'react';
import '../Css/TopslotIndicators.css';

import twoBar from '../Images/twoBar.png';
import oneBar from '../Images/oneBar.png';
import fiveBar from '../Images/fiveBar.png';
import tenBar from '../Images/tenBar.png';
import cointossBar from '../Images/cointossBar.png';
import plinkoBar from '../Images/plinkoBar.png';

// Top Slot Multiplier Overlays
import top2x from '../Images/topslotmultis/topslot_2x.png';
import top3x from '../Images/topslotmultis/topslot_3x.png';
import top4x from '../Images/topslotmultis/topslot_4x.png';
import top5x from '../Images/topslotmultis/topslot_5x.png';
import top7x from '../Images/topslotmultis/topslot_7x.png';
import top10x from '../Images/topslotmultis/topslot_10x.png';
import top15x from '../Images/topslotmultis/topslot_15x.png';
import top20x from '../Images/topslotmultis/topslot_20x.png';
import top25x from '../Images/topslotmultis/topslot_25x.png';
import top50x from '../Images/topslotmultis/topslot_50x.png';

const numberImages = {
    Result1: oneBar,
    Result2: twoBar,
    Result5: fiveBar,
    Result10: tenBar
};

const bonusImages = {
    ResultCF: cointossBar,
    ResultPC: plinkoBar
};

const normalizeResultKey = (result) => {
    if (result === "Plinko") return "ResultPC";
    if (result === "CoinToss") return "ResultCF";
    return result;
};

const topslotImages = {
    2: top2x,
    3: top3x,
    4: top4x,
    5: top5x,
    7: top7x,
    10: top10x,
    15: top15x,
    20: top20x,
    25: top25x,
    50: top50x
};

const TopslotIndicators = ({ result, topSlot }) => {
    const [activeTopslot, setActiveTopslot] = useState(null);

    useEffect(() => {
        if (topSlot?.result && topSlot?.multiplier) {
            setActiveTopslot({ result: topSlot.result, multiplier: topSlot.multiplier });

            const timer = setTimeout(() => setActiveTopslot(null), 15000); 
            return () => clearTimeout(timer);
        }
    }, [topSlot]);

    return (
        <div className="indicator-wrapper">
            <div className="numbers-grid">
                {Object.keys(numberImages).map((key) => (
                    <div key={key} className="result-box">
                        <img
                            src={numberImages[key]}
                            alt={`Result ${key}`}
                            className={`result-image ${result === key ? 'flip' : ''}`}
                        />
                        {activeTopslot?.result === key && topslotImages[activeTopslot.multiplier] && (
                            <img
                                src={topslotImages[activeTopslot.multiplier]}
                                alt={`${activeTopslot.multiplier}x`}
                                className="topslot-overlay"
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="bonus-grid">
    {Object.keys(bonusImages).map((key) => (
        <div key={key} className="result-box">
            <img
                src={bonusImages[key]}
                alt={`Result ${key}`}
                className={`result-image ${result === key ? 'flip' : ''}`}
            />
            {activeTopslot?.result === key && topslotImages[activeTopslot.multiplier] && (
                <img
                    src={topslotImages[activeTopslot.multiplier]}
                    alt={`${activeTopslot.multiplier}x`}
                    className="topslot-overlay"
                />
            )}
        </div>
    ))}
</div>

        </div>
    );
};

export default TopslotIndicators;
