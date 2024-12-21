// Step 1: Import ArcGIS modules
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer"
  ], function (esriConfig, Map, MapView, FeatureLayer) {
    
    // Step 2: Set your ArcGIS API Key
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurJLFIpW6LSEO6wOl6ICOV4I4Y_TbMmWNO1bhDot0W9i1B2cCBZllDtnRJZbB-coucxWN585WE75UWmerwWgu7FseUK5lvwNmk07krvLDi8jHXT_Lpkqck6LZJ9x-PKAN8ZF-sm_exOIPUH_OF-T4Y5Cpgylfknr05gTD8PLnG7rOiLiP0dtjLeky3vjpT2ukPmm7hxbLV6LES3w3hu9DBbpVpBZMoGfjsL6WeRoI_5eaAT1_Ytf4789V"; // Replace with your ArcGIS API Key
  
    // Step 3: Set your OpenAI API Key
    const openaiApiKey = "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"; // Replace with your OpenAI API Key
  
    // Step 4: Create the map
    const map = new Map({
      basemap: "streets-navigation-vector" // Basemap style
    });
  
    // Step 5: Create the MapView
    const view = new MapView({
      container: "viewDiv", // Div element ID
      map: map,
      center: [2.3522, 48.8566], // Longitude, Latitude (Paris)
      zoom: 12
    });
  
  
    // Step 7: Handle map click events
    view.on("click", async function (event) {
      const { latitude, longitude } = event.mapPoint;
  
      // Generate an AI fact using OpenAI API
      const fact = await generateFact(latitude, longitude);
  
      // Display the fact in a popup
      view.popup.open({
        title: "AI-Generated Fact",
        content: fact,
        location: event.mapPoint
      });
    });
  
    // Step 8: Define OpenAI API call function
    async function generateFact(latitude, longitude) {
      const prompt = `Provide an interesting fact about the location at latitude ${latitude.toFixed(2)} and longitude ${longitude.toFixed(2)}.`;
  
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
            temperature: 0.7
          })
        });
  
        const data = await response.json();
        return data.choices[0].message.content.trim();
      } catch (error) {
        console.error("Error generating AI fact:", error);
        return "Sorry, I couldn't generate a fact at this time.";
      }
    }
  });