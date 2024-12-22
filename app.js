// Step 1: Import ArcGIS modules
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer"
  ], function (esriConfig, Map, MapView, FeatureLayer) {
    
    // Step 2: Set your ArcGIS API Key
    esriConfig.apiKey = ""; // your ArcGIS API Key
  
    // Step 3: Set your OpenAI API Key
    const openaiApiKey = ""; //  your OpenAI API Key
  
    // Step 4: Create the map
    const map = new Map({
      basemap: "streets-navigation-vector" // Basemap style
    });
    
    // Step 5: Create the MapView
    const view = new MapView({
      container: "viewDiv", // Div element ID
      map: map,
      center: [-121.8863, 37.3382], // Longitude, Latitude (San Jose)
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