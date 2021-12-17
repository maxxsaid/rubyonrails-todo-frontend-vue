const app = new Vue({
  el: "#app",
  data: {
    loggedin: false,
    JWT: "",
    loginUsername: "",
    loginPassword: "",
    createUsername: "",
    createPassword: "",
    devURL: "http://localhost:3000",
    prodURL: "https://rubyonrails-todo-backend.herokuapp.com",
    user: null,
    token: null,
    todos: [],
    newTodo: "",
    updateTodo: "",
    editID: 0,
  },
  methods: {
    handleLogin: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const user = {
        username: this.loginUsername,
        password: this.loginPassword,
      };
      fetch(`${URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("error logging in");
          } else {
            this.user = data.user;
            this.token = data.token;
            this.loggedin = true;
            this.getTodos();
            this.loginPassword = "";
            this.loginUsername = "";
            window.sessionStorage.setItem("login", JSON.stringify(data));
          }
        });
    },
    handleLogout: function () {
      this.loggedin = false;
      this.user = null;
      this.token = null;
      window.sessionStorage.removeItem("login");
    },
    handleSignup: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const user = {
        username: this.createUsername,
        password: this.createPassword,
      };
      fetch(`${URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: user,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("sign up unsuccessul");
          } else {
            alert("sign up successful");
            this.createUsername = "";
            this.createPassword = "";
          }
        });
    },
    getTodos: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      fetch(`${URL}/todos`, {
        method: "get",
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.todos = data;
        });
    },
    createTodo: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const todo = { message: this.newTodo };

      fetch(`${URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${this.token}`,
        },
        body: JSON.stringify(todo),
      }).then((response) => {
        this.newTodo = "";
        this.getTodos();
      });
    },
    deleteTodo: function (event) {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const ID = event.target.id;

      fetch(`${URL}/todos/${ID}`, {
        method: "DELETE",
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      }).then((response) => {
        this.getTodos();
      });
    },
    editTodo: function (event) {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const ID = event.target.id;
      const updated = { message: this.updateTodo };

      fetch(`${URL}/todos/${ID}`, {
        method: "PUT",
        headers: {
          Authorization: `bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      }).then((response) => {
        this.getTodos();
      });
    },
    editSelect: function (event) {
      this.editID = event.target.id;
      const theTodo = this.todos.find((todo) => {
        return todo.id == this.editID;
      });
      this.updateTodo = theTodo.message;
    },
  },
  created: function () {
    const getLogin = JSON.parse(window.sessionStorage.getItem("login"));
    if (getLogin) {
      this.user = getLogin.user;
      this.token = getLogin.token;
      this.loggedin = true;
      this.getTodos();
    }
  },
});
