// DOMContentLoaded serve para garantir que o código interno seja executado somente após o conteúdo HTML.
document.addEventListener("DOMContentLoaded", function() {
    //pega o elemento HTML com id APP     
    const appContainer = document.getElementById("app");
    //nesta função irá pegar os usuários e tarefas que estão armazenados no localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentUser = null;

    // responsável por renderizar a aplicação com base no estado atual. Ela manipula o conteúdo do elemento com id "app".
    function renderApp() {
        // verifica se existir algum usuario atuenticado
        appContainer.innerHTML = currentUser ? renderUserArea() : renderLoginForm();
        if (currentUser) {
            renderTasks(); // exibir tarefas
            setupTaskForm(); // configurar as tarefas
        }
    }

    function renderLoginForm() {
        // esta função irá criar todo o docuemtno HTML para renderizar na página
        return `
        
            <h2 className="container">Login</h2>
            <form id="loginForm">
                <label for="username" >Nome:</label>
                <input type="text" id="username" required placeholder="Digite seu nome">  
                <div>
                <label for="password">Senha:</label>
                <input type="password" id="password" required placeholder="Digite sua senha">
                </div>
                <button type="submit" >Login</button>
            </form>
            <p>Não possui conta? <a href="#" id="signupLink">criar conta</a></p>
        `;
    }

    function renderUserArea() {
        // função da página pós logado, onde pegará o nome e colocará as tarefas para criar, editar ou apagar
        return `
            <h2>Bem vindo! ${currentUser}</h2>
            <button id="logoutButton">Sair</button>
            <h3>Suas Tarefas</h3>
            <form id="taskForm">
                <label for="taskDescription">Descrição:</label>
                <input type="text" id="taskDescription" required>
                <label for="taskDeadline">Data:</label>
                <input type="date" id="taskDeadline" required>
                <button type="submit">Adicionar</button>
            </form>
            <ul id="taskList">
                
            </ul>
        `;
    }

    function setupTaskForm() {
        const taskForm = document.getElementById("taskForm");

        taskForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const description = document.getElementById("taskDescription").value;
            const deadline = document.getElementById("taskDeadline").value;

            // aqui irá criar um novo objeto para tarefa
            const newTask = {
                id: tasks.length + 1,
                user: currentUser,
                description,
                deadline
            };

            // aqui irá atualizar o localStorage
            tasks.push(newTask);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
            clearTaskForm();
        });
    }

    function clearTaskForm() {
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDeadline").value = "";
    }

    //  responsável por renderizar as tarefas na interface do usuário com base nos dados armazenados
    function renderTasks() {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";

        const userTasks = tasks.filter(task => task.user === currentUser); // filtra as tarefas do usuário atual

        // iterar a atividade do usurio atual criando um elemento de lista para cada tarefa
        userTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.innerHTML = `
                <strong>${task.description}</strong> - Data: ${task.deadline}
                <button class="editTaskButton" data-task-id="${task.id}">Editar</button>
                <button class="deleteTaskButton" data-task-id="${task.id}">Deletar</button>
            `;
            // adiciona elemento na DOM
            taskList.appendChild(taskItem);
        });

        setupTaskButtons();
    }

    // aqui irá pegar as informações dos cliques para editar ou excluir
    function setupTaskButtons() {
        const editButtons = document.querySelectorAll(".editTaskButton");
        const deleteButtons = document.querySelectorAll(".deleteTaskButton");

        // irá editar obtendo id da tarefa 
        editButtons.forEach(button => {
            button.addEventListener("click", function(event) {
                const taskId = parseInt(event.target.dataset.taskId);
                const taskToEdit = tasks.find(task => task.id === taskId);
                if (taskToEdit) {
                    editTask(taskToEdit);
                }
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener("click", function(event) {
                const taskId = parseInt(event.target.dataset.taskId);
                deleteTask(taskId);
            });
        });
    }

    // função que irá editar a tarefa e atualizar no localStorage
    function editTask(task) {
        const updatedDescription = prompt("Editar descrição:", task.description);
        const updatedDeadline = prompt("Edit task deadline:", task.deadline);

        if (updatedDescription !== null && updatedDeadline !== null) {
            task.description = updatedDescription;
            task.deadline = updatedDeadline;

            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        }
    }

    // função para exlucir a tarefa desejada apagando tbm o id 
    function deleteTask(taskId) {
        const confirmDelete = confirm("Você deseja excluir sua tarefa?");
        if (confirmDelete) {
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
            renderTasks();
        }
    }

    // essa função irá associar se o usuario exite e irá direciona-lo para login  ou signup
    appContainer.addEventListener("submit", function(event) {
        event.preventDefault();

        if (event.target.id === "loginForm") {
            handleLogin();
        } else if (event.target.id === "signupForm") {
            handleSignup();
        }
    });

    // irá pegar os cliques dentro do appContainer e direcionar para o local desejado e renderizar
    appContainer.addEventListener("click", function(event) {
        if (event.target.id === "logoutButton") {
            currentUser = null;
            renderApp();
        } else if (event.target.id === "signupLink") {
            renderSignupForm();
        }
    });

    function handleLogin() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = username;
            renderApp();
        } else {
            alert("Nome ou Senha inválido");
        }
    }

    function handleSignup() {
        const username = document.getElementById("signupUsername").value;
        const password = document.getElementById("signupPassword").value;

        const existingUser = users.find(u => u.username === username);

        if (existingUser) {
            alert("Nome de usuário ja existe.");
        } else {
            users.push({ username, password });
            localStorage.setItem("users", JSON.stringify(users));
            currentUser = username;
            renderApp();
        }
    }

    function renderSignupForm() {
        appContainer.innerHTML = `
            <h2>Sign Up</h2>
            <form id="signupForm">
                <label for="signupUsername">Nome:</label>
                <input type="text" id="signupUsername" required>
                <label for="signupPassword">Senha:</label>
                <input type="password" id="signupPassword" required>
                <button type="submit">Sign Up</button>
            </form>
        `;
    }

    renderApp();
});
