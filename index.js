
const canvas = document.querySelector(".canvasBoard");
const video = document.querySelector(".videoPlayer");
const ctx = canvas.getContext('2d');
const arrPlayerVideos = document.getElementsByClassName("reproductor--item");
const basePath = "./Assets/Videos/";
let currentVideoSrc = "";
let commands = document.querySelector("#commands");
let arrMoviesTitles = ["akira","Akira","Kaguya","kaguya","Roronoa","roronoa","Mirai","mirai","Shingeki","shingeki","dxd"];
let maximizeButton = document.querySelector(".Maximize");
let minimizeButton = document.querySelector(".Minimize");
let maximized = false;

class Cell{
    constructor(x,y,symbol, color){
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y)
    }
}


class AsciiEffect{
    #imageCellArray = [];
    #symbols = [];
    #pixels = [];
    #ctx;
    #width;
    #height;

    constructor(ctx,width,height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(video,0,0,this.#width,this.#height);
        this.#pixels = this.#ctx.getImageData(0,0,this.#width,this.#height);
    }


    #convertToSymbol(g){
        if(g > 250) return "@"
        else if (g > 245) return "*";
        else if (g > 240) return "P";
        else if (g > 235) return "/";
        else if (g > 230) return "A";
        else if (g > 225) return "(";
        else if (g > 220) return ")";
        else if (g > 215) return "|";
        else if (g > 210) return "°";
        else if (g > 205) return "L";
        else if (g > 200) return "A";
        else if (g > 195) return "q";
        else if (g > 190) return "w";
        else if (g > 185) return "X";
        else if (g > 180) return "H";
        else if (g > 175) return "J";
        else if (g > 170) return "K";
        else if (g > 165) return "R";
        else if (g > 160) return "T";
        else if (g > 155) return "9";
        else if (g > 150) return "5";
        else if (g > 145) return "7";
        else if (g > 140) return "*";
        else if (g > 135) return "0";
        else if (g > 130) return "1";
        else if (g > 125) return "6";
        else if (g > 120) return "}";
        else if (g > 115) return "¿";
        else if (g > 110) return "?";
        else if (g > 100) return "¡";
        else if (g > 95) return "{";
        else if (g > 90) return "[";
        else if (g > 85) return "0";
        else if (g > 80) return "L";
        else if (g > 75) return "Q";
        else if (g > 70) return "B";
        else if (g > 65) return "E";
        else if (g > 60) return "&";
        else if (g > 55) return "7";
        else if (g > 50) return ":";
        else if (g > 45) return ";";
        else if (g > 40) return "X";
        else if (g > 35) return "C";
        else if (g > 30) return "V";
        else if (g > 25) return "B";
        else if (g > 20) return "N";
        else if (g > 15) return "R";
        else if (g > 10) return "T";
        else if (g > 5) return "E";
        else return " ";
    }


    #scanImage(cellSize){
        this.#imageCellArray = [];
        for(let y = 0; y < this.#pixels.height;y+= cellSize){
            for(let x = 0; x < this.#pixels.width;x+= cellSize){
                const posX = x * 4 ;
                const posY = y * 4 ;
                const pos = (posY * this.#pixels.width) + posX;

                if(this.#pixels.data[pos + 3] >  128){
                    const red = this.#pixels.data[pos] ;
                    const green = this.#pixels.data[pos + 1];
                    const blue = this.#pixels.data[pos] + 2;
                    const total = red + green + blue;
                    const averageColorValue =  total / 3;
                    const color = `rgb(${averageColorValue},${averageColorValue},${averageColorValue})`;
                    const symbol = this.#convertToSymbol(averageColorValue);
                    if(total > 200){
                        this.#imageCellArray.push(new Cell(x,y,symbol,color));
                    }
                }
            }
        }
        console.log(this.#imageCellArray)
    }

    #drawAscii(){
        this.#ctx.clearRect(0,0, this.#width, this.#height);
        for(let i = 0; i < this.#imageCellArray.length; i++){
            this.#imageCellArray[i].draw(this.#ctx)
        }
    }


    draw(cellSize){
        this.#scanImage(cellSize);
        this.#drawAscii();
    }
}


video.addEventListener('loadedmetadata',()=>{
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
})

const frameRate = 10;
video.addEventListener('play',()=>{
    
    //    ctx.drawImage(video,0,0);
    const drawImage = ()=>{
        if(!video.pused){
            let effect = new AsciiEffect(ctx, video.videoWidth,video.videoHeight);
            effect.draw(9)
            setTimeout(drawImage,1000/frameRate)
        }
    }
    setTimeout(drawImage,1000/frameRate)
})

const setVideoSrc = (videoTitle)=>{
    currentVideoSrc =videoTitle;
    currentVideoSrc = basePath + currentVideoSrc.split(" ").join("") + ".mp4";
    video.src = currentVideoSrc;
    video.play()
    setTimeout(drawImage,1000/frameRate)

}


const setEvents = ()=>{
    for (let index = 0; index < arrPlayerVideos.length; index++) {
        arrPlayerVideos[index].addEventListener('click',()=>setVideoSrc(arrPlayerVideos[index].querySelector(".item--title").innerText.split(" ")[0].toLowerCase()))
    }
}

document.addEventListener("keyup", (event)=>{
    if (event.keyCode === 13) {
        let arrCommands = commands.value.split(" ");
        if(arrCommands.length == 2 && arrCommands[0]=="play" && arrMoviesTitles.includes(arrCommands[1])){
            setVideoSrc(arrCommands[1])
        }else if(arrCommands.length==1 && arrCommands[0]=="pause"){
            video.pause()
        }else if(arrCommands.length==1 && arrCommands[0]=="play"){
            video.play()
        }else{
            commands.value = ""
            commands.value = `${arrCommands}:       command not found :(`;
            
        }
        setTimeout(()=>{
            commands.value = ""
        },1000)
        
    }
});


maximizeButton.addEventListener('click',()=>{
})

minimizeButton.addEventListener('click',()=>{
})

setEvents()


