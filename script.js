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
    
    if (catImg) {
        animInterval = setInterval(() => {
            currentFrameIndex = (currentFrameIndex + 1) % catWalkFrames.length;
            catImg.src = catWalkFrames[currentFrameIndex];
        }, 150);
    }
}

function startStandingAnimation() {
    clearInterval(animInterval);
    currentFrameIndex = 0;
    const catImg = document.getElementById("cat-avatar");
    
    if (catImg) {
        animInterval = setInterval(() => {
            currentFrameIndex = (currentFrameIndex + 1) % catStandFrames.length;
            catImg.src = catStandFrames[currentFrameIndex];
        }, 500);
    }
}

// โฟลว์การเดินเข้าฉากตอนใส่พินถูก
function startCatEntrance() {
    const catWrapper = document.querySelector(".cat-wrapper");
    const speechBubble = document.getElementById("speech-bubble");
    
    startWalkingAnimation();

    setTimeout(() => {
        if (catWrapper) catWrapper.style.transform = "translateX(-50%)";
    }, 100);

    setTimeout(() => {
        startStandingAnimation();
        if (speechBubble) speechBubble.classList.remove("hidden");
        showDialogue(dialogues[0]);
    }, 4100);
}

function showDialogue(text) {
    const catText = document.getElementById("cat-text");
    if (catText) catText.textContent = text;
}

// ควบคุมบทสนทนาหน้าแรก
function nextDialogue() {
    dialogueIndex++;
    if (dialogueIndex < dialogues.length) {
        showDialogue(dialogues[dialogueIndex]);
    } else {
        const catTextElem = document.getElementById("cat-text");
        if (catTextElem) catTextElem.textContent = "เย้! งั้นเราไปดูของเซอร์ไพรส์กันเลยค้าบ 🎁✨";
        
        const nextBtn = document.getElementById("next-btn");
        if (nextBtn) {
            nextBtn.textContent = "ไปเปิดกล่องของขวัญกัน! ✨";
            nextBtn.disabled = false;
            nextBtn.onclick = goToGiftScreen; // กดแล้วตัดเข้าหน้ากล่องของขวัญทันที
        }
    }
}

// สลับมาหน้ากล่องของขวัญทันที (วาปมา)
function goToGiftScreen() {
    const mainContent = document.getElementById("main-content");
    const giftScreen = document.getElementById("gift-screen");

    if (mainContent) {
        mainContent.classList.remove("active");
        mainContent.classList.add("hidden");
    }
    if (giftScreen) {
        giftScreen.classList.remove("hidden");
        giftScreen.classList.add("active");
    }
}

// เมื่อคลิกเปิดกล่องของขวัญ
function openGift() {
    const giftImg = document.getElementById("gift-img");
    const giftBox = document.getElementById("gift-box");
    const giftWrapper = document.querySelector(".gift-wrapper");
    const catBubble = document.getElementById("cat-speech-bubble");
    const boxBubble = document.getElementById("box-speech-bubble");
    const boxText = document.getElementById("box-cat-text");
    const nextBtn = document.getElementById("gift-next-btn");

    if (giftImg) giftImg.src = "gift-opened.png";
    if (giftBox) {
        giftBox.classList.add("opened");
        giftBox.onclick = null;
    }

    if (catBubble) catBubble.classList.add("hidden");
    if (giftWrapper) giftWrapper.classList.add("zoom-in");
    
    // แสดงกล่องข้อความ และมั่นใจว่าปุ่มซ่อนอยู่
    if (boxBubble) boxBubble.classList.remove("hidden");
    if (nextBtn) {
        nextBtn.classList.add("hidden");
        nextBtn.classList.remove("show");
    }

    // 1. แสดงข้อความชุดแรก
    if (boxText) boxText.textContent = "🎉 Happy Anniversary นะครับ! ❤️";
    
    // 2. หลังจากผ่านไป 5 วินาที เปลี่ยนเป็นข้อความชุดสุดท้าย
    setTimeout(() => {
        if (boxText) {
            boxText.textContent = "ขอบคุณที่คอยอยู่ข้างๆ และสร้างรอยยิ้มให้กันมาตลอดนะ ดีใจมากๆ เลยที่มีเธออยู่ในทุกๆ วัน ✨";
        }
        
        // 3. รอต่ออีก 5 วินาทีหลังจากข้อความชุดสุดท้ายจบ ค่อยๆ เฟดปุ่มให้โผล่ขึ้นมา
        setTimeout(() => {
            if (nextBtn) {
                nextBtn.classList.remove("hidden"); // เอา display: none ออกก่อน
                setTimeout(() => {
                    nextBtn.classList.add("show");  // ค่อยๆ เฟดโผล่ขึ้นมา
                }, 50);
            }
        }, 5000);

    }, 5000);
}

// ฟังก์ชันกดไปหน้าถัดไป (แกลเลอรีรูปภาพ)
function goToNextStep() {
    alert("ยอดเยี่ยมครับไบร์ท! เดี๋ยวเราจะพาไปทำสเตปแกลเลอรีรูปภาพต่อในขั้นตอนถัดไปนะ 🚀");
}