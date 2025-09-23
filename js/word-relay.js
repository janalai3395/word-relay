let gameStage = 'input-count'; // input-count → input-names → playing
let number = 0;
let nameIndex = 0;
let players = [];
let currentIndex = 0;
let newWord;
let word;
let usedWords = [];

const input = document.querySelector('input');
const button = document.querySelector('button');
const wordEl = document.querySelector('#word');
const orderEl = document.querySelector('#order');
const historyEl = document.querySelector('#word-history');
const playerListEl = document.querySelector('#player-list');

const updateOrder = () => {
    if (players.length > 0) {
        orderEl.textContent = players[currentIndex];
    } else {
        orderEl.textContent = '게임 종료';
    }
};

function updateUI(stage) {
    if (stage === 'input-count') {
        input.placeholder = '인원 수 입력 (숫자)';
        button.textContent = '인원 수 입력';
    } else if (stage === 'input-names') {
        input.placeholder = '플레이어 이름 입력';
        button.textContent = `${nameIndex + 1}번 참가자 이름 입력`;
    } else if (stage === 'playing') {
        input.placeholder = '단어 입력';
        button.textContent = '단어 입력';
    }
}

const addToHistory = (word) => {
    const li = document.createElement('li');
    li.textContent = word;
    historyEl.appendChild(li);
};

const renderPlayerList = () => {
    playerListEl.innerHTML = '';
    players.forEach((player, idx) => {
        const li = document.createElement('li');
        li.textContent = `${idx + 1}. ${player}`;
        playerListEl.appendChild(li);
    });
};

const resetInput = () => {
    input.value = '';
    input.focus();
};

const onClickButton = () => {
    newWord = input.value.trim();

    if (gameStage === 'input-count') {
        // 참가자 수 입력 단계
        number = Number(newWord);
        if (!number || number < 2) {
            alert('2명 이상의 숫자를 입력해주세요!');
            resetInput();
            return;
        }

        gameStage = 'input-names';
        updateUI(gameStage);
        resetInput();

    } else if (gameStage === 'input-names') {
        // 참가자 이름 입력 단계
        if (!newWord) {
            alert('이름을 입력해주세요!');
            return;
        }

        players.push(newWord);
        nameIndex++;

        if (nameIndex < number) {
            updateUI(gameStage);
        } else {
            // 이름 입력 완료 → 게임 시작
            gameStage = 'playing';
            renderPlayerList();
            updateOrder();
            updateUI(gameStage);
        }

        resetInput();

    } else if (gameStage === 'playing') {
        // 게임 진행 중
        if (!newWord) {
            alert('단어를 입력해주세요!');
            return;
        }

        // 중복 단어로 탈락
        if (usedWords.includes(newWord)) {
            alert(`${players[currentIndex]}님이 중복된 단어로 탈락했습니다!`);
            players.splice(currentIndex, 1);

            if (players.length === 0) {
                alert("모든 참가자가 탈락했습니다. 게임 종료!");
                input.disabled = true;
                button.disabled = true;
                return;
            } else if (players.length === 1) {
                alert(`${players[0]}님이 최종 우승자입니다!`);
                input.disabled = true;
                button.disabled = true;
                return;
            }

            if (currentIndex >= players.length) currentIndex = 0;
            renderPlayerList();
            updateOrder();
            resetInput();
            return;
        }

        // 올바른 단어 조건
        if (!word || word.at(-1) === newWord[0]) {
            word = newWord;
            wordEl.textContent = word;
            usedWords.push(word);
            addToHistory(word);

            currentIndex = (currentIndex + 1) % players.length;
            updateOrder();
        } else {
            // 틀린 단어로 탈락
            alert(`${players[currentIndex]}님 탈락!`);
            players.splice(currentIndex, 1);

            if (players.length === 0) {
                alert("모든 참가자가 탈락했습니다. 게임 종료!");
                input.disabled = true;
                button.disabled = true;
                return;
            } else if (players.length === 1) {
                alert(`${players[0]}님이 최종 우승자입니다!`);
                input.disabled = true;
                button.disabled = true;
                return;
            }

            if (currentIndex >= players.length) currentIndex = 0;
            renderPlayerList();
            updateOrder();
        }

        resetInput();
    }
};

button.addEventListener('click', onClickButton);

updateUI(gameStage);