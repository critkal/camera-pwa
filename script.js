const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const save = document.getElementById('save');
const upload = document.getElementById('upload');

// Get access to the camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing camera: ", err);
    }
}

startCamera();

// Take a photo
snap.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    save.style.display = 'block';
});

upload.addEventListener('change', (event) => {
    const filePicker = document.querySelector('input');
    if (!filePicker || !filePicker.files 
        || filePicker.files.length <= 0) {
        reject('No file selected.');
        return;
    }
    const myFile = filePicker.files[0];
    console.log(myFile);
})

// Save the photo
save.addEventListener('click', async () => {
    const dataUrl = canvas.toDataURL('image/png');
    const blob = await (await fetch(dataUrl)).blob();
    const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'photo.png',
        types: [{
            description: 'PNG Image',
            accept: { 'image/png': ['.png'] },
        }],
    });
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
    alert('Photo saved successfully!');
});


// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
