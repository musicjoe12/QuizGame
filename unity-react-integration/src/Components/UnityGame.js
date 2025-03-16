import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useLocation } from "react-router-dom";
import "../Css/UnityGame.css";

const UnityGame = () => {
    const location = useLocation();

    const { unityProvider, isLoaded } = useUnityContext({
        loaderUrl: "build/newtest.loader.js",
        dataUrl: "build/newtest.data.unityweb",
        frameworkUrl: "build/newtest.framework.js.unityweb",
        codeUrl: "build/newtest.wasm.unityweb",
    });

    // Check if we should show Unity
    const isGamePage = location.pathname === "/";

    return (
        <div className="game-container" style={{ display: isGamePage ? "block" : "none" }}>
            {!isLoaded && <p className="loading-text">Loading Unity Game...</p>}
            <Unity className="unity-canvas" unityProvider={unityProvider} />
        </div>
    );
};

export default UnityGame;
