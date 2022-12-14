import React, { useState, useEffect } from "react";
import config from "../config";
import axios from "axios";
import classes from "../Styles/post.module.css";
import Comments from "./Comments";
import { ThumbUp } from "@material-ui/icons";
import DropDown from "./DropDown";
import { useNavigate } from "react-router-dom";
import noData from "../images/no.svg";

export default function UserPost() {
  const [commentOpen, setCommentOpen] = useState([]);
  const [myPost, setMyPost] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [cnt, setCnt] = useState(0);

  const handleCommentOpen = (evnt, index) => {
    console.log("handle comment");
    const commentStatus = commentOpen;
    commentStatus[index] = !commentStatus[index];
    setCommentOpen(commentStatus);
  };

  const navigate = useNavigate();
  useEffect(() => {
    getImages();
  }, []);

  const getImages = () => {
    axios
      .get("http://localhost:3003/auth/getImages", config())
      .then((response) => {
        if (response.data[0].profileImgId !== "null") {
          setProfileImage(response.data[0].profileImgId);
        } else {
          setProfileImage("avatar.png");
        }
      });
  };

  useEffect(() => {
    getAllMyPost();
  }, []);

  const getAllMyPost = () => {
    axios
      .get("http://localhost:3003/auth/getOwnPost", config())
      .then((response) => {
        // console.log(response.data);
        const allMyPost = response.data;

        allMyPost.sort((a, b) => (a.postDate > b.postDate ? 1 : -1));
        // console.log(allMyPost);
        setMyPost(allMyPost);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // console.log(myPost);

  async function isThePostLiked(postID) {
    console.log(postID);
    console.log("clicked is post liked");
    const response = await axios.get(
      `http://localhost:3003/auth/isLike/${postID}`,
      config()
    );

    if (response.data.isLiking === true) {
      handleUnLike(postID);
    } else {
      handleLike(postID);
    }
  }

  const handleLike = (postid) => {
    console.log("clicked like");
    // clicked = true;
    console.log(postid);
    //  setLikeNumber(likeNumber+1);
    axios
      .post(`http://localhost:3003/auth/like/${postid}`, {}, config())
      .then((response) => {
        console.log(response);
        // liked = true;
      });
    window.location.reload(false);
  };

  const handleUnLike = (postid) => {
    console.log("clicked unlike");
    // clicked = true;
    console.log(postid);
    // setLikeNumber(likeNumber-1);
    axios
      .delete(`http://localhost:3003/auth/unlike/${postid}`, config())
      .then((response) => {
        console.log(response);
        // liked = false;
      });
    window.location.reload(false);
  };
  // console.log(myPost.length);
  if (myPost.length !== 0) {
    return myPost.map((Post, index) => {
      return (
        <div key={index} className={classes.post}>
          <div className={classes.postWrapper}>
            <div className={classes.postTop}>
              <div className={classes.postTopLeft}>
                <img
                  className={classes.postProfileImg}
                  src={`http://localhost:3003/auth/images/${profileImage}`}
                  alt=""
                />
                <div>
                  <div className={classes.postUsername}>
                    <b>{Post.Author}</b>
                  </div>

                  <div className={classes.postDate}>
                    Posted On {Post.date_time.slice(0, 10)} at{" "}
                    {Post.date_time.slice(11, 16)}
                  </div>
                </div>
              </div>
              <div
                className={classes.postTopRight}
                //onClick={() => {
                //  console.log(Post.postId);
                // }}
              >
                <DropDown
                  ClickEdit={() => {
                    navigate("/EditPost", {
                      state: {
                        id: Post.postID,
                        postDet: Post.postDet,
                      },
                    });
                  }}
                  postId={Post.postID}
                />
              </div>
            </div>

            <div className={classes.postCenter}>
              <span className={classes.postText}>
                <div dangerouslySetInnerHTML={{ __html: Post.postDet }} />
              </span>
              <img
                className={classes.postImg}
                src={`http://localhost:3003/auth/images/${Post.imgID}`}
                alt=""
              />
            </div>
            <div className={classes.postBottom}>
              <div className={classes.postBottomLeft}>
                <ThumbUp
                  className={classes.likeIcon}
                  onClick={() => {
                    console.log("click thumb");
                    isThePostLiked(myPost[index].postID);
                  }}
                />

                {Post.likenumber === null ? (
                  <span className={classes.postLikeCounter}>No Likes Yet</span>
                ) : (
                  <span className={classes.postLikeCounter}>
                    {Post.likenumber} people liked it
                  </span>
                )}
              </div>
              <div className={classes.postBottomRight}>
                {Post.commentNumber === null ? (
                  <span
                    className={classes.postCommentText}
                    onClick={(evnt) => {
                      handleCommentOpen(evnt, index);
                      setCnt(cnt + 1);
                    }}
                  >
                    no comments yet
                  </span>
                ) : (
                  <span
                    className={classes.postCommentText}
                    onClick={(evnt) => {
                      handleCommentOpen(evnt, index);
                      setCnt(cnt + 1);
                    }}
                  >
                    {Post.commentNumber} comments
                  </span>
                )}
              </div>
            </div>

            {commentOpen[index] && <Comments postId={myPost[index].postID} />}
          </div>
        </div>
      );
    });
  } else {
    return (
      <div className={classes.noPost}>
        <div className={classes.postWrapper}>
          <h2>You Haven't Posted Anything Yet.</h2>
          <br />
          <img className={classes.imageNoData} src={noData} alt=" " />
        </div>
      </div>
    );
  }
}
