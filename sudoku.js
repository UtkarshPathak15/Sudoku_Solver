var numSelected = null;
var tileSelected = null;

var errors = 0;



function intialize(){
    let board = [];

    for(let r=0;r<9;r++)
    {
        board[r] = []
    }

    return board;
}

let solution = intialize();

window.onload = function(){

    var t = document.getElementById('lose');
    t.style.display = 'none';
    
    var xhrRequest  = new XMLHttpRequest();
    xhrRequest.onload = function(){
        var response = JSON.parse(xhrRequest.response)
        // console.log(response)
        board = response.board
        setGame();
        sudokuSolver(solution,0,0,9);
        console.log(solution);
    }

    xhrRequest.open('get','https://sugoku.onrender.com/board?difficulty=medium')
    xhrRequest.send()

    
}




function setGame(){
    // digits 1-9
    for(let i=1;i<=9;i++)
    {
        // <div id="1" class="number"> 1 </div>
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click",selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    for(let r=0;r<9;r++)
    {
        for(let c=0;c<9;c++)
        {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" +c.toString();
            // console.log(board[r][c])
            solution[r][c] = board[r][c];
            if(board[r][c] != 0)
            {
            tile.innerText = board[r][c];
            tile.classList.add("tile-start")
            }
            if(r==2 || r==5)
            {
                tile.classList.add("horizontal-line")
            }

            if(c==2 || c==5)
            {
                tile.classList.add("vertical-line")
            }
            tile.addEventListener("click",selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);

        }
    }
}

function selectNumber(){
    if(numSelected != null)
    {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");

}

function check(board,solution){
    for(let r=0;r<9;r++){
        for(let c=0;c<9;c++){
            if(board[r][c] != solution[r][c])
            return false;
        }
    }

    return true;
}

function selectTile()
{
    let b = document.getElementById("digits");
    let t = document.getElementById('lose');
    let s = document.getElementById('solve');
    if(numSelected){
        if(this.innerText !="")
        return;

        // "0-0" "0-1"...
        let coords = this.id.split("-"); // ["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        
        if(solution[r][c] == numSelected.id)
        {
            this.innerText = numSelected.id;
            board[r][c] = solution[r][c];
            // console.log(board);
            // console.log(solution);
            if(check(board,solution)){
            b.style.display = 'none'; 
            s.style.display = 'none'; 
            t.style.display = 'block';
            t.style.color = "rgb(172, 255, 172)";
            t.innerText = 'You Win !!';
            
            }
            
        }
        else
        {
            errors +=1;
            document.getElementById("errors").innerText = errors;
            if(errors >10)
            {
            b.style.display = 'none'; 
            s.style.display = 'none'; 
            t.style.display = 'block';
            fillBoard();
            errors=errors-1;
            }
        }

    }


}


function fillBoard() {
    let tiles = document.getElementsByClassName("tile");
    let s = document.getElementById('solve');
    s.style.display = 'none'; 
    let m = 0;

    const interval = 50;

    // Create an interval to update the tiles
    const updateInterval = setInterval(function() {
        // Check if m is within the valid range
        if (m < tiles.length) {
            const r = Math.floor(m / 9);
            const c = m % 9;
            tiles[m].innerText = solution[r][c];
            m += 1;
        } else {
            // Stop the interval when all tiles are updated
            clearInterval(updateInterval);
        }
    }, interval);

    
    // console.log(solution);
}


function isValid(solution,i,j,num)
{   

    for(let c=0;c<9;c++){
        if(solution[i][c] == num || solution[c][j] == num){
            return false;
        }
    }

    let si = i-i%3;
    let sj = j-j%3;
    for(let r=si;r<si+3;r++)
    {
        for(let c=sj;c<sj+3;c++)
        {
            if(solution[r][c] == num){
            return false;
        }
        }
    }

    return true;
}

function sudokuSolver(solution, i, j, n)
{
    if(i==n)
    {
    // fillBoard(solution)
    return true;
    }

    if(j==n)
    {
    return sudokuSolver(solution,i+1,0,n);
    }


    if(solution[i][j]!=0)
    {
    return sudokuSolver(solution,i,j+1,n);
    }

    for(let num=1 ; num<=9; num++)
    {
        if(isValid(solution,i,j,num)){
            solution[i][j] = num;
            let subAns = sudokuSolver(solution,i,j+1,n);
            if(subAns){
                return true;
            }
            // backtracking
            solution[i][j] = 0;
        }
    }

    return false;
}


function newPuzzle(){
location.reload();
}


let getPuzzle = document.getElementById("newpuzzle");
let solve = document.getElementById("solve");
// console.log('getPuzzle')
getPuzzle.addEventListener("click",newPuzzle);
solve.addEventListener("click",fillBoard);
