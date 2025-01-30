import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "./UnityGame.css";

const UnityGame = () => {
    const { unityProvider } = useUnityContext({
        loaderUrl: "build/newtest.loader.js",
        dataUrl: "build/newtest.data.unityweb",
        frameworkUrl: "build/newtest.framework.js.unityweb",
        codeUrl: "build/newtest.wasm.unityweb",
      });
    
      return <Unity className="container" unityProvider={unityProvider} />;
    }

export default UnityGame;