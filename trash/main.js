let getRandomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

let getRandomUniqueArray = function() {
    let startArray = [1,2,3,4,5,6,7,8,9];
    let finishArray = [];
    for (let i = 0; i < 9; i++) {
        let randomPosition = getRandomNumber(0, startArray.length - 1)
        let numberFromStartArray = startArray[randomPosition]
        finishArray.push(numberFromStartArray)
        startArray.splice(randomPosition, 1)
    }
    return finishArray
} 

let getRandomSudokuField = function() {
    for (let trying = 0; trying < 100; trying++) {
        let commonArray = []
        for (let row = 0; row < 9; row++) {
            let rowArray = []
            for (let column = 0; column < 9; column++) {
                rowArray.push([1,2,3,4,5,6,7,8,9])
            }
            commonArray.push(rowArray)
        }
        
        if (isCorrectSudokuField(commonArray)) {
            console.log(commonArray)
            return
        }
    }
    console.log('не подобрано')
}

let isUniqueArray = function(array) {
    
    return new Set(array).size == array.length
}

let isCorrectSudokuField = function(array) {
    let isCorrectColumns = function() {
        for (let column = 0; column < 9; column++) {
            let columnArray = []
            for (let row = 0; row < 9; row++) {
                columnArray.push(array[row][column])
            }
            if (isUniqueArray(columnArray) == false) {
                return false
            }
        }
        return true
    }
    let isCorrectSquares = function() {

    }
    if (isCorrectColumns() /* && isCorrectSquares() */) {
        return true
    } else {
        return false
    }
}

getRandomSudokuField()

/* for (let i = 0; i < 1000; i++) {

} */