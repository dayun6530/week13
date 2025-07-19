import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DiaryStateContext } from "../App";
import { useContext } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import DiaryList from "../components/DiaryList";
import { getDiariesByMonth } from "../api/diary";

const getMonthlyData = (pivotDate, data) => {
  const beginTime = new Date(
    pivotDate.getFullYear(),
    pivotDate.getMonth(),
    1,
    0,
    0,
    0
  ).getTime();
  const endTime = new Date(
    pivotDate.getFullYear(),
    pivotDate.getMonth() + 1,
    0,
    23,
    59,
    59
  ).getTime();

  return data.filter(
    (item) => beginTime <= item.createdDate && item.createdDate <= endTime
  );
};

const Home = () => {
  const [pivotDate, setPivotDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMonthlyData = async (pivotDate) => {
    try {
      setIsLoading(true);
      const monthString = `${pivotDate.getFullYear()}-${String(
        pivotDate.getMonth() + 1
      ).padStart(2, "0")}`;
      const data = await getDiariesByMonth(monthString);

      // 🔧 여기서 emotionID → emotionId 로 key 이름 정제 + 유효값 보정
      const normalizedData = data.map((item) => {
        let emotionId = Number(item.emotionID ?? 3);
        if (emotionId < 1 || emotionId > 5) {
          emotionId = 3;
        }

        return {
          ...item,
          emotionId, // ✅ 소문자 key로 변경
        };
      });

      setMonthlyData(normalizedData);
    } catch (e) {
      alert("월별 데이터 불러오기 실패");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyData(pivotDate);
  }, [pivotDate]);

  const onIncreaseMonth = () => {
    setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() + 1));
  };

  const onDecreaseMonth = () => {
    setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() - 1));
  };

  return (
    <div>
      <Header
        title={`${pivotDate.getFullYear()}년 ${pivotDate.getMonth() + 1}월`}
        leftChild={<Button onClick={onDecreaseMonth} text={"<"} />}
        rightChild={<Button onClick={onIncreaseMonth} text={">"} />}
      />
      {isLoading ? (
        <div>로딩 중입니다...</div>
      ) : (
        <DiaryList data={monthlyData} />
      )}
    </div>
  );
};

export default Home;
