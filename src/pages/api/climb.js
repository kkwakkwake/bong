// /pages/api/climb.js

export default async function handler(req, res) {
  const { emdCd = "11680103" } = req.query;

  const url = `https://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_L_FRSTCLIMB&key=${process.env.NEXT_PUBLIC_TRAIL_API_KEY}&attrFilter=emdCd:=:${emdCd}|mntn_nm:=:대모산&domain=localhost:3000&crs=EPSG:4326`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("vworld API 호출 에러:", error);
    res.status(500).json({ error: "vworld API 요청 실패" });
  }
}
