"use client";

import Image from "next/image";
import style from "./page.module.css";
import NaverMap from "@/components/naver-map";
import { Coordinates } from "@/app/types/map";
import { useEffect, useState } from "react";

// import MockMountain from "../../../../public/images/mock-mountain.jpg";
import MockMountain from "../../../../public/images/mock-mountain.jpg";
import IconSearch from "../../../../public/icons/icons8-search.svg";
import IconReset from "../../../../public/icons/icons-reset.png";
import IconPosition from "../../../../public/icons/icons-position.png";
import IconPositionBlack from "../../../../public/icons/icons-position-black.png";
import IconMountain from "../../../../public/icons/icons-mountain.png";
import IconPath from "../../../../public/icons/icons-path.png";
import IconMountainGreen from "../../../../public/icons/icons-mountain-green.png";
import IconPathGreen from "../../../../public/icons/icons-path-green.png";

import IconMountainGray from "../../../../public/icons/icons-mountain-gray.png";
import IconPathGray from "../../../../public/icons/icons-path-gray.png";
import IconMountainBlack from "../../../../public/icons/icons-mountain-black.png";
import IconPathBlack from "../../../../public/icons/icons-path-black.png";
import { useRouter } from "next/navigation";

interface TNearMountainItem {
  // address_name: "서울 강남구 일원동";
  // category_group_code: "AT4";
  // category_group_name: "관광명소";
  // category_name: "여행 > 관광,명소 > 산";
  // distance: "2721";
  // id: "10241368";
  // phone: "";
  // place_name: "대모산";
  // place_url: "http://place.map.kakao.com/10241368";
  // road_address_name: "";
  // x: "127.0790106835936";
  // y: "37.47482803960479";
  addressName: string;
  categoryGroupCode: "AT4";
  categoryGroupName: "관광명소";
  categoryName: "여행 > 관광,명소 > 산";
  distance: string;
  id: string;
  phone: string;
  placeName: string;
  placeUrl: string;
  roadAddressName: string;
  x: string;
  y: string;
}

export default function Page() {
  const [category, setCategory] = useState<string[]>([]);
  const [resultOpen, setIsResultOpen] = useState(false);

  const [nearMountains, setNearMountains] = useState<TNearMountainItem[]>([]);
  const [loc, setLoc] = useState<Coordinates>([0, 0]);
  const [currentAddress, setCurrentAddress] = useState<string>("");

  const [searchInput, setSearchInput] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    console.log("Selected categories:", category);
  }, [category]);

  const clickCategoryMethod = (categoryName: string) => {
    if (category.includes(categoryName)) {
      setCategory(category.filter((cat) => cat !== categoryName));
    } else {
      setCategory([...category, categoryName]);
    }
  };

  const handleUpdatePosition = (lng: string, lat: string, address: string) => {
    fetchNearbyMountains(lng, lat);
    setLoc([Number(lng), Number(lat)]);
    setCurrentAddress(address);
  };

  const fetchNearbyMountains = async (lng: string, lat: string) => {
    console.log("Fetching nearby mountains with coordinates:", lng, lat);
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=산&x=${lat}&y=${lng}&radius=5000&category_group_code=AT4&size=10&sort=distance`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
        },
      }
    );
    const data = await res.json();
    console.log("Nearby mountains data:", data);
    if (data.documents) {
      const mountains = data.documents.map((item: any) => ({
        addressName: item.address_name,
        categoryGroupCode: item.category_group_code,
        categoryGroupName: item.category_group_name,
        categoryName: item.category_name,
        distance: item.distance,
        id: item.id,
        phone: item.phone,
        placeName: item.place_name,
        placeUrl: item.place_url,
        roadAddressName: item.road_address_name,
        x: item.x,
        y: item.y,
      }));

      setNearMountains(mountains);
    } else {
      setNearMountains([]);
    }
  };

  useEffect(() => {
    console.log("Mountains fetched:", nearMountains);
  }, [nearMountains]);

  const handleSearchInput = () => {
    if (!searchInput.trim()) {
      return;
    }
    router.push(`/search?query=${searchInput}`);
  };
  return (
    <div className={style.container}>
      <header className={style.header}>
        <input
          type="text"
          placeholder="어디로 갈까요?"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={() => handleSearchInput()}>
          <Image src={IconSearch} alt="search-bar" width={28} height={28} />
        </button>
      </header>
      <div>
        <ul className={style.categoryList}>
          <li
            onClick={() => clickCategoryMethod("mountain")}
            className={
              category.includes("mountain") ? style.categorySelected : ""
            }
          >
            <Image
              src={
                category.includes("mountain")
                  ? IconMountainBlack
                  : IconMountainGreen
              }
              alt="mountain-icon"
              width={16}
              height={16}
            />
            <span>산</span>
          </li>
          <li
            onClick={() => clickCategoryMethod("path")}
            className={category.includes("path") ? style.categorySelected : ""}
          >
            <Image
              src={category.includes("path") ? IconPathBlack : IconPathGreen}
              alt="path-icon"
              width={16}
              height={16}
            />
            <span>등산 추천 코스</span>
          </li>
        </ul>
      </div>

      {/* <div className={style.mapContainer}>
        <div className={style.mapButton} onClick={() => fetchNearbyMountains()}>
          <span>이 지역에서 탐색</span>
          <Image src={IconReset} alt="reset-button" width={12} height={12} />
        </div>
        {loc && <NaverMap loc={loc} />}
      </div> */}

      <NaverMap onUpdatePosition={handleUpdatePosition} />
      <div
        className={`${style.mapResultList} ${style["slide-up-container"]} ${
          resultOpen ? style["active"] : ""
        }`}
        onClick={() => setIsResultOpen(!resultOpen)}
      >
        <div>
          <Image src={IconPosition} alt="내 위치" width={24} height={24} />
          <span>{currentAddress || ""}</span>
        </div>
        <div>
          <h5>산 {nearMountains && nearMountains.length}</h5>
          <div className={style.mountainList}>
            {nearMountains && nearMountains.length > 0 ? (
              nearMountains.map((mountain) => (
                <div key={mountain.id} className={style.mountainItem}>
                  <span>{mountain.placeName}</span>
                  <span>{mountain.distance}</span>
                </div>
              ))
            ) : (
              <p>근처에 산이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
