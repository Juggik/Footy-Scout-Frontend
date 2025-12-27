import client from "../../api/client.jsx";

export async function getPlayerStats(playerName) {
  try {
    const resp = await client.get("/playerDetails/playerStats", {
      params: { name: playerName },
    });
    console.log("Response:", resp.data);
    return resp.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
