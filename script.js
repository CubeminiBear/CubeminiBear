// Пароль для доступа к игре
const GAME_PASSWORD = "1234";

document.addEventListener('DOMContentLoaded', () => {
    // Проверка пароля
    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');
    const container = document.querySelector('.container');

    function checkPassword() {
        const enteredPassword = passwordInput.value.trim();
        
        if (enteredPassword === GAME_PASSWORD) {
            passwordModal.style.display = 'none';
            container.style.display = 'block';
            // После ввода пароля запускаем вашу существующую игру
            startGame();
        } else {
            passwordError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    passwordSubmit.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });
    passwordInput.focus();

    // Ваш существующий код игры
    function startGame() {
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
            'День Рождения': '1 Ноября',
            'Новый Год': '15 градусов', 
            'Аромат': 'Медведь и Капитан',
            'Ассаймент': 'Удачный и счастливый',
            'Красно-белый набор': 'Мандарин и фрукты',
            'Магазин': 'В1',
            'Витамин': 'Ромашка',
            'Команда': 'Дружная и качественная'
        };

        // Создаем массив всех карточек
        let cards = [];
        for (const [first, second] of Object.entries(cardPairs)) {
            cards.push({ text: first, matchesWith: second, type: 'first' });
            cards.push({ text: second, matchesWith: first, type: 'second' });
        }

        let selectedCards = []; // Карточки, выбранные для проверки
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
                
                card.addEventListener('click', handleCardClick);
                gameBoard.appendChild(card);
            });
        }

        // Обработка клика по карточке
        function handleCardClick() {
            if (!canFlip) return;
            if (this.classList.contains('matched')) return;
            
            // Если карточка еще не перевернута - переворачиваем
            if (!this.classList.contains('flipped')) {
                this.classList.add('flipped');
            }
            
            // Если карточка уже выбрана - отменяем выбор
            if (selectedCards.includes(this)) {
                this.classList.remove('selected');
                selectedCards = selectedCards.filter(card => card !== this);
                return;
            }
            
            // Если уже выбрано 2 карточки - очищаем выбор
            if (selectedCards.length >= 2) {
                selectedCards.forEach(card => card.classList.remove('selected'));
                selectedCards = [];
            }
            
            // Добавляем карточку в выбранные
            this.classList.add('selected');
            selectedCards.push(this);

            // Если выбрано 2 карточки - проверяем совпадение
            if (selectedCards.length === 2) {
                canFlip = false;
                setTimeout(checkMatch, 600);
            }
        }

        // Проверка совпадения
        function checkMatch() {
            const [card1, card2] = selectedCards;
            
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
            
            // Снимаем выделение
            card1.classList.remove('selected');
            card2.classList.remove('selected');
            selectedCards = [];
            canFlip = true;

            // Проверка победы
            if (matchedPairs === Object.keys(cardPairs).length) {
                setTimeout(showWinMessage, 800);
            }
        }

        // Обработка несовпадения
        function handleMismatch(card1, card2) {
            showMessage('Попробуй снова', `"${card1.dataset.text}" и "${card2.dataset.text}" не являются парой`);
            
            // Снимаем выделение, но оставляем карточки перевернутыми
            card1.classList.remove('selected');
            card2.classList.remove('selected');
            selectedCards = [];
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
            selectedCards = [];
            canFlip = true;
            createGameBoard();
        }

        // Инициализация игры
        createGameBoard();
    }
});
