import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Editor from "../components/Editor";
import { useContext, useEffect, useState } from "react";
import { DiaryDispatchContext, DiaryStateContext } from "../App";
import DiaryItem from "../components/DiaryItem";
import useDiary from "../hooks/useDiary";
import { updateDiary, deleteDiary } from "../api/diary";

const Edit = () => {
  const params = useParams();
  const nav = useNavigate();
  const { onDelete, onUpdate } = useContext(DiaryDispatchContext);
  const curDiaryItem = useDiary(params.id);

  const onClickDelete = async () => {
    if (window.confirm("일기를 정말 삭제할까요? 다시 복구되지 않아요")) {
      try {
        await deleteDiary(params.id);
        onDelete(params.id); // ✅ context 갱신
        nav("/", { replace: true });
      } catch (e) {
        alert("일기 삭제에 실패했습니다.");
        console.error(e);
      }
    }
  };

  const onSubmit = async (input) => {
    if (window.confirm("일기를 정말 수정할까요?")) {
      try {
        await updateDiary(params.id, {
          createdDate: input.createdDate.getTime(),
          emotionId: input.emotionId,
          content: input.content,
        });

        // ✅ 상태도 함께 갱신
        onUpdate(
          params.id,
          input.createdDate.getTime(),
          input.emotionId,
          input.content
        );

        nav("/", { replace: true });
      } catch (e) {
        alert("일기 수정에 실패했습니다.");
        console.error(e);
      }
    }
  };

  return (
    <div>
      <Header
        title={"일기 수정하기"}
        leftChild={<Button onClick={() => nav(-1)} text={"< 뒤로 가기"} />}
        rightChild={
          <Button onClick={onClickDelete} text={"삭제하기"} type={"NEGATIVE"} />
        }
      />
      <Editor initData={curDiaryItem} onSubmit={onSubmit} />
    </div>
  );
};

export default Edit;
