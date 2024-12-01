const canvas = document.getElementById('game_canvas');
const ctx = canvas.getContext('2d');

//grafika szopa pobrana z darmowej strony  albo licencja creative-commons
//htpps://null-painter-error.itch.io/cute-racoon-2d-game-sprite-and-animations

const imageIdle = new Image();
imageIdle.src = '/assets/idle.png';

///////////////////////////////////////////////////////////

let decimalNumber = Math.floor(Math.random() * 255) + 1;

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

window.addEventListener('keydown', (e) =>{
//console.log(e);
})
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
    }

    draw() {
        ctx.drawImage(this.img, this.frame * 165, 0, 165, 200,this.position.x,this.position.y, 165, 200);

        if (this.frame < this.maxframes) this.frame++;
        else this.frame = 0;
    }

}

const racoon = new Character({
    img: imageIdle,
    position: {x:500, y:485}
})

////////////////////////////////////////////////////////////////////////////////

const animate = () =>{
    
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    drawUI();

    racoon.draw();

    requestAnimationFrame(animate);
}

animate();
