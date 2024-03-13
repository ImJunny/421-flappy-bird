const app = Vue.createApp({
  data() {
    return {
      birdY: 250,
      gameover: false,
      pipesX: -52,
      pipesY: 0,
      animateID: null,
      animateUpID:null,
      started: false,
      score: 0,
      scoreArr: [0],
      jumpFactor:0,
      jumping: false
    };
  },
  methods: {
    startGame() {
      if(this.gameover){
        return
      }

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
      ) this.loseGame();

      //temp
      if(this.jumping)
        this.birdY -= 1.5;

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
      this.pipesX += 1.5;
    },

    loseGame() {
      this.gameover = true;
      cancelAnimationFrame(this.animateID);
      cancelAnimationFrame(this.animateUpID);
    },

    moveBird() {
      this.jumping = true;
      this.jumpFactor = 6
      this.animateUpID = requestAnimationFrame(this.moveBirdHelper)
    },

    moveBirdHelper(){
      if (this.birdY<450 && this.jumpFactor>0) {
        this.birdY+=this.jumpFactor
        this.jumpFactor *=.8


        requestAnimationFrame(this.moveBirdHelper)
      }
      else {
        this.jumpFactor=0
        this.jumping=false
      }
      // if (this.birdY < 450) this.birdY += 30;
    }
  },
});

app.mount("#app");
