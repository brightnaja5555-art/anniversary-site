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
            nextBtn.onclick = goToGiftScreen;
        }
    }
}

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
    if (boxBubble) boxBubble.classList.remove("hidden");
    if (nextBtn) {
        nextBtn.classList.add("hidden");
        nextBtn.classList.remove("show");
    }

    if (boxText) boxText.textContent = "🎉 Happy Anniversary นะครับ! ❤️";
    
    setTimeout(() => {
        if (boxText) {
            boxText.textContent = "ขอบคุณที่คอยอยู่ข้างๆ และสร้างรอยยิ้มให้กันมาตลอดนะ ดีใจมากๆ เลยที่มีเธออยู่ในทุกๆ วัน ✨";
        }
        
        setTimeout(() => {
            if (nextBtn) {
                nextBtn.classList.remove("hidden");
                setTimeout(() => {
                    nextBtn.classList.add("show");
                }, 50);
            }
        }, 5000);

    }, 5000);
}

// ================= Step 4 Logic: หรี่เพลงเก่า และสลับไปหน้าเพลงพิเศษ =================
function goToMusicScreen() {
    const bgMusic = document.getElementById("bg-music");
    const giftScreen = document.getElementById("gift-screen");
    const musicScreen = document.getElementById("music-screen");

    if (bgMusic) {
        let vol = bgMusic.volume;
        const fadeOut = setInterval(() => {
            if (vol > 0.03) {
                vol -= 0.03;
                bgMusic.volume = vol;
            } else {
                bgMusic.pause();
                bgMusic.currentTime = 0;
                clearInterval(fadeOut);
            }
        }, 100);
    }

    if (giftScreen) {
        giftScreen.classList.remove("active");
        giftScreen.classList.add("hidden");
    }
    if (musicScreen) {
        musicScreen.classList.remove("hidden");
        musicScreen.classList.add("active");
        startMusicCatAnimation();
    }
}

function startMusicCatAnimation() {
    const musicCatImg = document.getElementById("music-cat-img");
    let frameIdx = 0;
    setInterval(() => {
        frameIdx = (frameIdx + 1) % catWalkFrames.length;
        if (musicCatImg) {
            musicCatImg.src = catWalkFrames[frameIdx];
        }
    }, 250);
}

// ================= Step 5 Logic: กด "ฟังสิ" -> แมวเดินซ้ายออกจอ -> โผล่มาหน้า 4 ไอคอน =================
function startSpecialMusic() {
    const specialMusic = document.getElementById("special-music");
    const musicContentBox = document.querySelector(".music-content-box");
    const musicCatImg = document.getElementById("music-cat-img");

    if (specialMusic) {
        specialMusic.volume = 0.25;
        specialMusic.play().catch(err => console.log("Special music play error:", err));
    }

    // 1. ให้น้องแมวหันซ้าย/เดินออกไปทางซ้ายจนพ้นจอ
    if (musicContentBox) {
        // เปลี่ยนเป็นแอนิเมชันเดิน
        let walkIdx = 0;
        const walkInterval = setInterval(() => {
            walkIdx = (walkIdx + 1) % catWalkFrames.length;
            if (musicCatImg) musicCatImg.src = catWalkFrames[walkIdx];
        }, 150);

        // สั่งให้กล่องข้อความและตัวแมวสไลด์ออกซ้ายจนพ้นจอ
        musicContentBox.style.transition = "transform 1.5s ease-in";
        musicContentBox.style.transform = "translateX(-120vw)";

        // 2. หลังจากแมวเดินพ้นจอแล้ว ให้เปลี่ยนฉากไปหน้า 4 ไอคอน
        setTimeout(() => {
            clearInterval(walkInterval);
            const musicScreen = document.getElementById("music-screen");
            const hubScreen = document.getElementById("hub-screen");

            if (musicScreen) {
                musicScreen.classList.remove("active");
                musicScreen.classList.add("hidden");
            }
            if (hubScreen) {
                hubScreen.classList.remove("hidden");
                hubScreen.classList.add("active");
                startHubCatAnimation(); // เริ่มสบัดหางที่หน้าหลัก
            }
        }, 1500);
    }
}

// ฟังก์ชันให้น้องแมวที่หน้าหลักสบัดหางวนลูป
function startHubCatAnimation() {
    const hubCatImg = document.getElementById("hub-cat-img");
    let frameIdx = 0;
    setInterval(() => {
        frameIdx = (frameIdx + 1) % catStandFrames.length;
        if (hubCatImg) {
            hubCatImg.src = catStandFrames[frameIdx];
        }
    }, 400);
}

// ฟังก์ชันชั่วคราวสำหรับกดไอคอนเกมปริศนา (เดี๋ยวเรามาทำรายละเอียดเกมกันต่อในสเตปถัดไป!)
function openGameModal() {
    alert("เย้! กำลังจะเปิดหน้า 'เกมทายใจ' ค้าบไบร์ท!");
}

function openPhotosModal() {
    alert("เปิดหน้าภาพความทรงจำ");
}

function openTimeModal() {
    alert("เปิดหน้าเช็คเวลาของเรา");
}

function openLetterModal() {
    alert("เปิดหน้าความในใจ");
}

function openGachaModal() {
    alert("🎁 กล่องสุ่มรางวัล: ต้องเล่นเกมตอบคำถามให้ถูกหมดทุกข้อก่อนนะถึงจะเปิดได้!");
}

function openTrollModal() {
    alert("😈 แบร่! ตั้งใจเข้ามาอ่านเหรอ ไม่มีอะไรหรอก แค่จะหลอกเฉยๆ 555");
}