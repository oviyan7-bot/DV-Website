const app = document.getElementById('app');
const hero = document.getElementById('hero');
const yesButton = document.getElementById('yesButton');
const maybeButton = document.getElementById('maybeButton');
const proposalResponse = document.getElementById('proposalResponse');
const valentineTabs = document.getElementById('valentineTabs');
const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = Array.from(document.querySelectorAll('.tab-panel'));
const itineraryList = document.getElementById('itineraryList');
const letterContent = document.getElementById('letterContent');

const itineraryItems = [
  { time: '1:00 PM', activity: 'Lunch', location: 'Yauatcha' },
  { time: '3:00 PM', activity: 'Chill', location: 'BnB' },
  { time: '5:00 PM', activity: 'Grocery shopping', location: 'Food Square' },
  { time: '7:00 PM', activity: 'I cook dinner for you', location: 'BnB' },
  { time: '8:00 PM', activity: 'Romantic dinner', location: 'BnB' },
  { time: '10:00 PM', activity: 'Wuthering heights / your mystery activity', location: 'Cinema / ?' }
];

const letterParagraphs = [
  'Dear Divya,',
  'HI BABY!!!! HAPPY VALENTINES DAY + 3 MONTHSSS!!!!! Hooray! We made it baby.',
  "What a journey the last three months have been. So many ups and downs, learnings, difficult conversations, realizations and memories. I legitimately feel like I'm a newer and better person since having reconnected with you. You are genuinely such a good person, deep down and that inspires me to be the best version of myself every day and do what\'s right.",
  "I have had such an incredibly fun time these last few months and have made some beautiful core memories <3333. Rolling loud, new year, exploring Bombay together, meeting your friends and family. It has genuinely been such a huge privilege to get to know you on such a deep level. It's like I'm in university again, majoring in Divya (it's been way better than that fuck ahh engineering degree). I genuinely have so much fun when I'm around you, I smile so bright and laugh so loud.",
  "Thank you for being my home. Thank you for making me so comfortable to be in your presence, in my own skin. I don't ever have to have a mask on around you. You know me on the rawest, deepest level. You know me, the real me. At first it was scary, letting someone in so close to me but now it's been one of the most fulfilling and liberating experiences of my life. Thank you for seeing me and accepting me and all my flaws. I am so incredibly grateful to have you in my life. I have been practicing gratitude lately, and almost every time I close my eyes and picture what I'm grateful for and what enriches my life the most and what makes me happiest, you're always one of the first things to come up :)",
  "I know the last few weeks have been hard. They've honestly been a little exhausting and draining. We have reached that stage in our relationship where we have to face some harsh truths about each other and more importantly, ourselves. The honeymoon phase is over and this is real now and the path ahead is a bit scary, but it will be 100% worth it I promise you. I have learnt so much about myself and grown so much. I have learned to look deeper within myself and see my flaws and accept my mistakes and It's been difficult but strangely fulfilling at the same time, and I'm sure it's been the same with you. Thank you for providing me with the space to grow. I will do anything to be the version of myself that's best for you, always. That will end up being a better version of myself anyway :). I am so proud of you and myself for communicating, going through the storm and always coming out stronger. Soon, we will be indestructible.",
  'Thank you for providing me with the privilege to watch you grow. You have grown so much and turned into such a beautiful and strong young woman in these past 3(actually 5) months. I have loved being a part of your journey, whether that\'s through watching you, supporting you or helping you in whatever little ways I can :)',
  "We have a long road ahead, and I am scared but more so excited! I promise to always go above and beyond for you. I will always put in the effort (travel to Bombay whenever I have to XD) to make this relationship successful. I am so beyond excited for this amazing weekend we're about to share, and the life we will share together. I love living life with you by my side.",
  "All of this has made me miss you and the cuddles LOL. I can't wait to squeeze you tomorrow. Thank you for being you, Divya. No matter what rough roads may lie ahead, we will get through them together because we are a team. I am so excited for all the memories we are going to create :)",
  "Once again, I promise to never take you for granted and treat you as if I'm still trying to get you. I'm sorry if I've been slacking on that lately, I will step up. You're the most beautiful and amazing girl in the world and you deserve the universe and I will always try my best to give it to you. I adore you :)",
  'Love,',
  'Piggy'
];

const collagePhotos = [
  'images/26194490-afa9-4179-a044-614b79686007.jpg',
  'images/3ba6441c-6bcc-435a-a821-7a4c9de1649f.jpg',
  'images/d4f96ec5-4244-4987-b0c1-c51c6be701fd.jpg',
  'images/IMG_3911.JPG',
  'images/IMG_8443.JPG'
];

function setActiveTab(tabName) {
  tabs.forEach((button) => button.classList.toggle('active', button.dataset.tab === tabName));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === tabName));
}

function revealValentineContent(responseText, tabName = 'itinerary') {
  proposalResponse.textContent = responseText;
  proposalResponse.classList.remove('hidden');
  valentineTabs.classList.remove('hidden');
  app.classList.add('content-revealed');
  setActiveTab(tabName);
}

function renderItinerary() {
  itineraryList.innerHTML = '';

  itineraryItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'itinerary-item';
    li.innerHTML = `
      <div class="itinerary-time">${item.time}</div>
      <div>
        <strong>${item.activity}</strong>
        <p class="itinerary-meta">${item.location}</p>
      </div>
    `;
    itineraryList.appendChild(li);
  });
}

function renderLetter() {
  letterContent.innerHTML = '';
  letterParagraphs.forEach((paragraph) => {
    const p = document.createElement('p');
    p.className = 'letter-paragraph';
    p.textContent = paragraph;
    letterContent.appendChild(p);
  });
}

function renderCollage() {
  collagePhotos.forEach((src, index) => {
    const img = document.getElementById(`photo${index + 1}`);
    if (!img) return;
    img.src = src;
  });

  const heroImage = collagePhotos[2];
  hero.style.backgroundImage = `linear-gradient(rgba(48, 5, 27, 0.35), rgba(48, 5, 27, 0.35)), url('${heroImage}')`;
}

yesButton.addEventListener('click', () => {
  revealValentineContent('She said YES. 💞', 'itinerary');
});

maybeButton.addEventListener('click', () => {
  revealValentineContent('Reason #108: Every plan is better with Divya in it ✨', 'letter');
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
});

renderItinerary();
renderLetter();
renderCollage();
