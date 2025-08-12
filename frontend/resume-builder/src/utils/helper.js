import moment from 'moment';
import html2canvas from 'html2canvas';

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

export const fixTailwindColors = (element) => {
  const elements = element.querySelectorAll('*');

  elements.forEach((el) => {
    const style = window.getComputedStyle(el);

    ["color", "background-color", "border-color"].forEach((prop) => {
      const value = style[prop];
      if(value.includes("oklch")){
        el.style[prop] = "#000"
      }
    });
  });
};

//convert component to image
export async function captureElementAsImage(element, options = {}) {
  if (!element) throw new Error("No Element provided");

  const canvas = await html2canvas(element, {
    backgroundColor: null,     // keep transparent if designing PDF later
    useCORS: true,             // allow cross-origin images when possible
    logging: false,            // suppress html2canvas internal logs (removes noise)
    scale: Math.min(2, window.devicePixelRatio || 1.5), // cap scale for perf
    ...options
  });

  return canvas.toDataURL("image/png");
}

export const dataURLtoFile = (dataURL, filename) => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
};
