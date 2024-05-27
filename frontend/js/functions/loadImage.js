export default function loadImage(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${base64}`;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};
