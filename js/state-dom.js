const userId = 1

window.addEventListener('DOMContentLoaded', async () => {
    await getTasks(userId)
    render()
})

let taskItems = []

const getTasks = async (userId) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    const tasks = await response.json()

    taskItems = tasks.filter(item => item.userId === userId)
}

const remove = async function(index) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${index}`, {
        method: 'DELETE'
    })
    if (response.status === 200) {
        taskItems.splice(index, 1)
        render()
    }

}

const addTodo = async (todoObject) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(todoObject)
    })
    if (response.status === 201) {
        taskItems.push(todoObject)
        render()
    }
}

const checkTodo = index => {
    taskItems[index].completed = !taskItems[index].completed
    render()
}

const render = () => {
    const tasksListContainer = document.querySelector('.tasks_list__container')
    tasksListContainer.innerHTML = ''

    taskItems.forEach((item, index) => {
        const taskItem = document.createElement('div')
        taskItem.classList.add('tasks_list__item')

        const taskCheckbox = document.createElement('input')
        taskCheckbox.type = 'checkbox'
        taskCheckbox.checked = item.completed
        taskCheckbox.addEventListener('click', event => {
            checkTodo(index)
        })
        taskCheckbox.checked && taskItem.classList.add('completed_task')

        const taskText = document.createElement('p')
        taskText.innerText = item.title
        taskText.classList.add('task_item_text')

        const taskDelete = document.createElement('div')
        taskDelete.classList.add('task_item_delete')
        taskDelete.addEventListener('click', () => remove(index))

        const taskDeleteImg = document.createElement('img')
        taskDeleteImg.src = 'assets/icons8-delete-48.svg'

        taskDelete.append(taskDeleteImg)
        taskItem.append(taskCheckbox, taskText, taskDelete)

        const tasksListContainer = document.querySelector('.tasks_list__container')
        tasksListContainer.append(taskItem)
    })

}

const form = document.forms.add_task_form
form.addEventListener('submit', event => {
    event.preventDefault()
    const todo = {
        userId,
        title: form.add_task_input.value,
        completed: false
    }
    addTodo(todo)
    form.add_task_input.value = ''
})


