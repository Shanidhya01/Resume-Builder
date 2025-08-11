import moment from 'moment';

export const validEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  return regex.test(email);
};

export const getLightColorFromImage = (imgUrl) => {
  return new Promise((resolve, reject) => {
    if(!imgUrl || typeof imgUrl !== 'string') {
      return reject(new Error("Invalid image URL"));
    }

    const img = new Image();

    if(!imgUrl.startsWith('data')){
      img.crossOrigin = "Anonymous";      
    }
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      
      let r = 0, g = 0, b = 0, count = 0;
      for(let i = 0; i < imageData.length; i += 4) {
        const red = imageData[i];
        const green = imageData[i + 1];
        const blue = imageData[i + 2];
        const brightness = (red + green + blue) / 3;

        //Only  count light pixels
        if (brightness > 180) {
          r += red;
          g += green;
          b += blue;
          count++;
        }
      }
      if(count == 0){
        resolve("#ffffff")
      }else{
        r= Math.floor(r / count);
        g= Math.floor(g / count);
        b= Math.floor(b / count);
        resolve(`rgb(${r}, ${g}, ${b})`);
      }
    };
    img.onerror = () => {
      console.error("Image loading error");
      reject(new Error("Failed to load image"));
    };
  });
};

export function formatYearMonth(yearMonth){
  return yearMonth ? moment(yearMonth, "YYYY-MM").format("MMM YYYY") : "";
}