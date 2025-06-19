"use client";

import { useEffect } from "react";
import styles from "./page.module.css";
import { parseString, parseStringPromise } from "xml2js";

export default function Home() {
  const fetchMountains = async () => {
    try {
      // const response = await fetch(
      //   "https://apis.data.go.kr/1400000/service/cultureInfoService2/mntInfoOpenAPI2?searchWrd=%EB%AF%BC%EB%91%A5%EC%82%B0&ServiceKey=B6wtfFMtSrBtgvqbOBe8WnfxwiAK9rFGXbbR5HFP2t8nlu5PvY795CYo45vBS%2BEpN1y5ec4P%2B%2B2EhbhgoM5l0A%3D%3D"
      // );

      const randomNumber = Math.floor(Math.random() * 160) + 1;
      const response = await fetch(
        `https://apis.data.go.kr/1400000/service/cultureInfoService2/mntInfoOpenAPI2?ServiceKey=B6wtfFMtSrBtgvqbOBe8WnfxwiAK9rFGXbbR5HFP2t8nlu5PvY795CYo45vBS%2BEpN1y5ec4P%2B%2B2EhbhgoM5l0A%3D%3D&pageNo=${randomNumber}&numOfRows=20`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await parseString(response);
      console.log("Mountains data:", data);

      const xmlText = await response.text();
      const result = await parseStringPromise(xmlText);
      console.log(result);
      const items = result.response.body[0].items[0].item;
      console.log("Parsed items:", items);
      const hg = items.filter((item: any) => item.mntihigh[0] !== "0");
      console.log("Filtered mountains with height:", hg);
    } catch (error) {
      console.error("Error fetching mountains:", error);
    }
  };

  useEffect(() => {
    fetchMountains();
  }, []);

  return (
    <div className={styles.container}>
      <section>
        <h3>History</h3>
      </section>
      <section>
        <h3>Recommendation</h3>
      </section>
    </div>
  );
}
