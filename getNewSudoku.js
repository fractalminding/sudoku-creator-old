class Sudoku {
 
    // Constructor
    constructor(N, K) {
        this.N = N;
        this.K = K;
 
        // Compute square root of N
        const SRNd = Math.sqrt(N);
        this.SRN = Math.floor(SRNd);
 
        // Initialize all entries as false to indicate
        // that there are no edges initially
        this.mat = Array.from({
            length: N
        }, () => Array.from({
            length: N
        }, () => 0));
    }
 
    // Sudoku Generator
    fillValues() {
        // Fill the diagonal of SRN x SRN matrices
        this.fillDiagonal();
 
        // Fill remaining blocks
        this.fillRemaining(0, this.SRN);
 
        // Remove Randomly K digits to make game
        this.removeKDigits();
    }
 
    // Fill the diagonal SRN number of SRN x SRN matrices
    fillDiagonal() {
        for (let i = 0; i < this.N; i += this.SRN) {
            // for diagonal box, start coordinates->i==j
            this.fillBox(i, i);
        }
    }
 
    // Returns false if given 3 x 3 block contains num.
    unUsedInBox(rowStart, colStart, num) {
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                if (this.mat[rowStart + i][colStart + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }
 
    // Fill a 3 x 3 matrix.
    fillBox(row, col) {
        let num = 0;
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                while (true) {
                    num = this.randomGenerator(this.N);
                    if (this.unUsedInBox(row, col, num)) {
                        break;
                    }
                }
                this.mat[row + i][col + j] = num;
            }
        }
    }
 
    // Random generator
    randomGenerator(num) {
        return Math.floor(Math.random() * num + 1);
    }
 
    // Check if safe to put in cell
    checkIfSafe(i, j, num) {
        return (
            this.unUsedInRow(i, num) &&
            this.unUsedInCol(j, num) &&
            this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num)
        );
    }
 
    // check in the row for existence
    unUsedInRow(i, num) {
        for (let j = 0; j < this.N; j++) {
            if (this.mat[i][j] === num) {
                return false;
            }
        }
        return true;
    }
 
    // check in the row for existence
    unUsedInCol(j, num) {
        for (let i = 0; i < this.N; i++) {
            if (this.mat[i][j] === num) {
                return false;
            }
        }
        return true;
    }
 
    // A recursive function to fill remaining
    // matrix
    fillRemaining(i, j) {
        // Check if we have reached the end of the matrix
        if (i === this.N - 1 && j === this.N) {
            return true;
        }
 
        // Move to the next row if we have reached the end of the current row
        if (j === this.N) {
            i += 1;
            j = 0;
        }
 
 
        // Skip cells that are already filled
        if (this.mat[i][j] !== 0) {
            return this.fillRemaining(i, j + 1);
        }
 
        // Try filling the current cell with a valid value
        for (let num = 1; num <= this.N; num++) {
            if (this.checkIfSafe(i, j, num)) {
                this.mat[i][j] = num;
                if (this.fillRemaining(i, j + 1)) {
                    return true;
                }
                this.mat[i][j] = 0;
            }
        }
 
        // No valid value was found, so backtrack
        return false;
    }
 
    // Print sudoku
    printSudoku() {
        let boardElem = document.querySelector("#board")
        
        for (let i = 0; i < this.N; i++) {
            let boardString = document.createElement('tr')
            //console.log(this.mat[i].join(" "))
            for (let cellValue of this.mat[i]) {
                let boardCell = document.createElement('td')
                boardCell.innerHTML = cellValue
                boardCell.classList.add('cell')
                boardCell.classList.add('active-cell')
                if (i == 2 || i == 5) {
                    boardCell.classList.add('with-down-line')
                }

                boardCell.onclick = function(event) {                    
                    if (event.target.classList.contains('active-cell')) {
                        event.target.classList.remove('active-cell')
                    } else {
                        event.target.classList.add('active-cell')
                    }

                    let checkText = document.querySelector('#check-text')
                    let tdElems = document.querySelectorAll('#board td')
                    // console.log(tdElems)
                    let stringArray = []
                    let finishArray = []
                    for (let cell of tdElems) {
                      if (cell.classList.contains('active-cell')) {
                        stringArray.push(+(cell.innerHTML))
                      } else {
                        stringArray.push(0)
                      }
                    }
                    for (let i = 0; i < 9; i++) {
                      finishArray.push(stringArray.splice(0,9))
                    }
                    //console.log(finishArray)

                    if (isOnlyOneSolution(finishArray)) {
                      checkText.innerHTML = 'Корректно'
                      if (checkText.classList.contains('check-text-incorrect')) {
                        checkText.classList.remove('check-text-incorrect')
                      }
                    } else {
                      checkText.innerHTML = 'Некорректно'
                      if (!checkText.classList.contains('check-text-incorrect')) {
                        checkText.classList.add('check-text-incorrect')
                      }
                    }

                    let wrote = document.querySelector('#wrote')
                    let amountOfFilledCells = document.querySelectorAll('.active-cell')
                    wrote.innerHTML = amountOfFilledCells.length

                }

                boardString.appendChild(boardCell)
            }

            boardElem.appendChild(boardString)
        }
        //console.log(this.mat)
    }
 
    // Remove the K no. of digits to
    // complete game
    removeKDigits() {
        let count = this.K;
 
        while (count !== 0) {
            // extract coordinates i and j
            let i = Math.floor(Math.random() * this.N);
            let j = Math.floor(Math.random() * this.N);
            if (this.mat[i][j] !== 0) {
                count--;
                this.mat[i][j] = 0;
            }
        }
 
        return;
    }
}