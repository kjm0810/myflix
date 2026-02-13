import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = "https://api.themoviedb.org/3";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ message: "TMDB_API_KEY is missing" });
    }

    const { url, language, ...rest } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "Query param 'url' is required" });
    }

    const lang = typeof language === "string" && language.trim() ? language : "ko-KR";

    // TMDB query 구성
    const params = new URLSearchParams();
    params.set("api_key", API_KEY);
    params.set("language", lang);

    // 나머지 쿼리(with_genres, page, sort_by 등) 그대로 전달
    for (const [key, value] of Object.entries(rest)) {
      if (typeof value === "string") {
        params.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      }
    }

    console.log(`${BASE_URL}/${url}?${params.toString()}`);

    const tmdbRes = await fetch(`${BASE_URL}/${url}?${params.toString()}`);

    if (!tmdbRes.ok) {
      const text = await tmdbRes.text();
      return res.status(tmdbRes.status).json({ message: "TMDB request failed", detail: text });
    }

    const data = await tmdbRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Server error", detail: String(err) });
  }
}
