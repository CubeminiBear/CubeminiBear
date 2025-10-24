document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const pairsFoundElement = document.getElementById('pairs-found');
    const messageModal = document.getElementById('message-modal');
    const winModal = document.getElementById('win-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');
    const winClose = document.getElementById('win-close');

    // Египетские символы (эмодзи для простоты)
    const egyptianSymbols = [
        '𓂀', '𓆣', '𓋹', '𓃒',
        '𓊹', '𓍶', '𓁛', '𓆄'
    ];

    // Создаем пары карточек
    let cards = [...egyptianSymbols, ...egyptianSymbols];
    let flippedCards = [];
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
        
        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-front"></div>
                <div class="card-back">${symbol}</div>
            `;
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    // Переворот карточки
    function flipCard() {
        if (!canFlip) return;
        if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
        if (flippedCards.length >= 2) return;

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            canFlip = false;
            setTimeout(checkMatch, 600);
        }
    }

    // Проверка совпадения
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.symbol === card2.dataset.symbol;

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
        
        showMessage('Верно!', 'Вы нашли парные символы!');
        
        flippedCards = [];
        canFlip = true;

        // Проверка победы
        if (matchedPairs === egyptianSymbols.length) {
            setTimeout(showWinMessage, 800);
        }
    }

    // Обработка несовпадения
    function handleMismatch(card1, card2) {
        showMessage('Попробуй снова', 'Ищи внимательнее!');
        
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
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
        flippedCards = [];
        canFlip = true;
        createGameBoard();
    }

    // Инициализация игры
    createGameBoard();
});
