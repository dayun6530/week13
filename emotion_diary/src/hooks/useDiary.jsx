import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiaryById } from "../api/diary";

const useDiary = (id) => {
  const [curDiaryItem, setCurDiaryItem] = useState();
  const nav = useNavigate();

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const data = await getDiaryById(id);

        // ✅ emotionId 보정 처리
        let emotionId;

        if (typeof data.emotionId === "number") {
          emotionId = data.emotionId;
        } else if (typeof data.emotionID === "number") {
          emotionId = data.emotionID;
        } else if (typeof data.emotion === "number") {
          emotionId = data.emotion;
        } else if (
          typeof data.emotion === "object" &&
          data.emotion !== null &&
          "id" in data.emotion
        ) {
          emotionId = data.emotion.id;
        } else if (typeof data.emotion === "string") {
          const emotionMap = {
            terrible: 5,
            bad: 4,
            soso: 3,
            good: 2,
            happy: 1,
          };
          emotionId = emotionMap[data.emotion.toLowerCase()] ?? 3;
        } else {
          emotionId = 3;
        }

        // 범위 보정
        if (emotionId < 1 || emotionId > 5) {
          emotionId = 3;
        }

        setCurDiaryItem({
          ...data,
          emotionId, // ✅ Viewer는 이 key만 씀!
        });
      } catch (e) {
        alert("존재하지 않는 일기입니다.");
        nav("/", { replace: true });
      }
    };

    fetchDiary();
  }, [id]);

  return curDiaryItem;
};

export default useDiary;
