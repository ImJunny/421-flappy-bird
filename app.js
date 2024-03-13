const app = Vue.createApp({
  data() {
    return {
      birdY: 250,
      gameover: false,
      pipesX: -52,
      pipesY: 0,
      animateID: null,
      started: false,
      score: 0,
      scoreArr: [0],
    };
  },
  methods: {
    startGame() {
      if (this.gameover) return;

      if (!this.started) {
        this.update();
        this.started = true;
      } else this.moveBird();
    },

    update() {
      this.animateID = requestAnimationFrame(this.update);

      let birdRef = this.$refs.birdRef;
      let bottomRef = this.$refs.bottomRef;
      let topRef = this.$refs.topRef;
      let birdLeft = parseInt(birdRef.getBoundingClientRect().left);
      let birdRight = parseInt(birdRef.getBoundingClientRect().right);
      let pipeLeft = parseInt(bottomRef.getBoundingClientRect().left);
      let pipeRight = parseInt(bottomRef.getBoundingClientRect().right);
      let birdTop = parseInt(birdRef.getBoundingClientRect().top);
      let birdBottom = parseInt(birdRef.getBoundingClientRect().bottom);
      let topBottom = parseInt(topRef.getBoundingClientRect().bottom);
      let bottomTop = parseInt(bottomRef.getBoundingClientRect().top);

      if (
        (birdRight >= pipeLeft &&
          birdLeft <= pipeRight &&
          !(birdBottom <= bottomTop && birdTop >= topBottom)) ||
        this.birdY <= 112
      ) {
        this.loseGame();
      }
      this.birdY -= 1;

      if (birdRight == pipeRight) {
        this.score++;
        let scoreString = this.score.toString();
        this.scoreArr = [];
        for (let i = 0; i < scoreString.length; i++) {
          this.scoreArr.push(scoreString.charAt(i));
        }
      }

      if (this.pipesX > 288) {
        this.pipesX = -52;
        this.pipesY = Math.random() * 210 - 150;
      }
      this.pipesX += 2;
    },

    loseGame() {
      this.started = false;
      this.gameover = true;
      cancelAnimationFrame(this.animateID);
    },

    moveBird() {
      if (this.birdY < 450) this.birdY += 30;
    },
  },
});

app.mount("#app");
