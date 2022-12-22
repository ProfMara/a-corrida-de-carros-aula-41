class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.movendo = false;

  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
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

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
    
    //é aqui que cria os grupos
    coinGroup = new Group();
    fuelGroup  = new Group();
    //é aqui que chama o método para adicionar as sprites
    this.addSprite(coinGroup, 0.3, 30, coinImage);
    this.addSprite(fuelGroup, 0.01, 50,fuelImage);

}
  //é aqui que cria o método para adicionar as sprites
  addSprite(grupo, tamanho,quantidade,imagem){
    for(var i = 0; i < quantidade; i++ ){
      //random é uma função que cria números aleatórios
      var x = random(width * 0.33, width * 0.66);
      var y = random(-height * 6, height - 100);
      var sprite = createSprite(x,y);
      sprite.addImage(imagem);
      sprite.scale = tamanho;
      grupo.add(sprite);
    }
  }



  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reiniciar o Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.resetar();

    Player.pegarInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);



      //índice da matriz
      var index = 0;
      for (var plr in allPlayers) {
        //adicione 1 ao índice para cada loop
        index = index + 1;

        //atualiza as posições dos carros
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        this.mostrarPlacar();
        

        if (index === player.index) {
          stroke(10);
          fill("red");
          textSize(45)
          ellipse(x, y, 60, 60);
          text (player.name, x-10,y-50);

          //é aqui que testa se colidiu
          //chamar a função que coleta moedas e combustíveis
          this.coletarMoeda(index);
          this.coletarComb(index);
          this.mostrarComb();
          
          //alterar a posição da câmera na direção y
          camera.position.y = cars[index - 1].position.y;


          
        }
      }

      //manipulando eventos de teclado
      this.controle();

      drawSprites();
    }
  }

  resetar() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
      });
      window.location.reload();
    });
  }
  
  //função que detecta a colisão entre o carro e a moeda
  coletarMoeda(i){

    cars[i-1].overlap(coinGroup, 
      function(coletor, coletado){
        coletado.remove();
        player.score +=30;
        player.update()
    })

  }

  //função para detectar a colisão entre o carro e o combustível

coletarComb(i){

    

}
  

  //mostrar barra de combustível
  mostrarComb(){

  }


  mostrarRank() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver(){
    swal({
      title: `Fim de jogo!`,
      text: "Oopss você perdeu a corrida",
      imageUrl: "https://i.postimg.cc/V5ydXyqj/deslike.png",
      imageSize: "100x100",
      confirmButtonText:"Obrigado por Jogar"

    })
  }

  mostrarPlacar() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
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

  controle() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
      this.movendo = true;
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
    }
  }

  
}
