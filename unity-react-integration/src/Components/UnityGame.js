import React, { useEffect } from 'react';

const UnityGame = () => {
  useEffect(() => {
    // Dynamically load the UnityLoader script
    const script = document.createElement('script');
    script.src = "/unityBuild/Build/test2.loader.js"; // Path to the loader script
    script.onload = () => {
      console.log("Unity Loader Script Loaded Successfully");

      try {
        // Instantiate Unity after the script is loaded
        if (typeof UnityLoader !== 'undefined') {
          UnityLoader.instantiate("unityContainer", {
            loaderUrl: "/unityBuild/Build/test2.loader.js",  // Path to loader
            dataUrl: "/unityBuild/Build/test2.data",        // Path to Unity data
            frameworkUrl: "/unityBuild/Build/test2.framework.js", // Path to framework
            codeUrl: "/unityBuild/Build/test2.wasm",        // Path to code
          });
        } else {
          console.error('UnityLoader is not defined after script load');
        }
      } catch (error) {
        console.error('Error instantiating Unity:', error);
      }
    };

    // Error handling for script load failure
    script.onerror = (error) => {
      console.error('Failed to load UnityLoader script:', error);
    };

    // Append the script to the document
    document.body.appendChild(script);

    // Cleanup on component unmount (optional)
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h1>Unity Game in React</h1>
      <div id="unityContainer" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default UnityGame;
