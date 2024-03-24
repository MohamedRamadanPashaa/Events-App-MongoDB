import { useContext, useEffect, useRef, useState } from "react";

import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";
import NotificationContext from "../../store/notification-context";

function Comments(props) {
  const { eventId } = props;

  const emailInputRef = useRef();
  const nameInputRef = useRef();
  const commentInputRef = useRef();

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [LoadingComments, setLoadingComments] = useState(false);
  const notificationCtx = useContext(NotificationContext);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  useEffect(() => {
    const getComments = async () => {
      setLoadingComments(true);

      try {
        const response = await fetch(`/api/comments/${eventId}`);
        const data = await response.json();

        if (response.ok) {
          setComments(data.comments);
        } else {
          throw new Error(data.message || "Something went wrong!");
        }
      } catch (error) {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something went wrong!",
          status: "error",
        });
      }

      setLoadingComments(false);
    };

    if (showComments) {
      getComments();
    }
  }, [showComments]);

  async function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: "Sending comment...",
      message: "Your comment is currently being stored.",
      status: "pending",
    });

    try {
      // send data to API
      const response = await fetch(`/api/comments/${eventId}`, {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully comment added!",
          status: "success",
        });
        setComments([...comments, data.comment]);
        emailInputRef.current.value = "";
        nameInputRef.current.value = "";
        commentInputRef.current.value = "";
      } else {
        throw new Error(data.message || "Something went wrong!");
      }
    } catch (error) {
      notificationCtx.showNotification({
        title: "Error!",
        message: error.message || "Something went wrong!",
        status: "error",
      });
    }
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && (
        <NewComment
          emailInputRef={emailInputRef}
          nameInputRef={nameInputRef}
          commentInputRef={commentInputRef}
          onAddComment={addCommentHandler}
        />
      )}
      {showComments && (
        <CommentList LoadingComments={LoadingComments} items={comments} />
      )}
    </section>
  );
}

export default Comments;
