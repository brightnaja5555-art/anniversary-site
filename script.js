// รายการไฟล์ทั้งหมดที่ต้องการให้โหลดล่วงหน้า 100% ก่อนเปิดหน้าเว็บ
const assetsToPreload = [
    // รูปแอนิเมชันน้องแมว
    'cat-walk1.png', 'cat-walk2.png', 'cat-walk3.png', 'cat-walk4.png',
    'cat-stand1.png', 'cat-stand2.png',
    // รูปไอคอน & ของขวัญ
    'gift-closed.png', 'gift-opened.png',
    'game-icon.png', 'photo-icon.png', 'time-icon.png', 'letter-icon.png', 'gacha-icon.png', 'troll-icon.png',
    // รูปภาพแกลเลอรีความทรงจำทั้ง 8 รูป
    'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg',
    'photo5.jpg', 'photo6.jpg', 'photo7.jpg', 'photo8.jpg',
    // ไฟล์เสียง
    'click-sfx.mp3', 'gift-sfx.mp3', 'song.mp3', 'special-song.mp3'
];

let loadedAssetsCount = 0;

// แอนิเมชันน้องแมวเดินขณะรอโหลด
function startLoadingCatAnim() {
    const loadingCatImg = document.getElementById("loading-cat-img");
    let frameIdx = 0;
    return setInterval(() => {
        frameIdx = (frameIdx + 1) % catWalkFrames.length;
        if (loadingCatImg) loadingCatImg.src = catWalkFrames[frameIdx];
    }, 180);
}

// ฟังก์ชันเริ่มพรีโหลดไฟล์ทั้งหมด
function initPreloader() {
    const animTimer = startLoadingCatAnim();
    const progressBar = document.getElementById("progress-bar");
    const percentText = document.getElementById("loading-percent-text");
    const totalAssets = assetsToPreload.length;

    function updateProgress() {
        loadedAssetsCount++;
        const percent = Math.floor((loadedAssetsCount / totalAssets) * 100);
        
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (percentText) percentText.textContent = `${percent}%`;

        if (loadedAssetsCount >= totalAssets) {
            setTimeout(() => {
                clearInterval(animTimer);
                finishLoading();
            }, 500);
        }
    }

    assetsToPreload.forEach(assetUrl => {
        if (assetUrl.endsWith('.mp3')) {
            const audio = new Audio();
            audio.src = assetUrl;
            audio.oncanplaythrough = updateProgress;
            audio.onerror = updateProgress; // ข้ามกรณีไฟล์เสียงหาไม่เจอ
        } else {
            const img = new Image();
            img.src = assetUrl;
            img.onload = updateProgress;
            img.onerror = updateProgress; // ข้ามกรณีรูปหาไม่เจอ
        }
    });
}

// เมื่อโหลดครบ 100% สลับไปหน้าใส่ PIN
function finishLoading() {
    const loadingScreen = document.getElementById("loading-screen");
    const pinScreen = document.getElementById("pin-screen");

    if (loadingScreen) {
        loadingScreen.style.transition = "opacity 0.6s ease";
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
            loadingScreen.classList.remove("active");
            loadingScreen.classList.add("hidden");
            
            if (pinScreen) {
                pinScreen.classList.remove("hidden");
                pinScreen.classList.add("active");
            }
        }, 600);
    }
}

// เรียกทำงานพรีโหลดทันทีที่เปิดหน้าเว็บ
window.addEventListener("DOMContentLoaded", initPreloader);

const CORRECT_PIN = "2109";

const catWalkFrames = ['cat-walk1.png', 'cat-walk2.png', 'cat-walk3.png', 'cat-walk4.png'];
const catStandFrames = ['cat-stand1.png', 'cat-stand2.png'];

let animInterval = null;
let currentFrameIndex = 0;

const dialogues = [
    "สวัสดีค้าบพี่ปันๆสินะ🐱✨",
    "เค้าจะเป็นไกด์ประจำตัวที่จะพาเธอไปชมเว็บของเราสองคน💕",
    "พร้อมที่จะออกเดินทางไปกับเค้าหรือยังเอ่ย? เค้ามีอะไรจะให้ด้วยแหล่ะ"
];
let dialogueIndex = 0;

// ================= ระบบสะสมคูปองและกระเป๋าคูปอง =================
let userTickets = 0; // จำนวนคูปองสุ่มสะสม
let inventory = {};   // รายการบัตรที่สุ่มได้ { "บัตรเลี้ยงน้ำ 1 วัน": 1, ... }

const rewardList = [
    { name: "บัตรเลี้ยงน้ำ 1 วัน", icon: "🥤", angle: 30 },
    { name: "บัตรเลี้ยงข้าว 1 วัน", icon: "🍲", angle: 90 },
    { name: "บัตรทำตามคำสั่ง 1 สิทธิ์", icon: "👑", angle: 150 },
    { name: "บัตรตามใจ 1 วัน", icon: "💖", angle: 210 },
    { name: "บัตรห้ามดื้อ 1 วัน", icon: "😇", angle: 270 },
    { name: "บัตรห้ามเหม่อ 1 วัน", icon: "😳", angle: 330 }
];

function updateTicketDisplay() {
    const hubCount = document.getElementById("hub-ticket-count");
    const gachaCount = document.getElementById("gacha-ticket-count");
    
    if (hubCount) hubCount.textContent = userTickets;
    if (gachaCount) gachaCount.textContent = userTickets;

    // อัปเดตจำนวนในกระเป๋า
    let totalCards = 0;
    for (let key in inventory) {
        totalCards += inventory[key];
    }
    const invCount = document.getElementById("inv-count");
    if (invCount) invCount.textContent = totalCards;
}

// ================= Step 1: PIN Check =================
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
        errorMsg.textContent = "❌ รหัสผ่านไม่ถูกต้อง ลองนึกดูดีๆหนา";
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

// ================= Step 2: Animation & Dialogue =================
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
        if (catTextElem) catTextElem.textContent = "งั้นเราไปดูของเซอร์ไพรส์กันเลยค้าบ🎁✨";
        
        const nextBtn = document.getElementById("next-btn");
        if (nextBtn) {
            nextBtn.textContent = "ไปดูกันน!✨";
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
    playGiftSound(); // เล่นเสียงพิเศษตอนเปิดกล่องตรงนี้!
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

    if (boxText) boxText.textContent = "🎉Happy Anniversary นะคับ🎉";
    
    setTimeout(() => {
        if (boxText) {
            boxText.textContent = "ครบรอบ 1 เดือนแล้วว ขอบคุณพี่ปันๆที่คอยอยู่ข้างไบร์ทตลอด ไบร์ทมีความสุขมากกๆ ต่อจากนี้ไม่ว่าจะเกิดอะไรขึ้นขอให้พวกเรายังเดินไปด้วยกันต่อไปนะ รักแฟนค้าบ  ✨";
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

// ================= Step 4: Music Transition =================
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

// ================= Step 5: Hub Screen =================
function startSpecialMusic() {
    const specialMusic = document.getElementById("special-music");
    const musicContentBox = document.querySelector(".music-content-box");
    const musicCatImg = document.getElementById("music-cat-img");

    if (specialMusic) {
        specialMusic.volume = 0.25;
        specialMusic.play().catch(err => console.log("Special music play error:", err));
    }

    if (musicContentBox) {
        let walkIdx = 0;
        const walkInterval = setInterval(() => {
            walkIdx = (walkIdx + 1) % catWalkFrames.length;
            if (musicCatImg) musicCatImg.src = catWalkFrames[walkIdx];
        }, 150);

        musicContentBox.style.transition = "transform 1.5s ease-in";
        musicContentBox.style.transform = "translateX(-120vw)";

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
                startHubCatAnimation();
                updateTicketDisplay();
            }
        }, 1500);
    }
}

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

function backToHub() {
    const screens = document.querySelectorAll(".screen");
    screens.forEach(s => {
        s.classList.remove("active", "game-fade-in");
        s.classList.add("hidden");
    });

    const hubScreen = document.getElementById("hub-screen");
    if (hubScreen) {
        hubScreen.classList.remove("hidden");
        hubScreen.classList.add("active");
        updateTicketDisplay();
    }
}

// ================= Step 6: Quiz Game Logic =================
const questionBank = [
    { q: "วันเกิดไบร์ทวันที่เท่าไหร่กันนะ", options: ["20", "21", "24", "27"], correct: 1 },
    { q: "ข้อความแรกที่พี่ปันๆทักไบร์ทคือ", options: ["หมายถึงแสงเชิงรังสีรึเปล่าคะถ้าปีพี่ไม่มีน้า", "หมายถึงเสียงรึเปล่าคะถ้าปีพี่ไม่มีน้า", "หมายถึงแสงเชิงคลื่นรึเปล่าคะถ้าปีพี่ไม่มีน้า", "หมายถึงแสงรึเปล่าคะถ้าปีพี่ไม่มีน้า"], correct: 2 },
    { q: "ถ้าไบร์ทได้กินข้าวที่โรงอาหารของโรงเรียนไบร์ทชอบสั่ง", options: ["กระเพราหมูสับไข่ดาว", "กระเพราหมูอ้วน", "กระเพราหมูสับไข่ดาวและไข่พะโล้", "ก๋วยเตี๋ยวชากังราว"], correct: 2 },
    { q: "อาหารที่พี่ปันๆป้อนไบร์ทครั้งแรกคือ", options: ["ไส้กรอกชิ้น", "ซูชิ", "เฟรนช์ฟรายส์", "ลาบ"], correct: 2 },
    { q: "วันที่พวกเราได้กินข้าวด้วยกันครั้งแรกคือวันที่", options: ["10", "14", "21", "27"], correct: 1 },
    { q: "พี่ปันๆทักไบร์ทครั้งแรกวันที่เท่าไหร่", options: ["29", "30", "31", "67"], correct: 2 },
    { q: "ไบร์ทเกลียดวิชาอะไรมากที่สุด", options: ["ชีวะ", "คณิต", "ฟิสิกส์", "ดาราศาสตร์"], correct: 0 },
    { q: "หมาเก่าของไบร์ทชื่อ", options: ["แพนเค้ก", "ทูน่า", "ดำ", "ซูชิ"], correct: 3 },
    { q: "ไบร์ทเป็นภูมิแพ้อะไร", options: ["ภูมิแพ้ทั่วไป", "ภูมิแพ้อากาศ", "ภูมิแพ้หมู", "ภูมิแพ้เธอ"], correct: 1 },
    { q: "ไบร์ทชอบสีอะไรมากที่สุด", options: ["สีแดง", "สีฟ้า", "สีรุ้ง", "สีชมพู"], correct: 1 },
    { q: "ทำไมไบร์ทถึงชอบคิดว่าตัวเองอ้วน", options: ["พุงออก", "หน้าอ้วน", "มีคนบอก", "เพราะชาติที่แล้วเป็นหมู"], correct: 1 },
    { q: "ชื่อจริงของไบร์ทคือ", options: ["โชติวุติ", "โชติวุฒ", "โชติวุฒ์", "โชติวุฒิ"], correct: 3 },
    { q: "นามสกุลของไบร์ทคือ", options: ["สิงระโส", "โสระสิง", "โสระสิงค์", "โสระสิงห์"], correct: 3 },
    { q: "ไบร์ทชอบเล่นเกมอะไรมากที่สุด", options: ["Roblox", "Freefire", "Rov", "Five m"], correct: 0 },
    { q: "พี่ปันๆรักไบร์ทมั้ย", options: ["รัก", "รักมาก", "รักมากกก", "รักมากกค้าบบบ"], correct: 3 }
];

let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let isAnswerLocked = false;

function openGameModal() {
    const hubScreen = document.getElementById("hub-screen");
    const gameScreen = document.getElementById("game-screen");

    if (hubScreen) {
        hubScreen.classList.remove("active");
        hubScreen.classList.add("hidden");
    }

    if (gameScreen) {
        setTimeout(() => {
            gameScreen.classList.remove("hidden");
            gameScreen.classList.add("active", "game-fade-in");
            initGame();
        }, 300);
    }
}

function initGame() {
    let shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    selectedQuestions = shuffled.slice(0, 10);
    currentQuestionIndex = 0;
    score = 0;
    isAnswerLocked = false;

    loadQuestion();
}

function loadQuestion() {
    isAnswerLocked = false;
    const qData = selectedQuestions[currentQuestionIndex];

    document.getElementById("question-progress").textContent = `คำถามข้อที่ ${currentQuestionIndex + 1} / 10`;
    document.getElementById("question-text").textContent = qData.q;

    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`opt-${i}`);
        btn.textContent = qData.options[i];
        btn.className = "option-btn";
        btn.disabled = false;
    }
}

function selectOption(selectedIndex) {
    if (isAnswerLocked) return;
    isAnswerLocked = true;

    const qData = selectedQuestions[currentQuestionIndex];
    const correctIndex = qData.correct;

    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`opt-${i}`);
        btn.disabled = true;
        if (i === correctIndex) {
            btn.classList.add("correct");
        } else if (i === selectedIndex) {
            btn.classList.add("wrong");
        }
    }

    if (selectedIndex === correctIndex) {
        score++;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < selectedQuestions.length) {
            loadQuestion();
        } else {
            finishGame();
        }
    }, 1200);
}

function finishGame() {
    const gameScreen = document.getElementById("game-screen");
    
    if (score === 10) {
        userTickets += 1; // เพิ่มคูปองสุ่ม 1 ใบ
        alert(`🎉 สุดยอดมากกก! ตอบถูกหมดทุกข้อเลย (${score}/10)\nคุณได้รับ 🎟️ คูปองสุ่ม 1 ใบ! นำไปหมุนวงล้อกาชาได้เลยย 🎁`);
    } else {
        alert(`✨ จบเกมแล้ว! เธอตอบถูก ${score} / 10 ข้อ\n(ต้องตอบถูกหมด 10/10 ข้อถึงจะได้รับคูปองนะ ลองเล่นใหม่อีกครั้งได้เลย!) 💕`);
    }

    backToHub();
}

// ================= Step 7: Gacha Wheel & Inventory Logic =================
let isSpinning = false;
let currentRotation = 0;

function openGachaModal() {
    const hubScreen = document.getElementById("hub-screen");
    const gachaScreen = document.getElementById("gacha-screen");

    if (hubScreen) {
        hubScreen.classList.remove("active");
        hubScreen.classList.add("hidden");
    }

    if (gachaScreen) {
        gachaScreen.classList.remove("hidden");
        gachaScreen.classList.add("active");
        startGachaCatAnimation();
        updateTicketDisplay();
    }
}

function startGachaCatAnimation() {
    const gachaCatImg = document.getElementById("gacha-cat-img");
    let frameIdx = 0;
    setInterval(() => {
        frameIdx = (frameIdx + 1) % catStandFrames.length;
        if (gachaCatImg) {
            gachaCatImg.src = catStandFrames[frameIdx];
        }
    }, 400);
}

function spinWheel() {
    if (isSpinning) return;

    if (userTickets <= 0) {
        alert("❌ คุณยังไม่มีคูปองสุ่มเลย! ไปเล่น 'เกมทายใจ' ให้ตอบถูกครบ 10 ข้อเพื่อรับคูปองก่อนนะ 🎮");
        return;
    }

    isSpinning = true;
    userTickets -= 1; // หักคูปอง 1 ใบ
    updateTicketDisplay();

    const spinBtn = document.getElementById("spin-btn");
    if (spinBtn) spinBtn.disabled = true;

    // สุ่มรางวัลจาก 6 ชนิด (Index 0-5)
    const randomIndex = Math.floor(Math.random() * rewardList.length);
    const selectedReward = rewardList[randomIndex];

    // คำนวณ องศาการหมุนวงล้อ ให้เข็มชี้ตรงกับรางวัล
    // แต่ละช่องกว้าง 60 องศา
    const extraRounds = 5 * 360; // หมุน 5 รอบเต็ม
    const targetDegree = 360 - selectedReward.angle; 
    currentRotation += extraRounds + targetDegree - (currentRotation % 360);

    const wheel = document.getElementById("gacha-wheel");
    if (wheel) {
        wheel.style.transform = `rotate(${currentRotation}deg)`;
    }

    // รอวงล้อหมุนเสร็จ (4 วินาที)
    setTimeout(() => {
        isSpinning = false;
        if (spinBtn) spinBtn.disabled = false;

        // เพิ่มคูปองรางวัลลงกระเป๋า
        if (!inventory[selectedReward.name]) {
            inventory[selectedReward.name] = 1;
        } else {
            inventory[selectedReward.name] += 1;
        }

        updateTicketDisplay();

        alert(`🎉 ยินดีด้วย! เธอสุ่มได้บัตร: [ ${selectedReward.icon} ${selectedReward.name} ]\nไปเช็คดูที่กระเป๋าคูปองได้เลยน้า 🎒✨`);
    }, 4000);
}

// ================= ระบบเปิด-ปิดกระเป๋าเก็บคูปอง =================
function openInventoryModal() {
    const modal = document.getElementById("inventory-modal");
    const invList = document.getElementById("inventory-list");

    if (invList) {
        invList.innerHTML = "";
        let keys = Object.keys(inventory);

        if (keys.length === 0) {
            invList.innerHTML = `<p class="empty-inv-text">ยังไม่มีบัตรรางวัลเลย ไปสุ่มกาชากันนะ! 🎁</p>`;
        } else {
            keys.forEach(cardName => {
                const count = inventory[cardName];
                const cardDiv = document.createElement("div");
                cardDiv.className = "ticket-item";
                cardDiv.innerHTML = `
                    <span class="ticket-item-title">🎟️ ${cardName}</span>
                    <span class="ticket-item-count">x${count} ใบ</span>
                `;
                invList.appendChild(cardDiv);
            });
        }
    }

    if (modal) modal.classList.remove("hidden");
}

function closeInventoryModal() {
    const modal = document.getElementById("inventory-modal");
    if (modal) modal.classList.add("hidden");
}

// ================= Step 8: เวลาของเรา (Time Counter Logic) =================
let timeInterval = null;

// กำหนดวันเริ่มต้น: วันที่ 28 เดือนที่แล้ว เวลา 23:50:00
// เนื่องจากปัจจุบันคือ เดือน 10 ปี 2026 (ตลค. 2026) เดือนที่แล้วคือ กย. 2026 (กันยายน 28, 2026, 23:50:00)
const startDate = new Date("2026-09-28T23:50:00"); 

function openTimeModal() {
    const hubScreen = document.getElementById("hub-screen");
    const timeScreen = document.getElementById("time-screen");

    if (hubScreen) {
        hubScreen.classList.remove("active");
        hubScreen.classList.add("hidden");
    }

    if (timeScreen) {
        timeScreen.classList.remove("hidden");
        timeScreen.classList.add("active");
        startTimer();
        startTimeCatAnimation();
    }
}

function startTimer() {
    if (timeInterval) clearInterval(timeInterval);

    // อัปเดตรันทันที 1 รอบ
    updateElapsedTime();

    // รันทุกๆ 1 วินาทีแบบเรียลไทม์
    timeInterval = setInterval(updateElapsedTime, 1000);
}

function updateElapsedTime() {
    const now = new Date();
    let diff = now - startDate; // เวลาต่างกันเป็นมิลลิวินาที

    if (diff < 0) diff = 0; // ป้องกันเวลาก่อนเริ่ม

    const secondsTotal = Math.floor(diff / 1000);
    const days = Math.floor(secondsTotal / (3600 * 24));
    const hours = Math.floor((secondsTotal % (3600 * 24)) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = secondsTotal % 60;

    // แสดงผลลงในหน้าจอ (จัดรูปแบบเลข 2 หลักสำหรับ ชม., นาที, วินาที)
    document.getElementById("days-count").textContent = days;
    document.getElementById("hours-count").textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes-count").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds-count").textContent = String(seconds).padStart(2, '0');
}

function startTimeCatAnimation() {
    const timeCatImg = document.getElementById("time-cat-img");
    let frameIdx = 0;
    setInterval(() => {
        frameIdx = (frameIdx + 1) % catStandFrames.length;
        if (timeCatImg) {
            timeCatImg.src = catStandFrames[frameIdx];
        }
    }, 400);
}

// ================= Step 9: ภาพความทรงจำ (Photo Gallery Logic) =================
const photoDataList = [
    { src: "photo1.jpg", title: "1. สเวนเซ่นครั้งแรกของเรา" },
    { src: "photo2.jpg", title: "2. ซูชิโระครั้งแรกของเรา" },
    { src: "photo3.jpg", title: "3. ภาพคู่แต่เหม่อ" },
    { src: "photo4.jpg", title: "4. โกโก้ที่พี่ปันๆซื้อให้" },
    { src: "photo5.jpg", title: "5. มันเรียกว่าอะไรนะลืม" },
    { src: "photo6.jpg", title: "6. กล้ามนิ่ม" },
    { src: "photo7.jpg", title: "7. วันเกิดพี่ปันๆ" },
    { src: "photo8.jpg", title: "8. อันนี้น่ารัก" }
];

let currentPhotoIndex = 0;

function openPhotosModal() {
    const hubScreen = document.getElementById("hub-screen");
    const photosScreen = document.getElementById("photos-screen");

    if (hubScreen) {
        hubScreen.classList.remove("active");
        hubScreen.classList.add("hidden");
    }

    if (photosScreen) {
        photosScreen.classList.remove("hidden");
        photosScreen.classList.add("active");
        currentPhotoIndex = 0;
        renderPhoto();
        startPhotosCatAnimation();
    }
}

function renderPhoto() {
    const photoObj = photoDataList[currentPhotoIndex];
    const imgElem = document.getElementById("current-photo");
    const titleElem = document.getElementById("photo-title-text");
    const counterElem = document.getElementById("photo-counter");

    if (imgElem) imgElem.src = photoObj.src;
    if (titleElem) titleElem.textContent = photoObj.title;
    if (counterElem) counterElem.textContent = `รูปที่ ${currentPhotoIndex + 1} / ${photoDataList.length}`;
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photoDataList.length;
    renderPhoto();
}

function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photoDataList.length) % photoDataList.length;
    renderPhoto();
}

function startPhotosCatAnimation() {
    const photosCatImg = document.getElementById("photos-cat-img");
    let frameIdx = 0;
    setInterval(() => {
        frameIdx = (frameIdx + 1) % catStandFrames.length;
        if (photosCatImg) {
            photosCatImg.src = catStandFrames[frameIdx];
        }
    }, 400);
}

// ================= Step 10: ความในใจ (Letter & Feedback Logic) =================
function openLetterModal() {
    const hubScreen = document.getElementById("hub-screen");
    const letterScreen = document.getElementById("letter-screen");

    if (hubScreen) {
        hubScreen.classList.remove("active");
        hubScreen.classList.add("hidden");
    }

    if (letterScreen) {
        letterScreen.classList.remove("hidden");
        letterScreen.classList.add("active");
        loadSavedFeedback();
        startLetterCatAnimation();
    }
}

// โหลดข้อความที่เคยบันทึกไว้ในเครื่อง (LocalStorage) มาแสดง
function loadSavedFeedback() {
    const inputField = document.getElementById("feedback-input");
    const savedText = localStorage.getItem("bright_anniversary_feedback");
    
    if (inputField && savedText) {
        inputField.value = savedText;
    }
}

// บันทึกข้อความอัตโนมัติเมื่อมีการพิมพ์
function saveFeedback() {
    const inputField = document.getElementById("feedback-input");
    const statusMsg = document.getElementById("save-status");

    if (inputField) {
        localStorage.setItem("bright_anniversary_feedback", inputField.value);
        
        // แสดงข้อความแจ้งเตือนว่าบันทึกแล้วแบบจางๆ
        if (statusMsg) {
            statusMsg.classList.add("show");
            setTimeout(() => {
                statusMsg.classList.remove("show");
            }, 1500);
        }
    }
}

function startLetterCatAnimation() {
    const letterCatImg = document.getElementById("letter-cat-img");
    let frameIdx = 0;
    setInterval(() => {
        frameIdx = (frameIdx + 1) % catStandFrames.length;
        if (letterCatImg) {
            letterCatImg.src = catStandFrames[frameIdx];
        }
    }, 400);
}

// ================= Step 11: ไม่ดูถือว่าพลาด (Troll Button Logic) =================
let trollClickCount = 0;
const TARGET_CLICKS = 67;

function openTrollModal() {
    const hubScreen = document.getElementById("hub-screen");
    const trollScreen = document.getElementById("troll-screen");

    if (hubScreen) {
        hubScreen.classList.remove("active");
        hubScreen.classList.add("hidden");
    }

    if (trollScreen) {
        trollScreen.classList.remove("hidden");
        trollScreen.classList.add("active");
        
        // รีเซ็ตค่าเวลากลับเข้ามาใหม่
        trollClickCount = 0;
        document.getElementById("click-count").textContent = trollClickCount;
        
        const resultBox = document.getElementById("troll-result-box");
        const trollBtn = document.getElementById("troll-click-btn");
        const catText = document.getElementById("troll-cat-text");

        if (resultBox) resultBox.classList.add("hidden");
        if (trollBtn) trollBtn.disabled = false;
        if (catText) catText.textContent = "ไบร์ทมีอะไรจะบอกลองกดปุ่มให้ครบสิ 🐾✨";

        startTrollCatAnimation();
    }
}

function handleTrollClick() {
    if (trollClickCount < TARGET_CLICKS) {
        trollClickCount++;
        document.getElementById("click-count").textContent = trollClickCount;

        // สุ่มอนิเมชันปุ่มขยับเล็กน้อยสร้างความมันส์ตอนกด
        const trollBtn = document.getElementById("troll-click-btn");
        if (trollBtn) {
            trollBtn.style.transform = `scale(${1 + (trollClickCount % 3) * 0.03})`;
        }

        // เมื่อกดครบ 67 ครั้ง!
        if (trollClickCount === TARGET_CLICKS) {
            const resultBox = document.getElementById("troll-result-box");
            const catText = document.getElementById("troll-cat-text");

            if (resultBox) resultBox.classList.remove("hidden");
            if (trollBtn) trollBtn.disabled = true;
            if (catText) catText.textContent = "555 โดนหลอกซะแล้วสิ! 🤪💖";
        }
    }
}

function startTrollCatAnimation() {
    const trollCatImg = document.getElementById("troll-cat-img");
    let frameIdx = 0;
    setInterval(() => {
        frameIdx = (frameIdx + 1) % catStandFrames.length;
        if (trollCatImg) {
            trollCatImg.src = catStandFrames[frameIdx];
        }
    }, 400);
}

// ================= ระบบเล่นเสียงแก้ปัญหา Delay บน Netlify =================

// ฟังก์ชันเล่นเสียงคลิกปุ่มทั่วไป (แก้ไขไร้ดีเลย์)
function playClickSound() {
    const originalSfx = document.getElementById("click-sfx");
    if (originalSfx) {
        // คัดลอก Node เสียงเพื่อเล่นใน Memory ทันที ไม่ต้องรอดึงจาก Server
        const sfxClone = originalSfx.cloneNode(true);
        sfxClone.volume = 0.5;
        const promise = sfxClone.play();
        if (promise !== undefined) {
            promise.catch(err => console.log("Click SFX delay fix:", err));
        }
    }
}

// ฟังก์ชันเล่นเสียงเปิดกล่องของขวัญโดยเฉพาะ (แก้ไขไร้ดีเลย์)
function playGiftSound() {
    const originalGiftSfx = document.getElementById("gift-sfx");
    if (originalGiftSfx) {
        const giftClone = originalGiftSfx.cloneNode(true);
        giftClone.volume = 0.7;
        const promise = giftClone.play();
        if (promise !== undefined) {
            promise.catch(err => console.log("Gift SFX delay fix:", err));
        }
    }
}

// ดักฟังการคลิกทุกปุ่มในเว็บไซต์อัตโนมัติ (ยกเว้นกล่องของขวัญเพื่อให้ไปเล่นเสียงเปิดกล่องแทน)
document.addEventListener("click", function(event) {
    const isGiftBox = event.target.closest("#gift-box");
    
    if (!isGiftBox && (event.target.tagName === "BUTTON" || event.target.closest("button") || event.target.closest(".icon-item"))) {
        playClickSound();
    }
})