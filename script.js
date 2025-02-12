let dataCache = [];
let currentPage = 1;
const itemsPerPage = 8;

const menuIcon = document.getElementById("menu-icon");
const hiddenLinks = document.getElementById("hidden-links");
const blurBackground = document.getElementById("blur-background");

function fetchData(page = 1) {
	fetch("https://brandstestowy.smallhost.pl/api/random")
		.then((res) => res.json())
		.then(({ data }) => {
			if (Array.isArray(data)) {
				dataCache = [...dataCache, ...data];
				createSelectOptions();
				createGridAndSelectItems(
					dataCache.slice(0, currentPage * itemsPerPage),
				);
			}
		})
		.catch(handleError);
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
	// const allItems = dataCache;

	container.innerHTML = "";
	createGridAndSelectItems(filteredItems);

	// select.value = selectedCount;

	// allItems.forEach((item) => {
	// 	const option = document.createElement("option");
	// 	option.value = item.id;
	// 	option.textContent = item.id;
	// 	select.appendChild(option);
	// });

	// if (allItems.length > 0) {
	// 	select.value = allItems[allItems.length - 1].id;
	// }
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

function checkScrollPosition() {
	const windowHeight = window.innerHeight;
	const documentHeight = document.documentElement.scrollHeight;
	const scrollPosition = window.scrollY + windowHeight;

	if (scrollPosition >= documentHeight) {
		loadMoreItems();
	}
}

function loadMoreItems() {
	currentPage += 1;
	fetchData(currentPage);
}

window.addEventListener("scroll", checkScrollPosition);

fetchData();
