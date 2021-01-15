(function () {
    const baseImg = document.querySelector(".base-image");
    const greyscaleImg = document.querySelector(".greyscale-image");
    const processedImg = document.querySelector(".processed-image");
    const baseImgCtx = baseImg.getContext('2d');
    const greyscaleImgCtx = greyscaleImg.getContext('2d');
    const processedImgCtx = processedImg.getContext('2d');
    const min = document.querySelector("#min");
    const max = document.querySelector("#max");
    var imgData;

    const image = new Image();
    image.src = "https://picsum.photos/800/450";
    image.crossOrigin = "Anonymous";
    image.onload = function () {
        baseImg.width = image.naturalWidth;
        processedImg.width = image.naturalWidth;
        baseImg.height = image.naturalHeight;
        processedImg.height = image.naturalHeight;
        greyscaleImg.width = image.naturalWidth;
        greyscaleImg.height = image.naturalHeight;
        baseImgCtx.drawImage(image, 0, 0);
        imgData = baseImgCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
        greyscaleImgCtx.putImageData(greyScale(imgData), 0, 0);
        processedImgCtx.putImageData(reduceColorLevels(greyScale(imgData), Number(min.value), Number(max.value)), 0, 0);
    }

    min.addEventListener("input", function () {
        processedImgCtx.putImageData(reduceColorLevels(greyScale(imgData), Number(min.value), Number(max.value)), 0, 0);
    });
    max.addEventListener("input", function () {
        processedImgCtx.putImageData(reduceColorLevels(greyScale(imgData), Number(min.value), Number(max.value)), 0, 0);
    });

    function reduceColorLevels(imgData, start, end) {
        const min = minColor(imgData);
        const max = maxColor(imgData);
        var reducedImg = new ImageData(
            new Uint8ClampedArray(imgData.data.reduce((acc, color, i) => {
                if ((i + 1) % 4 === 0) acc.push(color);
                else acc.push(Math.floor((end - start) * (color - min) / (max - min) + start))
                return acc;
            }, [])),
            image.naturalWidth, image.naturalHeight);
        return reducedImg;
    }

    function greyScale(imgData) {
        for (let i = 0; i <= imgData.data.length - 4; i = i + 4) {
            const r = imgData.data[i];
            const g = imgData.data[i + 1];
            const b = imgData.data[i + 2];
            const color = 0.3 * r + 0.59 * g + 0.11 * b;
            imgData.data[i + 0] = color;
            imgData.data[i + 1] = color;
            imgData.data[i + 2] = color;
        }
        return imgData;
    }

    function minColor(imgData) {
        return imgData.data.reduce((acc, next, i) => {
            if ((i + 1) % 4 === 0) return acc;
            else return acc < next ? acc : next;
        });
    }

    function maxColor(imgData) {
        return imgData.data.reduce((acc, next, i) => {
            if ((i + 1) % 4 === 0) return acc;
            else return acc > next ? acc : next;
        });
    }
})()