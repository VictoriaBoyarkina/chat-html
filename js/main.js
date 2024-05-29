import { io } from "socket.io-client";
import previewImage from "./functions/previewImage";
import compressAndConvertToBase64 from "./functions/toBase64";
import addUser from "./functions/addUser";
import addMessage from "./functions/addMessage";
import "hystModal-0.4/dist/hystmodal.min.css";
import getUserName from "./functions/getUserName.js";
import getAvatar from "./functions/getAvatar.js";
import uniqid from "uniqid";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "../pages/login.html";

//Create parser
const parser = new DOMParser();

// Current user
const user = localStorage.getItem("userId")
  ? JSON.parse(localStorage.getItem("userId"))
  : null;

console.log(user);
console.log(window.location.pathname);

// If a user logged in, redirect him to chat
if (user && window.location.pathname === "/login") {
  window.location.href = "/";
}

// Login button
const loginButton = document.getElementById("login");
if (loginButton) {
  loginButton.addEventListener("click", async () => {
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
    } catch (e) {
      if (e.message === "Network Error") {
        Toastify({
          text: "Проблемы с интернетом",
          className: "info",
          style: {
            background: "#E11616",
          },
        }).showToast();
      } else {
        Toastify({
          text: "Для вас не нашлось подходящего имени :(",
          className: "info",
          style: {
            background: "#E11616",
          },
        }).showToast();
      }
    }
  });
}

// If not logged in redirect to login page
if (!user && window.location.pathname === "/") {
  window.location.href = "/login";
} else {
  // Initialize ockets
  let socket = io("https://zuzex-server-a5gh.onrender.com");

  // Send user
  socket.emit("user joined", user);

  // Request messages
  socket.emit("get messages");

  // Users container
  const usersBox = document.getElementById("users-box");

  // Messages container
  const messagesBox = document.getElementById("messages-box");

  //Set name
  const userName = document.getElementById("userName");
  userName.textContent = user.userName;

  //Set avatar
  const svgDoc = parser.parseFromString(user.avatar, "text/xml");
  const svgElement = svgDoc.documentElement;
  svgElement.classList.add("navigation__user-icon");
  const avatarContainer = document.getElementById("avatar");
  avatarContainer.prepend(svgElement);

  // Listen to events
  socket.on("update users", (users) => {
    usersBox.innerHTML = "";
    // localStorage.setItem("users", JSON.stringify(users));
    const filtredUsers = users.filter((u) => u.id !== user.id);
    const usersStatus = document.querySelector(".chat__users-status");
    usersStatus.textContent = filtredUsers.length
      ? "Пользователи в сети"
      : "Кажется тут только вы";
    filtredUsers.forEach((user) => addUser(user, usersBox));
  });

  socket.on("all messages", async (messages) => {
    messagesBox.innerHTML = "";
    const messagePromises = messages.map((m) =>
      addMessage(m, user, messagesBox)
    );
    const messageElements = await Promise.all(messagePromises);
    messageElements.forEach((msgElement) => {
      messagesBox.appendChild(msgElement);
    });
    messagesBox.scrollTop = messagesBox.scrollHeight;
  });

  socket.on("chat message", async (message) => {
    const messageElement = await addMessage(message, user, messagesBox);
    messagesBox.appendChild(messageElement);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  });

  // Container for previewing image
  const previewContainer = document.querySelector(".chat__messages-container");

  // Choosing image
  const fileInput = document.getElementById("file-input");
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      compressAndConvertToBase64(file)
        .then(([fullBase64, base64String]) => {
          previewImage(previewContainer, fullBase64);
        })
        .catch((error) => {
          Toastify({
            text: "Не удалось загрузить изображение",
            className: "info",
            style: {
              background: "#E11616",
            },
          }).showToast();
          console.error("Error:", error);
        });
    }
  });

  //Messages input
  const messageInput = document.getElementById("messages-input");
  messageInput.focus();

  // Form
  const form = document.getElementById("messages-form");

  // Add listener
  form.addEventListener("submit", handleFormSubmit);

  // Form submission handler
  function handleFormSubmit(event) {
    event.preventDefault();
    const message = messageInput.value;
    const file = fileInput.files[0];
    if (!message && !file) {
      return;
    } else if (file) {
      compressAndConvertToBase64(file)
        .then(([fullBase64, base64String]) => {
          const msg = {
            text: message,
            img: base64String,
            id: uniqid(),
            userAvatar: user.avatar,
            userName: user.userName,
            userId: user.id,
            date: Date.now(),
          };
          socket.emit("chat message", msg);
          form.reset();
          messageInput.focus();
          const preview = document.querySelector(".preview-outer");
          preview.remove();
        })
        .catch((error) => {
          Toastify({
            text: "Не удалось загрузить изображение",
            className: "info",
            style: {
              background: "#E11616",
            },
          }).showToast();
          console.error("Error:", error);
        });
    } else {
      const msg = {
        text: message,
        img: "",
        id: uniqid(),
        userAvatar: user.avatar,
        userName: user.userName,
        userId: user.id,
        date: Date.now(),
      };
      socket.emit("chat message", msg);
      form.reset();
    }
  }

  //Logout button
  const logoutBtn = document.getElementById("logout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "/login";
    });
  }
}
