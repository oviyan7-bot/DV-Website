const app = document.getElementById("app");
const hero = document.getElementById("hero");
const yesButton = document.getElementById("yesButton");
const maybeButton = document.getElementById("maybeButton");
const proposalResponse = document.getElementById("proposalResponse");
const valentineTabs = document.getElementById("valentineTabs");
const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = Array.from(document.querySelectorAll(".tab-panel"));

const saveShareBar = document.getElementById("saveShareBar");
const saveDraftButton = document.getElementById("saveDraftButton");
const saveShareStatus = document.getElementById("saveShareStatus");

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

const STORAGE_KEY = "valentinePlannerStateV1";
const SNAPSHOT_KEY = "snapshot";
const READONLY_KEY = "readonly";

hero.style.backgroundImage = defaultHeroBackground;

const itineraryItems = [];
const collageImages = Array(collageSlots.length).fill(null);
let isLetterPublished = false;
let isReadOnlyView = false;

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

function showStatus(message) {
  saveShareStatus.textContent = message;
}

function toBase64(value) {
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64(value) {
  const padded = (value + "===").slice(0, value.length + ((4 - (value.length % 4)) % 4));
  const normalized = padded.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(escape(atob(normalized)));
}

function getState() {
  return {
    itineraryItems,
    letterText: letterTextbox.value,
    isLetterPublished,
    collageImages,
  };
}

function saveDraft() {
  if (isReadOnlyView) return;

  const serializedState = JSON.stringify(getState());
  localStorage.setItem(STORAGE_KEY, serializedState);
  return serializedState;
}

function updateShareableUrl(serializedState = JSON.stringify(getState())) {
  const shareUrl = new URL(window.location.href);
  const encodedSnapshot = toBase64(serializedState);

  shareUrl.searchParams.set(SNAPSHOT_KEY, encodedSnapshot);
  shareUrl.searchParams.delete(READONLY_KEY);

  window.history.replaceState({}, "", shareUrl);
}

function saveAndPublishShareUrl() {
  const serializedState = saveDraft();

  try {
    updateShareableUrl(serializedState);
    showStatus("Saved. Share this page URL to open the latest saved version on another device.");
  } catch (error) {
    showStatus("Saved locally, but link update failed (too much data). Try fewer/lower-size collage photos.");
  }
}

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

      if (!isReadOnlyView) {
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-event-button";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
          const matchIndex = itineraryItems.findIndex(
            (entry) =>
              entry.time === item.time &&
              entry.title === item.title &&
              entry.location === item.location
          );

          if (matchIndex !== -1) {
            itineraryItems.splice(matchIndex, 1);
            renderItinerary();
            saveDraft();
          }
        });

        li.append(removeButton);
      }

      itineraryList.append(li);
    });
}

function applyLetterPublishState() {
  letterTextbox.readOnly = isLetterPublished || isReadOnlyView;
  letterTextbox.classList.toggle("published", isLetterPublished || isReadOnlyView);

  if (isLetterPublished || isReadOnlyView) {
    publishLetterButton.disabled = true;
    publishLetterButton.textContent = isReadOnlyView ? "Published letter" : "Published ✨";
    letterStatus.textContent = "Your letter is published and can no longer be edited.";
    return;
  }

  publishLetterButton.disabled = false;
  publishLetterButton.textContent = "Publish letter 💌";
  letterStatus.textContent = "";
}

function renderCollage() {
  collageSlots.forEach((slot, index) => {
    const placeholder = slot.querySelector(".collage-slot-placeholder");
    const preview = slot.querySelector(".collage-slot-image");

    if (!placeholder || !preview) return;

    const imageData = collageImages[index];
    if (imageData) {
      preview.src = imageData;
      preview.classList.remove("hidden");
      placeholder.classList.add("hidden");
      preview.alt = `Collage slot ${index + 1}`;
    } else {
      preview.src = "";
      preview.classList.add("hidden");
      placeholder.classList.remove("hidden");
    }
  });

  const firstImage = collageImages.find(Boolean);
  hero.style.backgroundImage = firstImage
    ? `linear-gradient(rgba(48, 5, 27, 0.35), rgba(48, 5, 27, 0.35)), url('${firstImage}')`
    : defaultHeroBackground;
}

function applyState(state) {
  if (!state || typeof state !== "object") return;

  itineraryItems.splice(0, itineraryItems.length, ...(state.itineraryItems || []));
  letterTextbox.value = state.letterText || "";
  isLetterPublished = Boolean(state.isLetterPublished);

  collageImages.fill(null);
  (state.collageImages || []).forEach((img, index) => {
    if (index < collageImages.length) {
      collageImages[index] = img || null;
    }
  });

  renderItinerary();
  applyLetterPublishState();
  renderCollage();
}

function applyReadOnlyMode() {
  isReadOnlyView = true;

  maybeButton.classList.add("hidden");
  saveShareBar.classList.add("hidden");
  addEventButton.disabled = true;
  publishLetterButton.disabled = true;

  [eventTime, eventTitle, eventLocation].forEach((input) => {
    input.disabled = true;
  });

  collageSlots.forEach((slot) => {
    const input = slot.querySelector(".collage-slot-input");
    if (input) {
      input.disabled = true;
      input.classList.add("hidden");
    }
    slot.classList.add("read-only-slot");
  });

  applyLetterPublishState();
  renderItinerary();
}

function loadInitialState() {
  const params = new URLSearchParams(window.location.search);
  const snapshotParam = params.get(SNAPSHOT_KEY);
  const readonlyParam = params.get(READONLY_KEY);

  if (snapshotParam) {
    try {
      applyState(JSON.parse(fromBase64(snapshotParam)));
      if (readonlyParam === "1") {
        applyReadOnlyMode();
        revealValentineContent("Shared read-only version 💘", "itinerary");
      } else {
        revealValentineContent("Loaded latest saved version 💖", "itinerary");
      }
      return;
    } catch (error) {
      showStatus("Could not load saved snapshot from the link.");
    }
  }

  const savedDraft = localStorage.getItem(STORAGE_KEY);
  if (!savedDraft) {
    renderItinerary();
    applyLetterPublishState();
    renderCollage();
    return;
  }

  try {
    applyState(JSON.parse(savedDraft));
  } catch (error) {
    renderItinerary();
    applyLetterPublishState();
    renderCollage();
  }
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

saveDraftButton.addEventListener("click", () => {
  saveAndPublishShareUrl();
});

publishLetterButton.addEventListener("click", () => {
  if (isLetterPublished || isReadOnlyView) return;

  isLetterPublished = true;
  applyLetterPublishState();
  saveDraft();
});

addEventButton.addEventListener("click", () => {
  if (isReadOnlyView || !eventTitle.value.trim()) return;

  itineraryItems.push({
    time: eventTime.value || "TBD",
    title: eventTitle.value.trim(),
    location: eventLocation.value.trim(),
  });

  eventTitle.value = "";
  eventLocation.value = "";
  eventTime.value = "";

  renderItinerary();
  saveDraft();
});

letterTextbox.addEventListener("input", () => {
  saveDraft();
});

collageSlots.forEach((slot, index) => {
  const input = slot.querySelector(".collage-slot-input");
  if (!input) return;

  input.addEventListener("change", (event) => {
    if (isReadOnlyView) return;

    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      collageImages[index] = loadEvent.target.result;
      renderCollage();
      saveDraft();
    };
    reader.readAsDataURL(file);
  });
});

loadInitialState();
