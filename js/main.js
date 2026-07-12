import { initAnimations } from "./animations.js";
import { initBackground } from "./background.js";
import { initDeck } from "./deck.js";
import { initLowPowerMode } from "./low-power.js";

initLowPowerMode();
initBackground();
initDeck();
await initAnimations();

if (window.lucide) window.lucide.createIcons();
