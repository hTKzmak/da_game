let jumpIsActive = false;
let leftIsActive = false;
let rightIsActive = false;

// Управление
const controlsContainer = document.createElement('div');
controlsContainer.className = 'controls-container';

const controls = document.createElement('div');
controls.className = 'controls';

const leftAndRight = document.createElement('div');
leftAndRight.className = 'leftAndRight';

const leftButton = document.createElement('button');
leftButton.className = 'control';
leftButton.textContent = 'Left';

leftButton.addEventListener('touchstart', () => {
    leftIsActive = true;
})

leftButton.addEventListener('touchend', () => {
    leftIsActive = false;
})


const rightButton = document.createElement('button');
rightButton.className = 'control';
rightButton.textContent = 'Right';

rightButton.addEventListener('touchstart', () => {
    rightIsActive = true;
})

rightButton.addEventListener('touchend', () => {
    rightIsActive = false;
})

const jumpButton = document.createElement('button');
jumpButton.className = 'control';
jumpButton.textContent = 'Jump';

jumpButton.addEventListener('touchstart', () => {
    jumpIsActive = true;
})

jumpButton.addEventListener('touchend', () => {
    jumpIsActive = false;
})


// Сборка
leftAndRight.appendChild(leftButton);
leftAndRight.appendChild(rightButton);

controls.appendChild(leftAndRight);
controls.appendChild(jumpButton);

controlsContainer.appendChild(controls);