var images = [
  "img/1.jpg",
  "img/2.jpg",
  "img/3.jpg",
  "img/4.jpg",
  "img/5.jpg",
  "img/6.jpg",
  "img/7.jpg",
  "img/8.jpg",
  "img/9.jpg",
  "img/10.jpg",
];
var svgs = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/></svg>',
];
let Maindata = {};

async function fetchMainData() {
  try {
    const data = await fetchData();
    Maindata = {};
    data.sort((a, b) => { return a["NAME"] > b["NAME"] ? 1 : -1; });
    for (const i of data) {
      if (!Maindata[i.NAME]) {
        Maindata[i.NAME] = i;
      }
    }
    showPopular();
    addDataList();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function selectImage() {
  var image = images[Math.floor(Math.random() * images.length)];
  return image;
}

function makeSearchBoxVisible() {
  let searchInputBox = document.createElement("input");
  searchInputBox.setAttribute("id", "search");
  searchInputBox.setAttribute("type", "search");
  searchInputBox.setAttribute("name", "search");
  searchInputBox.setAttribute("placeholder", "Search...");
  searchInputBox.setAttribute("list", "data");
  searchInputBox.dataset.visible = "false";
  searchInputBox.setAttribute("onblur", "makeSearchBoxhidden()");
  document.getElementById("sear").appendChild(searchInputBox);
  if (searchInputBox.dataset.visible) {
    searchInputBox.style.visibility = "visible";
    searchInputBox.style.animation = "fadeIn 0.5s forwards";
    searchInputBox.dataset.visible = true;
  } else {
    searchInputBox.style.visibility = "hidden";
    searchInputBox.style.animation = "fadeOut 0.5s forwards";
    searchInputBox.dataset.visible = false;
  }

  document.getElementById("search").addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    createHospitalCard(selectedValue, "grid");
  });
}

function makeSearchBoxhidden() {
  document.getElementById("sear").removeChild(document.getElementById("search"));
}

async function fetchData() {
  try {
    const response = await fetch("excel-to-json.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function addDataList() {
  try {
    const searDiv = document.getElementById("sear");
    const datalist = document.createElement("datalist");
    datalist.id = "data";
    for (const key in Maindata) {
      let option = document.createElement("OPTION");
      option.text = Maindata[key]["NAME"];
      option.value = Maindata[key]["NAME"];
      datalist.appendChild(option);
    }
    searDiv.appendChild(datalist);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function showPopular() {
  let keys = Object.keys(Maindata);
  randomIndices = [];
  for (let i = 0; i < 8; i++) {
    let randomIndex = Math.floor(Math.random() * keys.length);
    while (randomIndices.includes(randomIndex))
      randomIndex = Math.floor(Math.random() * keys.length);
    randomIndices.push(randomIndex);
    createHospitalCard(keys[randomIndex], "popular_hospital");
  }
}

function createHospitalCard(hName, container) {
  const newCard = document.createElement("div");
  newCard.className = "card";
  const card_img = document.createElement("div");
  card_img.className = "card-img";
  const Name = document.createElement("h2");
  const location = document.createElement("p");
  const viewMoreButton = document.createElement("button")
  viewMoreButton.textContent = "View More"
  viewMoreButton.id = "viewMore"
  viewMoreButton.className = "viewMore"
  const image = document.createElement("img");
  let Hospital_details = Maindata[hName];
  image.src = selectImage();
  image.alt = image.src;
  nameH = Hospital_details["NAME"].toUpperCase();
  if (nameH.includes("(")) {
    thename = nameH.split("(")[0] + " (" + nameH.split("(")[1];
  } else {
    thename = nameH;
  }
  Name.textContent = thename;
  newCard.title = thename;
  className = thename.split(" ").join("_")
  // console.log(className)
  newCard.classList.add(`${className}`)
  // console.log(newCard.classList)
  Addr = capitalize(Hospital_details["ADDRESS"]);
  city = Hospital_details["CITY"].toUpperCase();
  pinCode = Hospital_details["PIN CODE"];
  location.innerHTML =
    '<span id="Addr">' +
    `${Addr}, ` +
    '</span><span id="city">' +
    `${city}, ` +
    '</span><span id="pincode">' +
    `${pinCode}` +
    "</span>";
  card_img.appendChild(image);
  newCard.appendChild(card_img);
  newCard.appendChild(Name);
  newCard.appendChild(location);
  newCard.appendChild(viewMoreButton)
  document.getElementById(container).appendChild(newCard);
}

const capitalize = (string) => {
  words = string.split(" ");
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

function menuHandle() {
  let menuButton = document.getElementById("menuButton");
  let menuPanel = document.querySelector(".MenuPanel");
  switch (menuButton.value) {
    case "menuMode":
      menuButton.innerHTML = svgs[0];
      menuPanel.style.animation = "slideInRight .7s ease forwards";
      document.querySelector("main").style.filter = "blur(3px)";
      document.querySelector("main").style.pointerEvents = "none";
      menuPanel.dataset.value = "open";
      menuButton.value = "closeMenu";
      break;
    default:
      menuButton.innerHTML = svgs[1];
      menuPanel.style.animation = "slideInLeft .7s ease forwards";
      document.querySelector("main").style.filter = "blur(0px)";
      document.querySelector("main").style.pointerEvents = "auto";
      menuPanel.dataset.value = "closed";
      menuButton.value = "menuMode";
  }
}

function closeMenu(element) {
  if (element.dataset.value == "open") {
    let button = document.getElementById("menuButton");
    button.innerHTML = svgs[1];
    element.style.animation = "slideInLeft .7s ease forwards";
    document.querySelector("main").style.filter = "blur(0px)";
    document.querySelector("main").style.pointerEvents = "auto";
    element.dataset.value = "closed";
    button.value = "menuMode";
  }
}

document.body.addEventListener("click", (event) => {
  const clickedElement = event.target;
  if (document.querySelector(".MenuPanel").dataset.value == "open") {
    if (
      !clickedElement.parentNode.matches(".MenuPanel") &&
      !clickedElement.closest(".MenuPanel")
    ) {
      closeMenu(document.querySelector(".MenuPanel"));
    }
  }
});

window.addEventListener("resize", () => {
  let button = document.getElementById("menuButton");
  if (window.innerWidth <= 875) {
    button.innerHTML = svgs[1];
  } else {
    if (button.firstChild) {
      button.removeChild(button.firstChild);
    }
  }
});

// document.addEventListener("mouseover", (event) => {
//   const targetElement = event.target;
//   if (targetElement.name) {
//     targetElement.title = targetElement.name;
//   } else if (targetElement.id) {
//     targetElement.title = targetElement.id;
//   }
// });

document.addEventListener("click", (event) => {
  //menu open and close handling
  if (event.target.closest(".menuButton")) {
    menuHandle();
  }
  //search box visibility handling
  if (event.target.closest(".label_of_search")) makeSearchBoxVisible();

  //handling single click event when double click already done and for closing double clicked option box
  if (document.body.dataset.is_dbl_clicked == "true") {
    let grid = document.getElementById("grid")
    if (grid.querySelector(".card .option-block")) {
      grid.querySelector(".card .option-block").closest(".card").removeChild(document.querySelector(".option-block"))
      document.body.dataset.is_dbl_clicked="false"
    }
  }
});

document.addEventListener("DOMContentLoaded", fetchMainData());

document.addEventListener("dblclick", (event) => {
  const clickedCard = event.target.closest(".card");
  if(clickedCard){
  let className = clickedCard.classList[1];}
  if (clickedCard && document.body.dataset.is_dbl_clicked == "false" && clickedCard.closest(".grid")) {
    addDoubleClickBlock(event, clickedCard, className)
  }
  else if(document.body.dataset.is_dbl_clicked == "true") {
    clickedCard.removeChild(document.getElementById("option-block"))
    document.body.dataset.is_dbl_clicked = "false"
    addDoubleClickBlock(event, clickedCard, className)
  }
});

const addDoubleClickBlock = (event, clickedCard) => {
  const block = document.createElement("span");
  block.classList.add("option-block");
  block.id = "option-block";
  const deleteDiv = document.createElement("div")
  const pinDiv = document.createElement("div")
  deleteDiv.textContent = "Delete";
  if(clickedCard.classList[2]){
    pinDiv.textContent = "Unpin"
  }else{
    pinDiv.textContent = "Pin";
  }
  deleteDiv.onclick = () => {
    let grid = document.getElementById("grid");
    grid.removeChild(clickedCard)
    document.body.dataset.is_dbl_clicked = 'false'
  }
  pinDiv.onclick = pinClickHandle(pinDiv,grid,clickedCard)
  document.body.dataset.is_dbl_clicked = "true"
  block.appendChild(deleteDiv);
  block.appendChild(pinDiv);
  block.style.position = "absolute";

  const cardRect = clickedCard.getBoundingClientRect();
  const offsetX = event.clientX - cardRect.left;
  const offsetY = event.clientY - cardRect.top;

  block.style.left = `${offsetX}px`;
  block.style.top = `${offsetY}px`;
  clickedCard.appendChild(block);
}

function pinClickHandle(pinDiv, grid, clickedCard) {
  if (pinDiv.textContent === "Pin") {
    return function () {
      const firstChild = grid.firstChild;
      grid.insertBefore(clickedCard, firstChild);
      clickedCard.classList.add("pinned");
      const pinnedSVG = document.createElement("div");
      pinnedSVG.id = "pinnedCardSVG";
      pinnedSVG.style.position="absolute";
      pinnedSVG.style.width='18px';
      pinnedSVG.style.height='18px';
      pinnedSVG.style.zIndex="999";
      pinnedSVG.style.left = "6px";
      pinnedSVG.style.top = `6px`;
      pinnedSVG.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16"><path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146"/></svg>'
      clickedCard.appendChild(pinnedSVG);
      pinDiv.textContent = "Unpin";
    };
  } else {
    return function () {
      clickedCard.classList.remove("pinned");
      const pinnedSVG = clickedCard.querySelector("#pinnedCardSVG");
      if (pinnedSVG) {
        pinnedSVG.remove();
      }
      pinDiv.textContent = "Pin";
    };
  }
}