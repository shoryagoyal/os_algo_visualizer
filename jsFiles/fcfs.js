const processQueue = document.querySelector(".processQueue"); 
const rowAdd = document.querySelector("#rowAdd");
const tbody = document.querySelector("tbody"); 
const run_algo = document.querySelector("#run_algo");


class ProcessParam  { 
    constructor(id, arriveTime, executionTime) {
        this.id = id; 
        this.arriveTime = arriveTime; 
        this.executionTime = executionTime;
    }
    get arrivalTime() {
        return this.arriveTime; 
    }
    get exeTime() {
        return this.executionTime;
    }
    get pid() {
        return this.id;
    }
}
rowAdd.addEventListener('click', () => {  
    let tableSize = tbody.rows.length; 
    const tr = document.createElement('tr');   
    const td = document.createElement('td'); 
    const data = document.createTextNode("P"+(tableSize));  
    td.appendChild(data);  
    tr.appendChild(td);
    for(let i = 0; i < 2; i++) {
        const td = document.createElement('td'); 
        const input = document.createElement('input');  
        input.type = "number";
        td.appendChild(input);
        tr.appendChild(td);
    }
    tbody.appendChild(tr); 
    // console.log("Addes row tableSize="+tableSize);s
}); 

run_algo.addEventListener('click', () => {  
    console.log("clicked")
    document.querySelector("#result").style.display = "block";
    const processArray = convertToArray();
    const sortedArray = sortArray(processArray); 
    const completionTimeArray = completionTime(sortedArray);  
    let n = sortedArray.length;
    const turnAroundTime = new Array(n);
    for(let i = 0; i < n; i++) {
        turnAroundTime[i] = completionTimeArray[i]-processArray[i].arrivalTime; 
    }
    const waitTime = new Array(n);
    for(let i = 0; i < n; i++) {
        waitTime[i] = turnAroundTime[i]-processArray[i].exeTime; 
    }
    displayScreen(processArray, completionTimeArray, turnAroundTime, waitTime);
}); 

function displayScreen(processArray, completionTimeArray, turnAroundTime, waitTime) {
    const result = document.querySelector("#result");  
    const tbodyResult = document.querySelector("#tbodyResult");
    let n = processArray.length;  
    for(let i = 0; i < n; i++) {
        const tr = document.createElement('tr');
        tr.appendChild(createTdAndVal(processArray[i].id)); 
        tr.appendChild(createTdAndVal(processArray[i].arrivalTime)); 
        tr.appendChild(createTdAndVal(processArray[i].executionTime)); 
        tr.appendChild(createTdAndVal(completionTimeArray[i])); 
        tr.appendChild(createTdAndVal(turnAroundTime[i])); 
        tr.appendChild(createTdAndVal(waitTime[i])); 
        tbodyResult.appendChild(tr);
    }
}

function createTdAndVal(val) {
    const td = document.createElement('td'); 
    const data = document.createTextNode(val); 
    td.appendChild(data); 
    return td;
}

function completionTime(sortedArray) {
    let currTime = 0;
    let completionTimeArray = new Array(sortedArray.length);
    for(let currProcess of sortedArray) {
        let pid = parseInt(currProcess.pid), arvTime = parseInt(currProcess.arrivalTime), exeTime = parseInt(currProcess.exeTime); 
        // console.log("arr="+typeof(arvTime)+" exe="+exeTime);  
        if(arvTime >= currTime) {
            completionTimeArray[pid] = arvTime+exeTime; 
            currTime = arvTime+exeTime;
        }
        else {
            completionTimeArray[pid] = currTime+exeTime; 
            currTime += exeTime;
        }
    } 
    return completionTimeArray;
}

function sortArray(processArray) {
    processArray.sort(function(a, b) {
        if(a.arriveTime == b.arriveTime) return a.id-b.id; 
        return a.arriveTime - b.arriveTime;
    });
    return processArray;
}
function convertToArray() {
    let tableSize = tbody.rows.length; // Finding the number of process in the table.
    const processArray = new Array(tableSize);
    let index = 0; // Used to keep traack of process index as we are using for of loop
    // Iterating over a row of table 
    for(let row of tbody.rows) { 
        // row.cells[1].querySelector("input").value - on the cell i find the input element and take its value.
        let newPro = new ProcessParam(index, row.cells[1].querySelector("input").value, row.cells[2].querySelector("input").value); 
        processArray[index] = newPro;
        index++;
    }  
    return processArray;
}