import axios from "axios";

// API 서버 주소 (환경변수 또는 직접 문자열로)
const BASE_URL = "/api"; // 또는 "https://api.jeonghyeon.store"

const diaryApi = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// ✅ 1. 월별 일기 조회 (GET /diaries/month?month=YYYY-MM)
export const getDiariesByMonth = async (month) => {
  const response = await diaryApi.get("/diaries/month", {
    params: { month },
  });

  console.log("📦월별 응답 데이터:", response.data); // 👈 이거 꼭 확인
  return response.data;
};

// ✅ 2. 단일 일기 조회 (GET /diaries/:id)
export const getDiaryById = async (id) => {
  const response = await diaryApi.get(`/diaries/${id}`);
  return response.data;
};

// ✅ 3. 새 일기 생성 (POST /diaries)
export const createDiary = async ({ createdDate, emotionId, content }) => {
  const response = await diaryApi.post("/diaries", {
    createdDate,
    emotionId,
    content,
  });
  return response.data;
};

// ✅ 4. 일기 수정 (PUT /diaries/:id)
export const updateDiary = async (id, { createdDate, emotionId, content }) => {
  const response = await diaryApi.put(`/diaries/${id}`, {
    createdDate,
    emotionId,
    content,
  });
  return response.data;
};

// ✅ 5. 일기 삭제 (DELETE /diaries/:id)
export const deleteDiary = async (id) => {
  const response = await diaryApi.delete(`/diaries/${id}`);
  return response.data;
};
