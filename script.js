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

const collageGrid = document.getElementById("collageGrid");

const defaultHeroBackground =
  "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1500&q=80')";

hero.style.backgroundImage = defaultHeroBackground;

yesButton.addEventListener("click", () => {
  proposalResponse.textContent = "She said YES. 💞";
  proposalResponse.classList.remove("hidden");
  valentineTabs.classList.remove("hidden");
  valentineTabs.scrollIntoView({ behavior: "smooth", block: "start" });
});

maybeButton.addEventListener("click", () => {
  proposalResponse.textContent = "Reason #108: Every plan is better with Divya in it ✨";
  proposalResponse.classList.remove("hidden");
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selected = tab.dataset.tab;

    tabs.forEach((button) => button.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(selected).classList.add("active");
  });
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

function createCollageSlots(slotCount = 8) {
  collageGrid.innerHTML = "";

  for (let index = 0; index < slotCount; index += 1) {
    const slot = document.createElement("label");
    slot.className = "collage-slot";

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.className = "collage-slot-input";

    const placeholder = document.createElement("span");
    placeholder.className = "collage-slot-placeholder";
    placeholder.textContent = `Upload photo ${index + 1}`;

    const preview = document.createElement("img");
    preview.className = "collage-slot-image hidden";
    preview.alt = `Collage slot ${index + 1}`;

    input.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        preview.src = loadEvent.target.result;
        preview.classList.remove("hidden");
        placeholder.classList.add("hidden");
      };
      reader.readAsDataURL(file);
    });

    slot.append(input, placeholder, preview);
    collageGrid.append(slot);
  }
}

createCollageSlots();
renderItinerary();
