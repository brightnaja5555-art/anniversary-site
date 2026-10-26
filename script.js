const CORRECT_PIN = "1234";

const catWalkFrames = ['cat-walk1.png', 'cat-walk2.png', 'cat-walk3.png', 'cat-walk4.png'];
const catStandFrames = ['cat-stand1.png', 'cat-stand2.png'];

let animInterval = null;
let currentFrameIndex = 0;

const dialogues = [
    "สวัสดีค้าบ! ยินดีต้อนรับเข้าสู่โลกของเรานะ 🐱✨",
    "เค้าเป็นไกด์ประจำตัวที่จะพาเธอไปย้อนดูความทรงจำหวานๆ ของเราสองคน 💕",
    "พร้อมที่จะออกเดินทางไปกับเค้าหรือยังเอ่ย? กดปุ่มนี้เพื่อไปกันเลย!"
];
let dialogueIndex = 0;

function checkPin() {
    const inputVal = document.getElementById("pin-input").value;
    const errorMsg = document.getElementById("error-msg");
    const pinScreen = document.getElementById("pin-screen");
    const mainContent = document.getElementById("main-content");
    const music = document.getElementById("bg-music");

    if (inputVal === CORRECT_PIN) {
        errorMsg.textContent = "";
        
        if (music) {
            music.currentTime = 0;
            music.volume = 0;
            music.play().then(() => {
                let currentVol = 0;
                const fadeAudio = setInterval(() => {
                    if (currentVol < 0.2) {
                        currentVol += 0.01;
                        music.volume = Math.min(currentVol, 0.2);
                    } else {
                        clearInterval(fadeAudio);
                    }
                }, 200);
            }).catch(err => console.log("Audio play error:", err));
        }

        pinScreen.classList.remove("active");
        pinScreen.classList.add("hidden");
        
        mainContent.classList.remove("hidden");
        mainContent.classList.add("active");
        
        startCatEntrance();
        
    } else {
        errorMsg.textContent = "❌ รหัสผ่านไม่ถูกต้อง ลองนึกดูดีๆ นะคะคนเก่ง";
        document.getElementById("pin-input").value = "";
        
        const card = document.querySelector(".card-box");
        card.style.transform = "translateX(10px)";
        setTimeout(() => card.style.transform = "translateX(-10px)", 100);
        setTimeout(() => card.style.transform = "translateX(0)", 200);
    }
}

document.getElementById("pin-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") checkPin();
});

function startWalkingAnimation() {
    clearInterval(animInterval);
    currentFrameIndex = 0;
    const catImg = document.getElementById("cat-avatar");
    
    animInterval = setInterval(() => {
        currentFrameIndex = (currentFrameIndex + 1) % catWalkFrames.length;
        catImg.src = catWalkFrames[currentFrameIndex];
    }, 150);
}

function startStandingAnimation() {
    clearInterval(animInterval);
    currentFrameIndex = 0;
    const catImg = document.getElementById("cat-avatar");
    
    animInterval = setInterval(() => {
        currentFrameIndex = (currentFrameIndex + 1) % catStandFrames.length;
        catImg.src = catStandFrames[currentFrameIndex];
    }, 500);
}

// ------------------- โฟลว์การเดินจากขวาสุดเข้ามาตรงกลาง -------------------
function startCatEntrance() {
    const catWrapper = document.querySelector(".cat-wrapper");
    const speechBubble = document.getElementById("speech-bubble");
    
    // 1. เริ่มเล่นท่าเดิน
    startWalkingAnimation();

    // 2. ขยับน้องแมวจากนอกจอด้านขวา เข้ามาอยู่ตรงกลาง (ใช้ transform: translate)
    setTimeout(() => {
        catWrapper.style.transform = "translateX(-50%)";
    }, 100);

    // 3. เมื่อเดินถึงตรงกลาง (ครบ 4 วินาที) -> หยุดเดิน เปลี่ยนเป็นยืนสลับหาง แล้วแสดงกล่องคำพูด
    setTimeout(() => {
        startStandingAnimation();
        speechBubble.classList.remove("hidden");
        showDialogue(dialogues[0]);
    }, 4100);
}

function showDialogue(text) {
    const catText = document.getElementById("cat-text");
    catText.textContent = text;
}

function nextDialogue() {
    dialogueIndex++;
    if (dialogueIndex < dialogues.length) {
        showDialogue(dialogues[dialogueIndex]);
    } else {
        document.getElementById("cat-text").textContent = "เย้! งั้นเราไปลุยหน้าถัดไปกันเลยค้าบ 🚀💖";
        
        const nextBtn = document.getElementById("next-btn");
        nextBtn.textContent = "เดินทางต่อสำเร็จ! ✨";
        nextBtn.disabled = true;
        nextBtn.style.opacity = "0.6";
    }
}