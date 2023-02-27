let video = document.getElementById("video");
let canvas = document.body.appendChild(document.createElement("canvas"));
let ctx = canvas.getContext("2d");
let displaySize;

let width = 1280;
let height = 720;

const startSteam = () => {
    console.log("----- START STEAM ------");
    navigator.mediaDevices.getUserMedia({
        video: {width, height},
        audio : false
    }).then((steam) => {video.srcObject = steam});
}

console.log(faceapi.nets);

console.log("----- START LOAD MODEL ------");
Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startSteam);


async function detect() {
    const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceExpressions();
    console.log(detections);
    
    ctx.clearRect(0,0, width, height);
    
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    //mengambil data consoleLog lalu menampilkannya
    //jiga ingin mengambil yang lebih spesifik menggunakan tanda hubung titik contoh expressions.angry dibagian p.innerText = JSON.stringify();
    const consoleLog = document.getElementById("console-log");
    consoleLog.innerHTML = "";
    
    const {expressions} = resizedDetections;
    const p = document.createElement("p");
    p.innerText = JSON.stringify(expressions);
    consoleLog.appendChild(p);

    //menampilkan nilai angry, disgusted, fearful, happy, neutral, sad, surprised
    const angryProbability = parseInt((expressions.angry * 100).toFixed(0), 10);
    console.log('angry: ' + angryProbability);
    
    const disgustedProbability = parseInt((expressions.disgusted * 100).toFixed(0), 10);
    console.log('disgusted: ' + disgustedProbability);
    
    const fearfulProbability = parseInt((expressions.fearful * 100).toFixed(0), 10);
    console.log('fearful: ' + fearfulProbability);
    
    const happyProbability = parseInt((expressions.happy * 100).toFixed(0), 10);
    console.log('happy: ' + happyProbability);
    
    const neutralProbability = parseInt((expressions.neutral * 100).toFixed(0), 10);
    console.log('neutral: ' + neutralProbability);
    
    const sadProbability = parseInt((expressions.sad * 100).toFixed(0), 10);
    console.log('sad: ' + sadProbability);
    
    const surprisedProbability = parseInt((expressions.surprised * 100).toFixed(0), 10);
    console.log('surprised: ' + surprisedProbability);
}

video.addEventListener('play', ()=> {
    displaySize = {width, height};
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(detect, 70);
});