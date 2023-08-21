const cell_length = 10;
const cell_border = 2;
const cell_total_length = cell_length + (2 * cell_border);

const board_width = 80;
const board_height = 40;
const speed = 50;

let board = []
let sim_running = false

const board_div = document.getElementById("board");
const sim_button = document.getElementById("simulation-btn")
const clear_button = document.getElementById("clear-btn")
const random_button = document.getElementById("random-btn")
const random_multiplier = document.getElementById("random-multiplier")


class cell {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.alive = false;
        this.neighbors = 0;

        this.topRow     = false;
        this.bottomRow  = false;
        this.rightCol   = false; 
        this.leftCol    = false;

        this.updateCriticalRowCol()
        
        this.cell_div = document.createElement("div");
        this.cell_div.style.width = cell_length + "px";
        this.cell_div.style.height = cell_length + "px";
        board_div.append(this.cell_div);

        this.cell_div.addEventListener("click", this.onClick);
    }

    onClick = () => {
        if(this.alive){
            this.cell_div.style.backgroundColor = "#1E1E1E";
        }
        else {
            this.cell_div.style.backgroundColor = "#FFFFFF";
        }
        this.alive = !this.alive;
    }

    updateCriticalRowCol = () => {
        if(this.y == 0)                     this.topRow = true;
        if(this.y == board_height - 1)      this.bottomRow = true;
        if(this.x == 0)                     this.leftCol = true;
        if(this.x == board_width - 1)       this.rightCol = true;
    }

    numOfAliveNeighbors = () => {
        this.neighbors = 0;
        if(!this.rightCol)          this.neighbors += board[this.y][this.x + 1].aliveOrDead();
        if(!this.leftCol)           this.neighbors += board[this.y][this.x - 1].aliveOrDead();
        if(!this.topRow)            this.neighbors += board[this.y - 1][this.x].aliveOrDead();
        if(!this.bottomRow)         this.neighbors += board[this.y + 1][this.x].aliveOrDead();

        if(!this.rightCol && !this.bottomRow)           this.neighbors += board[this.y + 1][this.x + 1].aliveOrDead();
        if(!this.leftCol && !this.bottomRow)            this.neighbors += board[this.y + 1][this.x - 1].aliveOrDead();
        if(!this.rightCol && !this.topRow)              this.neighbors += board[this.y - 1][this.x + 1].aliveOrDead();
        if(!this.leftCol && !this.topRow)               this.neighbors += board[this.y - 1][this.x - 1].aliveOrDead();
    }

    sim = () => {
        if(this.alive){
            if((this.neighbors < 2) || (this.neighbors > 3))  this.makeDead();
            else this.makeAlive();
        }
        else{
            if(this.neighbors == 3)  this.makeAlive();
        }
    }

    aliveOrDead = () => {
        if(this.alive) return 1;
        else return 0;
    }

    makeDead = () => {
        this.alive = false;
        this.cell_div.style.backgroundColor = "#1E1E1E";
    }

    makeAlive = () => {
        this.alive = true;
        this.cell_div.style.backgroundColor = "#FFFFFF";
    }
}

const createBoard = () => {
    board_div.style.width = (board_width * cell_total_length) + "px";
    board_div.style.height = (board_height * cell_total_length) + "px";

    for(let y = 0; y < board_height; y++){
        let row = []
        for(let x = 0; x < board_width; x++){
            row.push(new cell(x,y))
        }
        board.push(row)
    }
}

const runSim = () => {
    if(sim_running){
        board.forEach(row => row.forEach(currentCell => currentCell.numOfAliveNeighbors()))
        board.forEach(row => row.forEach(currentCell => currentCell.sim()))
        setTimeout(runSim,speed)
    }
}

const random_board = () => {
    clear_board();
    if(!sim_running){
            board.forEach(row => row.forEach(currentCell => {
            if(Math.floor(Math.random() * random_multiplier.value) == 0){
                currentCell.makeAlive();
            }
        }))
    }
}

const clear_board = () => {
    if(!sim_running){
        board.forEach(row => row.forEach(currentCell => currentCell.makeDead()))
    }
}



window.onload = function(){
    createBoard();
    sim_button.addEventListener("click", () => {
        sim_running = !sim_running;
        if(sim_running)     sim_button.innerText = "Stop Simulation";
        else                sim_button.innerText = "Start Simulation";
        runSim();
    });

    clear_button.addEventListener("click", clear_board)

    random_button.addEventListener("click", random_board)
}