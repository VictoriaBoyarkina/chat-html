export default function previewImage(container, previewImage) {
  const outerDiv = document.createElement("div");
  outerDiv.classList.add("preview-outer");
  const innerDiv = document.createElement("div");
  innerDiv.classList.add("preview-inner");
  const closeButton = document.createElement("button");
  closeButton.addEventListener("click", () => {
    const preview = document.querySelector(".preview-outer");
    preview.remove();
  });
  const closeIcon = document.createElement("img");
  closeIcon.classList.add("preview-close");
  closeIcon.src = "../assets/img/cross-icon.svg";
  closeButton.appendChild(closeIcon);
  const previewImageEl = document.createElement("img");
  previewImageEl.classList.add("preview-image");
  previewImageEl.src = previewImage;
  innerDiv.appendChild(closeButton);
  innerDiv.appendChild(previewImageEl);
  outerDiv.appendChild(innerDiv);
  container.appendChild(outerDiv);
}
