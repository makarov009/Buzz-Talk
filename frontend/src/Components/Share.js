import React, { useState, useEffect } from "react";
import classes from "../Styles/share.module.css";
import { PermMedia } from "@material-ui/icons";
import axios from "axios";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import "../Styles/editor.scss";
import { useNavigate } from "react-router-dom";

// import config from "../config";

export default function Share() {
  const [postDet, setPostDet] = useState("");
  const [image, setImage] = useState({
    file: [],
  });
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: `What's on your mind...`,
      }),
    ],

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // console.log(html);
      setPostDet(html);
    },
  });

  useEffect(() => {
    getImages();
  }, []);

  const configure = {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: localStorage.getItem("accessToken"),
    },
  };

  const getImages = () => {
    axios
      .get("http://localhost:3003/auth/getImages", configure)
      .then((response) => {
        if (response.data[0].profileImgId !== "null") {
          setProfileImage(response.data[0].profileImgId);
        } else {
          setProfileImage("avatar.png");
        }
      });
  };

  const handleInputChange = (event) => {
    console.log("image changing");
    setImage({
      ...image,
      file: event.target.files[0],
    });
  };

  const CreatePost = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image.file);
    formData.append("postDet", postDet);
    console.log(formData);
    axios
      .post("http://localhost:3003/auth/createPost", formData, configure)
      .then((response) => {
        console.log(response);
      });
    window.location.reload(false);
  };

  return (
    <div className={classes.share}>
      <div className={classes.shareTop}>
        <img
          className={classes.shareProfileImg}
          src={`http://localhost:3003/auth/images/${profileImage}`}
          alt=""
        />

        <div className={classes.textEditor}>
          <EditorContent editor={editor} />
        </div>
      </div>
      <hr className={classes.shareHr} />
      <div className={classes.shareBottom}>
        <div className={classes.shareOptions}>
          <div className={classes.shareOption}>
            <PermMedia className={classes.shareIcon} />
            <label htmlFor="file">ADD PHOTO</label>
            <input
              type="file"
              id="file"
              name="file"
              accepts="image/*"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button className={classes.shareButton} onClick={CreatePost}>
          Post
        </button>
      </div>
    </div>
  );
}
