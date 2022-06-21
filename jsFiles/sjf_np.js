class ProcessParam  { 
    constructor(id, arriveTime, executionTime) {
        this.id = id; 
        this.arriveTime = arriveTime; 
        this.executionTime = executionTime;
    }
    get getArrivalTime() {
        return this.arriveTime; 
    }
    get getExeTime() {
        return this.executionTime;
    }
    get getid() {
        return this.id;
    }
}

const addProcess = document.querySelector("#addProcess");
addProcess.addEventListener('click', () => {
    const tbody = docuemnt.querySelector("#processData");  
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
}); 