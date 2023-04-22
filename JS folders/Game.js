class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");
  this.left_keyactive=false
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playermoving=false
    this.explosion=false
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
      console.log(gameState)
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    rocket1 = createSprite(width / 2 - 50, height - 100);
    rocket1.addImage("rocket1", rocket1_img);
   // rocket1.addImage("explosion",explosion)
    rocket1.scale = 0.5

    rocket2 = createSprite(width / 2 + 100, height - 100);
    rocket2.addImage("rocket2", rocket2_img);
  //  rocket2.addImage("explosion",explosion)
    rocket2.scale = 0.5

    rocket = [rocket1, rocket2];
    fuels = new Group()
    powercoins = new Group()
    meteors =new Group()

    var meteorPositions = [
      { x: width / 2 + 250, y: height - 800, image: meteorImg },
      { x: width / 2 - 150, y: height - 1300, image: meteorImg },
      { x: width / 2 + 250, y: height - 1800, image: meteorImg },
      { x: width / 2 - 180, y: height - 2300, image: meteorImg },
      { x: width / 2, y: height - 2800, image: meteorImg },
      { x: width / 2 - 180, y: height - 3300, image: meteorImg },
      { x: width / 2 + 180, y: height - 3300, image: meteorImg },
      { x: width / 2 + 250, y: height - 3800, image: meteorImg },
      { x: width / 2 - 150, y: height - 4300, image: meteorImg },
      { x: width / 2 + 250, y: height - 4800, image: meteorImg },
      { x: width / 2, y: height - 5300, image: meteorImg },
      { x: width / 2 - 180, y: height - 5500, image: meteorImg }
    ];
    this.addSprites(fuels,4,fuelimg,0.02)
    this.addSprites(powercoins,18,powercoinImage,0.09)
    this.addSprites(meteors,meteorPositions.length,meteorImg,0.05,meteorPositions)
  }
  addSprites(spritegroup,numberofsprites,spriteimage,scale,positions=[]){
    var x,y ;
    for(var i=0;i<numberofsprites;i++){
      if (positions.length >0) {
        x=positions[i].x
        y=positions[i].y
        spriteimage=positions[i].image
        
      } else {
        x= random(width/2+150,width/2-150);
    y=random(-height*4.5,height-400)
      }
    
    var sprite=createSprite(x,y)
    sprite.addImage("sprite",spriteimage)
    sprite.scale=scale
    spritegroup.add(sprite)
  }
}
handlefuel(index){
  rocket[index-1].overlap(fuels,function(collector,collected){
    player.fuel=185
    collected.remove()
  })
  if (player.fuel>0&&this.playermoving) {
    player.fuel-=0.3
  }
  if (player.fuel<=0) {
    gameState=2
    this.gameover()
  }
}
gameover(){
  swal({
    title:`Game Over`,
    text:"You Loose",
    imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize:"100x100",
    confirmButtonText:"ok"
  })
}
handlepowercoin(index){
  rocket[index-1].overlap(powercoins,function(collector,collected){
    player.score+=21
    collected.remove()
  })
}
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard")
    this.leadeboardTitle.class("resetText")
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }
  showRank(){
  swal({
    title:`Awesome!${"\n"}Rank${"\n"}${player.rank}`,
    text:"You did it",
    imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
    imageSize:"100x100",
    confirmButtonText:"ok"
  })
  }
  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        rocketAtEnd:0,
        players:{}
      })
      window.location.reload();
    })
  }
  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  play() {
    this.handleElements();
this.handleResetButton()
    Player.getPlayersInfo();
  player.getRocketAtEnd();
    if (allPlayers !== undefined) {
      image(trackImg, 0, -height * 5, width, height * 6);
      this.showLeaderboard();
      this.showfuel()
      this.showlife()
      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        var currentlife = allPlayers[plr].life
        if (currentlife <= 0) {
          rocket[index-1].changeImage("explosion")
          rocket[index-1].scale=0.3
         }
  
        rocket[index - 1].position.x = x
        rocket[index - 1].position.y = y
        
        if (index==player.index) {
          
         
          stroke(10)
          fill("red")
          ellipse(x,y,60,60)
          this.handlefuel(index)
          this.handlepowercoin(index)
         // this.handlemeteorcollision(index)
         // this.handlerocketAcolisionwithrocketB(index)
          if (player.life<=0) {
            this.explosion=true
            this.playermoving=false
          }
          camera.position.y = rocket[index-1].position.y

        }
      }
      const finshLine = height * 6 - 100;
      if (player.positionY > finshLine) {
        gameState=2
        player.rank += 1;
        Player.updateRocketAtEnd(player.rank);
        player.update();
        this.showRank();
      }
      if (this.playermoving) {
        player.positionY+=5
        player.update()
      }
      this.handlePlayerControls();
     
      drawSprites();
    }
  }
 
  handlePlayerControls() {
   //if (!this.explosion   ) {
      
    
    // handling keyboard events
    if (keyIsDown(UP_ARROW)) {
      this.playermoving=true
      player.positionY += 10;
      player.update();
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.playermoving=true
      player.positionY -= 10;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW)&& player.positionX > width / 3 - 50) {
      this.left_keyactive=true
      player.positionX -= 5;
      player.update();
    }
    if (keyIsDown(RIGHT_ARROW)&& player.positionX < width / 2 + 300) {
      this.left_keyactive=false
      player.positionX += 5;
      player.update();
    }
 // }
  }
 
  showfuel(){
push ()
image (fuelimg,width/2-130,height-player.positionY-400,20,20)
fill("white")
rect (width/2-100,height-player.positionY-400,185,20)
fill("#edb200")
rect (width/2-100,height-player.positionY-400,player.fuel,20)
pop ()
  }
  showlife(){
    push ()
    image(lifeimg,width/2-130,height-player.positionY-350,20,20)
    fill("white")
    rect (width/2-100,height-player.positionY-350,185,20)
    fill("#ff0000")
    rect (width/2-100,height-player.positionY-350,player.life,20)
    pop ()
  }
  handlemeteorcollision(index){
    if (rocket[index-1].collide(meteor)) {
      if (this.left_keyactive) {
        player.positionX+=100
      } else {
        player.positionX-=100
      }
      if (player.life>0) {
        player.life-=185/4
      }
      player.update()
    }
  }
  handlerocketAcolisionwithrocketB(index){
    if (index==1) {
      if (rocket[index-1].collide(rocket[1])) {
        if (this.left_keyactive) {
          player.positionX+=100
        }
        else{
          player.positionX-=100
        }
        if (player.life>0) {
          player.life-=185/4
        }
        player.update()
      }
    }
    if (index==2) {
      if (rocket[index-1].collide(rocket[0])) {
        if (this.left_keyactive) {
          player.positionX+=100
        }
        else{
          player.positionX-=100
        }
        if (player.life>0) {
          player.life-=185/4
        }
        player.update()
      }
    }
  }
}
