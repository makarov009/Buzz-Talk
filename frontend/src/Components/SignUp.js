import React from "react";
import Illustration from "./Illustration";
import classes from "../Styles/signup.module.css";
import SignUpForm from "./SignUpForm";

export default function SignUp() {
  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <div className={classes.cont}>
          <div className={classes.left}>
            <h1>Create an account</h1>
            <Illustration />
          </div>
          <div className={classes.right}>
            <SignUpForm />
          </div>
        </div>
      </div>
    </main>
  );
}
