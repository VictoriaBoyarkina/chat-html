const parser = new DOMParser();

export default function addUser(user, container) {
  const li = document.createElement("li");
  li.classList.add("chat__users-item");
  li.id = user.id;
  const svgDoc = parser.parseFromString(user.avatar, "text/xml");
  const svg = svgDoc.documentElement;
  svg.classList.add("chat__users-icon");
  const span = document.createElement("span");
  span.classList.add("chat__users-name");
  span.textContent = user.userName;
  li.appendChild(svg);
  li.appendChild(span);
  container.prepend(li);
}