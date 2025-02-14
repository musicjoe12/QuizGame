import React, { useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useLocation } from "react-router-dom";
import "../Css/UnityGame.css";

const UnityGame = () => {
    const unityInstance = useRef(null);
    const location = useLocation();

    const { unityProvider } = useUnityContext({
        loaderUrl: "build/newtest.loader.js",
        dataUrl: "build/newtest.data.unityweb",
        frameworkUrl: "build/newtest.framework.js.unityweb",
        codeUrl: "build/newtest.wasm.unityweb",
    });

    useEffect(() => {
        // Initialize Unity only once
        if (!unityInstance.current) {
            unityInstance.current = unityProvider;
            console.log("Unity initialized once.");
        }
    }, [unityProvider]);

    // Check if we should show Unity
    const isGamePage = location.pathname === "/";

    return (
        <div
            className="unity-persistent"
            style={{
                display: isGamePage ? "block" : "none"
            }}
        >
            <Unity unityProvider={unityProvider} />
        </div>
    );
};

export default UnityGame;
