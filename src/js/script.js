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
