import classes from "./comment-list.module.css";

function CommentList({ items, LoadingComments }) {
  return (
    <>
      {LoadingComments && <p>Loading comments...</p>}

      {!LoadingComments && items.length === 0 && (
        <p>No comments for this event</p>
      )}

      {items && items.length > 0 && (
        <ul className={classes.comments}>
          {/* Render list of comments - fetched from API */}
          {items.map((item) => (
            <li key={item._id}>
              <p>{item.text}</p>
              <div>
                By <address>{item.name}</address>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default CommentList;
