const navToggle = document.querySelector("#navToggle");
const navLinks = document.querySelector("#navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const revealNodes = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImg");

if (lightbox && lightboxImage) {
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".sheet").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      if (!image) return;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  lightbox.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

// Keep the experience graceful when an image host is slow or unavailable.
document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    if (image.dataset.fallbackShown) return;
    image.dataset.fallbackShown = "true";
    const holder = image.parentElement;
    if (!holder) return;
    holder.classList.add("image-missing");
    const fallback = document.createElement("span");
    fallback.className = "image-fallback";
    fallback.textContent = image.alt || "Joy Sweet dessert";
    holder.appendChild(fallback);
    image.remove();
  });
});

// A focused, local Joy Sweet guide: quick, useful answers without sending guest questions elsewhere.
const chatKnowledge = [
  { keys: ["hours", "open", "opening", "when", "time"], answer: "Joy Sweet is open daily from 12:00–21:00. Holiday hours can change, so check Instagram before travelling." },
  { keys: ["where", "address", "location", "find", "chinatown", "faulkner"], answer: "You’ll find Joy Sweet at 41 Faulkner Street, Manchester M1 4EE, in Chinatown." },
  { keys: ["delivery", "deliveroo", "uber", "order", "collect", "collection"], answer: "You can order for delivery or collection through Deliveroo or Uber Eats from the Visit page." },
  { keys: ["vegan", "vegetarian", "allerg", "allergy", "allergen"], answer: "Ingredients and toppings can vary. Please ask the team in-store about allergens before ordering; shared preparation areas may be used." },
  { keys: ["coconut", "classic coconut"], answer: "Classic Coconut Delight is a chilled coconut dessert with a silky, refreshing texture." },
  { keys: ["osmanthus", "tofu", "pudding"], answer: "Osmanthus Tofu Pudding is a soft, silky pudding with a gentle floral osmanthus note." },
  { keys: ["mango", "snow", "ice"], answer: "Mango Snow Mountain is one of Joy Sweet’s refreshing snow-ice favourites, great when you want something cool and fruity." },
  { keys: ["durian", "taro", "sticky rice"], answer: "Durian Ice with Taro & Sticky Rice is a rich, fragrant chilled dessert with creamy taro and chewy rice." },
  { keys: ["make it yours", "custom", "topping", "base", "choose"], answer: "Make it yours: choose a base, then add four to six toppings such as grass jelly, osmanthus jelly, peach resin, mochi, taro paste, tofu pudding, sago, red bean burst, lotus seed, sticky rice or taro balls." },
  { keys: ["menu", "dessert", "food", "serve", "what"], answer: "The menu includes Cantonese sweet soups, tofu puddings, coconut desserts, milk custards, snow ices, cakes and build-your-own bowls." },
  { keys: ["hello", "hi", "hey"], answer: "Hi! I’m the Joy Sweet guide. Ask me about the menu, ingredients, opening hours, directions or ordering." }
];

const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
const getChatAnswer = (question) => {
  const text = normalise(question);
  let best = null;
  let score = 0;
  chatKnowledge.forEach((entry) => {
    const matchCount = entry.keys.reduce((count, key) => count + (text.includes(normalise(key)) ? 1 : 0), 0);
    if (matchCount > score) { score = matchCount; best = entry; }
  });
  return best?.answer || "I can help with Joy Sweet’s menu, toppings, ingredients, opening hours, directions and ordering. Try asking: ‘What can I customise?’";
};

const chatToggle = document.createElement("button");
chatToggle.className = "chat-launcher";
chatToggle.type = "button";
chatToggle.setAttribute("aria-expanded", "false");
chatToggle.setAttribute("aria-controls", "joyChat");
chatToggle.innerHTML = "<span class=\"chat-launcher__dot\"></span>Ask Joy Sweet";

const chatPanel = document.createElement("section");
chatPanel.className = "chat-panel";
chatPanel.id = "joyChat";
chatPanel.hidden = true;
chatPanel.setAttribute("aria-label", "Ask Joy Sweet");
chatPanel.innerHTML = `<div class="chat-panel__head"><div><span class="eyebrow">Joy Sweet guide</span><h2>How can I help?</h2></div><button class="chat-close" type="button" aria-label="Close chat">×</button></div><div class="chat-messages" aria-live="polite"><div class="chat-bubble chat-bubble--bot">Hi! Ask me about the menu, toppings, opening hours, directions or ordering.</div></div><form class="chat-form"><label class="sr-only" for="chatQuestion">Your question</label><input id="chatQuestion" autocomplete="off" placeholder="Ask about Joy Sweet…"><button class="btn btn--honey" type="submit">Send</button></form>`;
document.body.append(chatToggle, chatPanel);

const chatMessages = chatPanel.querySelector(".chat-messages");
const chatForm = chatPanel.querySelector(".chat-form");
const chatInput = chatPanel.querySelector("#chatQuestion");
const closeChat = () => { chatPanel.hidden = true; chatToggle.setAttribute("aria-expanded", "false"); };
chatToggle.addEventListener("click", () => { chatPanel.hidden = !chatPanel.hidden; chatToggle.setAttribute("aria-expanded", String(!chatPanel.hidden)); if (!chatPanel.hidden) chatInput.focus(); });
chatPanel.querySelector(".chat-close").addEventListener("click", closeChat);
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble chat-bubble--user";
  userBubble.textContent = question;
  chatMessages.appendChild(userBubble);
  const answer = document.createElement("div");
  answer.className = "chat-bubble chat-bubble--bot";
  answer.textContent = getChatAnswer(question);
  chatMessages.appendChild(answer);
  chatInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
