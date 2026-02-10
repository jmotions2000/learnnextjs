// app/tide/page.tsx (Server Component)

import React from "react";

// 날짜 포맷팅용 헬퍼 함수
const getFormatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

async function getTideData() {
  const today = new Date();
  const apiDate = getFormatDate(today); // 20260206
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  // Next.js의 강력한 캐싱: 12시간(43200초) 동안 캐시 유지 (PHP Transient 대체)
  const res = await fetch(
    `https://www.khoa.go.kr/seaDivide/getSeaDivide.do?rid=4&date=${apiDate}&ye=${year}&mon=${month}&type=json`,
    { next: { revalidate: 43200 } },
  );

  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default async function TidePage() {
  const data = await getTideData();

  // 데이터 정제 로직 (PHP랑 똑같습니다)
  const rawTime =
    data?.resultData?.[0]?.time || data?.result_data?.[0]?.time || "";
  const cleanTime = rawTime
    .replace(/\(전날\)|\(다음날\)/g, "")
    .split(/\r\n|\n/);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md text-center mt-10">
      <h2 className="text-xl font-bold text-slate-800 mb-2">
        🌊 제부도 물때표
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Next.js로 가져온 데이터입니다.
      </p>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        {cleanTime.length > 0 ? (
          <ul className="space-y-2">
            {cleanTime.map(
              (time: string, index: number) =>
                time && (
                  <li key={index} className="text-blue-600 font-medium text-lg">
                    ⏰ {time}
                  </li>
                ),
            )}
          </ul>
        ) : (
          <p className="text-gray-500">하루종일 계속 열려있습니다.</p>
        )}
      </div>
    </div>
  );
}
