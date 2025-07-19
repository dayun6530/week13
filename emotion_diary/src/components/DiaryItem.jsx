import { getEmotionImage } from "../util/get-emotion-image";
import Button from "./Button";
import "./DiaryItem.css";
import { useNavigate } from "react-router-dom";

const DiaryItem = ({ id, emotionId, createdDate, content }) => {
  const nav = useNavigate();
  const parsedEmotionId = Number(emotionId); // 한 번만 변환해서 재사용

  const handleMoveToDetail = () => {
    nav(`/diary/${id}`);
  };

  return (
    <div className="DiaryItem">
      <div
        onClick={handleMoveToDetail}
        className={`img_section img_section_${parsedEmotionId}`}
      >
        <img
          src={getEmotionImage(parsedEmotionId)}
          alt={`emotion-${parsedEmotionId}`}
        />
      </div>

      <div onClick={handleMoveToDetail} className="info_section">
        <div className="created_date">
          {new Date(createdDate).toLocaleDateString()}
        </div>
        <div className="content">{content}</div>
      </div>

      <div className="button_section">
        <Button onClick={() => nav(`/edit/${id}`)} text={"수정하기"} />
      </div>
    </div>
  );
};

export default DiaryItem;
