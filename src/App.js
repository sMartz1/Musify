import React, { useState } from "react";
import firebase from "./utils/firebase";
import { ToastContainer } from "react-toastify";
import "firebase/auth";
import Auth from "./pages/Auth";
import LoggedLayout from "./Layouts/LoggedLayout";

require("dotenv").config();
function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadApp, setReloadApp] = useState(false);
  firebase.auth().onAuthStateChanged((currentUser) => {
    if (!currentUser?.emailVerified) {
      firebase.auth().signOut();
      setUser(null);
    } else {
      setUser(currentUser);
    }
    setIsLoading(false);
    if (isLoading) {
      return null;
    }
  });

  return (
    <>
      {!user ? (
        <Auth />
      ) : (
        <LoggedLayout setReloadApp={setReloadApp} user={user} />
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisiblityChange
        draggable
        pauseOnHover={false}
      />
    </>
  );
}

export default App;
