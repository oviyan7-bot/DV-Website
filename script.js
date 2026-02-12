const hero = document.getElementById("hero");
const bgUpload = document.getElementById("bgUpload");
const yesButton = document.getElementById("yesButton");
const valentineTabs = document.getElementById("valentineTabs");
const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = Array.from(document.querySelectorAll(".tab-panel"));
const collageUpload = document.getElementById("collageUpload");
const collageGrid = document.getElementById("collageGrid");

hero.style.backgroundImage =
  "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1500&q=80')";

bgUpload.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    hero.style.backgroundImage = `url('${loadEvent.target.result}')`;
  };
  reader.readAsDataURL(file);
});

yesButton.addEventListener("click", () => {
  valentineTabs.classList.remove("hidden");
  valentineTabs.scrollIntoView({ behavior: "smooth", block: "start" });
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

collageUpload.addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []);
  files.forEach((file) => createCollageCard(file));
  collageUpload.value = "";
});

function createCollageCard(file) {
  if (!file.type.startsWith("image/")) return;

  const card = document.createElement("div");
  card.className = "collage-card";

  const image = document.createElement("img");
  image.alt = `Collage photo ${file.name}`;

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "100";
  slider.max = "300";
  slider.value = "170";

  slider.addEventListener("input", () => {
    image.style.setProperty("--img-size", `${slider.value}px`);
    image.style.height = `${slider.value}px`;
  });

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    image.src = loadEvent.target.result;
  };
  reader.readAsDataURL(file);

  card.append(image, slider);
  collageGrid.append(card);
}
