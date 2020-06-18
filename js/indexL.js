class User {
  static length = 0
  static currentUser = 0
  static isUser = true

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

  constructor( id, idUser, title, content, completed) {
    this.id = id
    this.idUser = idUser
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
  static findData = false
  constructor () { this.fetch() }

  fetch() { 
    let data = JSON.parse(localStorage.getItem( this.STORAGE_KEY) || '[]')
    if (  data.toString().length !== 0 ) Storage.findData = true
    else this.save([[],[]])
    return data
  }
  
  fetchAllUser() {
    const users = this.fetch()[0]
    if ( users.length === 0) return []
    users.forEach( (user, i) => { user.id = i })
    User.length = users.length
    return users
  }

  fetchAllTodo() {
    const todos = this.fetch()[1]
    if ( todos.length === 0) return []
    todos.forEach( (todo, i) => { todo.id = i })
    Todo.length = todos.length
    return todos
  }

  save( todo ) { localStorage.setItem( this.STORAGE_KEY, JSON.stringify( todo )) }
}
class FilterUsers {
  static noUser (users) { return users.filter( (user) => { return !users.id }) }
  // static all (todos) { return todos.filter( (todo) => { return todo.idUser == User.currentUser }) }
  // static active (todos) { return todos.filter( (todo) => { return (!todo.completed && todo.idUser == User.currentUser) }) }
  // // static active (todos) { return todos.filter( (todo) => { return !todo.completed }) }
  // static completed (todos) { return todos.filter( (todo) => { return (todo.completed && todo.idUser == User.currentUser) }) }
}

class Filters {
  static all (todos) { return todos.filter( (todo) => { return todo.idUser == User.currentUser }) }
  // static all (todos) { return todos }
  static active (todos) { return todos.filter( (todo) => { return (!todo.completed && todo.idUser == User.currentUser) }) }
  // static active (todos) { return todos.filter( (todo) => { return !todo.completed }) }
  static completed (todos) { return todos.filter( (todo) => { return (todo.completed && todo.idUser == User.currentUser) }) }
}

const todoStorage = new Storage()
let user1 = new User ( 1, 'Zico', 'Bornelus', 'borneluszico@gmail.com' ) 
let user2 = new User ( 2, 'Bico', 'lola', 'lola@gmail.com' ) 
let allUser = new Array()
allUser.push( user1 )
allUser.push( user2 )

let todo1 = new Todo( 1, 0, 'code', 'portfolio', false)
let todo2 = new Todo( 2, 0, 'Site', 'fdnl', false)
let todo3 = new Todo( 2, 1, 'Coding PleziAprann', 'PleziAprann', false)
let allTodo = new Array()
allTodo.push( todo1 )
allTodo.push( todo2)
allTodo.push( todo3)

let all = new Array()
all.push(allUser)
all.push(allTodo)

// todoStorage.save(all)

const todo = new Vue({
  el: '#todo',
  data: {
    todos: todoStorage.fetchAllTodo(),
    users: todoStorage.fetchAllUser(),
    currentUser: 0,
    todo: new Todo(),
    editedTodo: null,
    visibility: 'all',
    selected: true,
    showModal: false,
    showSlideRight: false
  },
  components: {
    modal     : { template: '#modal' },
    deletetodo: { template: '#deletetodo' },
    slideright: { 
      props   : {
        todo: Todo
      },
      template: '#slideRight'
    }
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
    filteredUsers () { 
      debugger
      return Filters[this.visibility]( this.users )},
    filteredTodos () {
      let data = Filters[this.visibility]( this.todos ) 
      // if( data.length === 0 ) this.showModal = true
      return data
    },
    remaining () { 
      return Filters.active(this.todos).length },
    allDone: {
      get () { return this.remaining === 0 },
      set (value) { this.todos.forEach( (todo) => { todo.completed = value }) }
    },
    // lo (a) {
    //   this.showModal = true
    // }
  },
  
  filters: {
    pluralize (n) { return n === 1 ? 'item' : 'items'}
  },
  // form () {

  // },
  methods: {
    addTodo () {
      let title = this.todo.title && this.todo.title.trim()
      let content = this.todo.content && this.todo.content.trim()
      if (!title && !content) return
      this.todos.push( new Todo ( Todo.length++, title, content, false )  )
      // this.users
      this.todo = new Todo()
    },
    removeTodo (todo) { this.todos.splice(this.todos.indexOf(todo), 1) },
    removeCompleted () { this.todos = Filters.active(this.todos) },
    beforeEnter: function (el) {
      console.log(el)
    },
    sidebarRight () {
      
      const sidebarRight = document.querySelectorAll('.sidebar.right')
      // if ( sidebarRight) {
        
      // }
      // console.log( sidebarRight.classList.contains('show') )
      console.log('okay')
      this.show = true
    }
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
    todo.visibility = 'all'
  }
}
window.addEventListener('hashchange', onHashChange)
onHashChange()




// todoStorage.save(allTodo)
// todoStorage.fetchAll()
// var all = todoStorage.fetchAllUser()

// console.log( todoStorage )
// console.log( all )
// console.log( Todo.length )


const inputs = document.querySelectorAll('form textarea')
// const inputs = document.querySelectorAll('form.login-form input')
inputs.forEach(input => {
    let parent = input.parentNode
    input.addEventListener("focus", function () {
      parent.classList.add("focus")
    });
    input.addEventListener("blur", function () {
      if(this.value == "") parent.classList.remove("focus");
    })
})




// let user1 = new User ( 1, 'Zico', 'Bornelus', 'borneluszico@gmail.com' ) 
// let user2 = new User ( 2, 'Bico', 'lola', 'lola@gmail.com' ) 
// let allUser = new Array()
// allUser.push( user1 )
// allUser.push( user2 )

// let todo1 = new Todo( 1, 0, 'code', 'portfolio', false)
// let todo2 = new Todo( 2, 0, 'Site', 'fdnl', false)
// let todo3 = new Todo( 2, 1, 'Coding PleziAprann', 'PleziAprann', false)
// let allTodo = new Array()
// allTodo.push( todo1 )
// allTodo.push( todo2)
// allTodo.push( todo3)

// let all = new Array()
// all.push(allUser)
// all.push(allTodo)

// todoStorage.save(all)