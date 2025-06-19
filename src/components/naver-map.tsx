"use client";

import Script from "next/script";
import { Coordinates, NaverMap } from "@/app/types/map";
import { useCallback, useEffect, useRef, useState } from "react";
import style from "./naver-map.module.css";
import Image from "next/image";
import IconReset from "../../public/icons/icons-reset.png";

export type NaverMap = naver.maps.Map;
type Lng = number;
type Lat = number;
export type Coordinates = [Lng, Lat];

const mapId = "naver-map";

declare global {
  interface Window {
    naver: any;
  }
}

export default function Nap({
  onUpdatePosition,
}: {
  onUpdatePosition: (lat: string, lng: string, address: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);

  const [loc, setLoc] = useState<Coordinates>();
  const [currentAddress, setCurrentAddress] = useState<string>("");

  const initializeMap = () => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(loc),
      zoom: 15,
      scaleControl: true,
      mapDataControl: true,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };
    const map = new window.naver.maps.Map(mapId, mapOptions);
    mapRef.current = map;
    mapInstanceRef.current = map;
    getMapCenter();
  };

  const initLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLoc([position.coords.longitude, position.coords.latitude]);
    });
  };

  useEffect(() => {
    initLocation();
  }, []);

  const getMapCenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    console.log("getMapCenter called", map);

    const center = map.getCenter() as naver.maps.LatLng; // ✅ 이렇게 수정
    const lat = String(center.lat());
    const lng = String(center.lng());

    console.log("Map center:", center, lat, lng);
    // onUpdatePosition(lng, lat);
    setLoc([lng, lat] as Coordinates);
    getAddressFromCoordinates(lat, lng);
  };

  useEffect(() => {}, [loc]);
  const getAddressFromCoordinates = (lat: number, lng: number) => {
    const coord = new window.naver.maps.LatLng(lat, lng);

    window.naver.maps.Service.reverseGeocode(
      {
        coords: coord,
        orders: [
          window.naver.maps.Service.OrderType.ADDR, // 지번 주소
          window.naver.maps.Service.OrderType.ROAD_ADDR, // 도로명 주소
        ],
      },
      (status, response) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          alert("주소를 불러오지 못했습니다.");
          return;
        }

        const result = response.v2;
        const address =
          result.address.roadAddress || result.address.jibunAddress;

        console.log("현재 위치 주소:", address, lat, lng);
        setCurrentAddress(address);
        onUpdatePosition(lat.toString(), lng.toString(), address);
        // setAddress(address); 같은 방식으로 상태에 저장 가능
      }
    );
  };

  return (
    <div className={style.mapContainer}>
      <div className={style.mapButton} onClick={() => getMapCenter()}>
        <span>이 지역에서 탐색</span>
        <Image src={IconReset} alt="reset-button" width={12} height={12} />
      </div>
      {/* {loc && <NaverMap loc={loc} />} */}
      {loc && (
        <div>
          <Script
            strategy="afterInteractive"
            type="text/javascript"
            src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
            onReady={initializeMap}
          ></Script>

          <div id={mapId} style={{ width: "100%", height: "400px" }} />
        </div>
      )}
    </div>
  );
}
