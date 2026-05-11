// below line run when full HTML page loded it checks is Html fully loded then excute this
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input"); // this is to collect the task from the input from the user
  const addTaskBtn = document.getElementById("add-task-btn"); // by saying const we are storing a variable
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image"); // this image will show when there is nothing in the list
  const todoscontainer = document.querySelector(".todos-container");
  const progressBar = document.getElementById("progress");
  const progressNumbers = document.querySelector(".numbers");

  // below function check the tasklist is empty if true it shows the empty image Block if false its hides the image None
  const toggleEmptyState = () => {
    emptyImage.style.display =
      taskList.children.length === 0 ? "block" : "none";
    todoscontainer.style.width = taskList.children.length > 0 ? "100%" : "50%"; // this to arjust the with of the list
  };

  // this is for progress to update as the single parameter check completion by default value of true
  const updateprogress = (checkcompletion = true) => {
    const totalTasks = taskList.children.length;
    const completedTasks =
      taskList.querySelectorAll(".checkbox:checked").length;

    progressBar.style.width = totalTasks
      ? `${(completedTasks / totalTasks) * 100}%`
      : "0%";
    progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

    if (checkcompletion && totalTasks > 0 && completedTasks === totalTasks) {
      launchConfetti();
    }
  };

  // to store the task in local borwser
  const saveTaskToLocalStorage = () => {
    const task = Array.from(taskList.querySelectorAll("li")).map((li) => ({
      text: li.querySelector("span").textContent,
      completed: li.querySelector(".checkbox").checked,
    }));
    localStorage.setItem("tasks", JSON.stringify(task));
  };

  const loadTaskFromLocalStorage = () => {
    const saveTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    saveTasks.forEach(({ text, completed }) => addTask(text, completed, false));
    toggleEmptyState();
    updateprogress();
  };

  //    below code will collect the task entered in the tasktext and remove the any white space if exist
  const addTask = (text, completed = false, checkcompletion = true) => {
    // event.preventDefault(); // this is to prevent deafult action when typed and click on button it has to show the input typed

    const taskText = text || taskInput.value.trim();
    if (!taskText) {
      return;
    }

    // here we will be creating a Checkbox to show the text entered by the user
    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" class="checkbox"
    ${completed ? "checked" : ""}/>
    <span>${taskText}</span>
    <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
    `;

    // this is for edit
    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    // if it marked as completed cant be able to edit (function)
    if (completed) {
      li.classList.add("completed");
      editBtn.display = true;
      editBtn.style.opacity = "0.5";
      editBtn.style.pointerEvents = "none";
    }

    // checkbox
    checkbox.addEventListener("change", () => {
      const ischecked = checkbox.checked;
      li.classList.toggle("completed", ischecked);
      editBtn.disabled = ischecked;
      editBtn.style.opacity = ischecked ? "0.5" : "1";
      editBtn.style.pointerEvents = ischecked ? "none" : "auto";
      updateprogress();
      saveTaskToLocalStorage();
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        toggleEmptyState();
        updateprogress(false);
        saveTaskToLocalStorage();
      }
    });

    // this function is for when user click on delete button it has to delete from the list
    //  emptystate function is to show once evething is deleted it should show empty list
    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateprogress();
      saveTaskToLocalStorage();
    });

    taskList.appendChild(li);
    taskInput.value = ""; // give space to type for user
    toggleEmptyState(); // to run that function of image hide and show this is import to call
    updateprogress(checkcompletion);
    saveTaskToLocalStorage();
  };

  //    after the user type and enter key prees this event is for that after this we need to add preventdefault function
  addTaskBtn.addEventListener("click", () => addTask());
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  });

  loadTaskFromLocalStorage();
});

const launchConfetti = () => {
  const count = 200,
    defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      }),
    );
  }
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, { spread: 60 });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
