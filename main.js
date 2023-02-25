let isOnlyOneSolution = function(boardArray) {
    //console.log(boardArray)
    let counter
  const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  
  function shuffle( array ) {
    let newArray = [...array]
    for ( let i = newArray.length - 1; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ newArray[ i ], newArray[ j ] ] = [ newArray[ j ], newArray[ i ] ];
    }
    return newArray;
  }
  
  
  /*--------------------------------------------------------------------------------------------
  --------------------------------- Check if Location Safe -------------------------------------
  --------------------------------------------------------------------------------------------*/
  
  const rowSafe = (puzzleArray, emptyCell, num) => {
    // -1 is return value of .find() if value not found
    return puzzleArray[ emptyCell.rowIndex ].indexOf(num) == -1 
  }
  const colSafe = (puzzleArray, emptyCell, num) => {
    return !puzzleArray.some(row => row[ emptyCell.colIndex ] == num )
  }
  
  const boxSafe = (puzzleArray, emptyCell, num) => {
    boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3) // Define top left corner of box region for empty cell
    boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3)
    let safe = true
  
    for ( boxRow of [0,1,2] ) {  // Each box region has 3 rows
      for ( boxCol of [0,1,2] ) { // Each box region has 3 columns
        if ( puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] == num ) { // Num is present in box region?
          safe = false // If number is found, it is not safe to place
        }
      }
    }
    return safe
  }
  
  const safeToPlace = ( puzzleArray, emptyCell, num ) => {
    return rowSafe(puzzleArray, emptyCell, num) && 
    colSafe(puzzleArray, emptyCell, num) && 
    boxSafe(puzzleArray, emptyCell, num) 
  }
  
  /*--------------------------------------------------------------------------------------------
  --------------------------------- Obtain Next Empty Cell -------------------------------------
  --------------------------------------------------------------------------------------------*/
  
  const nextEmptyCell = puzzleArray => {
    const emptyCell = {rowIndex: "", colIndex: ""}
  
    puzzleArray.forEach( (row, rowIndex) => {
        if (emptyCell.colIndex !== "" ) return // If this key has already been assigned, skip iteration
        let firstZero = row.find( col => col === 0) // find first zero-element
        if (firstZero === undefined) return; // if no zero present, skip to next row
        emptyCell.rowIndex = rowIndex
        emptyCell.colIndex = row.indexOf(firstZero)
      })
    
    if (emptyCell.colIndex !== "" ) return emptyCell
    // If emptyCell was never assigned, there are no more zeros
    return false
  }
  
  /*--------------------------------------------------------------------------------------------
  --------------------------------- Generate Filled Board -------------------------------------
  --------------------------------------------------------------------------------------------*/
  
  const fillPuzzle = startingBoard => {
    const emptyCell = nextEmptyCell(startingBoard)
    // If there are no more zeros, the board is finished, return it
    if (!emptyCell) return startingBoard
  
    // Shuffled [0 - 9 ] array fills board randomly each pass
    for (num of shuffle(numArray) ) {   
      // counter is a global variable tracking the number of iterations performed in generating a puzzle
      // Most puzzles generate in < 500ms, but occassionally random generation could run in to
      // heavy backtracking and result in a long wait. Best to abort this attempt and restart.
      // 20_000_000 iteration maximum is approximately 1.3 sec runtime.
      // See initializer function for more
      counter++
      if ( counter > 20_000_000 ) throw new Error ("Recursion Timeout")
      if ( safeToPlace( startingBoard, emptyCell, num) ) {
        startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = num // If safe to place number, place it
        // Recursively call the fill function to place num in next empty cell
        if ( fillPuzzle(startingBoard) ) return startingBoard 
        // If we were unable to place the future num, that num was wrong. Reset it and try next value
        startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = 0 
      }
    }
    return false // If unable to place any number, return false, which triggers previous round to go to next num
  }
  
  const newSolvedBoard = _ => {
    const newBoard = boardArray.map(row => row.slice() ) // Create an unaffiliated clone of a fresh board
    fillPuzzle(newBoard) // Populate the board using backtracking algorithm
    return newBoard
  }
  
  /*--------------------------------------------------------------------------------------------
  --------------------------------- Generate Playable Board ------------------------------------
  --------------------------------------------------------------------------------------------*/
  
  const pokeHoles = (startingBoard, holes) => {
    const removedVals = []
  
    while (removedVals.length < holes) {
      const val = Math.floor(Math.random() * 81) // Value between 0-81
      const randomRowIndex = Math.floor(val / 9) // Integer 0-8 for row index
      const randomColIndex = val % 9 
  
      if (!startingBoard[ randomRowIndex ]) continue // guard against cloning error
      if ( startingBoard[ randomRowIndex ][ randomColIndex ] == 0 ) continue // If cell already empty, restart loop
      
      removedVals.push({  // Store the current value at the coordinates
        rowIndex: randomRowIndex, 
        colIndex: randomColIndex, 
        val: startingBoard[ randomRowIndex ][ randomColIndex ] 
      })
      startingBoard[ randomRowIndex ][ randomColIndex ] = 0 // "poke a hole" in the board at the coords
      const proposedBoard = startingBoard.map ( row => row.slice() ) // Clone this changed board
      
      // Attempt to solve the board after removing value. If it cannot be solved, restore the old value.
      // and remove that option from the list
      if ( !fillPuzzle( proposedBoard ) ) {  
        startingBoard[ randomRowIndex ][ randomColIndex ] = removedVals.pop().val 
      }
    }
    return [removedVals, startingBoard]
  }
  
  /*--------------------------------------------------------------------------------------------
  --------------------------------- Initialize -------------------------------------
  --------------------------------------------------------------------------------------------*/
  
  function newStartingBoard  (holes) {
    // Reset global iteration counter to 0 and Try to generate a new game. 
    // If counter reaches its maximum limit in the fillPuzzle function, current attemp will abort
    // To prevent the abort from crashing the script, the error is caught and used to re-run
    // this function
    try {
      counter = 0
      let solvedBoard = newSolvedBoard()  
  
      // Clone the populated board and poke holes in it. 
      // Stored the removed values for clues
      let [removedVals, startingBoard] = pokeHoles( solvedBoard.map ( row => row.slice() ), holes)
  
      return [removedVals, startingBoard, solvedBoard]
      
    } catch (error) {
      return newStartingBoard(holes)
    }
  }
  
  // The board will be completely solved once for each item in the empty cell list.
  // The empty cell array is rotated on each iteration, so that the order of the empty cells
  // And thus the order of solving the game, is different each time.
  // The solution for each attempt is pushed to a possibleSolutions array as a string
  // Multiple solutions are identified by taking a unique Set from the possible solutions
  // and measuring its length. If multiple possible solutions are found at any point
  // If will return true, prompting the pokeHoles function to select a new value for removal.
  
  function multiplePossibleSolutions (boardToCheck) {
    //console.log(boardToCheck)
    const possibleSolutions = []
    const emptyCellArray = emptyCellCoords(boardToCheck)
    for (let index = 0; index < emptyCellArray.length; index++) {
      // Rotate a clone of the emptyCellArray by one for each iteration
      emptyCellClone = [...emptyCellArray]
      const startingPoint = emptyCellClone.splice(index, 1);
      emptyCellClone.unshift( startingPoint[0] ) 
      thisSolution = fillFromArray( boardToCheck.map( row => row.slice() ) , emptyCellClone)
      possibleSolutions.push( thisSolution.join() )
      
      if (Array.from(new Set(possibleSolutions)).length > 1 ) {
        //console.log(possibleSolutions)
        return true
      }
    }
    
    return false
  }
  
  // This will attempt to solve the puzzle by placing values into the board in the order that
  // the empty cells list presents
  function fillFromArray(startingBoard, emptyCellArray) {
    const emptyCell = nextStillEmptyCell(startingBoard, emptyCellArray)
    if (!emptyCell) return startingBoard
    let pokeCounter = 0
    for (num of shuffle(numArray) ) {   
      pokeCounter++
      if ( pokeCounter > 60_000_000 ) throw new Error ("Poke Timeout")
      if ( safeToPlace( startingBoard, emptyCell, num) ) {
        startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = num 
        if ( fillFromArray(startingBoard, emptyCellArray) ) return startingBoard 
        startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = 0 
      }
    }
    return false
  }
  
  // As numbers get placed, not all of the initial cells are still empty.
  // This will find the next still empty cell in the list
  function nextStillEmptyCell (startingBoard, emptyCellArray) {
    for (coords of emptyCellArray) {
      if (startingBoard[ coords.row ][ coords.col ] === 0) return {rowIndex: coords.row, colIndex: coords.col}
    }
    return false
  }
  
  // Generate array from range, inclusive of start & endbounds.
  const range = (start, end) => {
    const length = end - start + 1
    return Array.from( {length} , ( _ , i) => start + i)
  }
  
  // Get a list of all empty cells in the board from top-left to bottom-right
  function emptyCellCoords (startingBoard) {
    const listOfEmptyCells = []
    for (const row of range(0,8)) {
      for (const col of range(0,8) ) {
        if (startingBoard[row][col] === 0 ) listOfEmptyCells.push( {row, col } )
      }
    }
    return listOfEmptyCells
  }

  if (multiplePossibleSolutions(boardArray)) {
    return false
  } else {
    return true
  }

}
// JS program to implement the approach

/* let checkButton = document.querySelector('#check-button')
checkButton.onclick = function() {
  
} */

let showHideEmptyButton = document.querySelector('#show-hide-empty-button')
showHideEmptyButton.onclick = function() {
    let whiteCells = document.querySelectorAll('.white-cell')
    let cells = document.querySelectorAll('.cell')
    if (whiteCells.length == 0) {
        for (let cell of cells) {
            cell.classList.add('white-cell')
        }
    } else {
        for (let cell of cells) {
            cell.classList.remove('white-cell')
        }
    }
}

let clearFillAllButton = document.querySelector('#clear-fill-all-button')
clearFillAllButton.onclick = function() {
    let cells = document.querySelectorAll('.cell')
    let activeCells = document.querySelectorAll('.active-cell')
    if (activeCells.length == 81) {
        for (cell of cells) {
            cell.classList.remove('active-cell')
        }
    } else {
        for (cell of cells) {
            cell.classList.add('active-cell')
        }
    }

    let wrote = document.querySelector('#wrote')
    let amountOfFilledCells = document.querySelectorAll('.active-cell')
    wrote.innerHTML = amountOfFilledCells.length
}

let changeOnBoard = function(type, first, second) {
  let cells = document.querySelectorAll('#board .cell')
  if (type == 1) {
    //башни
    let firstTowerArray = []
    let firstTowerActiveArray = []
    let secondTowerArray = []
    let secondTowerActiveArray = []
    for (let i = (first * 3 - 3); i <= 81 - (6 - first); i += 9) {
      for(let j = i; j < i + 3; j++) {
        firstTowerArray.push(cells[j].innerHTML)
        if (cells[j].classList.contains('active-cell')) {
          firstTowerActiveArray.push(true)
        } else {
          firstTowerActiveArray.push(false)
        }
      }
    }
    for (let i = (second * 3 - 3); i <= 81 - (6 - second); i += 9) {
      for(let j = i; j < i + 3; j++) {
        secondTowerArray.push(cells[j].innerHTML)
        if (cells[j].classList.contains('active-cell')) {
          secondTowerActiveArray.push(true)
        } else {
          secondTowerActiveArray.push(false)
        }
      }
    }
    let localArrayIndex = 0
    for (let i = (first * 3 - 3); i <= 81 - (6 - first); i += 9) {
      for(let j = i; j < i + 3; j++) {
        cells[j].innerHTML = secondTowerArray[localArrayIndex]
        if (secondTowerActiveArray[localArrayIndex] == true) {
          if (!cells[j].classList.contains('active-cell')) {
            cells[j].classList.add('active-cell')
          }
        } else {
          if (cells[j].classList.contains('active-cell')) {
            cells[j].classList.remove('active-cell')
          }
        }
        localArrayIndex++
      }
    }
    localArrayIndex = 0
    for (let i = (second * 3 - 3); i <= 81 - (6 - second); i += 9) {
      for(let j = i; j < i + 3; j++) {
        cells[j].innerHTML = firstTowerArray[localArrayIndex]
        if (firstTowerActiveArray[localArrayIndex] == true) {
          if (!cells[j].classList.contains('active-cell')) {
            cells[j].classList.add('active-cell')
          }
        } else {
          if (cells[j].classList.contains('active-cell')) {
            cells[j].classList.remove('active-cell')
          }
        }
        localArrayIndex++
      }
    }
    //console.log(firstTowerArray)
    
  }
  if (type == 2) {
    //ряды
    let firstRowArray = []
    let firstRowActiveArray = []
    let secondRowArray = []
    let secondRowActiveArray = []
    for (let i = (first - 1) * 27; i < first * 27; i += 9) {
      for(let j = i; j < i + 9; j++) {
        firstRowArray.push(cells[j].innerHTML)
        if (cells[j].classList.contains('active-cell')) {
          firstRowActiveArray.push(true)
        } else {
          firstRowActiveArray.push(false)
        }
      }
    }
    for (let i = (second - 1) * 27; i < second * 27; i += 9) {
      for(let j = i; j < i + 9; j++) {
        secondRowArray.push(cells[j].innerHTML)
        if (cells[j].classList.contains('active-cell')) {
          secondRowActiveArray.push(true)
        } else {
          secondRowActiveArray.push(false)
        }
      }
    }
    let localArrayIndex = 0
    for (let i = (first - 1) * 27; i < first * 27; i += 9) {
      for(let j = i; j < i + 9; j++) {
        cells[j].innerHTML = secondRowArray[localArrayIndex]
        if (secondRowActiveArray[localArrayIndex] == true) {
          if (!cells[j].classList.contains('active-cell')) {
            cells[j].classList.add('active-cell')
          }
        } else {
          if (cells[j].classList.contains('active-cell')) {
            cells[j].classList.remove('active-cell')
          }
        }
        localArrayIndex++
      }
    }
    localArrayIndex = 0;
    for (let i = (second - 1) * 27; i < second * 27; i += 9) {
      for(let j = i; j < i + 9; j++) {
        cells[j].innerHTML = firstRowArray[localArrayIndex]
        if (firstRowActiveArray[localArrayIndex] == true) {
          if (!cells[j].classList.contains('active-cell')) {
            cells[j].classList.add('active-cell')
          }
        } else {
          if (cells[j].classList.contains('active-cell')) {
            cells[j].classList.remove('active-cell')
          }
        }
        localArrayIndex++
      }
    }
  }
  if (type == 3) {
    //столбцы
    let firstColumnArray = []
    let firstColumnActiveArray = []
    let secondColumnArray = []
    let secondColumnActiveArray = []
    
    for (let i = first - 1; i < 81; i += 9) {
      firstColumnArray.push(cells[i].innerHTML)
      if (cells[i].classList.contains('active-cell')) {
        firstColumnActiveArray.push(true)
      } else {
        firstColumnActiveArray.push(false)
      }
    }
    
    for (let i = second - 1; i < 81; i += 9) {
      secondColumnArray.push(cells[i].innerHTML)
      if (cells[i].classList.contains('active-cell')) {
        secondColumnActiveArray.push(true)
      } else {
        secondColumnActiveArray.push(false)
      }
    }
    //console.log(secondColumnArray)
    for (let i = first - 1; i < 81; i += 9) {
      cells[i].innerHTML = secondColumnArray[(i - (first - 1)) / 9]
      if (secondColumnActiveArray[(i - (first - 1)) / 9] == true) {
        if (!cells[i].classList.contains('active-cell')) {
          cells[i].classList.add('active-cell')
        }
      } else {
        if (cells[i].classList.contains('active-cell')) {
          cells[i].classList.remove('active-cell')
        }
      }
    }
    //console.log(first)
    for (let i = second - 1; i < 81; i += 9) {
      //console.log((i - (second - 1)) / 9)
      cells[i].innerHTML = firstColumnArray[(i - (second - 1)) / 9]
      if (firstColumnActiveArray[(i - (second - 1)) / 9] == true) {
        if (!cells[i].classList.contains('active-cell')) {
          cells[i].classList.add('active-cell')
        }
      } else {
        if (cells[i].classList.contains('active-cell')) {
          cells[i].classList.remove('active-cell')
        }
      }
    }
  }
  if (type == 4) {
    //строки
    let firstStringArray = []
    let firstStringActiveArray = []
    let secondStringArray = []
    let secondStringActiveArray = []
    for (let i = (first-1) * 9; i < (first-1) * 9 + 9; i++) {
      firstStringArray.push(cells[i].innerHTML)
      if (cells[i].classList.contains('active-cell')) {
        firstStringActiveArray.push(true)
      } else {
        firstStringActiveArray.push(false)
      }
    }
    for (let i = (second-1) * 9; i < (second-1) * 9 + 9; i++) {
      secondStringArray.push(cells[i].innerHTML)
      if (cells[i].classList.contains('active-cell')) {
        secondStringActiveArray.push(true)
      } else {
        secondStringActiveArray.push(false)
      }
    }
    //console.log(firstStringArray)
    for (let i = (first-1) * 9; i < (first-1) * 9 + 9; i++) {
      cells[i].innerHTML = secondStringArray[i - ((first - 1) * 9)]

      if (secondStringActiveArray[i - ((first - 1) * 9)] == true) {
        if (!cells[i].classList.contains('active-cell')) {
          cells[i].classList.add('active-cell')
        }
      } else {
        if (cells[i].classList.contains('active-cell')) {
          cells[i].classList.remove('active-cell')
        }
      }
    }
    for (let i = (second-1) * 9; i < (second-1) * 9 + 9; i++) {

      cells[i].innerHTML = firstStringArray[i - ((second - 1) * 9)]
      if (firstStringActiveArray[i - ((second - 1) * 9)] == true) {
        if (!cells[i].classList.contains('active-cell')) {
          cells[i].classList.add('active-cell')
        }
      } else {
        if (cells[i].classList.contains('active-cell')) {
          cells[i].classList.remove('active-cell')
        }
      }
    }
    //console.log(firstStringActiveArray)
  }
  if (type == 5) {
    //цифры
    let firstArray = []
    let secondArray = []
    for (let elem of cells) {
      if (elem.innerHTML == first) {
        firstArray.push(elem)
      }
      if (elem.innerHTML == second) {
        secondArray.push(elem)
      }
    }
    for (let elem of firstArray) {
      elem.innerHTML = second
    }
    for (let elem of secondArray) {
      elem.innerHTML = first
    }
  }
}

let changePanelButton = document.querySelector('#change-panel-button')
changePanelButton.onclick = function() {
  let checkedRadio = document.querySelector('#change-panel :checked').value
  let firstToChange = document.querySelector('#first-to-change').value
  let secondToChange = document.querySelector('#second-to-change').value
  changeOnBoard(+(checkedRadio), +(firstToChange), +(secondToChange))
}

let leftRightArrow = document.querySelector('#left-right-arrow')
leftRightArrow.onclick = function() {
  let cells = document.querySelectorAll('#board .cell')
  let actives = []
  let values = []
  for (let cell of cells) {
    values.push(cell.innerHTML)
    if (cell.classList.contains('active-cell')) {
      actives.push(true)
    } else {
      actives.push(false)
    }
  }
  let globalIndex = 0;
  for (let i = 0; i < 81; i += 9) {
    for (let j = 9; j > 0; j--) {
      let localIndex = i + j - 1
      //console.log(index)
      cells[globalIndex].innerHTML = values[localIndex]
      if (actives[localIndex] == true) {
        if (!cells[globalIndex].classList.contains('active-cell')) {
          cells[globalIndex].classList.add('active-cell')
        }
      } else {
        if (cells[globalIndex].classList.contains('active-cell')) {
          cells[globalIndex].classList.remove('active-cell')
        }
      }
      globalIndex++
    }
  }
}

let upDownArrow = document.querySelector('#up-down-arrow')
upDownArrow.onclick = function() {
  let cells = document.querySelectorAll('#board .cell')
  let actives = []
  let values = []
  for (let cell of cells) {
    values.push(cell.innerHTML)
    if (cell.classList.contains('active-cell')) {
      actives.push(true)
    } else {
      actives.push(false)
    }
  }
  //console.log (values)
  let globalIndex = 0;
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      let localIndex = 81 - (9 - y) - x * 9
      //console.log(globalIndex, localIndex)
      //console.log(x, y)
      cells[globalIndex].innerHTML = values[localIndex]
      if (actives[localIndex] == true) {
        if (!cells[globalIndex].classList.contains('active-cell')) {
          cells[globalIndex].classList.add('active-cell')
        }
      } else {
        if (cells[globalIndex].classList.contains('active-cell')) {
          cells[globalIndex].classList.remove('active-cell')
        }
      }
      globalIndex++ 
    }
  }
}
let turnArrow = document.querySelector('#turn-arrow')
turnArrow.onclick = function() {
  let cells = document.querySelectorAll('#board .cell')
  let actives = []
  let values = []
  for (let cell of cells) {
    values.push(cell.innerHTML)
    if (cell.classList.contains('active-cell')) {
      actives.push(true)
    } else {
      actives.push(false)
    }
  }
  let globalIndex = 0;
  for (let x = 0; x <= 8; x++) {
    for (let y = x + 9 * 8; y >= x; y -= 9) {
      //let localIndex = x + y * 9
      let localIndex = globalIndex
      //console.log(globalIndex, localIndex)
      //console.log(x, y)
      cells[globalIndex].innerHTML = values[y]
      if (actives[y] == true) {
        if (!cells[globalIndex].classList.contains('active-cell')) {
          cells[globalIndex].classList.add('active-cell')
        }
      } else {
        if (cells[globalIndex].classList.contains('active-cell')) {
          cells[globalIndex].classList.remove('active-cell')
        }
      }
      globalIndex++ 
    }
  }
}