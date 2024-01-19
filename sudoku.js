let ViktorSudoku = {
    init(board) {
        ViktorSudoku.boards.init(board)
        ViktorSudoku.canvas.init()
        ViktorSudoku.modes.init()
        ViktorSudoku.numPad.init()
        ViktorSudoku.actions.init()
        ViktorSudoku.info.init()
        ViktorSudoku.changePanel.init()
        ViktorSudoku.mosaicPanel.init()
        ViktorSudoku.writeTypePanel.init()
        

        ViktorSudoku.info.wrote.update()
        ViktorSudoku.draw()
    },
    boards: {
        init(board) {
            ViktorSudoku.boards.mainBoard = board
            let activeBoard = []
            for (let i = 0; i < 9; i++) {
                activeBoard[i] = []
                for (let j = 0; j < 9; j++) {
                    activeBoard[i][j] = true
                }
            }
            ViktorSudoku.boards.activeBoard = activeBoard
        },
        isExistSuchPosition() {
            let board = ViktorSudoku.boards.getBoardWithZero()
positions: for (let posArray of ViktorSudoku.boards.truePositionsArray) {
i_values:       for (let i = 0; i < 9; i++) {
j_values:           for (let j = 0; j < 9; j++) {
                        if (board[i][j] != posArray[i][j]) {
                            continue positions
                        }
                    }
                }
                return true
            }
            return false
        },
        truePositionsArray: [],
        clear() {
            let activeBoard = ViktorSudoku.boards.activeBoard
            let mainBoard = ViktorSudoku.boards.mainBoard
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    mainBoard[i][j] = 0
                    activeBoard[i][j] = false
                }
            }
            ViktorSudoku.draw()
        },
        getBoardWithZero() {
            let finishArray = []
            for (let y = 0; y < 9; y++) {
                finishArray[y] = []
                for (let x = 0; x < 9; x++) {
                    let isActiveCell = ViktorSudoku.boards.activeBoard[y][x]
                    if (isActiveCell == true) {
                        let value = ViktorSudoku.boards.mainBoard[y][x]
                        finishArray[y].push(value)
                    } else {
                        finishArray[y].push(0)
                    }
                }
            }
            //console.log(finishArray)
            //console.log(ViktorSudoku.boards.mainBoard)
            return finishArray
        }
    },
    mosaicPanel: {
        init() {
            let elem = document.querySelector("#mosaic-panel")
            ViktorSudoku.mosaicPanel.elem = elem
            let tryNumberElem = document.querySelector("#mosaic-try-number")
            ViktorSudoku.mosaicPanel.tryNumberElem = tryNumberElem
            ViktorSudoku.mosaicPanel.button.init()
        },
        button: {
            init() {
                let button = document.querySelector("#mosaic-panel-button")
                button.onclick = ViktorSudoku.mosaicPanel.button.click
            },
            click() {
                let tryNumber = ViktorSudoku.mosaicPanel.tryNumberElem.value
                for (let i = 0; i < tryNumber; i++) {
                    console.log('trying')
                    let newSudoku = new Sudoku(9, 0)
                    newSudoku.fillValues()
                    ViktorSudoku.boards.mainBoard = newSudoku.mat
                    
                    let board = ViktorSudoku.boards.getBoardWithZero()
                    let typeOfSolution = isOnlyOneSolution(board)

                    if (typeOfSolution == 1) {
                        
                        console.log("created!")
                        ViktorSudoku.boards.mainBoard = newSudoku.mat
                        ViktorSudoku.info.checkText.activate()
                        ViktorSudoku.draw('withoutBlue')
                        return
                    } else {
                        ViktorSudoku.info.checkText.disActivate(typeOfSolution)
                    }
                }
                console.log("not found =(")
                ViktorSudoku.mosaicPanel.tryNumberElem.value = 0
            }
        },
        show() {
            let elem = ViktorSudoku.mosaicPanel.elem
            elem.style.display = "inline-block"
        },
        hide() {
            let elem = ViktorSudoku.mosaicPanel.elem
            elem.style.display = "none"
        }
    },
    actions: {
        init() {
            ViktorSudoku.actions.hints.init()
            ViktorSudoku.actions.autoCheck.init()
            ViktorSudoku.actions.download.init()
        },
        hints: {
            init() {
                let elem = document.querySelector("#hints-button")
                ViktorSudoku.actions.hints.elem = elem
                ViktorSudoku.actions.hints.isActive = false
                elem.onclick = ViktorSudoku.actions.hints.click
            },
            activate() {
                let elem = ViktorSudoku.actions.hints.elem
                if (elem.classList.contains("hints-inactive-button")) {
                    elem.classList.remove("hints-inactive-button")
                }
            },
            disActivate() {
                let elem = ViktorSudoku.actions.hints.elem
                if (!elem.classList.contains("hints-inactive-button")) {
                    elem.classList.add("hints-inactive-button")
                }
            },
            click() {
                if (ViktorSudoku.actions.hints.isActive) {
                    ViktorSudoku.actions.hints.disActivate()
                    ViktorSudoku.actions.hints.isActive = false
                } else {
                    ViktorSudoku.actions.hints.activate()
                    ViktorSudoku.actions.hints.isActive = true
                }
                ViktorSudoku.draw()
            }
        },
        autoCheck: {
            init() {
                let elem = document.querySelector("#auto-check-button")
                ViktorSudoku.actions.autoCheck.elem = elem
                ViktorSudoku.actions.autoCheck.isActive = false
                elem.onclick = ViktorSudoku.actions.autoCheck.click
            },
            activate() {
                let elem = ViktorSudoku.actions.autoCheck.elem
                if (elem.classList.contains("auto-check-inactive-button")) {
                    elem.classList.remove("auto-check-inactive-button")
                }
                ViktorSudoku.info.checkText.update()
            },
            disActivate() {
                let elem = ViktorSudoku.actions.autoCheck.elem
                if (!elem.classList.contains("auto-check-inactive-button")) {
                    elem.classList.add("auto-check-inactive-button")
                }
            },
            click() {
                if (ViktorSudoku.actions.autoCheck.isActive) {
                    ViktorSudoku.actions.autoCheck.disActivate()
                    ViktorSudoku.actions.autoCheck.isActive = false
                } else {
                    ViktorSudoku.actions.autoCheck.activate()
                    ViktorSudoku.actions.autoCheck.isActive = true
                }
            }
        },
        download: {
            init() {
                let elem = document.querySelector("#download-button")
                ViktorSudoku.actions.download.elem = elem
                elem.onclick = ViktorSudoku.actions.download.click
            },
            click() {
                let canvas = ViktorSudoku.canvas.elem
                let image = canvas.toDataURL("image/png")
                let link = document.createElement("a")

                let currentDate = new Date()
                let currentDateString = 
                    currentDate.getFullYear()
                    + "_" + (currentDate.getMonth() + 1)
                    + "_" + currentDate.getDate()
                    + "_" + currentDate.getHours()
                    + "_" + currentDate.getMinutes()

                let fileName = currentDateString + ".png"
                
                link.download = fileName
                link.href = ViktorSudoku.canvas.elem.toDataURL()
                link.click()

            }
        }
    },
    changePanel: {
        init() {
            ViktorSudoku.changePanel.buttons.init()
        },
        buttons: {
            init() {
                ViktorSudoku.changePanel.buttons.change.init()
                ViktorSudoku.changePanel.buttons.leftRightMirror.init()
                ViktorSudoku.changePanel.buttons.upDownMirror.init()
                ViktorSudoku.changePanel.buttons.turn.init()
            },
            change: {
                init() {
                    let elem = document.querySelector("#change-panel-button")
                    ViktorSudoku.changePanel.buttons.change.elem = elem
                    elem.onclick = ViktorSudoku.changePanel.buttons.change.click
                },
                click() {
                    //console.log('changeButtonClick')
                    let type = ViktorSudoku.changePanel.getTypeOfChange()
                    let startFinish = ViktorSudoku.changePanel.getStartFinishValues()
                    let start = +(startFinish[0])
                    let finish = +(startFinish[1])

                    let stringNumbers = [
                        [0, 1, 2],
                        [3, 4, 5],
                        [6, 7, 8]
                    ]

                    if (type == "towers") {
                        let firstArray = []
                        let secondArray = []

                        for (let i = 0; i < 9; i++) {
                            for (let j = 0; j < 3; j++) {
                                let firstIndex = stringNumbers[start - 1][j]
                                let secondIndex = stringNumbers[finish - 1][j]
                                let firstValue = ViktorSudoku.boards.mainBoard[i][firstIndex]
                                let firstActiveValue = ViktorSudoku.boards.activeBoard[i][firstIndex]
                                let secondValue = ViktorSudoku.boards.mainBoard[i][secondIndex]
                                let secondActiveValue = ViktorSudoku.boards.activeBoard[i][secondIndex]
                                ViktorSudoku.boards.mainBoard[i][firstIndex] = secondValue
                                ViktorSudoku.boards.activeBoard[i][firstIndex] = secondActiveValue
                                ViktorSudoku.boards.mainBoard[i][secondIndex] = firstValue
                                ViktorSudoku.boards.activeBoard[i][secondIndex] = firstActiveValue
                            }
                        }
                    }
                    if (type == "rows") {
                        let firstArray = []
                        let secondArray = []
                        let firstActivityArray = []
                        let secondActivityArray = []
                        for (let i of (stringNumbers[start - 1])) {
                            let array = ViktorSudoku.boards.mainBoard[i]
                            let activityArray = ViktorSudoku.boards.activeBoard[i]
                            firstArray.push(array)
                            firstActivityArray.push(activityArray)
                        }
                        for (let i of (stringNumbers[finish - 1])) {
                            let array = ViktorSudoku.boards.mainBoard[i]
                            let activityArray = ViktorSudoku.boards.activeBoard[i]
                            secondArray.push(array)
                            secondActivityArray.push(activityArray)
                        }
                        //console.log(firstArray)
                        //console.log(secondArray)
                        for (let i in firstArray) {
                            let index = stringNumbers[start-1][i]
                            ViktorSudoku.boards.mainBoard[index] = secondArray[i]
                            ViktorSudoku.boards.activeBoard[index] = secondActivityArray[i]
                        }
                        for (let i in secondArray) {
                            let index = stringNumbers[finish-1][i]
                            ViktorSudoku.boards.mainBoard[index] = firstArray[i]
                            ViktorSudoku.boards.activeBoard[index] = firstActivityArray[i]
                        }
                        //console.log(ViktorSudoku.boards.mainBoard)
                    }
                    if (type == "columns") {
                        startIndex = start - 1
                        finishIndex = finish - 1
                        for (let y = 0; y < 9; y++) {
                            firstNumber = ViktorSudoku.boards.mainBoard[y][startIndex]
                            firstActivity = ViktorSudoku.boards.activeBoard[y][startIndex]
                            secondNumber = ViktorSudoku.boards.mainBoard[y][finishIndex]
                            secondActivity = ViktorSudoku.boards.activeBoard[y][finishIndex]

                            ViktorSudoku.boards.mainBoard[y][startIndex] = secondNumber
                            ViktorSudoku.boards.mainBoard[y][finishIndex] = firstNumber
                            ViktorSudoku.boards.activeBoard[y][finishIndex] = firstActivity
                            ViktorSudoku.boards.activeBoard[y][startIndex] = secondActivity
                        }
                    }
                    if (type == "strings") {

                        let firstStringIndex = start - 1
                        let firstActiveString = ViktorSudoku.boards.activeBoard[firstStringIndex]
                        let firstString = ViktorSudoku.boards.mainBoard[firstStringIndex]

                        let secondStringIndex = finish - 1
                        let secondActiveString = ViktorSudoku.boards.activeBoard[secondStringIndex]
                        let secondString = ViktorSudoku.boards.mainBoard[secondStringIndex]

                        ViktorSudoku.boards.mainBoard[firstStringIndex] = secondString
                        ViktorSudoku.boards.mainBoard[secondStringIndex] = firstString
                        ViktorSudoku.boards.activeBoard[firstStringIndex] = secondActiveString
                        ViktorSudoku.boards.activeBoard[secondStringIndex] = firstActiveString
                    }
                    if (type == "numbers") {
                        for (let y = 0; y < 9; y++) {
                            for (let x = 0; x < 9; x++) {
                                if (ViktorSudoku.boards.mainBoard[y][x] == start) {
                                    ViktorSudoku.boards.mainBoard[y][x] = finish
                                } else if (ViktorSudoku.boards.mainBoard[y][x] == finish) {
                                    ViktorSudoku.boards.mainBoard[y][x] = start
                                }
                            }
                        }
                    }
                    ViktorSudoku.draw()
                }
            },
            leftRightMirror: {
                init() {
                    let elem = document.querySelector("#left-right-arrow")
                    ViktorSudoku.changePanel.buttons.leftRightMirror.elem = elem
                    elem.onclick = ViktorSudoku.changePanel.buttons.leftRightMirror.click
                },
                click() {
                    let mainBoard = ViktorSudoku.boards.mainBoard
                    let activeBoard = ViktorSudoku.boards.activeBoard
                    let finishBoard = []
                    let finishActiveBoard = []
                    for (let y = 0; y < 9; y++) {
                        finishBoard[y] = []
                        finishActiveBoard[y] = []
                        for (let x = 0; x < 9; x++) {
                            finishBoard[y].unshift(mainBoard[y][x])
                            finishActiveBoard[y].unshift(activeBoard[y][x])
                        }
                    }
                    ViktorSudoku.boards.mainBoard = finishBoard
                    ViktorSudoku.boards.activeBoard = finishActiveBoard
                    ViktorSudoku.draw()
                }
            },
            upDownMirror: {
                init() {
                    let elem = document.querySelector("#up-down-arrow")
                    ViktorSudoku.changePanel.buttons.upDownMirror.elem = elem
                    elem.onclick = ViktorSudoku.changePanel.buttons.upDownMirror.click
                },
                click() {
                    let mainBoard = ViktorSudoku.boards.mainBoard
                    let activeBoard = ViktorSudoku.boards.activeBoard
                    let finishBoard = []
                    let finishActiveBoard = []
                    for (let y = 0; y < 9; y++) {
                        finishBoard.unshift(mainBoard[y])
                        finishActiveBoard.unshift(activeBoard[y])
                    }
                    ViktorSudoku.boards.mainBoard = finishBoard
                    ViktorSudoku.boards.activeBoard = finishActiveBoard
                    ViktorSudoku.draw()
                }
            },
            turn: {
                init() {
                    let elem = document.querySelector("#turn-arrow")
                    ViktorSudoku.changePanel.buttons.turn.elem = elem
                    elem.onclick = ViktorSudoku.changePanel.buttons.turn.click
                },
                click() {
                    let mainBoard = ViktorSudoku.boards.mainBoard
                    let activeBoard = ViktorSudoku.boards.activeBoard
                    let finishBoard = []
                    let finishActiveBoard = []
                    for (let y = 0; y < 9; y++) {
                        finishBoard[y] = []
                        finishActiveBoard[y] = []
                        for (let x = 0; x < 9; x++) {
                            finishBoard[y].push(mainBoard[8 - x][y])
                            finishActiveBoard[y].push(activeBoard[8 - x][y])
                        }
                    }
                    ViktorSudoku.boards.mainBoard = finishBoard
                    ViktorSudoku.boards.activeBoard = finishActiveBoard
                    ViktorSudoku.draw()
                }
            }

        },
        getTypeOfChange() {
            let elem = document.querySelector("#change-panel :checked")
            //console.log("type = ", type)
            return elem.value
        },
        getStartFinishValues() {
            let start = document.querySelector("#first-to-change").value
            let finish = document.querySelector("#second-to-change").value
            return [start, finish]
        }
    },
    info: {
        init() {
            ViktorSudoku.info.wrote.init()
            ViktorSudoku.info.checkText.init()
        },
        wrote: {
            init() {
                let elem = document.querySelector("#wrote")
                ViktorSudoku.info.wrote.elem = elem
                ViktorSudoku.info.wrote.value = 81
            },
            update() {
                let value = 0
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        let cellActivity = ViktorSudoku.boards.activeBoard[i][j]
                        if (cellActivity == true) {
                            value++
                        }
                    }
                }
                ViktorSudoku.info.wrote.value = value
                let elem = ViktorSudoku.info.wrote.elem
                elem.innerHTML = value
            }
        },
        checkText: {
            init() {
                let elem = document.querySelector("#check-text")
                ViktorSudoku.info.checkText.elem = elem
                elem.onclick = ViktorSudoku.info.checkText.click
            },
            click() {
                ViktorSudoku.info.checkText.update()
            },
            activate() {
                let elem = ViktorSudoku.info.checkText.elem
                if (elem.classList.contains('check-text-incorrect')) {
                    elem.classList.remove('check-text-incorrect')
                }
                elem.innerHTML = '1'
            },
            disActivate(type) {
                let elem = ViktorSudoku.info.checkText.elem
                if (!elem.classList.contains('check-text-incorrect')) {
                    elem.classList.add('check-text-incorrect')
                }
                if (type == 0) {
                    elem.innerHTML = '0'
                } else {
                    elem.innerHTML = '>1'
                }
                
            },
            update() {
                let board = ViktorSudoku.boards.getBoardWithZero()
                let typeOfSolution = isOnlyOneSolution(board)

                if (typeOfSolution == 1) {
                    let board = ViktorSudoku.boards.getBoardWithZero()
                    ViktorSudoku.boards.truePositionsArray.push(board)
                    ViktorSudoku.info.checkText.activate()
                } else {
                    ViktorSudoku.info.checkText.disActivate(typeOfSolution)
                }
            }
        }
    },
    writeTypePanel: {
        init() {
            let elem = document.querySelector("#write-type-panel")
            ViktorSudoku.writeTypePanel.elem = elem
        },
        getCurrent() {

        },
        show() {
            elem = ViktorSudoku.writeTypePanel.elem
            elem.style.display = "inline-block"
        },
        hide() {
            elem = ViktorSudoku.writeTypePanel.elem
            elem.style.display = "none"
        }
    },
    modes: {
        init() {
            ViktorSudoku.modes.current = "fromFinish"
            ViktorSudoku.modes.buttons.init()
        },
        buttons: {
            init() {
                ViktorSudoku.modes.buttons.fromFinish.init()
                ViktorSudoku.modes.buttons.fromZero.init()
                ViktorSudoku.modes.buttons.byMosaic.init()
                ViktorSudoku.modes.buttons.handSolving.init()
            },
            fromFinish: {
                init() {
                    ViktorSudoku.modes.buttons.fromFinish.elem = 
                        document.querySelector("#from-finish")
                    let elem = ViktorSudoku.modes.buttons.fromFinish.elem
                    elem.onclick = ViktorSudoku.modes.buttons.fromFinish.click
                },
                disActivate() {
                    let elem = ViktorSudoku.modes.buttons.fromFinish.elem
                    if (elem.classList.contains("active-mode-button")) {
                        elem.classList.remove("active-mode-button")
                    }
                },
                activate() {
                    let elem = ViktorSudoku.modes.buttons.fromFinish.elem
                    if (!elem.classList.contains("active-mode-button")) {
                        elem.classList.add("active-mode-button")
                    }
                    ViktorSudoku.modes.current = "fromFinish"
                },
                click() {
                    location.reload()
                    /* ViktorSudoku.modes.buttons.disActivateAll()
                    ViktorSudoku.modes.buttons.fromFinish.activate()
                    ViktorSudoku.numPad.hide() */
                }
            },
            fromZero: {
                init() {
                    ViktorSudoku.modes.buttons.fromZero.elem = 
                        document.querySelector("#from-zero")
                    let elem = ViktorSudoku.modes.buttons.fromZero.elem
                    elem.onclick = ViktorSudoku.modes.buttons.fromZero.click
                },
                disActivate() {
                    let elem = ViktorSudoku.modes.buttons.fromZero.elem
                    if (elem.classList.contains("active-mode-button")) {
                        elem.classList.remove("active-mode-button")
                    }
                },
                activate() {
                    let elem = ViktorSudoku.modes.buttons.fromZero.elem
                    if (!elem.classList.contains("active-mode-button")) {
                        elem.classList.add("active-mode-button")
                    }
                    ViktorSudoku.modes.current = "fromZero"
                    
                },
                click() {
                    ViktorSudoku.modes.buttons.disActivateAll()
                    ViktorSudoku.modes.buttons.fromZero.activate()
                    ViktorSudoku.numPad.show()
                    ViktorSudoku.boards.clear()
                    ViktorSudoku.info.wrote.update()
                }
            },
            byMosaic: {
                init() {
                    ViktorSudoku.modes.buttons.byMosaic.elem = 
                        document.querySelector("#by-mosaic")
                    let elem = ViktorSudoku.modes.buttons.byMosaic.elem
                    elem.onclick = ViktorSudoku.modes.buttons.byMosaic.click
                },
                disActivate() {
                    let elem = ViktorSudoku.modes.buttons.byMosaic.elem
                    if (elem.classList.contains("active-mode-button")) {
                        elem.classList.remove("active-mode-button")
                    }
                    ViktorSudoku.mosaicPanel.hide()
                },
                activate() {
                    let elem = ViktorSudoku.modes.buttons.byMosaic.elem
                    if (!elem.classList.contains("active-mode-button")) {
                        elem.classList.add("active-mode-button")
                    }
                    ViktorSudoku.mosaicPanel.show()
                    ViktorSudoku.modes.current = "byMosaic"
                },
                click() {
                    ViktorSudoku.modes.buttons.disActivateAll()
                    ViktorSudoku.modes.buttons.byMosaic.activate()
                    ViktorSudoku.numPad.hide()
                    ViktorSudoku.boards.clear()
                    ViktorSudoku.info.wrote.update()
                }
            },
            handSolving: {
                init() {
                    ViktorSudoku.modes.buttons.handSolving.elem = 
                        document.querySelector("#hand-solving")
                    let elem = ViktorSudoku.modes.buttons.handSolving.elem
                    elem.onclick = ViktorSudoku.modes.buttons.handSolving.click
                },
                disActivate() {
                    let elem = ViktorSudoku.modes.buttons.handSolving.elem
                    if (elem.classList.contains("active-mode-button")) {
                        elem.classList.remove("active-mode-button")
                    }
                    ViktorSudoku.writeTypePanel.hide()
                },
                activate() {
                    let elem = ViktorSudoku.modes.buttons.handSolving.elem
                    if (!elem.classList.contains("active-mode-button")) {
                        elem.classList.add("active-mode-button")
                    }
                    ViktorSudoku.writeTypePanel.show()
                    ViktorSudoku.modes.current = "handSolving"
                },
                click() {
                    ViktorSudoku.modes.buttons.disActivateAll()
                    ViktorSudoku.modes.buttons.handSolving.activate()
                    ViktorSudoku.numPad.hide()
                    //ViktorSudoku.boards.clear()
                    ViktorSudoku.info.wrote.update()
                }
            },
            disActivateAll() {
                let buttons = ViktorSudoku.modes.buttons
                buttons.fromFinish.disActivate()
                buttons.fromZero.disActivate()
                buttons.byMosaic.disActivate()
                buttons.handSolving.disActivate()
            }
        }
    },
    numPad: {
        init() {
            ViktorSudoku.numPad.current = 1
            ViktorSudoku.numPad.elem = 
                document.querySelector("#numpad")
            ViktorSudoku.numPad.currentNumPadNumber = 1
            let elems = document.querySelectorAll(".numpad-num")
            let index = 0
            for (let elem of elems) {
                elem.onclick = ViktorSudoku.numPad.click
                index++
            }
        }, 
        show() {
            let elem = ViktorSudoku.numPad.elem
            elem.style.display = "inline-block"
        },
        hide() {
            let elem = ViktorSudoku.numPad.elem
            elem.style.display = "none"
        },
        click(event) {
            let elem = event.target
            let value = +(elem.innerHTML)
            ViktorSudoku.numPad.currentNumPadNumber = value
            ViktorSudoku.numPad.disActivateAll()
            if (!elem.classList.contains("active-num")) {
                elem.classList.add("active-num")
            }

        },
        disActivateAll() {
            let elems = document.querySelectorAll(".numpad-num")
            //console.log(elems)
            for (let elem of elems) {
                if (elem.classList.contains('active-num')) {
                    elem.classList.remove("active-num")
                }
            }
        }
    },
    canvas: {
        init() {
            let canvas = document.querySelector("#board-canvas")
            ViktorSudoku.canvas.elem = canvas
            ViktorSudoku.canvas.context = canvas.getContext("2d")
            canvas.onclick = ViktorSudoku.canvas.click
        },
        click(event) {
            let x = event.offsetX
            let y = event.offsetY
            let indexes = ViktorSudoku.getIndexesByCoords(x, y)
            let indexX = indexes[0]
            let indexY = indexes[1]
            //console.log(ViktorSudoku.boards.getBoardWithZero())
            if (ViktorSudoku.modes.current == "fromFinish") {
                //console.log("from-------finish")
                if (ViktorSudoku.boards.activeBoard[indexY][indexX] == true) {
                    ViktorSudoku.boards.activeBoard[indexY][indexX] = false
                } else {
                    ViktorSudoku.boards.activeBoard[indexY][indexX] = true
                }
            } else if (ViktorSudoku.modes.current == "fromZero") {
                let numPadNumber = ViktorSudoku.numPad.currentNumPadNumber
                let cellNumber = ViktorSudoku.boards.mainBoard[indexY][indexX]
                if (numPadNumber == cellNumber) {
                    ViktorSudoku.boards.activeBoard[indexY][indexX] = false
                    ViktorSudoku.boards.mainBoard[indexY][indexX] = 0
                } else {
                    let numPadNumber = ViktorSudoku.numPad.currentNumPadNumber
                    ViktorSudoku.boards.activeBoard[indexY][indexX] = true
                    ViktorSudoku.boards.mainBoard[indexY][indexX] = 
                        numPadNumber
                }
            } else if (ViktorSudoku.modes.current == "byMosaic") {
                if (ViktorSudoku.boards.activeBoard[indexY][indexX] == true) {
                    ViktorSudoku.boards.activeBoard[indexY][indexX] = false
                } else {
                    ViktorSudoku.boards.activeBoard[indexY][indexX] = true
                }
            }
            let autoCheck = ViktorSudoku.actions.autoCheck.isActive
            if (autoCheck == true) {
                if (ViktorSudoku.boards.isExistSuchPosition() == false) {
                    ViktorSudoku.info.checkText.update()
                } else {
                    //console.log('найдено')
                    ViktorSudoku.info.checkText.activate()
                }
                
            }
            //console.log(ViktorSudoku.modes.current)
            ViktorSudoku.info.wrote.update()
            //console.log(ViktorSudoku.boards.mainBoard)
            //console.log(ViktorSudoku.boards.activeBoard)
            ViktorSudoku.draw()
        }
    },
    getIndexesByCoords(x, y) {
        let coords = ViktorSudoku.cellCoords
        let indexX, indexY
        for (let i in coords) {
            if (x <= coords[i]) {
                indexX = i
                break
            }
        }
        for (let j in ViktorSudoku.cellCoords) {
            if (y <= coords[j]) {
                indexY = j
                break
            }
        }
        return [indexX, indexY]
    },
    draw(mode) {
        
        let board = ViktorSudoku.boards.mainBoard
        let canvas = ViktorSudoku.canvas.elem
        let context = ViktorSudoku.canvas.context
        
        ViktorSudoku.setCanvasSize(canvas, 568, 568)
        context.clearRect(0, 0, 568, 568)
        ViktorSudoku.drawBorder(context)
        ViktorSudoku.drawGrid(context)
        if (ViktorSudoku.modes.current == "byMosaic" && mode != "withoutBlue") {
            ViktorSudoku.drawSquares(context, board)
        } else {
            ViktorSudoku.drawNumbers(context, board)
        }
        if(ViktorSudoku.modes.current == "fromFinish") {
            ViktorSudoku.drawHints()
        }
    },
    centerCoords: [35, 96, 158, 222, 284, 346, 410, 472, 534],
    cellCoords: [63.5, 126, 188, 252, 314, 376, 440, 502, 564],
    setCanvasSize(canvas, x, y) {
        canvas.width = x
        canvas.height = y
    },
    drawHints() {
        let hintsActivity = ViktorSudoku.actions.hints.isActive
        if (hintsActivity == false) {
            return
        }
        let context = ViktorSudoku.canvas.context
        context.beginPath()
        let board = ViktorSudoku.boards.mainBoard
        for (let y in board) {
            for (let x in board) {
                if (ViktorSudoku.boards.activeBoard[y][x] == true) {
                    continue
                }
                let number = board[y][x]
                if (number == 0) {
                    return
                }
                let xCoord = ViktorSudoku.centerCoords[x] - 7
                let yCoord = ViktorSudoku.centerCoords[y] + 7
                context.font = "20px Courier New"
                //console.log(number)
                context.fillText(number, xCoord, yCoord)
            }
        }

        context.stroke()
    },
    drawSquares() {
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                let cellActivity = ViktorSudoku.boards.activeBoard[y][x]
                if (cellActivity == true) {
                    let startX = ViktorSudoku.cellCoords[x] - 60
                    let startY = ViktorSudoku.cellCoords[y] - 60
                    
                    let context = ViktorSudoku.canvas.context
                    context.rect(startX, startY, 60, 60)
                    context.fillStyle = "#49b19e"
                    context.fill()
                }
            }
        }
    },
    drawNumbers(context, board) {
        context.beginPath()
        context.font = "40px Roboto-Light"
        //context.font = "40px Comfortaa"
        //console.log(context.font)
        for (let y in board) {
            for (let x in board) {
                if (ViktorSudoku.boards.activeBoard[y][x] == false) {
                    continue
                }
                let number = board[y][x]
                if (number == 0) {
                    return
                }
                let xCoord = ViktorSudoku.centerCoords[x] - 13
                let yCoord = ViktorSudoku.centerCoords[y] + 13
                
                //console.log(number)
                context.fillText(number, xCoord, yCoord)
            }
        }

        context.stroke()
    },
    drawBorder(context) {
        context.beginPath()
        context.lineWidth = 4
        context.moveTo(2, 0)
        context.lineTo(2, 568)
        context.moveTo(2, 566)
        context.lineTo(568, 566)
        context.moveTo(566, 566)
        context.lineTo(566, 0)
        context.moveTo(566, 2)
        context.lineTo(0, 2)
        context.stroke()
    },
    drawGrid(context) {
        //---вертикальные
        context.beginPath()
        context.lineWidth = 2
        context.moveTo(65, 0)
        context.lineTo(65, 568)
        context.stroke()
    
        context.beginPath()
        context.moveTo(127, 0)
        context.lineTo(127, 568)
        context.stroke()
    
        context.beginPath()
        context.moveTo(190, 0)
        context.lineWidth = 4
        context.lineTo(190, 568)
        context.stroke()
    
        context.beginPath()
        context.lineWidth = 2
        context.moveTo(253, 0)
        context.lineTo(253, 568)
        context.moveTo(315, 0)
        context.lineTo(315, 568)
        context.stroke()
    
        context.beginPath()
        context.lineWidth = 4
        context.moveTo(378, 0)
        context.lineTo(378, 568)
        context.stroke()
        
        context.beginPath()
        context.lineWidth = 2
        context.moveTo(441, 0)
        context.lineTo(441, 568)
        context.moveTo(503, 0)
        context.lineTo(503, 568)
        context.stroke()
    
        //---горизонтальные
        context.beginPath()
        context.lineWidth = 2
        context.moveTo(0, 65)
        context.lineTo(568, 65)
        context.stroke()
    
        context.beginPath()
        context.moveTo(0, 127)
        context.lineTo(568, 127)
        context.stroke()
    
        context.beginPath()
        context.moveTo(0, 190)
        context.lineWidth = 4
        context.lineTo(568, 190)
        context.stroke()
    
        context.beginPath()
        context.lineWidth = 2
        context.moveTo(0, 253)
        context.lineTo(568, 253)
        context.moveTo(0, 315)
        context.lineTo(568, 315)
        context.stroke()
    
        context.beginPath()
        context.lineWidth = 4
        context.moveTo(0, 378)
        context.lineTo(568, 378)
        context.stroke()
        
        context.beginPath()
        context.lineWidth = 2
        context.moveTo(0, 441)
        context.lineTo(568, 441)
        context.moveTo(0, 503)
        context.lineTo(568, 503)
        context.stroke()
    }
}
