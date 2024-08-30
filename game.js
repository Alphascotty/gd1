const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 20,
    height: 20,
    color: 'lime',
    speed: 5
};

const bullets = [];
const targets = [];
const targetSize = 30;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullets that go off screen
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function drawTargets() {
    ctx.fillStyle = 'red';
    targets.forEach((target, index) => {
        ctx.fillRect(target.x, target.y, targetSize, targetSize);

        // Check collision with bullets
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < target.x + targetSize &&
                bullet.x + bullet.width > target.x &&
                bullet.y < target.y + targetSize &&
                bullet.height + bullet.y > target.y
            ) {
                targets.splice(index, 1);
                bullets.splice(bulletIndex, 1);
            }
        });
    });
}

function createTarget() {
    const x = Math.random() * (canvas.width - targetSize);
    const y = Math.random() * (canvas.height / 2);
    targets.push({ x, y });
}

function movePlayer() {
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
    if (keys.Space) {
        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            speed: 7
        });
        keys.Space = false; // Prevents holding space for continuous shooting
    }
}

const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawPlayer();
    drawBullets();
    drawTargets();

    requestAnimationFrame(update);
}

// Create targets at intervals
setInterval(createTarget, 1000);

update();

