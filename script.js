document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const pairsFoundElement = document.getElementById('pairs-found');
    const messageModal = document.getElementById('message-modal');
    const winModal = document.getElementById('win-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');
    const winClose = document.getElementById('win-close');

    // ВАШИ ПАРЫ - МОЖЕТЕ МЕНЯТЬ!
    const cardPairs = {
        'Зима': 'Снег',
        'Лето': 'Солнце', 
        'Весна': 'Цветы',
        'Осень': 'Листья',
        'Дождь': 'Зонт',
        'Мороз': 'Варежки',
        'Жара': 'Вентилятор',
        'Ветер': 'Воздушный змей'
    };

    // Создаем массив всех карточек
    let cards = [];
    for (const [first, second] of Object.entries(cardPairs)) {
        cards.push({ text: first, matchesWith: second, type: 'first' });
        cards.push({ text: second, matchesWith: first, type: 'second' });
    }

    let activeCards = []; // Только карточки, ожидающие проверки (максимум 2)
    let matchedPairs = 0;
    let canFlip = true;

    // Перемешиваем карточки
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    // Создаем игровое поле
    function createGameBoard() {
        gameBoard.innerHTML = '';
        shuffleCards();
        
        cards.forEach((cardData, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.text = cardData.text;
            card.dataset.matchesWith = cardData.matchesWith;
            card.dataset.type = cardData.type;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-front"></div>
                <div class="card-back ${cardData.type}">${cardData.text}</div>
            `;
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    // Переворот карточки
    function flipCard() {
        // Проверяем, можно ли переворачивать
        if (!canFlip) return;
        if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
        if (activeCards.length >= 2) return;

        // Переворачиваем карточку
        this.classList.add('flipped');
        activeCards.push(this);

        // Если перевернули 2 карточки - проверяем совпадение
        if (activeCards.length === 2) {
            canFlip = false;
            setTimeout(checkMatch, 600);
        }
    }

    // Проверка совпадения
    function checkMatch() {
        const [card1, card2] = activeCards;
        
        // Проверяем, соответствуют ли карточки друг другу
        const isMatch = 
            (card1.dataset.matchesWith === card2.dataset.text) || 
            (card2.dataset.matchesWith === card1.dataset.text);

        if (isMatch) {
            handleMatch(card1, card2);
        } else {
            handleMismatch(card1, card2);
        }
    }

    // Обработка совпадения
    function handleMatch(card1, card2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        matchedPairs++;
        pairsFoundElement.textContent = matchedPairs;
        
        // Сообщение о найденной паре
        showMessage('Верно!', `Вы нашли пару: ${card1.dataset.text} - ${card2.dataset.text}`);
        
        // ОЧИЩАЕМ активные карточки
        activeCards = [];
        canFlip = true;

        // Проверка победы
        if (matchedPairs === Object.keys(cardPairs).length) {
            setTimeout(showWinMessage, 800);
        }
    }

    // Обработка несовпадения
    function handleMismatch(card1, card2) {
        showMessage('Попробуй снова', `"${card1.dataset.text}" и "${card2.dataset.text}" не являются парой`);
        
        // ОЧИЩАЕМ активные карточки, но оставляем их перевернутыми
        activeCards = [];
        canFlip = true;
    }

    // Показать сообщение
    function showMessage(title, message) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        messageModal.style.display = 'block';
    }

    // Показать сообщение о победе
    function showWinMessage() {
        winModal.style.display = 'block';
    }

    // Закрыть модальное окно
    modalClose.addEventListener('click', () => {
        messageModal.style.display = 'none';
    });

    // Новая игра
    winClose.addEventListener('click', () => {
        winModal.style.display = 'none';
        resetGame();
    });

    // Клик вне модального окна
    window.addEventListener('click', (event) => {
        if (event.target === messageModal) {
            messageModal.style.display = 'none';
        }
        if (event.target === winModal) {
            winModal.style.display = 'none';
            resetGame();
        }
    });

    // Сброс игры
    function resetGame() {
        matchedPairs = 0;
        pairsFoundElement.textContent = '0';
        activeCards = [];
        canFlip = true;
        createGameBoard();
    }

    // Инициализация игры
    createGameBoard();
});
