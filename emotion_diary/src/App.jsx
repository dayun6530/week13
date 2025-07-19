import "./App.css";
import { useReducer, useRef, createContext, useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Notfound from "./pages/Notfound";
import Button from "./components/Button";
import Header from "./components/Header";
import { getDiariesByMonth } from "./api/diary";
import { getStringedDate } from "./util/get-stringed-date";
import { createDiary } from "./api/diary";
import { updateDiary } from "./api/diary";
import { getEmotionImage } from "./util/get-emotion-image";

function reducer(state, action) {
  let nextState;

  switch (action.type) {
    case "INIT":
      return action.data;

    case "CREATE": {
      nextState = [action.data, ...state];
      break;
    }
    case "UPDATE": {
      nextState = state.map((item) =>
        String(item.id) === String(action.data.id)
          ? {
              ...action.data,
              emotionId: Number(action.data.emotionId),
            }
          : item
      );
      break;
    }
    case "DELETE": {
      nextState = state.filter((item) => String(item.id) !== String(action.id));
      break;
    }
    default:
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const thisMonth = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;

        const dataFromApi = await getDiariesByMonth(thisMonth);

        // 💡 emotionId가 없는 경우를 대비한 변환
        const normalizedData = dataFromApi.map((item) => ({
          ...item,
          emotionId: Number(
            item.emotionId ?? item.emotion ?? item.emotion_id ?? 3
          ),
        }));

        dispatch({ type: "INIT", data: normalizedData });

        // 최대 ID 계산
        let maxId = 0;
        normalizedData.forEach((item) => {
          if (Number(item.id) > maxId) {
            maxId = Number(item.id);
          }
        });
        idRef.current = maxId + 1;
      } catch (error) {
        console.error("초기 데이터 불러오기 실패:", error);
        alert("서버로부터 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 새로운 일기 추가
  const onCreate = async (createdDate, emotionId, content) => {
    try {
      const newItem = await createDiary({ createdDate, emotionId, content });
      console.log("🧩 응답 받은 새 일기:", newItem);

      // ✨ 새로 추가되는 단일 일기 객체만 emotionId 보정
      const normalizedItem = {
        ...newItem,
        emotionId: Number(
          newItem.emotionId ??
            newItem.emotion ??
            newItem.emotion_id ??
            emotionId
        ),
      };

      dispatch({
        type: "CREATE",
        data: normalizedItem, // ✅ 이 변수만 dispatch해야 함
      });
    } catch (e) {
      alert("일기 생성 실패");
      console.error("🔥 오류:", e);
    }
  };

  // 기존 일기 수정
  const onUpdate = async (id, createdDate, emotionId, content) => {
    try {
      const updatedItem = await updateDiary(id, {
        createdDate,
        emotionId,
        content,
      });

      dispatch({
        type: "UPDATE",
        data: {
          id,
          createdDate,
          emotionId: Number(emotionId),
          content,
        },
      });
    } catch (e) {
      alert("일기 수정 실패");
      console.error("🔴 수정 실패:", e);
    }
  };

  // 기존 일기 삭제
  const onDelete = (id) => {
    dispatch({
      type: "DELETE",
      id,
    });
  };

  if (isLoading) {
    return <div>데이터 로딩중입니다 ...</div>;
  }

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/diary/:id" element={<Diary />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
