class User {
  static length = 0

  constructor(id, name, lastName, email) {
    this.id = id
    this.name = name
    this.lastName = lastName
    this.email = email
  }
  // getId () { return this.id }
  // setId ( id ) { this.id = id }

  // getName () { return this.name }
  // setName ( name ) { this.name = name }

  // getLastName () { return this.lastName }
  // setLastName ( lastName ) { this.lastName = lastName }

  // getEmail () { return this.email }
  // setEmail ( email ) { this.email = email }
}

class Todo {
  static length = 0

  constructor(id, title, content, completed) {
    this.id = id
    this.title = title
    this.content = content
    this.completed = completed
  }

  // getId () { return this.id }
  // setId ( id ) { this.id = id }

  // getTitle () { return this.title }
  // setTitle ( title ) { this.title = title }

  // getContent () { return this.content }
  // setContent ( content ) { this.content = content }

  // getCompleted () { return this.completed }
  // setCompleted ( completed ) { this.completed = completed }
}

class Storage {
  STORAGE_KEY = 'GL-Todo'

  fetch() { return JSON.parse(localStorage.getItem( this.STORAGE_KEY) || '[]') }
  
  fetchAllUser() {
    const users = this.fetch()[0]
    users.forEach( (user, i) => { user.id = i })
    User.length = users.length
    return users
  }

  fetchAllTodo() {
    const todos = this.fetch()[1]
    todos.forEach( (todo, i) => { todo.id = i })
    Todo.length = todos.length
    return todos
  }

  save( todo ) { localStorage.setItem( this.STORAGE_KEY, JSON.stringify( todo )) }
}

class Filters {
  static all (todos) { return todos }
  static active (todos) { return todos.filter( (todo) => { return !todo.completed }) }
  static completed (todos) { return todos.filter( (todo) => { return todo.completed }) }
}

// let user1 = new User ( 1, 'Zico', 'Bornelus', false ) 
// let user2 = new User ( 2, 'Bico', 'lola', false ) 
// let allUser = new Array()
// allUser.push( user1 )
// allUser.push( user2 )

// let todo1 = new Todo( 1, 'code', 'portfolio', false)
// let todo2 = new Todo( 2, 'Site', 'fdnl', false)
// let allTodo = new Array()
// allTodo.push( todo1 )
// allTodo.push( todo2)

// let all = new Array()
// all.push(allUser)
// all.push(allTodo)

let todoStorage = new Storage()
// todoStorage.save(all)
// todoStorage.save(allTodo)
// todoStorage.fetchAll()
// var all = todoStorage.fetchAllUser()

// console.log( todoStorage )
// console.log( all )
// console.log( Todo.length )


const todo = new Vue({
  el: '#todo',
  data: {
    users: todoStorage.fetchAllUser(),
    todos: todoStorage.fetchAllTodo(),
    title: '',
    content: '',
    editedTodo: null,
    visibility: 'all',
    selected: true
  },
  watch: {
    users: {
      handler (users) {
        let all = new Array()
        all.push( users )
        all.push( this.todos )
        todoStorage.save( all )
      },
      deep: true
    },
    todos: {
      handler (todos) {
        let all = new Array()
        all.push( this.users )
        all.push( todos )
        todoStorage.save( all )
      },
      deep: true
    }
  },
  computed: {
    filteredUsers () { return Filters[this.visibility]( this.users )},
    filteredTodos () { return Filters[this.visibility]( this.todos ) },
    remaining () { return Filters.active(this.todos).length },
      allDone: {
        get () { return this.remaining === 0 },
        set (value) { this.todos.forEach( (todo) => { todo.completed = value }) }
      }
    },
  // filters: {
  //   pluralize (n) { return n === 1 ? 'item' : 'items'}
  // },
  methods: {
    addTodo () {
      let title = this.title && this.title.trim()
      let content = this.content && this.content.trim()
      if (!title && !content) return
      this.todos.push( new Todo ( Todo.length++, title, content, false )  )
      // this.users
      this.title = ''
      this.content = ''
    },
    removeTodo (todo) { this.todos.splice(this.todos.indexOf(todo), 1) },
    removeCompleted () { this.todos = Filters.active(this.todos) }

    // editTodo (todo) {
    //   this.beforeEditCache = todo.title
    //   this.editedTodo = todo
    // },
  //   doneEdit: function (todo) {
  //     if (!this.editedTodo) return
  //     this.editedTodo = null
  //     todo.title = todo.title.trim()
  //     if (!todo.title) {
  //       this.removeTodo(todo)
  //     }
  //   cancelEdit: function (todo) {
  //     this.editedTodo = null
  //     todo.title = this.beforeEditCache
  //   },
  },
  // directives: {
  //   'todo-focus': function (el, binding) {
  //     if (binding.value) {
  //       el.focus()
  //     }
  //   }
  // }
})

function onHashChange () {
  let visibility = window.location.hash.replace(/#\/?/, '')
  if (Filters[visibility]) todo.visibility = visibility
  else {
    window.location.hash = ''
    app.visibility = 'all'
  }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()