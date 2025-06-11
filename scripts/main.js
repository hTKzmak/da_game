let toPlay = false;

// Элементы игры
let platforms;
let player;
let cursors;
let coins;
let enemies;

// Счёт
let score = 0;
let scoreText;
let gameover = false;

// скорость и высота
const speed = 500;
const jump = -900;

// музыка и звуки
let explosionSound;
let coinSound;
let music;

// вся логика игры
class GameScene extends Phaser.Scene {
  init() {
    const bar = this.add.rectangle(960 - 230, 510, 4, 28, 0xdedede);
    this.load.on("progress", (progress) => {
      bar.width = 4 + 460 * progress;
    });

    this.load.on("complete", () => {
      bar.destroy();
      showGameIntro();
    })
  }

  // предзагрузка ассетов
  preload() {
    this.load.image("platform", "assets/sprites/platform.png");
    this.load.image("coin", "assets/sprites/coin.png");
    this.load.image("enemy", "assets/sprites/enemy.png");
    this.load.spritesheet("entity", "assets/sprites/entity.png", {
      frameWidth: 110,
      frameHeight: 70,
    });
    this.load.spritesheet("death", "assets/sprites/death.png", {
      frameWidth: 100,
      frameHeight: 70,
    });

    this.load.audio("music", "assets/music.mp3");
    this.load.audio("explosion", "assets/sounds/explosion.mp3");
    this.load.audio("coin", "assets/sounds/coin.mp3");
  }

  // создание объектов и элементов игры
  create() {
    explosionSound = this.sound.add("explosion", { loop: false });
    coinSound = this.sound.add("coin", { loop: false });
    music = this.sound.add("music", { loop: true });

    // добавление группы платформ
    platforms = this.physics.add.staticGroup();
    platforms.create(550, 1000, "platform").setScale(3).refreshBody();
    platforms.create(960, 650, "platform");
    platforms.create(100, 400, "platform");
    platforms.create(1800, 400, "platform");

    // добавление игрока, назначение для него анмаций и физики
    player = this.physics.add.sprite(960, 350, "entity");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    player.setSize(70, 70);

    this.anims.create({
      key: "left",
      frames: [{ key: "entity", frame: 1 }],
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "entity", frame: 0 }],
    });
    this.anims.create({
      key: "right",
      frames: [{ key: "entity", frame: 2 }],
    });
    this.anims.create({
      key: "death",
      frames: this.anims.generateFrameNumbers("death", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: 0,
    });

    player.body.setGravityY(1000);
    this.physics.add.collider(player, platforms);

    // создание управления
    cursors = this.input.keyboard.createCursorKeys();

    // Создание звёздочек
    this.createCoins();

    // Бомбы
    enemies = this.physics.add.group();
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(player, enemies, this.hitEnemy, null, this);

    // Счёт
    scoreText = this.add.text(64, 64, "Score: 0", {
      fontFamily: "montserrat",
      fontSize: "48px",
      fill: "#fff",
    });

    music.setVolume(0.1);
    music.play();
  }

  update() {
    if (gameover || !toPlay) return;

    // создание управления игрока
    if (cursors.left.isDown || leftIsActive) {
      player.setVelocityX(-speed);
      player.anims.play("left", false);
    } else if (cursors.right.isDown || rightIsActive) {
      player.setVelocityX(speed);
      player.anims.play("right", false);
    } else {
      player.setVelocityX(0);
      player.anims.play("turn", false);
    }

    if ((cursors.up.isDown || jumpIsActive) && player.body.touching.down) {
      player.setVelocityY(jump);
    }
  }

  // фукнция по сбору звёзд
  collectCoin(player, coin) {
    coinSound.play();
    coin.disableBody(true, true);
    score += 1;
    scoreText.setText(`Score: ${score}`);

    if (coins.countActive(true) === 0) {
      this.createCoins();

      let x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
      this.createEnemies(x);
    }
  }

  // функция по завершению игры и уничтожению игрока
  hitEnemy(player, enemy) {
    music.setVolume(0.1);
    explosionSound.play();
    gameover = true;
    enemy.destroy();
    showGameOver();
    scoreText.setText(``);
    player.body.moves = false;
    player.body.enable = false;
    player.anims.play("death", false);
  }

  // пересоздание игрока, отчистка бомб и обнуление счёта
  retryGame() {
    score = 0;
    scoreText.setText(`Score: ${score}`);
    enemies.clear(true, true);

    player.body.moves = true;
    player.body.enable = true;
    player.setPosition(960, 350);

    gameover = false;

    music.setVolume(0.5);
  }

  // Функция создания статичных монет с рандомным расположением вне платформ
  createCoins() {
    if (coins) {
      coins.clear(true, true); // очищаем старые звезды
    }

    coins = this.physics.add.staticGroup();
    const coinCount = 10;
    const maxAttempts = 100;

    for (let i = 0; i < coinCount; i++) {
      let attempts = 0;
      let coin;

      do {
        const x = Phaser.Math.Between(50, this.game.config.width - 50);
        const y = Phaser.Math.Between(50, this.game.config.height - 90);

        coin = coins.create(x, y, "coin");
        coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        const overlaps = platforms.getChildren().some((platform) => {
          return Phaser.Geom.Intersects.RectangleToRectangle(
            coin.getBounds(),
            platform.getBounds()
          );
        });

        if (overlaps) {
          coin.destroy();
        }

        attempts++;
      } while (coin.active === false && attempts < maxAttempts);
    }

    this.physics.add.collider(coins, platforms);
    this.physics.add.overlap(player, coins, this.collectCoin, null, this);
  }

  createEnemies(x) {
    for (let i = 0; i < 3; i++) {
      let enemy = enemies.create(x, 16, "enemy");
      enemy.setBounce(1);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }
}

const gameFuncs = new GameScene();

// конфигурация игры
const config = {
  type: Phaser.AUTO,
  scene: GameScene,
  width: 1920,
  height: 1080,
  backgroundColor: "#191919",
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
