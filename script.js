const gameBoard = document.getElementById('gameBoard');
const themeBtn = document.getElementById('themeBtn');
const themeLabel = document.getElementById('themeLabel');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const timerDisplay = document.getElementById('timer');
const showMatchedCardsCheckbox = document.getElementById('showMatchedCards');
const gridSizeSelect = document.getElementById('gridSize');

let gridSize = parseInt(gridSizeSelect.value);
const totalPairsMap = { 2: 2, 4: 8, 6: 18 }; // 確保每個尺寸的對應數量
let currentImages = [];
let flippedCards = [];
let matchedPairs = 0;
let isGameActive = false;
let isTimerStarted = false;
let timer;
let elapsedSeconds = 0;
let theme = 1;

const imagesTheme1 = [
    'images/theme1/img1.jpg', 'images/theme1/img2.jpg', 'images/theme1/img3.jpg', 'images/theme1/img4.jpg',
    'images/theme1/img5.jpg', 'images/theme1/img6.jpg', 'images/theme1/img7.jpg', 'images/theme1/img8.jpg',
    'images/theme1/img9.jpg', 'images/theme1/img10.jpg', 'images/theme1/img11.jpg', 'images/theme1/img12.jpg',
    'images/theme1/img13.jpg', 'images/theme1/img14.jpg', 'images/theme1/img15.jpg', 'images/theme1/img16.jpg'
];

const imagesTheme2 = [
    'images/theme2/img1.jpg', 'images/theme2/img2.jpg', 'images/theme2/img3.jpg', 'images/theme2/img4.jpg',
    'images/theme2/img5.jpg', 'images/theme2/img6.jpg', 'images/theme2/img7.jpg', 'images/theme2/img8.jpg',
    'images/theme2/img9.jpg', 'images/theme2/img10.jpg', 'images/theme2/img11.jpg', 'images/theme2/img12.jpg',
    'images/theme2/img13.jpg', 'images/theme2/img14.jpg', 'images/theme2/img15.jpg', 'images/theme2/img16.jpg'
];

gridSizeSelect.addEventListener('change', () => {
    gridSize = parseInt(gridSizeSelect.value);
    initGame();
});

themeBtn.addEventListener('click', () => {
    theme = theme === 1 ? 2 : 1;
    updateThemeLabel();
    initGame();
});

startBtn.addEventListener('click', () => {
    startGame();
    setTimeout(() => {
        flipAllCards(false);
        isGameActive = true;
    }, 10000); // Show cards for 10 seconds
});

restartBtn.addEventListener('click', initGame);

function initGame() {
    gameBoard.innerHTML = '';
    restartBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    gameBoard.className = `game-board grid-${gridSize}`;

    const totalPairs = totalPairsMap[gridSize];
    currentImages = [
        ...(theme === 1 ? imagesTheme1.slice(0, totalPairs) : imagesTheme2.slice(0, totalPairs)),
        ...(theme === 1 ? imagesTheme1.slice(0, totalPairs) : imagesTheme2.slice(0, totalPairs))
    ];

    shuffle(currentImages);
    currentImages.forEach(image => {
        const card = createCard(image);
        gameBoard.appendChild(card);
    });

    flippedCards = [];
    matchedPairs = 0;
    isGameActive = false;
    isTimerStarted = false;
    resetTimer();
    updateThemeLabel();
}

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">?</div>
            <div class="card-back" style="background-image: url(${image})"></div>
        </div>
    `;
    card.addEventListener('click', () => onCardClick(card));
    return card;
}

function onCardClick(card) {
    if (!isGameActive || card.classList.contains('flipped') || flippedCards.length === 2) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }

    if (!isTimerStarted) {
        isTimerStarted = true;
        startTimer();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.querySelector('.card-back').style.backgroundImage === card2.querySelector('.card-back').style.backgroundImage;

    if (match) {    matchedPairs++;
        if (matchedPairs === currentImages.length / 2) {
            isGameActive = false;
            clearInterval(timer);
            alert(`遊戲結束！你總共花了 ${elapsedSeconds} 秒`);
            restartBtn.classList.remove('hidden');
        }
    
        flippedCards = [];
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
    }
    
    function startGame() {
        initGame();
        setTimeout(() => {
            flipAllCards(true);
        }, 100);
    }
    
    function flipAllCards(isFront) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (isFront) {
                card.classList.add('flipped');
            } else {
                card.classList.remove('flipped');
            }
        });
    }
    
    function startTimer() {
        timer = setInterval(() => {
            elapsedSeconds++;
            timerDisplay.textContent = `時間：${elapsedSeconds}秒`;
        }, 1000);
    }
    
    function resetTimer() {
        elapsedSeconds = 0;
        timerDisplay.textContent = `時間：0秒`;
    }
    
    // 更新主題標籤
    function updateThemeLabel() {
        themeLabel.textContent = theme === 1 ? '主題：卡通' : '主題：食物';
    }
    
    // 洗牌函數
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
