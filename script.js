const hero = document.getElementById("hero");
const bgUpload = document.getElementById("bgUpload");
const clearBgButton = document.getElementById("clearBgButton");
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

const greetingInput = document.getElementById("greetingInput");
const openingInput = document.getElementById("openingInput");
const memoryInput = document.getElementById("memoryInput");
const addMemoryButton = document.getElementById("addMemoryButton");
const memoryList = document.getElementById("memoryList");
const promiseInput = document.getElementById("promiseInput");
const signatureInput = document.getElementById("signatureInput");
const letterPreviewBody = document.getElementById("letterPreviewBody");

const collageUpload = document.getElementById("collageUpload");
const collageGrid = document.getElementById("collageGrid");

const defaultHeroBackground =
  "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1500&q=80')";

hero.style.backgroundImage = defaultHeroBackground;

bgUpload.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    hero.style.backgroundImage = `url('${loadEvent.target.result}')`;
    clearBgButton.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

clearBgButton.addEventListener("click", () => {
  hero.style.backgroundImage = defaultHeroBackground;
  bgUpload.value = "";
  clearBgButton.classList.add("hidden");
});

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

const memories = [];

function renderMemories() {
  memoryList.innerHTML = "";

  memories.forEach((memory) => {
    const li = document.createElement("li");
    li.textContent = memory;
    memoryList.append(li);
  });

  renderLetter();
}

function paragraphFromText(text) {
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => `<p>${line}</p>`)
    .join("");
}

function renderLetter() {
  const greeting = greetingInput.value.trim() || "My Dearest Divya,";
  const opening = paragraphFromText(openingInput.value.trim());
  const promise = paragraphFromText(promiseInput.value.trim());
  const signature = signatureInput.value.trim() || "Forever yours,";

  const memorySection = memories.length
    ? `<p><strong>My favorite moments with you:</strong></p><ul>${memories
        .map((memory) => `<li>${memory}</li>`)
        .join("")}</ul>`
    : "";

  letterPreviewBody.innerHTML = `
    <p>${greeting}</p>
    ${opening || "<p>You make every ordinary day feel extraordinary.</p>"}
    ${memorySection}
    ${promise || "<p>I promise to keep choosing you, in all the little moments and all the big ones.</p>"}
    <p>${signature}<br />Your Valentine</p>
  `;
}

addMemoryButton.addEventListener("click", () => {
  const value = memoryInput.value.trim();
  if (!value) return;

  memories.push(value);
  memoryInput.value = "";
  renderMemories();
});

[greetingInput, openingInput, promiseInput, signatureInput].forEach((input) => {
  input.addEventListener("input", renderLetter);
});

collageUpload.addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []);
  files.forEach((file) => createCollageCard(file));
  collageUpload.value = "";
});

function createRangeControl(labelText, value, onInput) {
  const label = document.createElement("label");
  label.textContent = labelText;

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "80";
  slider.max = "360";
  slider.value = String(value);

  slider.addEventListener("input", () => onInput(Number(slider.value)));

  label.append(slider);
  return { label, slider };
}

function createCollageCard(file) {
  if (!file.type.startsWith("image/")) return;

  const card = document.createElement("div");
  card.className = "collage-card";

  const frame = document.createElement("div");
  frame.className = "collage-frame";

  const image = document.createElement("img");
  image.alt = `Collage photo ${file.name}`;

  let width = 180;
  let height = 180;

  const applyDimensions = () => {
    image.style.setProperty("--img-width", `${width}px`);
    image.style.setProperty("--img-height", `${height}px`);
  };

  const widthControl = createRangeControl("Width", width, (nextWidth) => {
    width = nextWidth;
    applyDimensions();
  });

  const heightControl = createRangeControl("Height", height, (nextHeight) => {
    height = nextHeight;
    applyDimensions();
  });

  const controls = document.createElement("div");
  controls.className = "resize-controls";
  controls.append(widthControl.label, heightControl.label);

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    image.src = loadEvent.target.result;
    applyDimensions();
  };
  reader.readAsDataURL(file);

  frame.append(image);
  card.append(frame, controls);
  collageGrid.append(card);
}

renderItinerary();
renderLetter();
