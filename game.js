const canvas = document.getElementById('game_canvas');
const ctx = canvas.getContext('2d');

//grafika szopa pobrana z darmowej strony  albo licencja creative-commons
//htpps://null-painter-error.itch.io/cute-racoon-2d-game-sprite-and-animations


const backgroundImage = new Image();
backgroundImage.src = '/assets/background.png'

const imageOn = new Image();
imageOn.src = '/assets/on.png'

const imageOff = new Image();
imageOff.src = '/assets/off.png'

const imageIdle = new Image();
imageIdle.src = '/assets/idle.png';

const imageWalkLeft = new Image();
imageWalkLeft.src = '/assets/walk_l.png';

const imageWalkRight = new Image();
imageWalkRight.src = '/assets/walk_r.png';

///////////////////////////////////////////////////////////

let decimalNumber = Math.floor(Math.random() * 255) + 1;

const checkWin = () => {

    let currentDecimalValue = 0;
    for (let i = 0; i <8; i++){
        currentDecimalValue += buttons[i].value * Math.pow(2, 7-i);
    }

    ctx.fillStyle = "#ffd38d";
    ctx.font = "32px Arial";
    ctx.fillText(currentDecimalValue, 15, 40);

    if (currentDecimalValue == decimalNumber){
        ctx.fillStyle = "#32140f";
        ctx.fillRect(300, 20, 630, 70);
        ctx.fillStyle = "#ffd38d";
        ctx.font = "48px Arial";
        ctx.fillText("Poprawna liczba! You Win!", 330, 70);
    }
}

//////////////////////////////////////////////////////////

const cursor = {
    x:0,
    y:0
}

canvas.addEventListener('click', (event) => {

    let gameRectangle = canvas.getBoundingClientRect() //Rozmiar elementu i jego położenie względem okna przeglądarki (obiekt)
    cursor.x = event.clientX - gameRectangle.left;
    cursor.y = event.clientY - gameRectangle.top;

    if(cursor.x >= 1030 && cursor.x <= 1150 && cursor.y >= 730 && cursor.y <= 780){
        decimalNumber = Math.floor(Math.random() * 255) + 1;
        //resetowanie wszystkich przycisków
        for(let i = 0; i < 8; i++){
            buttons[i].img = imageOff;
            buttons[i].switched = false;
            buttons[i].value = 0;
        }
        drawUI();
    }
    
});

//efekt cursor pointer dla przycisku
canvas.addEventListener('mousemove', (event) => {
    
    let gameRectangle = canvas.getBoundingClientRect() //Rozmiar elementu i jego położenie względem okna przeglądarki (obiekt)
    cursor.x = event.clientX - gameRectangle.left;
    cursor.y = event.clientY - gameRectangle.top;
    
    if(cursor.x >= 1030 && cursor.x <= 1150 && cursor.y >= 730 && cursor.y <= 780){
        canvas.style.cursor = 'pointer';
    }else{
        canvas.style.cursor = 'auto';
    }
    
});

/////////////////////////////////////////////////////////////////////////
const key = {
    a:{pressed: false},
    d:{pressed: false},
    w:{pressed: false}
}

let currentKey = '';

window.addEventListener('keydown', (event) =>{

    if (event.key == 'a' || event.key == 'ArrowLeft') {
        key.a.pressed = true;
        currentKey = 'a'
    }

    if (event.key == 'd') {
        key.d.pressed = true;
        currentKey = 'd'
    }

    if (event.key == 'w') {
        key.w.pressed = true;
        currentKey = 'w'
    }
});

window.addEventListener('keyup', (event) =>{
    if (event.key == 'a') {
        key.a.pressed = false;
        racoon.state = 'idle';
    }

    if (event.key == 'd') {
        key.d.pressed = false;
        racoon.state = 'idle';
    }

    if (event.key == 'w') {
        key.w.pressed = false;
        racoon.state = 'idle';
    }
});

/////////////////////////////////////////////////////////////////////////

const drawUI = () => {
    
    //napis na dole canvasa
    ctx.font = "42px Arial";
    ctx.fillStyle = "#ffd38d";
    ctx.fillText("Liczba dziesiętna do przedstawienia binarnego: " + decimalNumber, 30, 770);
    
    //przycisk za napisem
    ctx.fillStyle = "brown";
    ctx.fillRect(1030, 730, 120, 50);
    ctx.font = "28px Arial";
    ctx.fillStyle = "#ffd38d";
    ctx.fillText("ZMIEŃ", 1045, 765);
    
}

////////////////////////////////////////////////////////////////////////////////

class Character {

    constructor({img, position}) {
        this.img = img;
        this.position = position;
        this.frame = 0;
        this.maxframes = 10;
        this.state = 'idle';
        this.velocity = 0;
        this.weight = 1;
        this.switched = false;
    }

    isStanding(){
        return this.position.y >= 485;
    }

    jump(){
        if (key.w.pressed && this.isStanding()) this.velocity = -20;

        this.position.y += this.velocity;

        if (!this.isStanding()){
            this.velocity += this.weight
            this.switchButton();
        }else{
            this.velocity = 0;
            this.state = 'idle';
            this.switched = false;
        }
    }

    switchButton(){

        for (let i = 0; i < 8; i++ ) {
            let start = i * 150;
            let end = i * 150 +150;

            if(this.position.x+80 >= start && this.position.x +80 <= end && this.position.y <= 300 && !this.switched) {
                if (buttons[i].value ==0) {
                    buttons[i].value = 1;
                    buttons[i].img = imageOn;
                }else{
                    buttons[i].value = 0;
                    buttons[i].img = imageOff;
                }

                this.switched = true;
             //   console.log('switched: '+i);
            }
        }
    }

    draw() {

        ctx.drawImage(this.img, this.frame * 165, 0, 165, 200,this.position.x,this.position.y, 165, 200);

        if (key.d.pressed && currentKey == 'd') {
            this.position.x += 8;
            if (this.position.x >= 1035) this.position.x = 1035;//ograniczenie ruchu do końca canvas
            this.state = 'walk_right';
        }

        else if (key.a.pressed && currentKey == 'a') {
            this.position.x -= 8;
            if (this.position.x <= 0) this.position.x = 0;//ograniczenie ruchu do końca canvas
            this.state = 'walk_left';
        }

        else if (key.w.pressed && currentKey == 'w'){
            this.state = 'jump';
        }

        //podmiana obrazu w zależności od stanu postaci
        if (this.state == 'idle') this.img = imageIdle;
        if (this.state == 'walk_left') this.img = imageWalkLeft;
        if (this.state == 'walk_right') this.img = imageWalkRight;


        if (this.frame < this.maxframes) this.frame++;
        else this.frame = 0;

        this.jump();
    }  
}

const racoon = new Character({
    img: imageIdle,
    position: {x:500, y:485}
})

////////////////////////////////////////////////////////////////////////////////
class Button {
    constructor ({img, pos, nr}) {
        this.img = img;
        this.pos = pos;
        this.nr = nr;
        this.value = 0;
    }

    draw(){
        ctx.drawImage(this.img, this.nr * 150, 110);
    }
}

let buttons = [];

for (let i = 0; i < 8; i++){
    buttons.push(
        new Button({
            img: imageOff,
            pos: {x:150, y:0},
            nr: i
        })
    )

}

////////////////////////////////////////////////////////////////////////////////

const animate = () =>{
    
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0);
    drawUI();

    
    for (let i = 0; i < 8; i++){
        buttons[i].draw();
    }
    
    racoon.draw();
    checkWin();
    requestAnimationFrame(animate);
}

animate();
