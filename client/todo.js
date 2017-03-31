(function() {
    const URL = 'http://localhost:3000';

    document.querySelector('.new-todo').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTodo('' + e.target.value);
            e.target.value = '';
        }
    });

    document.querySelector('.clear-completed').addEventListener('click', e => {
        e.preventDefault();
        clearCompleted();
    })

    const applyEvents = () => {
        const destroys = document.querySelectorAll('.destroy');
        for (let i = 0; i < destroys.length; i++) {
            destroys[i].addEventListener('click', e => {
                e.preventDefault();
                const id = +e.target.parentNode.parentNode.dataset.id;
                removeTodo(id);
            });
        }

        const checkboxes = document.querySelectorAll('.toggle');
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].addEventListener('change', e => {
                e.preventDefault();
                const id = +e.target.parentNode.parentNode.dataset.id;
                toggleTodo(id);
            })
        }
    }

    const renderTodoList = (list) => {
        if (list.length === 0 && !document.querySelector('.footer').classList.contains('hidden')) {
            document.querySelector('.footer').classList.add('hidden');
        } else if (list.length !== 0 && document.querySelector('.footer').classList.contains('hidden')) {
            document.querySelector('.footer').classList.remove('hidden');
        }

        const todoItemTemplate = `
            <li data-id="{{ id }}">
                <div class="view">
                    <input class="toggle" type="checkbox">
                    <label>{{ text }}</label>
                    <button class="destroy"></button>
                </div>
                <input class="edit" value="Rule the web">
            </li>
        `;
        const todos = [];
        list.forEach(todo => {
            const todoHTML = todoItemTemplate
                                .replace('{{ text }}', todo.text)
                                .replace('{{ id }}', todo.id);

            const doc = document.createElement('div');
            doc.innerHTML = todoHTML;
  
            if (todo.completed) {
                doc.querySelector('li')
                    .classList.add('completed');

                doc.querySelector('.toggle')
                    .checked = true;
            }
            
            todos.push(doc.querySelector('li'));
        })

        const todoList = document.querySelector('.todo-list');

        todoList.innerHTML = '';
        todos.forEach(t => todoList.appendChild(t));
        applyEvents();

        document.querySelector('.todo-count strong').textContent = 
            list.reduce((acc = 0, l) => 
                                l.completed 
                                    ? acc 
                                    : ++acc
            , 0);
    };

    const retrieveTodos = () => {
        fetch(`${URL}/`)
            .then(response => response.json())
            .then(json => renderTodoList(json));
    }

    const addTodo = (text) => {
        if (text.length === 0 || text === '') return;
        const opts = {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ text }),
        };
        fetch(`${URL}/`, opts)
            .then(response => response.json())
            .then(jsonResponse => {
                renderTodoList(jsonResponse);
            });
    };

    const removeTodo = (id) => {
        const opts = {
            method: 'DELETE',
        };
        fetch(`${URL}/${id}`, opts)
            .then(response => response.json())
            .then(json => renderTodoList(json));
    };

    const toggleTodo = (id) => {
        const opts = {
            method: 'PUT',
        };
        fetch(`${URL}/${id}`, opts)
            .then(response => response.json())
            .then(json => renderTodoList(json));
    };

    const clearCompleted = () => {
        const opts = { method: 'DELETE' };
        fetch(`${URL}/completed`, opts)
            .then(response => response.json())
            .then(json => renderTodoList(json));
    }

    retrieveTodos();
})();