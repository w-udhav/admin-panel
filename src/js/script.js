class Product {
  constructor(name, price, quantity, category) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
  }

  save() {
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
    const view = document.querySelector("#view");
    const product = document.createElement("tr");
    // product.classList.add("last:border-none border-b");

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

// ========================== Dashboard ==========================

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

//Filtering & Sorting
let filterFlag = false;
let sortFlag = false;
const filterBtn = document.querySelector("#filterBtn");
const sortBtn = document.querySelector("#sortBtn");
const filterValue = document.querySelector("#filterValue");
const sortValue = document.querySelector("#sortValue");
const custom = document.querySelector("#custom");

custom.style.display = "none";

filterBtn.addEventListener("click", () => {
  filterFlag = !filterFlag;
  if (filterFlag) {
    filterBtn.classList.add(
      "bg-blue-50",
      "underline",
      "underline-offset-[10px]",
      "text-blue-500"
    );

    custom.style.display = "flex";
  } else {
    filterBtn.classList.remove(
      "bg-blue-50",
      "underline",
      "underline-offset-[10px]",
      "text-blue-500"
    );

    if (!sortFlag) {
      custom.style.display = "none";
    }
  }
});
sortBtn.addEventListener("click", () => {
  sortFlag = !sortFlag;
  if (sortFlag) {
    sortBtn.classList.add(
      "bg-blue-50",
      "underline",
      "underline-offset-[10px]",
      "text-blue-500"
    );

    custom.style.display = "flex";
  } else {
    sortBtn.classList.remove(
      "bg-blue-50",
      "underline",
      "underline-offset-[10px]",
      "text-blue-500"
    );

    if (!filterFlag) {
      custom.style.display = "none";
    }
  }
});

filterValue.addEventListener("change", () => {
  const selectedFilter = filterValue.children[0].value.toLowerCase();
  const selectedSort = sortValue.children[0].value.toLowerCase();
  const totalProducts = document.querySelector("#totalProducts");

  const length = displayByCustoms(selectedFilter, selectedSort);
  if (isNaN(length)) {
    totalProducts.innerText = "0";
    return;
  }
  totalProducts.innerText = length;
});

sortValue.addEventListener("change", () => {
  const selectedFilter = filterValue.children[0].value.toLowerCase();
  const selectedSort = sortValue.children[0].value.toLowerCase();
  const totalProducts = document.querySelector("#totalProducts");

  const length = displayByCustoms(selectedFilter, selectedSort);
  if (isNaN(length)) {
    totalProducts.innerText = "0";
    return;
  }
  totalProducts.innerText = length;
});

// Searching
const searchInput = document.querySelector("#search");
searchInput.addEventListener("keyup", () => {
  const searchValue = searchInput.value.toLowerCase();
  const productList = JSON.parse(localStorage.getItem("productList")) || [];
  const filteredProducts = productList.filter((product) => {
    return product.name.toLowerCase().includes(searchValue);
  });

  const view = document.querySelector("#view");
  if (filteredProducts.length === 0) {
    view.innerHTML = `
      <tr>
        <td class="p-2 capitalize text-center text-amber-500" colspan="5">No Products!</td>
      </tr>
    `;
    return;
  }

  view.innerHTML = "";
  filteredProducts.forEach((product) => {
    const loaded = new Product(
      product.name,
      product.price,
      product.quantity,
      product.category
    );
    loaded.display();
  });
});

// ========================== Sidebar Functions ==========================

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

// ========================== Add Form Component ==========================

const myForm = document.querySelector("#addProductForm");
var pname = document.querySelector("#name");
var price = document.querySelector("#price");
var quantity = document.querySelector("#quantity");
var category = document.querySelector("#category");

pname.addEventListener("input", () => {
  const list = JSON.parse(localStorage.getItem("productList")) || [];

  // finding all unique names
  const uniqueNames = list.reduce((acc, product) => {
    if (!acc.includes(product.name)) {
      acc.push(product.name);
    }
    return acc;
  }, []);

  const existingNameList = document.querySelector("#existingNameList");
  existingNameList.innerHTML = "";
  uniqueNames.forEach((name) => {
    const p = document.createElement("p");
    p.classList.add("p-2", "border-t", "first:border-t-0", "text-sm");
    p.innerText = name;
    existingNameList.appendChild(p);
  });

  // checking existing product
  const existingProductIndex = list.findIndex(
    (product) => product.name === pname.value
  );
  if (existingProductIndex !== -1) {
    const existingProduct = list[existingProductIndex];
    price.value = existingProduct.price;
    quantity.value = existingProduct.quantity;
    category.value = existingProduct.category;
  } else {
    price.value = "";
    quantity.value = "";
    category.value = "";
  }
});

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

  const list = JSON.parse(localStorage.getItem("productList")) || [];
  // checking existing product
  const existingProductIndex = list.findIndex(
    (product) => product.name === pname
  );
  if (existingProductIndex !== -1) {
    const existingProduct = list[existingProductIndex];
    existingProduct.quantity =
      parseInt(existingProduct.quantity) + parseInt(quantity);
    existingProduct.price = price;
    existingProduct.category = category;
    localStorage.setItem("productList", JSON.stringify(list));
  } else {
    const product = new Product(pname, price, quantity, category);
    product.save();
  }

  displayProducts();
});

function displayProducts() {
  const productList = JSON.parse(localStorage.getItem("productList")) || [];
  const totalProducts = document.querySelector("#totalProducts");
  const view = document.querySelector("#view");
  if (productList.length === 0) {
    totalProducts.innerText = "0";
    view.innerHTML = `
      <tr>
        <td class="p-2 capitalize text-center text-amber-500" colspan="5">No Products!</td>
      </tr>
    `;
    return;
  }
  totalProducts.innerText = productList.length;
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

function displayByCustoms(category, sortBy) {
  const productList = JSON.parse(localStorage.getItem("productList")) || [];

  // Apply the filter based on the selected category (if provided)
  let filteredProducts = productList;
  if (category !== "all") {
    filteredProducts = productList.filter((product) => {
      return product.category.toLowerCase() === category.toLowerCase();
    });
  }

  console.log(filteredProducts);

  // Apply the sorting based on the selected sorting criteria (if provided)
  if (sortBy === "name") {
    filteredProducts.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  } else if (sortBy === "price") {
    filteredProducts.sort((a, b) => {
      return a.price - b.price;
    });
  } else if (sortBy === "quantity") {
    filteredProducts.sort((a, b) => {
      return a.quantity - b.quantity;
    });
  }

  const view = document.querySelector("#view");
  if (filteredProducts.length === 0) {
    view.innerHTML = `
      <tr>
        <td class="p-2 capitalize text-center text-amber-500" colspan="5">No Products!</td>
      </tr>
    `;
    return;
  }

  view.innerHTML = "";
  filteredProducts.forEach((product) => {
    const loaded = new Product(
      product.name,
      product.price,
      product.quantity,
      product.category
    );
    loaded.display();
  });

  return filteredProducts.length;
}
