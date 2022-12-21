
class Game extends Phaser.Scene {

  constructor() {
    super ('game' );
  }

  preload() {  
   
    this.load.image('fondo', '../imagenes/fondo marino.PNG' );
    this.load.spritesheet('submarino', '../imagenes/sub_avance.png', {frameWidth: 96, frameHeight: 96});
    this.load.spritesheet('submarino_salto', '../imagenes/sub_salto.png', {frameWidth: 96, frameHeight: 96});
    this.load.image('pipe0','../imagenes/cadena.png')
    this.load.spritesheet('pipeArriba0','../imagenes/mina.png',{frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('pipeAbajo0','../imagenes/mina.png',{frameWidth: 64, frameHeight: 64});
    this.load.image('pipe1','../imagenes/coral1.png')
    this.load.image('pipeArriba1','../imagenes/coralArriba2.png')
    this.load.image('pipeAbajo1','../imagenes/coralAbajo2.png')
  }

  create() {
    this.bg = this.add.tileSprite(544, 544, 1088, 1088, 'fondo').setScrollFactor(0);
    this.player = this.physics.add.sprite(50, 100, 'submarino');
    
   
    
		this.anims.create({
			key: 'avance',
			frames: this.anims.generateFrameNumbers('submarino', {start: 0, end: 5}),
			frameRate: 8,
			repeat: -1,
		});

        this.anims.create({
			key: 'luces',
			frames: this.anims.generateFrameNumbers('pipeArriba0', {start: 0, end: 1}),
			frameRate: 3,
			repeat: -1,
		});

        this.anims.create({
            key: 'saltar',
            frames: this.anims.generateFrameNumbers('submarino_salto', {start: 0, end: 3}),
            frameRate: 18,
            repeat: 1,
        });

	this.player.play('avance');

        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 32) {
                this.saltar();
            }
        });

        this.input.on('pointerdown', () => this.saltar());

        this.player.on('animationcomplete', this.animationComplete, this);

        this.nuevaColumna();
        
        

        this.physics.world.on('worldbounds', (body) => {
            this.scene.start('finScene');
        });
    
        this.player.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;

        
  }

animationComplete(animation, frame, sprite) {
	if (animation.key === 'saltar') {
		this.player.play('avance');
	}
}

saltar() {
	this.player.setVelocityY(-200);
    this.player.play('saltar');
}

nuevaColumna() {
	//Una columna es un grupo de cubos
	const columna = this.physics.add.group();
	//Cada columna tendrá un hueco (zona en la que no hay cubos) por dónde pasará el super héroe
	const hueco = Math.floor(Math.random() * 8) + 1;
    const aleatorio = Math.floor(Math.random() * 2);
	for (let i = 0; i < 13; i++) {
    	//El hueco estará compuesto por dos posiciones en las que no hay cubos, por eso ponemos hueco +1
		if (i !== hueco && i !== hueco + 1 && i !== hueco - 1) {
            let minas
            let cubo;
			if (i == hueco - 2) {
                cubo = columna.create(1088, i * 64+32, `pipeArriba${aleatorio}`);
                //minas.add.sprite(1088, i * 64+32, `pipeArriba${aleatorio}`);
                
            } else if (i == hueco + 2) {
                cubo = columna.create(1088, i * 64+32, `pipeAbajo${aleatorio}`);
                //minas.add.sprite(1088, i * 64+32, `pipeArriba${aleatorio}`);
            } else { 
                cubo = columna.create(1088, i * 64+32, `pipe${aleatorio}`);
            }
			cubo.body.allowGravity = false;
            //this.minas.play('luces');
		}
	}
	columna.setVelocityX(-100);
	//Detectaremos cuando las columnas salen de la pantalla...
	columna.checkWorldBounds = true;
	//... y con la siguiente línea las eliminaremos
	columna.outOfBoundsKill = true;
	//Cada 1000 milisegundos llamaremos de nuevo a esta función para que genere una nueva columna
	this.time.delayedCall(3500, this.nuevaColumna, [], this);
    this.physics.add.overlap(this.player, columna, this.hitColumna, null, this);
}

hitColumna() {
	this.scene.start('finScene')
}

update(time){
	this.bg.tilePositionX = time*0.05;
}

}

class escenaFin extends Phaser.Scene {
    constructor(){
        super('finScene')
    }

    preload(){
        this.load.image('fondoFin','../imagenes/pantalla_fin.png')
    }

    create(){
        this.add.sprite(544,416,'fondoFin');

        this.input.on('pointerdown', () => this.volverAJugar())
    }

    volverAJugar(){
        this.scene.start('game');
    }
}

const config = {
  type: Phaser.AUTO,
  width: 1088,
  height: 832,
  scene: [Game,escenaFin],
  
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true
    }
  },
}

let game = new Phaser.Game(config)