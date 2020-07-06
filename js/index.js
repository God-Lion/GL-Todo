class User {
  static length = 0
  static currentUser = 0
  static isUser = true

  constructor(id, name, email) {
    this.id = id
    this.name = name
    this.email = email
  }
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
}

class Storage {
  STORAGE_KEY = 'GL-Todo'
  constructor () { this.fetch() }

  fetch() { 
    let data = JSON.parse(localStorage.getItem( this.STORAGE_KEY) || '[]')
    if (  data.toString().length > 1 ) Storage.findData = true
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

  save( data ) { localStorage.setItem( this.STORAGE_KEY, JSON.stringify( data ))}
}
class FilterUsers {
  static noUser (users) { return users.filter( (user) => { return !users.id }) }
  static current (users) { return users.filter( (user) => { return !users.id }) }
}

class Filters {
  static active (todos) { return todos.filter( (todo) => { return (!todo.completed && todo.idUser == User.currentUser) }) }
  static all (todos) { return todos.filter( (todo) => { return todo.idUser == User.currentUser }) }
  static completed (todos) { return todos.filter( (todo) => { return (todo.completed && todo.idUser == User.currentUser) }) }
  static search (todos, search) { return todos.filter( ( row ) => { if (row.idUser == User.currentUser) return  ["title", "content"].some( ( key ) => { return String( row[key] ).toLowerCase().indexOf( search ) > -1 } ) })  }
}

const todoStorage = new Storage()

let user1 = new User ( 1, 'Zico Bornelus', 'borneluszico@gmail.com' ) 
let user2 = new User ( 2, 'Bico lola', 'lola@gmail.com' ) 
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
    todo: new Todo(),
    user: new User(),
    search: '',
    currentIdUser: 0,
    editedTodo: null,
    currentUser: 'current',
    visibility: 'all',
    selected: true,
    showModal: false,
    showSlideLeft: false,
    showSlideRight: false,
    edit: false
  },
  components: {
    modal     : {
      template: '#modal', 
      props: {
        value: {
          require: true,
          type: User
        }
      },
      computed: {
        user: { get() { return this.value } }
      }
    },
    deletetodo: { template: '#deletetodo' },
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
  mounted () {
    console.log(this.search)
    let startX = 0;
    let endX = 0;
    this.$el.addEventListener("touchstart", (e) => startX = event.touches[0].pageX);
    this.$el.addEventListener("touchmove", (e) => endX = event.touches[0].pageX);
    this.$el.addEventListener("touchend", function(e) {
      let threshold = startX - endX;
      if ( threshold < 250 && 70 < threshold ) this.showSlideLeft = false
      if ( threshold < -100 ) this.showSlideLeft = true
    }.bind(this));
  },
  computed: {
    filteredUsers () {
      let data = FilterUsers[this.currentUser]( this.users )
      if( data.length <= 0 ) this.showModal = true
      return data 
    },
    filteredTodos () {
      if ( this.search ) return Filters['search']( this.todos, this.search )
      return Filters[this.visibility]( this.todos )
    },
    remaining () { return Filters.active(this.todos).length },
    allDone: {
      get () { return this.remaining === 0 },
      set (value) { this.todos.forEach( (todo) => { todo.completed = value }) }
    }
  },
  filters: {
    pluralize (n) { return n === 1 ? 'item' : 'items'},
    capitalize (str) { return str.charAt(0).toUpperCase() + str.slice(1) }
  },
  methods: {
    addUser () {
      if (!this.user.name && !this.user.email) return
      this.users.push( new User ( User.length++, this.user.name, this.user.email )  )
      this.user = new User()
      this.showModal = false
    },
    addTodo () {
      let title = this.todo.title && this.todo.title.trim()
      let content = this.todo.content && this.todo.content.trim()
      if (!title && !content) return
      this.todos.push( new Todo ( Todo.length++, this.currentIdUser, title, content, false )  )
      this.todo = new Todo()
      this.showSlideRight = false
    },
    editTodo ( todo ) {
      this.beforeEditTodoCache = todo
      this.editedTodo = todo
      this.todo = todo
      this.edit = true
      this.showSlideRight = true
    },
    doneEditTodo ( todo ) {
      if (!this.editedTodo) return
      this.editedTodo = null
      this.todo = todo
      this.showSlideRight = false
    },
    cancelEditTodo () {
      this.editedTodo = null
      todo = this.beforeEditTodoCache
      this.todo = new Todo()
      this.edit = false
      this.showSlideRight = false
      debugger
    },
    removeTodo (todo) { this.todos.splice(this.todos.indexOf(todo), 1) },
    removeCompleted () { this.todos = Filters.active(this.todos) }
  },
  directives: {
    'todo-focus' (el, binding) {
      console.log(binding)
      debugger
      if (binding.value) el.focus()
    }
  }
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



const inputs = document.querySelectorAll('form textarea')
inputs.forEach(input => {
    let parent = input.parentNode
    input.addEventListener("focus", () => { if(!this.value) parent.classList.add("focus") });
    input.addEventListener("blur", () => { if(this.value == "") parent.classList.remove("focus"); })
})