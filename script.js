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
    data.sort(function (a, b) {
      return a["NAME"] > b["NAME"] ? 1 : -1;
    });
    for (const i of data) {
      if (!Maindata[i.NAME]) {
        Maindata[i.NAME] = i;
      }
    }
    showPopular();
    addDataset();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function selectImage() {
  var image = images[Math.floor(Math.random() * images.length)];
  return image;
}

function searchVisible() {
  let search_box = document.createElement("input");
  search_box.setAttribute("id", "search");
  search_box.setAttribute("type", "search");
  search_box.setAttribute("name", "search");
  search_box.setAttribute("placeholder", "Search...");
  search_box.setAttribute("list", "data");
  search_box.dataset.visible = "false";
  search_box.setAttribute("onblur", "hideSearch()");
  document.getElementById("sear").appendChild(search_box);
  if (search_box.dataset.visible) {
    search_box.style.visibility = "visible";
    search_box.style.animation = "fadeIn 0.5s forwards";
    search_box.dataset.visible = true;
  } else {
    search_box.style.visibility = "hidden";
    search_box.style.animation = "fadeOut 0.5s forwards";
    search_box.dataset.visible = false;
  }

  document.getElementById("search").addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    createCard(selectedValue, "grid");
  });
}

function hideSearch() {
  document
    .getElementById("sear")
    .removeChild(document.getElementById("search"));
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

async function addDataset() {
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
  ranInd = [];
  for (let i = 0; i < 8; i++) {
    let randomIndex = Math.floor(Math.random() * keys.length);
    while (ranInd.includes(randomIndex))
      randomIndex = Math.floor(Math.random() * keys.length);
    ranInd.push(randomIndex);
    createCard(keys[randomIndex], "popular_hospital");
  }
}

function createCard(hName, container) {
  const newCard = document.createElement("div");
  newCard.className = "card";
  const card_img = document.createElement("div");
  card_img.className = "card-img";
  const Name = document.createElement("h2");
  const location = document.createElement("p");
  const but=document.createElement("button")
  but.textContent="View More..."
  but.id="viewMore"
  but.className="viewMore"
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
  Addr = capital(Hospital_details["ADDRESS"]);
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
  newCard.appendChild(but)
  document.getElementById(container).appendChild(newCard);
}

const capital = (s) => {
  words = s.split(" ");
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

function menuHandle() {
  let button = document.getElementById("menuButton");
  let panel = document.querySelector(".MenuPanel");
  switch (button.value) {
    case "menuMode":
      button.innerHTML = svgs[0];
      panel.style.animation = "slideInRight .7s ease forwards";
      document.querySelector("main").style.filter = "blur(3px)";
      document.querySelector("main").style.pointerEvents = "none";
      panel.dataset.value = "open";
      button.value = "closeMenu";
      break;
    default:
      button.innerHTML = svgs[1];
      panel.style.animation = "slideInLeft .7s ease forwards";
      document.querySelector("main").style.filter = "blur(0px)";
      document.querySelector("main").style.pointerEvents = "auto";
      panel.dataset.value = "closed";
      button.value = "menuMode";
  }
}

function closeMenu(e) {
  if (e.dataset.value == "open") {
    let button = document.getElementById("menuButton");
    button.innerHTML = svgs[1];
    e.style.animation = "slideInLeft .7s ease forwards";
    document.querySelector("main").style.filter = "blur(0px)";
    document.querySelector("main").style.pointerEvents = "auto";
    e.dataset.value = "closed";
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
  console.log(window.screen.width, window.innerWidth);
  let button = document.getElementById("menuButton");
  if (window.innerWidth <= 875) {
    button.innerHTML = svgs[1];
  } else {
    if (button.firstChild) {
      button.removeChild(button.firstChild);
    }
  }
});

document.addEventListener("mouseover", (event) => {
  const targetElement = event.target;
  if (targetElement.name) {
    targetElement.title = targetElement.name;
  } else if (targetElement.id) {
    targetElement.title = targetElement.id;
  }
});
