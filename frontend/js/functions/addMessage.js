import loadImage from "./loadImage";

const parser = new DOMParser();

export default async function addMessage(message, user, container) {
  return new Promise(async (resolve) => {
    // Check if it's a current user message
    const currentUserMessage = message.userId === user.id;

    const fetchImage = async (img) => {
      try {
        const loadedImage = await loadImage(img);
        return loadedImage;
      } catch (error) {
        addToast("Не удалось загрузить фотографию", "bg-danger text-white");
        console.error("Error loading image:", error);
      }
    };

    // Create a container for the message
    const msgContainer = document.createElement("div");
    msgContainer.classList.add("message-container");

    // Parse and append the user's avatar
    const svgDoc = parser.parseFromString(message.userAvatar, "text/xml");
    const svgElement = svgDoc.documentElement;
    svgElement.classList.add("message-user-icon");
    msgContainer.appendChild(svgElement);

    const div = document.createElement("div");
    div.classList.add("message-text-container");

    if (!currentUserMessage) {
      div.classList.add("message-background");

      const userName = document.createElement("p");
      userName.classList.add("message-user-name");
      if (!message.img) {
        userName.classList.add("message-user-pb");
      }
      userName.textContent = message.userName;
      div.appendChild(userName);
    }

    // If there is an image, fetch and append it
    if (message.img) {
      const img = await fetchImage(message.img);
      if (img) {
        img.classList.add("message-img");
        div.appendChild(img);
      }
    }

    // Append text content
    if (message.text) {
      const msgText = document.createElement("p");
      msgText.classList.add("message-text-img");
      msgText.textContent = message.text;
      div.appendChild(msgText);
    }

    // Append the text container to the main message container
    msgContainer.appendChild(div);

    // Resolve the promise after the message is fully constructed
    resolve(msgContainer);
  });
}
