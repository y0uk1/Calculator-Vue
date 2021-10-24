var vm = new Vue({
    el: "#app",
    data: {
        calStack: [],
        calHistories: [],
        evalString: '',
        summation: '',
    },
    methods: {
        textSize: function(size) {
            if (size <= 16) {
                return 26
            } else if (size < 30) {
                return 26 - (size - 16) * 1.3
            } else {
                return 6
            }
        },
        calSum: function() {
            this.calHistories.push(
                {"equation": this.calStack, "summation": this.summation}
            )
            // this.calHistories.push(this.calStack)
            this.calStack = []
            sum_array = this.summation.split('')
            for (let i = 0; i < sum_array.length; i++) {
                this.calStack.push(sum_array[i])
            }
            this.evalString = ''
        },
        addBlacket: function() {
            if (this.isEndByOperator || this.isEndByBlacketOpen || this.isStart) {
                this.calStack.push('(')
            } else if (this.countOpen > this.countClose && (!this.isEndByOperator || this.isEndByBlacketClose)) {
                this.calStack.push(')')
            }
        },
        useHistoryCal: function(index) {
            this.calStack = []
            size = this.calHistories[index].equation.length
            for (let i = 0; i < size; i++) {
                this.calStack.push(this.calHistories[index].equation[i])
            }
        },
        deleteHistory: function() {
            this.calHistories = []
        },
        dispHistory: function() {
            displayNone(document.getElementById('main'))
            displayBlock(document.getElementById('history'))
        },
        dispMain: function() {
            displayNone(document.getElementById('history'))
            displayBlock(document.getElementById('main'))
        }
    },
    computed: {
        isEndByOperator: function() {
            let size = this.calStack.length
            return /\+|\-|×|÷|√|sin|cos|tan/.test(this.calStack[size - 1])
        },
        isEndByBlacketOpen: function() {
            let size = this.calStack.length
            return this.calStack[size - 1] === '('
        },
        isEndByBlacketClose: function() {
            let size = this.calStack.length
            return this.calStack[size - 1] === ')'
        },
        isCompleteBlacket: function() {
            return this.countOpen === this.countClose
        },
        countOpen: function() {
            let size = this.calStack.length
            let countOpen = 0
            for (let i = 0; i < size; i++) {
                if (this.calStack[i] === '(') countOpen++
            }
            return countOpen
        },
        countClose: function() {
            let size = this.calStack.length
            let countClose = 0
            for (let i = 0; i < size; i++) {
                if (this.calStack[i] === ')') countClose++
            }
            return countClose
        },
        isStart: function() {
            let size = this.calStack.length
            return size === 0
        }
    },
    watch: {
        calStack: function() {
            let size = this.calStack.length
            this.evalString = ''
            for (let i = 0; i < size; i++) {
                if (this.calStack[i] === "÷") this.evalString += '/'
                else if (this.calStack[i] === "×") this.evalString += '*'
                else if (this.calStack[i] === "π") this.evalString += 'Math.PI'
                else if (this.calStack[i] === "e") this.evalString += 'Math.exp(1)'
                else if (this.calStack[i] === "%") this.evalString += '/100'
                else if (this.calStack[i] === "!") {
                    lastNum = ''
                    for (let j = i-1; j >= 0; j--){
                        if (this.calStack[j].match(/[0-9]/) !== null) {
                            lastNum = this.calStack[j] + lastNum
                        } else {
                            break
                        }
                    }
                    lastNum = parseInt(lastNum)
                    this.evalString += `*factorial(${String(lastNum-1)})`
                }
                else if (this.calStack[i] === "√") this.evalString += 'Math.sqrt'
                else if (this.calStack[i] === "cos") this.evalString += 'Math.cos'
                else if (this.calStack[i] === "sin") this.evalString += 'Math.sin'
                else if (this.calStack[i] === "tan") this.evalString += 'Math.tan'
                else if (this.calStack[i] === "ln") this.evalString += 'Math.log'
                else this.evalString += this.calStack[i]
            }

            if (this.evalString && !this.isEndByOperator) {
                if (this.countOpen === 0 || this.countOpen === this.countClose) {
                    this.summation = String(Math.floor(eval(this.evalString) * Math.pow(10, 11)) / Math.pow(10, 11))
                }
            } else {
                this.summation = ''
            }
        }
    }
})

function displayNone(ele){
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
}

function displayBlock(ele){
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
}

function factorial(num) {
    if (num < 2) return 1;
    return num * factorial(num - 1);
}