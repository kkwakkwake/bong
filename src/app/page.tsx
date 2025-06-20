"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { parseString, parseStringPromise } from "xml2js";

export default function Home() {
  const fetchTrails = async () => {
    const domain = "localhost:3000";
    const attrFilter = "emdCd:=:11680103|mntn_nm:=:대모산";
    const crs = "EPSG:4326";
    const search = "LT_L_FRSTCLIMB";

    try {
      const response = await fetch("/api/climb?emdCd=11680103");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Fetching trails with name:", response);
      const data = await parseString(response);
      console.log("Trails data:", data);
    } catch (error) {
      console.error("Error fetching trails:", error);
    }
  };

  useEffect(() => {
    fetchTrails();
  }, []);

  const [history, setHistory] = useState([
    { id: 1, name: "등산 완료", count: 12 },
    { id: 2, name: "가고 싶은 산", count: 12 },
    { id: 3, name: "즐겨찾기", count: 12 },
  ]);

  return (
    <div className={styles.container}>
      <section>
        <h3>History</h3>
        <div className={styles.historyContainer}>
          {history.map((item) => (
            <div key={item.id} className={styles.historyItem}>
              <div>
                <span>{item.count}</span>
              </div>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3>Recommendation</h3>
      </section>
    </div>
  );
}
