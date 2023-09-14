import axios, { AxiosResponse } from 'axios';

const getLongLat = async (address: string) => {
  try {
    const response: AxiosResponse<ArrayBuffer> = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${process.env.GEOCODER_API}`,
      {
        responseType: "arraybuffer",
      }
    );

    // Convert the response data to a string
    const responseData = Buffer.from(response.data).toString("utf-8");

    // Parse the string as JSON
    const result = JSON.parse(responseData);

    if (!result || !result.features || result.features.length === 0) {
      throw new Error("No geocode data found.");
    }

    return {
      latitude: result.features[0].properties.lat,
      longitude: result.features[0].properties.lon,
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default getLongLat; 
