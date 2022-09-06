// Proces present at specific time duation are in ready queue 

// P1  1 3 
// P2  2 4 
// P3  1 2 
// P4  4 4 

// At t = 0 - no process arrived so cpu in idle state from [0, 1] 

// At t = 1 - Process p1 and p3 arrived and present in ready queue. Process p3 will get executed as has shortest burst time

// Non-preemptive shortest job first

// Non-preemptive means that once a process has been removed from the waiting queue 
// and given CPU time, it will execute until completed or terminated. 
// The algorithm removes processes with minimum arrival time from the 
// waiting queue and executes them until the process is completed.
// The process then shifts the CPU to other processes in the waiting queue.

// Refer this link - https://www.educative.io/answers/what-is-the-shortest-job-first-scheduling-algorithm
// Heap implementation js article - https://blog.bitsrc.io/implementing-heaps-in-javascript-c3fbf1cb2e65
// Practice question - https://leetcode.com/problems/single-threaded-cpu/

const processData = document.querySelector('#processData');
const rowAdd = document.querySelector("#addProcess"); 
const processTableBody = document.querySelector("#processData"); 
const run_algo = document.querySelector("#run_algo");
const error_fill_all_field = document.querySelector('.error_fill_all_field'); 
const tbodyResult = document.querySelector('#tbodyResult'); 
const result = document.querySelector("#result");
let processes = [];

class Process{
    constructor(processId, arrivalTime, burstTime) {
        this.processId = processId; 
        this.arrivalTime = arrivalTime; 
        this.burstTime = burstTime;
    }
}

// console.log("data="+processData);

rowAdd.addEventListener('click', () => {   
    let tableSize = processTableBody.rows.length; 
    const tr = document.createElement('tr');   
    const td = document.createElement('td'); 
    const data = document.createTextNode("P"+(tableSize));  
    td.appendChild(data);  
    tr.appendChild(td);
    for(let i = 0; i < 2; i++) {
        const td = document.createElement('td'); 
        const input = document.createElement('input');  
        input.setAttribute('required', '');
        input.type = "number";
        td.appendChild(input);
        tr.appendChild(td);
    }
    processTableBody.appendChild(tr); 
}); 

run_algo.addEventListener('click', () => {
    // Building process table in form of javaScript array
    let fieldsFilled = createProcessArray();   
    if(!fieldsFilled) return;
    // Run the shorted job first algoritm now  
    let completionTime = shortestJobFirst_np();
    // console.log("processses = "+processes);
    displayResult(completionTime);
});


function createProcessArray() {
    let processId = 0; 
    let allFieldsFilled = true;
    for(let process of processTableBody.rows) {  
        // parseInt is required as the value parameter will return string and we want integer value
        let arrivalTime = parseInt(process.cells[1].querySelector("input").value); 
        let executionTime = parseInt(process.cells[2].querySelector("input").value);  
        if(process.cells[1].querySelector("input").value === '' || process.cells[2].querySelector("input").value === '') {
            allFieldsFilled = false;
            break;
        }
        let newPro = new Process(processId, arrivalTime, executionTime); 
        processes.push(newPro);
        processId++;
    } 
    // console.log(error_fill_all_field+" allfie="+allFieldsFilled);
    if(allFieldsFilled) {
        error_fill_all_field.style.display = "none"; 
        // Return true signifies that all fiels are filled and we can start execution of the algorithm
        return true; 
    }
    error_fill_all_field.style.display = "block";  
    return false; 
}



function shortestJobFirst_np() {
    q = new Queue(); 
    pq = new PriorityQueue();
    let n = processes.length; 
    // data in sortedOrder array is sorted based on arrival time of process.  
    let sortedOrder = new Array(n); 
    for(let i = 0; i < n; i++) {
        sortedOrder[i] = processes[i];
    }
    sortedOrder.sort(function(a, b)  {
        return a.arrivalTime-b.arrivalTime; 
    });  
    for(i = 0; i < n; i++) {
        q.add(sortedOrder[i]);
    } 

    let currTime = sortedOrder[0].arrivalTime, processCompleted = 0;
    let completionTime = new Array(n);
    while(processCompleted < n) {
        if(!q.isEmpty() && currTime < q.getFront().arrivalTime && pq.isEmpty()) {
            currTime = q.getFront().arrivalTime; 
        } 
        while(!q.isEmpty() && q.getFront().arrivalTime <= currTime) {
            pq.insert(q.getFront()); 
            q.remove();
        } 
        let process = pq.getMin();  
        pq.remove();  
        // order.push(process.processId);
        completionTime[process.processId] = parseInt(currTime) + parseInt(process.burstTime); 
        processCompleted++;
        currTime = parseInt(currTime) + parseInt(process.burstTime);  
    } 
    return completionTime;
}

function displayResult(completionTime) {
    let index = 0;
    for(let process of processes) {
        const tr = document.createElement('tr'); 
        tr.appendChild(createElementHelper('td', process.processId)); 
        tr.appendChild(createElementHelper('td', process.arrivalTime)); 
        tr.appendChild(createElementHelper('td', process.burstTime)); 
        tr.appendChild(createElementHelper('td', completionTime[index])); 
        let tat = completionTime[index]-process.arrivalTime;  // Turn around time
        tr.appendChild(createElementHelper('td', tat)); 
        tr.appendChild(createElementHelper('td', tat-process.burstTime)); 
        tbodyResult.appendChild(tr);
        index++;
    }
    result.style.display = "block";
}

function createElementHelper(type, value = '') {
    const el = document.createElement(type); 
    el.appendChild(document.createTextNode(value)); 
    return el;
}

class Queue {
    constructor() {
        this.queue = []; 
    }
    getFront() {
        return this.queue[0];
    }
    remove() {
        let val = this.queue.shift();  
        return val; 
    }
    add(val) {
        this.queue.push(val);
    } 
    isEmpty() {
        if(this.queue.length === 0) return true; 
        return false; 
    }
    print() {
        console.log(this.queue);
    }
} 

function swap(arr, i, j) {
    let temp = arr[i]; 
    arr[i] = arr[j]; 
    arr[j] = temp;
}
class PriorityQueue {
    constructor() {
        this.heap = [];
    } 
    getMin() {
        return this.heap[0];
    }
    insert(val) {
        if(this.heap.length === 0) this.heap.push(val);
        else {
            this.heap.push(val); 
            let i = this.heap.length-1; 
            while(i > 0) { 
                let parent = Math.floor((i-1)/2);
                if(this.heap[parent].burstTime > this.heap[i].burstTime || (this.heap[parent].burstTime == this.heap[i].burstTime && this.heap[parent].processId > this.heap[i].processId)) {
                    swap(this.heap, parent, i); 
                    i = parent;
                }
                else break;
            }
        }
    } 
    remove() { 
        const n = this.heap.length;
        swap(this.heap, 0, n-1); 
        let val = this.heap.pop();
        let i = 0; 
        while(i < n-1) {
            let smaller = i;
            if((2*i + 1) < n-1) {
                if(this.heap[2*i+1].burstTime < this.heap[smaller].burstTime || (this.heap[2*i+1].burstTime == this.heap[smaller].burstTime && this.heap[2*i+1].processId < this.heap[smaller].processId)) {
                    smaller = 2*i+1;
                }
            }
            if((2*i+2) < n-1) {
                if(this.heap[2*i+2].burstTime < this.heap[smaller].burstTime || (this.heap[2*i+2].burstTime == this.heap[smaller].burstTime && this.heap[2*i+2].processId < this.heap[smaller].processId)) {
                    smaller = 2*i+2;
                }
            }
            if(smaller !== i) {
                swap(this.heap, i, smaller);
                i = smaller; 
            }
            else break;
        }
        return val;
    } 
    isEmpty() {
        if(this.heap.length === 0) return true; 
        return false; 
    }
} 