// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, onValue, push, remove } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvR0Pt7JGNF4vwfL5-Ct7mrJ9_nmSecrU",
    authDomain: "alii-9e98c.firebaseapp.com",
    databaseURL: "https://alii-9e98c.firebaseio.com",
    projectId: "alii-9e98c",
    storageBucket: "alii-9e98c.appspot.com",
    messagingSenderId: "778393545229",
    appId: "1:778393545229:web:28ec268faac59656008344",
    measurementId: "G-T7LNCR6WQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
    loadPhotos();
});

function loadActivities() {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    const activitiesRef = ref(db, 'activities');
    onValue(activitiesRef, (snapshot) => {
        activityList.innerHTML = ''; // Clear the list before updating
        snapshot.forEach((childSnapshot) => {
            const activity = childSnapshot.val();
            const listItem = document.createElement('li');
            listItem.innerHTML = `${activity} <button onclick="removeActivity('${childSnapshot.key}', this)">Eliminar</button>`;
            activityList.appendChild(listItem);
        });
    });
}

function addActivity() {
    const newActivity = document.getElementById('new-activity').value;
    if (newActivity) {
        const activitiesRef = ref(db, 'activities');
        push(activitiesRef, newActivity);
        document.getElementById('new-activity').value = '';
    }
}

function removeActivity(id, button) {
    const activityRef = ref(db, 'activities/' + id);
    remove(activityRef);
    button.parentElement.remove();
}

function loadPhotos() {
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.innerHTML = '';

    const photosRef = ref(db, 'photos');
    onValue(photosRef, (snapshot) => {
        carouselInner.innerHTML = ''; // Clear the carousel before updating
        snapshot.forEach((childSnapshot) => {
            const photo = childSnapshot.val().url;
            const imageElement = document.createElement('img');
            imageElement.src = photo;
            imageElement.classList.add('carousel-image');
            carouselInner.appendChild(imageElement);
        });

        // Restart carousel after loading photos
        startCarousel();
    });
}

function uploadPhoto() {
    const photoUpload = document.getElementById('photo-upload');
    const file = photoUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const photosRef = ref(db, 'photos');
            push(photosRef, { url: reader.result });
        };
        reader.readAsDataURL(file);
    }
}

function startCarousel() {
    let currentImageIndex = 0;
    const images = document.querySelectorAll('.carousel-image');
    const carouselInner = document.querySelector('.carousel-inner');
    const totalImages = images.length;

    function updateCarousel() {
        const offset = -currentImageIndex * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
    }

    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateCarousel();
    }, 3000);

    updateCarousel();
}
