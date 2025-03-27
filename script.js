document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('chess-board');
    const notationOptions = document.getElementById('notation-options');
    const result = document.getElementById('result');
    const nextBtn = document.getElementById('next-btn');

    let correctNotation = '';
    let attempts = 0;
    const maxAttempts = 3;

    function createBoard() {
        board.innerHTML = '';
        for (let row = 8; row >= 1; row--) {
            for (let col = 1; col <= 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.position = String.fromCharCode(96 + col) + row;
                board.appendChild(square);
            }
        }
    }

    function generateQuestion() {
        attempts = 0;
        result.textContent = '';
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => square.textContent = '');

        const randomSquare = squares[Math.floor(Math.random() * squares.length)];
        randomSquare.textContent = '♞';
        correctNotation = randomSquare.dataset.position;

        generateOptions(correctNotation);
    }

    function generateOptions(correct) {
        notationOptions.innerHTML = '';
        let options = new Set([correct]);
        while (options.size < 8) {
            const col = String.fromCharCode(97 + Math.floor(Math.random() * 8));
            const row = 1 + Math.floor(Math.random() * 8);
            options.add(`${col}${row}`);
        }
        Array.from(options).sort(() => Math.random() - 0.5).forEach(option => {
            const btn = document.createElement('div');
            btn.textContent = option;
            btn.classList.add('notation-option');
            btn.addEventListener('click', () => checkAnswer(option, btn));
            notationOptions.appendChild(btn);
        });
    }

    function checkAnswer(selected, btn) {
        if (selected === correctNotation) {
            result.textContent = 'Correct! 🎉';
            btn.style.backgroundColor = '#4CAF50';
            disableOptions();
            setTimeout(generateQuestion, 1500);
        } else {
            attempts++;
            btn.style.backgroundColor = '#F44336';
            btn.style.pointerEvents = 'none';
            if (attempts >= maxAttempts) {
                revealNotation();
                result.textContent = `The correct answer was "${correctNotation}". Moving to next...`;
                setTimeout(generateQuestion, 2500);
            } else {
                result.textContent = `Try again! (${maxAttempts - attempts} left)`;
            }
        }
    }

    function disableOptions() {
        Array.from(notationOptions.children).forEach(el => el.style.pointerEvents = 'none');
    }

    function revealNotation() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            if (square.dataset.position === correctNotation) {
                square.textContent = correctNotation;
                square.style.fontSize = '1rem';
                square.style.color = '#333';
            }
        });
        disableOptions();
    }

    nextBtn.addEventListener('click', generateQuestion);

    createBoard();
    generateQuestion();
});