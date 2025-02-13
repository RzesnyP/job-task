let dataCache = [];
let currentPage = 1;
const itemsPerPage = 8;

const benefits = [
	"Wsparcie rozwoju chrząstki stawowej",
	"Działanie chondroprotekcyjne",
	"Zmniejszenie stanu zapalnego i bólu",
	"Wzmocnienie stawów",
	"Ochrona przed mikrourazami",
	"Regeneracja po urazach i zabiegach ortopedycznych",
	"Poprawa jakości życia",
];

const menuIcon = document.getElementById("menu-icon");
const hiddenLinks = document.getElementById("hidden-links");
const blurBackground = document.getElementById("blur-background");
const container = document.querySelector(".list-container");

function fetchData() {
	const apiEndpoint = "https://brandstestowy.smallhost.pl/api/random";
	fetch(apiEndpoint)
		.then((res) => res.json())
		.then(({ data }) => {
			if (Array.isArray(data)) {
				dataCache = data;
				createSelectOptions();
				createGridAndSelectItems(
					dataCache.slice(0, currentPage * itemsPerPage),
				);
			}
		})
		.catch(handleError);

	benefits.forEach((text, i) => {
		const item = document.createElement("div");
		item.classList.add("mobile-list-item");

		const circle = document.createElement("div");
		circle.classList.add("mobile-circle");
		circle.textContent = i + 1;

		const description = document.createElement("p");
		description.classList.add("mobile-text");
		description.textContent = text;

		item.appendChild(circle);
		item.appendChild(description);
		container.appendChild(item);
	});
}

function createSelectOptions() {
	const selectElement = document.getElementById("select-load");
	selectElement.innerHTML = "";

	dataCache.forEach((item) => {
		const option = document.createElement("option");
		option.value = item.id;
		option.textContent = item.id;
		selectElement.appendChild(option);
	});

	selectElement.value = "8";
}

function handleError(err) {
	const errorMessage = document.getElementById("error-message");
	if (errorMessage) {
		errorMessage.textContent = `Wystąpił błąd ${err.message}`;
		errorMessage.classList.remove("hidden");
	}

	setTimeout(() => {
		errorMessage.classList.add("hidden");
	}, 5000);
}

function createGridAndSelectItems(items) {
	const container = document.getElementById("grid-container");
	items.forEach((item) => {
		const tile = document.createElement("div");
		tile.className = "grid-item";
		tile.textContent = item.id;
		tile.addEventListener("click", () => showPopup(item));
		container.appendChild(tile);
	});
}

function onSelectChange() {
	const select = document.getElementById("select-load");
	const selectedId = parseInt(select.value, 10);
	const container = document.getElementById("grid-container");

	const filteredItems = dataCache.filter((item) => item.id <= selectedId);

	container.innerHTML = "";
	createGridAndSelectItems(filteredItems);
}

function showPopup(item) {
	document.querySelector(".popup-id").textContent = item.id;
	document.querySelector(".popup-name").textContent = item.name || "Brak nazwy";
	document.querySelector(".popup-value").textContent =
		item.value || "Brak wartości";

	document.querySelector(".popup").style.display = "block";
	document.querySelector(".overlay").style.display = "block";
}

function closePopup() {
	document.querySelector(".popup").style.display = "none";
	document.querySelector(".overlay").style.display = "none";
	const errorMessage = document.getElementById("error-message");
	errorMessage.classList.add("hidden");
}

// function mobileView() {
// 	benefits.forEach((text, i) => {
// 		const item = document.createElement("div");
// 		item.classList.add("mobile-list-item");

// 		const circle = document.createElement("div");
// 		item.classList.add("mobile-circle");
// 		circle.textContent = i + 1;

// 		const description = document.createElement("p");
// 		description.classList.add("mobile-text");
// 		description.textContent = text;

// 		item.appendChild(circle);
// 		item.appendChild(description);
// 		container.appendChild(item);
// 	});
// }

document
	.getElementById("select-load")
	.addEventListener("change", onSelectChange);

menuIcon.addEventListener("click", () => {
	hiddenLinks.classList.toggle("active");
	blurBackground.classList.toggle("active");
});

function closeSidebar() {
	hiddenLinks.classList.toggle("active");
	blurBackground.classList.toggle("active");
}

blurBackground.addEventListener("click", () => {
	if (window.innerWidth <= 768) {
		hiddenLinks.classList.remove("active");
		blurBackground.classList.remove("active");
	}
});

window.addEventListener("resize", () => {
	if (window.innerWidth > 768) {
		hiddenLinks.classList.remove("active");
		blurBackground.classList.remove("active");
	}
});

document.querySelectorAll(".nav-links a").forEach((link) => {
	link.addEventListener("click", (e) => {
		e.preventDefault();

		const targetId = link.dataset.target;
		const targetSection = document.getElementById(targetId);

		if (targetSection) {
			targetSection.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	});
});

fetchData();
