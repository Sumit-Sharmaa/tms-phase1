var tasks = [];

function generateID() {
    let randomNum;
    do {
        randomNum = Math.floor(Math.random() * 1000);
    } while (tasks.some(task => task.id === randomNum));
    
    return randomNum;
}
// function uniqueId(){
//     const inputTaskId = document.getElementById('taskId').value;
//     tasks.forEach(task => {
//         if(inputTaskId === task.id){
//             alert('task id should be unique');
//             return false;
//         }
//         else {
//             return true;
//         }
//     });
// }


function validateTaskName() {
    const val = document.getElementById("taskName").value;

    if (val != "" && isNaN(val) && val.length < 30) {
        return true;
    }
    else {
        alert('Please enter a valid task name of 1-30 charachters');
        document.getElementById('taskName').value = '';
        return false;
    }
}

// const taskID = generateID();
// function validateSubTaskDate(taskID){
//     const TaskStartDate = new Date(TaskStartDateInput);
//     const TaskEndDate = new Date(TaskEndDateInput);
    
//     const subtaskStartDateValue = document.getElementById(`subtaskStartDate-${taskID}`).value;
//     const subtaskEndDateValue = document.getElementById(`subtaskEndDate-${taskID}`).value;
    
//     const subtaskStartDate = new Date(subtaskStartDateValue)
//     const subtaskEndDate = new Date(subtaskEndDateValue)
    
//     if(subtaskStartDate > TaskStartDate && subtaskEndDate < TaskEndDate){
//         return true;
//     }
//     else{
//         alert("subtask date should be within parent task's range");
//         return false;
//     }
// }    
// document.getElementById(`subtaskStartDate-${taskID}`).onchange = function(taskID){validateSubTaskDate(taskID)};
// document.getElementById(`subtaskEndDate-${taskID}`).onchange = function(){validateSubTaskDate(taskID)};

function validateDate() {
    
    const TaskStartDateInput = document.getElementById('startDate').value;
    const TaskEndDateInput = document.getElementById('endDate').value;
    
    const TaskStartDate = new Date(TaskStartDateInput);
    const TaskEndDate = new Date(TaskEndDateInput);
    


    if (TaskEndDateInput.length == 0 || TaskStartDateInput.length == 0) {
        alert("please fill date values");
    }

    else if (TaskEndDate <= TaskStartDate) {
        alert('End Date must be later than Start Date.');
    } else {
        return true;
    }
}


function validateStatus() {
    const currentDate = new Date();
    const TaskStartDateInput = document.getElementById('startDate').value;
    const TaskEndDateInput = document.getElementById('endDate').value;

    const TaskStartDate = new Date(TaskStartDateInput);
    const TaskEndDate = new Date(TaskEndDateInput);

    const selectValue = document.querySelector('select').value;
    var InProcess = document.getElementById('Inprocess');
    var DuePassed = document.getElementById('DuePassed');
    

    if (selectValue !== "null") {

        if (currentDate > TaskStartDate && currentDate > TaskEndDate) {
            InProcess.style.display = 'none';
            DuePassed.style.display = 'block';
            return true;
        }
        else if (currentDate > TaskStartDate && currentDate < TaskEndDate) {
            InProcess.style.display = 'block';
            DuePassed.style.display = 'none';
            return true;
        }

        return true;
    }
    else {
        alert('please select status')
    }
    return;

}
// to update status list dynamically on the basis of dates 
const StartDate = document.getElementById('startDate');
const EndDate = document.getElementById('endDate');

StartDate.onchange = function() {validateStatus()};
EndDate.onchange = function() {validateStatus()};

function addTask() {
    if ( validateTaskName() && validateDate()) {

        const taskName = document.getElementById('taskName').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const status = document.getElementById('status').value;
        // const tId = document.getElementById('taskIdInput').value;

        const taskID = generateID();

        tasks.push({
            id: taskID,
            // inputId: tId,
            name: taskName,
            startDate: startDate,
            endDate: endDate,
            status: status,
            subtasks: []
        });
        displayTasks();
        clearForm();
    }

}

function updateTaskInArray(taskID, taskName, startDate, endDate, status, subTaskId = NaN) {
    const taskIndex = tasks.findIndex(task => task.id === taskID);
    if (taskIndex === -1) {
        return;
    }
    if (!Number.isNaN(subTaskId)) {
        const idx = tasks[taskIndex].subtasks.findIndex(task => task.id === subTaskId);
        const newSubtask = {
            id: subTaskId,
            name: taskName,
            startDate: startDate,
            endDate: endDate,
            status: status
        }
        tasks[taskIndex].subtasks.splice(idx, 1, newSubtask);
    } else {
        // update task
        tasks[taskIndex].name = taskName;
        tasks[taskIndex].startDate = startDate;
        tasks[taskIndex].endDate = endDate;
        tasks[taskIndex].status = status;
    }
}

function updateTask() {
    const taskName = document.getElementById('taskName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const status = document.getElementById('status').value;

    if (taskName && startDate && endDate) {
        const taskID = parseInt(document.getElementById('taskId').value);
        const subTaskID = parseInt(document.getElementById('subTaskId').value);
       
        updateTaskInArray(taskID, taskName, startDate, endDate, status, subTaskID);
        displayTasks();
        clearForm();
    } else {
        alert('Please fill in all required fields.');
    }
}

function deleteTask(taskID, subTaskId = null) {
    const taskIndex = tasks.findIndex(task => task.id === taskID);
    if (subTaskId) {
        const subTaskIndex = tasks[taskIndex].subtasks.findIndex(task => task.id === subTaskId)
        if (subTaskIndex !== -1) {
            tasks[taskIndex].subtasks.splice(subTaskIndex, 1);
        }
    } else if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
    }
    displayTasks();
}

function addSubtask(taskID) {
    const parentTask = tasks.find(task => task.id === taskID);
    if (parentTask) {
        const subtaskParentId = taskID;
        const subtaskName = document.getElementById(`subtaskName-${subtaskParentId}`).value;
        const subtaskStartDate = document.getElementById(`subtaskStartDate-${subtaskParentId}`).value;
        const subtaskEndDate = document.getElementById(`subtaskEndDate-${subtaskParentId}`).value;
        const subtaskStatus = document.getElementById(`subtaskStatus-${subtaskParentId}`).value;

        if (subtaskName && subtaskStartDate && subtaskEndDate) {
            parentTask.subtasks.push({
                id: generateID(),
                name: subtaskName,
                startDate: subtaskStartDate,
                endDate: subtaskEndDate,
                status: subtaskStatus
            });

            displayTasks();
            clearSubtaskForm(subtaskParentId);

        } else {
            alert('Please fill in all required fields for the subtask.');
        }
    }
}



function displayTasks() {
    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';

    tasks.forEach(task => {
        const li = createTaskListItem(task);
        if (task.subtasks.length > 0) {
            const subtaskList = document.createElement('ul');
            subtaskList.className = 'subtask-list';
            task.subtasks.forEach(subtask => {
                const subtaskLi = document.createElement('li');
                subtaskLi.innerHTML = `
                    <strong>${subtask.name}</strong> <br/> 
                    (${subtask.startDate} to ${subtask.endDate}) - ${subtask.status}
                    <br/>
                    <div>
                        <button class="edit-button" onclick="editTask(${task.id}, ${subtask.id})"><span class="material-symbols-outlined">
                        edit
                        </span>Edit</button>
                        <button class="delete-button" onclick="deleteTask(${task.id}, ${subtask.id})"><span class="material-symbols-outlined">
                        delete
                        </span>Delete</button>
                    </div>
                `;
                subtaskList.appendChild(subtaskLi);
            });
            li.appendChild(subtaskList);
        }
        taskListElement.appendChild(li);
    });
}

function createTaskListItem(task) {
    const li = document.createElement('li');

    // const Id = document.getElementById('taskId').value;
    li.innerHTML = `
    <div>
        <div id="displayedData">
            <p>Id:</p> 
            ${task.id}
            </div>
        <div id="displayedData">
            <p>Name:</p> 
            ${task.name}
        </div>
        <div id="displayedData">
            <p>Starting Date:</p> 
            ${task.startDate}
        </div>
        <div id="displayedData">
            <p>Ending Date:</p> 
            ${task.endDate}
        </div> 
        <div id="displayedData">
            <p>status:</p> 
            ${task.status}
        </div>
    </div>

        <div class="taskLiButtons">
            <button class="edit-button" onclick="editTask(${task.id})"><span class="material-symbols-outlined">
            edit
            </span>Edit</button>
            <button class="delete-button" onclick="deleteTask(${task.id})"><span class="material-symbols-outlined">
            delete
            </span>Delete</button>
            <button class="add-subtask-button" onclick="showSubtaskForm(${task.id})"><span class="material-symbols-outlined">
            add
            </span>Add Subtask</button>
        </div>

        <div id="subtaskForm-${task.id}" style="display: none;">
            ${createSubtaskForm(task.id)}
        </div>
    `;


    return li;
}


function cancel(taskID) {
    const subtaskform = document.querySelector(`#subtaskForm-${taskID}`)
    subtaskform.style.display = 'none'
}

function createSubtaskForm(taskID) {
    return `
        <form >
            <input type="hidden" id="subtaskParentId" value="${taskID}">
            <label for="subtaskName-${taskID}">Subtask Name:</label>
            <input type="text" id="subtaskName-${taskID}" required><br>
            
            <label for="subtaskStartDate-${taskID}">Start Date:</label>
            <input type="date" id="subtaskStartDate-${taskID}" required><br>
            
            <label for="subtaskEndDate-${taskID}">End Date:</label>
            <input type="date" id="subtaskEndDate-${taskID}" required><br>
            
            <label for="subtaskStatus-${taskID}">Status:</label>
            <select id="subtaskStatus-${taskID}" required>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
                <option value="DuePassed">DuePassed</option>
                <option value="Canceled">Canceled</option>
            </select><br>
            <div>
            <button type="button" onclick="addSubtask(${taskID})">Add Subtask</button>
            <button type="button" onclick="cancel(${taskID})">cancel</button>
           </div>
            
        </form>
    `;
}
function showSubtaskForm(taskID) {
    const subtaskForm = document.getElementById(`subtaskForm-${taskID}`);
    subtaskForm.style.display = 'block';
}

function showUpdateSubtasksForm(taskID) {
    const updateSubtasksForm = document.getElementById(`updateSubtasksForm-${taskID}`);
    updateSubtasksForm.style.display = 'block';
}

function createUpdateSubtasksForm(task) {
    const subtasksList = task.subtasks.map((subtask, index) => `
        <label for="updateSubtaskName-${task.id}-${index}">Subtask Name:</label>
        <input type="text" id="updateSubtaskName-${task.id}-${index}" value="${subtask.name}" required><br>
        
        <label for="updateSubtaskStartDate-${task.id}-${index}">Start Date:</label>
        <input type="date" id="updateSubtaskStartDate-${task.id}-${index}" value="${subtask.startDate}" required><br>
        
        <label for="updateSubtaskEndDate-${task.id}-${index}">End Date:</label>
        <input type="date" id="updateSubtaskEndDate-${task.id}-${index}" value="${subtask.endDate}" required><br>
        
        <label for="updateSubtaskStatus-${task.id}-${index}">Status:</label>
        <select id="updateSubtaskStatus-${task.id}-${index}" required>
            <option value="In-Progress" ${subtask.status === 'In-Progress' ? 'selected' : ''}>In-Progress</option>
            <option value="Completed" ${subtask.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="DuePassed" ${subtask.status === 'DuePassed' ? 'selected' : ''}>DuePassed</option>
            <option value="Canceled" ${subtask.status === 'Canceled' ? 'selected' : ''}>Canceled</option>
        </select>
        <br>
    `).join('<br>');

    return `
        <form>
            ${subtasksList}
            <button type="button" onclick="updateSubtasks(${task.id})">Update Subtasks</button>
        </form>
    `;
}



function updateSubtasks(taskID) {
    const parentTask = tasks.find(task => task.id === taskID);
    if (parentTask) {
        parentTask.subtasks.forEach((subtask, index) => {
            const updatedSubtaskName = document.getElementById(`updateSubtaskName-${taskID}-${index}`).value;
            const updatedSubtaskStartDate = document.getElementById(`updateSubtaskStartDate-${taskID}-${index}`).value;
            const updatedSubtaskEndDate = document.getElementById(`updateSubtaskEndDate-${taskID}-${index}`).value;
            const updatedSubtaskStatus = document.getElementById(`updateSubtaskStatus-${taskID}-${index}`).value;

            subtask.name = updatedSubtaskName;
            subtask.startDate = updatedSubtaskStartDate;
            subtask.endDate = updatedSubtaskEndDate;
            subtask.status = updatedSubtaskStatus;
        });
        displayTasks();
    }
}

function editTask(taskID, subTaskId = null) {
    let taskIdx = tasks.findIndex(task => task.id === taskID);
    let task = tasks[taskIdx];
    if (subTaskId) {
        task = tasks[taskIdx].subtasks.find(task => task.id === subTaskId);
    }

    if (task) {
        document.getElementById('taskId').value = tasks[taskIdx].id;
        document.getElementById('subTaskId').value = subTaskId;
        document.getElementById('taskName').value = task.name;
        document.getElementById('startDate').value = task.startDate;
        document.getElementById('endDate').value = task.endDate;
        document.getElementById('status').value = task.status;
        document.getElementById('addButton').style.display = 'none';
        document.getElementById('updateButton').style.display = 'inline-block';
    }
    console.log('editing - ', taskID, subTaskId);
}

function clearForm() {
    document.getElementById('taskId').value = '';
    // document.getElementById('taskIdInput').value = '';
    document.getElementById('subTaskId').value = '';
    document.getElementById('taskName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('status').value = '--Select value--';
    document.getElementById('addButton').style.display = 'inline-block';
    document.getElementById('updateButton').style.display = 'none';
}

function clearSubtaskForm(taskID) {
    const subtaskForm = document.getElementById(`subtaskForm-${taskID}`);
    subtaskForm.style.display = 'none';
    const subtaskInputs = subtaskForm.querySelectorAll('input');
    subtaskInputs.forEach(input => (input.value = ''));
}

function searchTasksAndSubtasks(searchType, searchValue) {
    const filteredTasks = [];

    tasks.forEach(task => {
        // Check if the task name or status matches the search value based on the search type.
        if (
            (searchType === 'By-Name' && task.name.toLowerCase().includes(searchValue.toLowerCase())) ||
            (searchType === 'By-Status' && task.status.toLowerCase() === searchValue.toLowerCase())
        ) {
            filteredTasks.push(task);
        } else {
            // If the task doesn't match, check its subtasks.
            const filteredSubtasks = task.subtasks.filter(subtask => {
                return (
                    (searchType === 'By-Name' && subtask.name.toLowerCase().includes(searchValue.toLowerCase())) ||
                    (searchType === 'By-Status' && subtask.status.toLowerCase() === searchValue.toLowerCase())
                );
            });

            // If there are matching subtasks, add the parent task to the filteredTasks list.
            if (filteredSubtasks.length > 0) {
                // Clone the parent task to include only the matched subtasks.
                const clonedTask = { ...task };
                clonedTask.subtasks = filteredSubtasks;
                filteredTasks.push(clonedTask);
            }
        }
    });

    return filteredTasks;
}

const searchType = document.getElementById('searchType').value;
const searchValue = document.getElementById('input').value;
const filteredTasks = searchTasksAndSubtasks(searchType, searchValue);
console.log(filteredTasks);






displayTasks();
