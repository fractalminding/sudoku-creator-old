let sudoku = new Sudoku(9, 0)
sudoku.fillValues()

let oneSecond = setTimeout(function() {
    ViktorSudoku.init(sudoku.mat)
}, 300)
