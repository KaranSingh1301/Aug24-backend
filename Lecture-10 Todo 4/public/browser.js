window.onload = genrateTodos;

function genrateTodos() {
  axios
    .get("/read-item")
    .then((res) => {
      if (res.data.status !== 200) {
        alert(res.data.message);
        return;
      }

      console.log(res.data.data);
      const todos = res.data.data;

      document.getElementById("item_list").insertAdjacentHTML(
        "beforeend",
        todos
          .map((item) => {
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <span class="item-text"> ${item.todo}</span>
      <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
      </div></li>`;
          })
          .join("")
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-me")) {
    const todoId = event.target.getAttribute("data-id");
    const newData = prompt("Enter new Todo Text");

    axios
      .post("/edit-item", { todoId, newData })
      .then((res) => {
        console.log(res);
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }

        event.target.parentElement.parentElement.querySelector(
          ".item-text"
        ).innerHTML = newData;
      })
      .catch((err) => console.log(err));
  } else if (event.target.classList.contains("delete-me")) {
    console.log("delete button clicked");
    //home work
  }
});

//client(axios) <------> Server(express api) <------->Database(mongodb)
