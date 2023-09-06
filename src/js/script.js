class Product {
  constructor(name, price, quantity, category) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
  }

  // static getNextId() {
  //   let lastId = parseInt(localStorage.getItem("lastId")) || 0;
  //   lastId++;
  //   localStorage.setItem("lastId", lastId);
  //   return lastId;
  // }

  save() {
    this.id = Product.getNextId();
    const productList = JSON.parse(localStorage.getItem("productList")) || [];
    productList.push(this);
    localStorage.setItem("productList", JSON.stringify(productList));
  }

  remove() {
    const productList = JSON.parse(localStorage.getItem("productList"));
    const updatedList = productList.filter((product) => product.id !== this.id);
    localStorage.setItem("productList", JSON.stringify(updatedList));
  }

  display() {
    const list = JSON.parse(localStorage.getItem("productList"));
    const view = document.querySelector("#view");
    const product = document.createElement("tr");
    // product.classList.add("last:border-none border-b");

    console.log(list.length);
    if (list.length === 0) {
      product.innerHTML = `
        <td class="first:pl-4 p-2 capitalize" colspan="5">No Products</td>
      `;
      return;
    }

    const currentProduct = this;

    product.innerHTML = `
      <td class="first:pl-4 p-2 capitalize">${this.name}</td>
      <td class="p-2">${this.quantity}</td>
      <td class="p-2">${this.price}</td>
      <td class="p-2 capitalize">${this.category}</td>
      <td class="last:pr-4 p-2 flex gap-3">
        <button class="deleteBtn">
          <img src="./assets/icons/bin.svg" class="w-5 h-5" alt="" />
        </button>
      </td>
    `;

    const deleteBtn = product.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", () => {
      const userInput = prompt(
        `How many ${currentProduct.name} do you want to delete?`
      );

      if (userInput === null) {
        // User clicked Cancel, do nothing
        return;
      }

      const deleteQuantity = parseInt(userInput);

      if (!isNaN(deleteQuantity) && deleteQuantity > 0) {
        if (deleteQuantity > currentProduct.quantity) {
          alert("You cannot delete more than the available quantity");
          return;
        }
        currentProduct.quantity -= deleteQuantity;

        if (currentProduct.quantity === 0) {
          currentProduct.remove();
        } else {
          const list = JSON.parse(localStorage.getItem("productList"));
          const updatedList = list.map((product, index) => {
            if (product.name === currentProduct.name) {
              return currentProduct;
            }
            return product;
          });

          localStorage.setItem("productList", JSON.stringify(updatedList));
        }
      } else {
        alert("Please enter a valid number");
      }
      displayProducts();
    });

    view.prepend(product);
  }
}

// Dashboard
const catDisplay = document.querySelector("#catDisplay");
function catDisplay_interval() {
  let arr = ["Electronics", "Clothing", "Home", "Furniture", "Books", "Health"];
  let i = 1;
  setInterval(() => {
    catDisplay.innerText = arr[i];
    i++;
    if (i == arr.length) {
      i = 0;
    }
  }, 3000);
}
catDisplay_interval();

// Sidebar
const buttons = document.querySelectorAll("#links button");
const components = document.querySelectorAll(".content-component");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetComponentId = button.getAttribute("data-target");
    const activeComponentId = localStorage.getItem("activeComponentId");
    if (activeComponentId === targetComponentId) return;
    localStorage.setItem("activeComponentId", targetComponentId);

    // Hide all components and show only the target component
    components.forEach((component) => {
      if (component.id === targetComponentId) {
        component.style.display = "flex";
      } else {
        component.style.display = "none";
      }
    });

    // Remove active class from all buttons and add it to the clicked button
    buttons.forEach((btn) => {
      if (btn === button) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  });
});

const activeComponentId = localStorage.getItem("activeComponentId");
if (activeComponentId) {
  components.forEach((component) => {
    if (component.id === activeComponentId) {
      component.style.display = "flex";
    } else {
      component.style.display = "none";
    }
  });

  buttons.forEach((button) => {
    const targetComponentId = button.getAttribute("data-target");
    if (targetComponentId === activeComponentId) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

// Add Component
const myForm = document.querySelector("#addProductForm");
var pname = document.querySelector("#name");
var price = document.querySelector("#price");
var quantity = document.querySelector("#quantity");
var category = document.querySelector("#category");

function checkInputs() {
  console.log(pname.value, price.value, quantity.value, category.value);
  // trim to remove the whitespaces
  const nameValue = pname.value.trim();
  const priceValue = price.value.trim();
  const quantityValue = quantity.value.trim();
  const categoryValue = category.value.trim();

  if (
    nameValue === "" ||
    priceValue === "" ||
    quantityValue === "" ||
    categoryValue === ""
  ) {
    alert("Please fill in all fields!");
    return false;
  }

  return true;
}

myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!checkInputs()) return;

  var pname = document.querySelector("#name").value;
  var price = document.querySelector("#price").value;
  var quantity = document.querySelector("#quantity").value;
  var category = document.querySelector("#category").value;

  const product = new Product(pname, price, quantity, category);
  product.save();
});

function displayProducts() {
  const productList = JSON.parse(localStorage.getItem("productList")) || [];
  const view = document.querySelector("#view");
  if (productList.length === 0) {
    view.innerHTML = `
      <tr>
        <td class="p-2 capitalize text-center text-amber-500" colspan="5">No Products!</td>
      </tr>
    `;
    return;
  }

  view.innerHTML = "";
  productList.forEach((product) => {
    const loaded = new Product(
      product.name,
      product.price,
      product.quantity,
      product.category
    );
    loaded.display();
  });
}

window.addEventListener("load", () => {
  displayProducts();
});
