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
