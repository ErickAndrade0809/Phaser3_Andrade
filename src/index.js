
export class Game extends Phaser.Scene {

  constructor() {
    super({ key: 'game' });
  }

  preload() {
    resize();
    window.addEventListener('resize',resize,false);
    this.load.image('fondo', '../imagenes/fondo marino.PNG' );
    this.load.spritesheet('submarino', '../imagenes/subamarino_avance.png', {frameWidth: 50, frameHeight: 50});
    this.load.image('pipe','../imagenes/cadena.png')
    this.load.image('pipeMina','../imagenes/mina.png')
    this.load.image('pipe2','../imagenes/cadena.png')
    this.load.image('pipecoral','../imagenes/mina.png')
  }

  create() {
    this.add.sprite(480,320, 'fondo')
    this.player = this.physics.add.sprite(50, 100, 'submarino');
    
		this.anims.create({
			key: 'avance',
			frames: this.anims.generateFrameNumbers('submarino', {start: 0, end: 1}),
			frameRate: 10,
			repeat: -1,
		});

        /*this.anims.create({
            key: 'saltar',
            frames: this.anims.generateFrameNumbers('heroe', {start: 2, end: 2}),
            frameRate: 7,
            repeat: 1,
        });*/

		this.player.play('avance');

        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 32) {
                this.saltar();
            }
        });

        this.input.on('pointerdown', () => this.saltar());

        this.player.on('animationcomplete', this.animationComplete, this);

        this.nuevaColumna();

  }

saltar() {
	this.player.setVelocityY(-200);
}

animationComplete(animation, frame, sprite) {
	if (animation.key === 'saltar') {
		this.player.play('volar');
	}
}

nuevaColumna() {
	//Una columna es un grupo de cubos
	const columna = this.physics.add.group();
	//Cada columna tendrá un hueco (zona en la que no hay cubos) por dónde pasará el super héroe
	const hueco = Math.floor(Math.random() * 5) + 1;
	for (let i = 0; i < 8; i++) {
    	//El hueco estará compuesto por dos posiciones en las que no hay cubos, por eso ponemos hueco +1
		if (i !== hueco && i !== hueco + 1 && i !== hueco - 1) {

            let cubo;
			if (i == hueco - 2) {
                cubo = columna.create(960, i * 100, 'pipeMina');
            } else if (i == hueco + 2) {
                cubo = columna.create(960, i * 100, 'pipeMina');
            } else {
                cubo = columna.create(960, i * 100, 'pipe');
            }
			cubo.body.allowGravity = false;
		}
	}
	columna.setVelocityX(-200);
	//Detectaremos cuando las columnas salen de la pantalla...
	columna.checkWorldBounds = true;
	//... y con la siguiente línea las eliminaremos
	columna.outOfBoundsKill = true;
	//Cada 1000 milisegundos llamaremos de nuevo a esta función para que genere una nueva columna
	this.time.delayedCall(1000, this.nuevaColumna, [], this);
    this.physics.add.overlap(this.player, columna, this.hitColumna, null, this);
}

hitColumna() {
	alert('game over');
}

}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  scene: [Game],
  scale:{
    mode: Phaser.scale.FIT
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true
    }
  },
}
