import getUserName from "./functions/getUserName.js";
import getAvatar from "./functions/getAvatar.js";
import uniqid from "uniqid";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

// Create socket

// Current user
const user = localStorage.getItem("userId")
  ? JSON.parse(localStorage.getItem("userId"))
  : null;

// If a user logged in, redirect him to chat
if (user) {
  window.location.href = "/";
}

// Loading state
let loading = false;

// Login button
const button = document.getElementById("login");
button.addEventListener("click", async () => {
  loading = true;
  try {
    const userName = await getUserName();
    const avatar = await getAvatar(userName);
    const user = {
      userName,
      avatar,
      id: uniqid(),
    };
    localStorage.setItem("userId", JSON.stringify(user));
    window.location.href = "/";
    loading = false;
  } catch (e) {
    if (e.message === "Network Error") {
      Toastify({
        text: "Проблемы с интернетом",
        className: "info",
        style: {
          background: "#E11616",
        }
      }).showToast();
    } else {
      Toastify({
        text: "Для вас не нашлось подходящего имени :(",
        className: "info",
        style: {
          background: "#E11616",
        }
      }).showToast();
    }
    
    loading = false;
  }
});
