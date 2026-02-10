import { Suspense } from "react";
import MovieInfo, { getMovie } from "../../../components/movie-info";
import MovieVideos from "../../../components/movie-videos";

import { title } from "node:process";

// 타입 정의도 Promise로 감싸줘야 합니다.
// Next.js 15에서는 params가 Promise입니다.
interface IParams {
  params: Promise<{ id: string }>;
}

// 1. 함수 이름을 generateMetadata로 수정 (소문자 d)
// 2. params를 await 하여 id를 추출하도록 수정
export async function generateMetadata({ params }: IParams) {
  const { id } = await params; // ★ 여기서 await 필수!
  const movie = await getMovie(id);
  return {
    title: movie.title,
  };
}
// 성공하셨다니 정말 다행입니다!  강의는 구버전이고, 내가 쓰는 건 신버전일 때가 공부하면서 제일 막막한 순간인데, **"강의 + 보충 설명"**으로 잘 소화하고 계시다니 아주 훌륭합니다. 개발 실력이 가장 많이 느는 순간이 바로 이때거든요.

// 지금 겪으신 **"params가 Promise가 된 이유"**를 아주 짧고 쉽게 정리해 드릴게요. (이걸 알면 나중에 안 까먹습니다!)

//  왜 갑자기 Promise로 바꿨을까요? (Next.js 15의 큰 그림)
// 예전(Next.js 14 이하)에는 params가 "주머니 속에 이미 들어있는 사탕" 같았습니다.

// 그냥 손 넣어서 params.id 꺼내 먹으면 됐죠. (동기 방식)

// 그런데 Next.js 15부터는 params가 **"사탕 교환권(Promise)"**으로 바뀌었습니다.

// 서버가 페이지를 만들 때, 주소창의 정보를 읽어오는 것조차도 **"비동기(Asynchronous)"**로 처리해서 속도를 더 최적화하려고 하기 때문입니다.

// 그래서 "잠깐 기다려(await), 교환권 줄게 사탕이랑 바꿔와" 라고 해야 비로소 id를 얻을 수 있게 된 거죠.
// 앞으로 page.tsx나 layout.tsx 등 동적 라우팅([id]) 파일을 만질 때는 무조건 이 패턴만 기억하세요.

// 타입은 Promise로 감싸기: params: Promise<{ id: string }>

// 사용할 땐 기다리기: const { id } = await params;
export default async function MovieDetail({ params }: IParams) {
  // ★ 여기가 핵심 변경점! (Next.js 15)
  // params가 Promise이므로 await으로 기다려서 id를 꺼내야 합니다.
  const { id } = await params;

  return (
    <div>
      <Suspense fallback={<h1>Loading movie info</h1>}>
        <MovieInfo id={id} />
      </Suspense>
      <Suspense fallback={<h1>Loading movie videos</h1>}>
        <MovieVideos id={id} />
      </Suspense>
    </div>
  );
}
