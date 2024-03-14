const db = firebase.firestore();
const app = Vue.createApp({
  data() {
    return {
      birdY: 250,
      gameover: false,
      pipesX: -52,
      pipesY: 0,
      animateID: null,
      animateUpID: null,
      started: false,
      score: 0,
      highScore: -1,
      highName: "",
      scoreArr: [0],
      jumpFactor: 0,
      fallFactor: 0.5,
      submitted: false,
    };
  },
  methods: {
    startGame() {
      if (this.gameover) {
        return;
      }

      if (!this.started) {
        this.getScores();
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
      )
        this.loseGame();

      //temp
      if (this.jumpFactor<=1) {
        this.fallFactor*=1.2
        if(this.fallFactor>=4) this.fallFactor=4
        
        this.birdY -= this.fallFactor;
      }

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
      this.fallFactor=0.5;
      this.jumpFactor = 7;
      this.animateUpID = requestAnimationFrame(this.moveBirdHelper);
    },

    moveBirdHelper() {
      if (this.birdY < 450 && this.jumpFactor > 0) {
        this.birdY += this.jumpFactor;
        this.jumpFactor *= 0.8;

        requestAnimationFrame(this.moveBirdHelper);
      } else {
        this.jumpFactor = 0;
      }
      // if (this.birdY < 450) this.birdY += 30;
    },

    addScore() {
      let name = this.$refs.inputRef.value;
      if(name=="")return;
      db.collection("highscores").add({
        name: name,
        score: this.score,
      });
      if(this.score>this.highScore){
        this.highName = name
        this.highScore = this.score
      }
      this.submitted=true;
    },
    async getScores() {
      const scoreRef = db.collection("highscores").orderBy("score", "desc");
      const snapshot = await scoreRef.get();

      if (!snapshot.empty) {
        this.highName = snapshot.docs[0].data().name;
        this.highScore = snapshot.docs[0].data().score;
      }
    },
    playAgain(){
      this.birdY=  250,
      this.pipesX= -52,
      this.pipesY= 0,
      this.animateID= null,
      this.animateUpID= null,
      this.started= false,
      this.score= 0,
      this.scoreArr= [0],
      this.submitted= false
      this.jumpFactor=0;
      this.startGame()
      this.gameover=false
    }
  },
});

app.mount("#app");
