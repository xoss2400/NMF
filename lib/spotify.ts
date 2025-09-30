import querystring from "querystring";

export const getAccessToken = async (refreshToken: string) => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return response.json();
};

export const fetchTopTracks = async (accessToken: string) => {
  const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=10`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
};