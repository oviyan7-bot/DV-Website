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

const collageUpload = document.getElementById("collageUpload");
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

const itineraryItems = [
  { time: "10:00", title: "Coffee Date", location: "Our favorite café" },
  { time: "18:30", title: "Dinner", location: "Candlelight table for two" },
];

function renderItinerary() {
  itineraryList.innerHTML = "";

  itineraryItems
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .forEach((item) => {
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

      details.append(title, location);
      li.append(time, details);
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

collageUpload.addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []);
  files.forEach((file) => createCollageItem(file));
  collageUpload.value = "";
});

function createCollageItem(file) {
  if (!file.type.startsWith("image/")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "collage-item";

  const image = document.createElement("img");
  image.alt = `Collage photo ${file.name}`;

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    image.src = loadEvent.target.result;
    image.style.height = `${180 + Math.floor(Math.random() * 280)}px`;
  };
  reader.readAsDataURL(file);

  wrapper.append(image);
  collageGrid.append(wrapper);
}

renderItinerary();
