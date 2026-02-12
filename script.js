const app = document.getElementById("app");
const hero = document.getElementById("hero");
const yesButton = document.getElementById("yesButton");
const maybeButton = document.getElementById("maybeButton");
const proposalResponse = document.getElementById("proposalResponse");
const valentineTabs = document.getElementById("valentineTabs");
const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = Array.from(document.querySelectorAll(".tab-panel"));

const addEventButton = document.getElementById("addEventButton");
const eventTime = document.getElementById("eventTime");
const eventTitle = document.getElementById("eventTitle");
const eventLocation = document.getElementById("eventLocation");
const itineraryList = document.getElementById("itineraryList");

const letterTextbox = document.getElementById("letterTextbox");
const publishLetterButton = document.getElementById("publishLetterButton");
const letterStatus = document.getElementById("letterStatus");

const collageSlots = Array.from(document.querySelectorAll(".collage-slot"));

const defaultHeroBackground =
  "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1500&q=80')";

hero.style.backgroundImage = defaultHeroBackground;

function setActiveTab(tabName) {
  tabs.forEach((button) => button.classList.remove("active"));
  panels.forEach((panel) => panel.classList.remove("active"));

  const selectedTab = tabs.find((tab) => tab.dataset.tab === tabName) || tabs[0];
  const selectedPanel = document.getElementById(selectedTab.dataset.tab);

  if (!selectedPanel) return;

  selectedTab.classList.add("active");
  selectedPanel.classList.add("active");
}

function revealValentineContent(responseText, tabName = "itinerary") {
  proposalResponse.textContent = responseText;
  proposalResponse.classList.remove("hidden");

  valentineTabs.classList.remove("hidden");
  app.classList.add("content-revealed");
  setActiveTab(tabName);

  valentineTabs.scrollIntoView({ behavior: "smooth", block: "start" });
}

yesButton.addEventListener("click", () => {
  revealValentineContent("She said YES. 💞", "itinerary");
});

maybeButton.addEventListener("click", () => {
  revealValentineContent(
    "Reason #108: Every plan is better with Divya in it ✨",
    "letter"
  );
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTab(tab.dataset.tab);
  });
});


let isLetterPublished = false;

publishLetterButton.addEventListener("click", () => {
  if (isLetterPublished) return;

  isLetterPublished = true;
  letterTextbox.readOnly = true;
  letterTextbox.classList.add("published");
  publishLetterButton.disabled = true;
  publishLetterButton.textContent = "Published ✨";
  letterStatus.textContent = "Your letter is published and can no longer be edited.";
});

const itineraryItems = [];

function renderItinerary() {
  itineraryList.innerHTML = "";

  itineraryItems
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "itinerary-item";

      const time = document.createElement("div");
      time.className = "itinerary-time";
      time.textContent = item.time;

      const details = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.title;

      const location = document.createElement("p");
      location.className = "itinerary-meta";
      location.textContent = item.location || "Location to be decided";

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "remove-event-button";
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => {
        itineraryItems.splice(index, 1);
        renderItinerary();
      });

      details.append(title, location);
      li.append(time, details, removeButton);
      itineraryList.append(li);
    });
}

addEventButton.addEventListener("click", () => {
  if (!eventTitle.value.trim()) return;

  itineraryItems.push({
    time: eventTime.value || "TBD",
    title: eventTitle.value.trim(),
    location: eventLocation.value.trim(),
  });

  eventTitle.value = "";
  eventLocation.value = "";
  eventTime.value = "";
  renderItinerary();
});

collageSlots.forEach((slot, index) => {
  const input = slot.querySelector(".collage-slot-input");
  const placeholder = slot.querySelector(".collage-slot-placeholder");
  const preview = slot.querySelector(".collage-slot-image");

  if (!input || !placeholder || !preview) return;

  input.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      preview.src = loadEvent.target.result;
      preview.classList.remove("hidden");
      placeholder.classList.add("hidden");
      preview.alt = `Collage slot ${index + 1}`;
    };
    reader.readAsDataURL(file);
  });
});

renderItinerary();
