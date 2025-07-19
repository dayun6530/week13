import "./Viewer.css";
import { getEmotionImage } from "../util/get-emotion-image";
import { emotionList } from "../util/constants";

const Viewer = ({ emotionId, content }) => {
  const emotionItem = emotionList.find(
    (item) => item.emotionId === Number(emotionId)
  );

  // emotionItem이 없을 경우 대비
  if (!emotionItem) {
    return <div>존재하지 않는 감정 데이터입니다.</div>;
  }
  console.log("💡 감정 ID 확인:", emotionId);
  console.log("💡 감정 목록:", emotionList);
  return (
    <div className="Viewer">
      <section className="img_section">
        <h4>오늘의 감정</h4>
        <div className={`emotion_img_wrapper emotion_img_wrapper_${emotionId}`}>
          <img src={getEmotionImage(emotionId)} />
          <div>{emotionItem.emotionName}</div>
        </div>
      </section>
      <section className="content_section">
        <h4>오늘의 일기</h4>
        <div className="content_wrapper">
          <p>{content}</p>
        </div>
      </section>
    </div>
  );
};

export default Viewer;
