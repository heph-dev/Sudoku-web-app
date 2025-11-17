
function checkingSystem(puzzle_grid, grid) {

    function checkGrid(puzzle_grid, grid) {
        const noEmpty = puzzle_grid.every(row => row.every(cell => cell !== " "));
        if(noEmpty) {
            if(JSON.stringify(puzzle_grid) === JSON.stringify(grid)) {
                alert("✅ Congratulations, you passed, emmerich");
            }
            else alert("❌ Of course you failed, nicole");
        }
        else alert("⏸️ Fill all cells first, nicole");
    }

    const myBtn = document.getElementById("submit-button");

    myBtn.addEventListener("click", () => {
        checkGrid(puzzle_grid, grid);
    });

}

function inputSystem(puzzle_grid) {

    let empty_cell_pos = "";
    let prev_cell;

    function inputToGrid(puzzle_grid, num, pos) {
        pos_row = pos[0];
        pos_col = pos[1];
        puzzle_grid[pos_row][pos_col] = num;
        const cell = document.querySelector('[data-row="'+pos_row+'"][data-col="'+pos_col+'"]');
        cell.innerText = num;
    }

    document.querySelectorAll(".empty-cell").forEach(div => {
        div.addEventListener("click", () => {

            if (prev_cell && prev_cell.innerText == "") {
               prev_cell.style.backgroundColor = ""; 
            }

            empty_cell_pos = div.dataset.row + div.dataset.col;

            div.style.backgroundColor = "#fecea0ff";
            div.innerText = "";
            puzzle_grid[Number(div.dataset.row)][Number(div.dataset.col)] = " ";

            prev_cell = div;

        });
    });

    document.querySelectorAll(".input").forEach(div => {
        div.addEventListener("click", () => {
            if(empty_cell_pos != "") {
                // console.log(div.innerText);  
                inputToGrid(puzzle_grid, Number(div.innerText), empty_cell_pos);
            }
            else alert("⏸️ Pick a cell first, nicole");
            
        });
    });

    // Check if user has clicked away after clicking an empty cell
    document.addEventListener("click", (event) => {
        if (!(event.target.classList.contains("empty-cell") || event.target.classList.contains("input"))) {
            empty_cell_pos = "";
            if(prev_cell.innerText == "") {
                prev_cell.style.backgroundColor = "";
            }
        }
    });

}

function styleEmptyCells() {
    document.querySelectorAll(".cell").forEach(div => {
        if (div.innerText == "") {
            div.classList.add("empty-cell");
        }
        
    });
}

// Creates the HTML structure and adds the values 
function addToHtml(grid) {

    const grid_html = document.getElementById("sudoku-grid");

    // Create 9 subgrids to group cells
    for (let i = 1; i <= 9; i++) {
        const subgrid = document.createElement("div");
        subgrid.id = `subgrid_${i}`;
        subgrid.classList.add("subgrid");           

        grid_html.appendChild(subgrid);
    }

    // Add individual cells to their respective subgrid
    for(let row = 0; row < 9; row++) {

        for(let column = 0; column < 9; column++) { 

            // Generate cell on the HTML
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = grid[row][column];
            cell.dataset.row = row;
            cell.dataset.col = column;

            // Calculate subgrid index
            const subgrid_row = Math.floor(row / 3);
            const subgrid_col = Math.floor(column / 3);
            const subgrid_index = subgrid_row * 3 + subgrid_col;

            // Place the cell into the correct subgrid
            const subgrid = document.getElementById(`subgrid_${subgrid_index+1}`);
            subgrid.appendChild(cell);
            cell.classList.add("subgrid_"+(subgrid_index+1));
                
        }
    }

}


function solve(puzzle_grid, amount_of_solutions = 0) {

    for(let row = 0; row < 9; row++) {
        
        for(let column = 0; column < 9; column++) {

            if(puzzle_grid[row][column] == " ") {

                let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

                // Loop throw the numbers to check if there are valid to put in a specific cell, and then puts them
                // Backtracks if not
                for(let num of numbers) {

                    if(isNumValid(row, column, puzzle_grid, num)) {
                        puzzle_grid[row][column] = num;
                        amount_of_solutions = solve(puzzle_grid, amount_of_solutions); 
                        puzzle_grid[row][column] = " ";

                        // Short-circuit if the amount of solutions is more than 1
                        if(amount_of_solutions > 1) return amount_of_solutions;
                    }

                }
                
                return amount_of_solutions;
            }
        }
    }

    amount_of_solutions++;
    return amount_of_solutions;

}

// Removes values from grid to make it a puzzle
function createPuzzle(grid, missing_spaces) {
    let puzzle_grid = grid.map(row => [...row]);
    
    for(let i = 0; i < missing_spaces; i++) {
        const row = Math.floor(Math.random() * 9);
        const column = Math.floor(Math.random() * 9);
        const num = puzzle_grid[row][column];

        if(puzzle_grid[row][column] == " ") {
            i--;
        }
        else {
            puzzle_grid[row][column] = " ";
            let amount_of_solutions = solve(puzzle_grid);
            if(amount_of_solutions != 1) {
                puzzle_grid[row][column] = num;
                i--;
            }
        }
    }

    return puzzle_grid;
}

// Check if the number is in a specific subgrid
function inSubgrid(row, column, grid, num) {
    const startRow = Math.floor(row / 3) * 3;
    const startColumn = Math.floor(column / 3) * 3;

    for(let i = startRow; i < startRow + 3; i++) {
        for(let j = startColumn; j < startColumn + 3; j++) {
            if(num == grid[i][j]) {
                return true;
            }
        }
    }
    return false;
} 

// Check if Number is valid to put in a specific cell
function isNumValid(row, column, grid, num) {
    let in_row;
    let in_column;
    let in_subgrid;

    // Check if the num is in the row already
    if(grid[row] != undefined) {
        in_row = grid[row].includes(num);
    }
    else in_row = false;

    // Check if the num is in the column already
    in_column = grid.some(subArray => subArray[column] == num);

    // Check if the num is in the subgrid already
    in_subgrid = inSubgrid(row, column, grid, num); 

    // Checks if number already exists in row, column and subgrid
    if(in_row == false && in_column == false && in_subgrid == false) {
        return true;
    }
    else return false;
      
}

// Generate a complete Sudoko grid
function getValidGrid(grid) {

    // Loop through enitre grid
    for(let row = 0; row < 9; row++) {
        
        for(let column = 0; column < 9; column++) {

            if(grid[row][column] == " ") {

                let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                
                // Shuffle numbers for randomness
                for (let i = numbers.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
                }

                // Loop throw the numbers to check if there are valid to put in a specific cell, and then puts them
                // Backtracks if not
                for(let num of numbers) {

                    if(isNumValid(row, column, grid, num)) {
                        grid[row][column] = num;
                        if(getValidGrid(grid)) {

                            // Returns true when Grid is complete
                            return true;
                        }
                        grid[row][column] = " ";
                    }

                }

                // Returns false if no number is valid to put in a specific cell
                return false;
            }
        }
    }

    // Returns true when Grid is complete
    return true;
} 

function main() {

    // Warn User before they close the tab on their browser
    let warnOnLeave = true;

    window.addEventListener("beforeunload", (event) => {
        if (warnOnLeave) {
            event.preventDefault();
            event.returnValue = "";
        }
    });

    const clues = 50;  // default is 30
    const missing_spaces = 81 - clues;  // Amount of missing spaces on grid
 
    let grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    getValidGrid(grid);
    let puzzle_grid = createPuzzle(grid, missing_spaces);

    console.table(grid);
    // console.table(puzzle_grid);

    addToHtml(puzzle_grid);

    styleEmptyCells();

    inputSystem(puzzle_grid);

    checkingSystem(puzzle_grid, grid);
}

main();




