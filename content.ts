// warning: ugly code ahead
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*"]
}

function createHTMLElements(cardWrapper: any) {
  const ariaLabelElement = cardWrapper.querySelector('[aria-label]');
  if (ariaLabelElement) {
    const ariaLabel = ariaLabelElement.getAttribute('aria-label');
    
    // probably can be more robust, example: 
    // aria-label="nytimes.com The Best Emergency Weather Radio"
    // aria-label="axios.com X stops showing headlines after Musk update demand"
    const splitLabel = ariaLabel.split(' ');
    const headlineText = splitLabel[0]; // The domain is the first element
    const taglineText = splitLabel.slice(1).join(' '); // The rest of the label is the tagline

    const newDiv = document.createElement('div');
    newDiv.style.backgroundColor = 'white';
    newDiv.style.position = 'absolute';
    newDiv.style.bottom = '0';
    newDiv.style.width = '100%';
    newDiv.style.minHeight = '55px'; 
    newDiv.style.zIndex = '1';

    // Create headline and tagline divs
    const headline = document.createElement('div');
    headline.textContent = headlineText;
    headline.style.margin = '5px 10px';
    headline.style.color = '#5A636A';
    headline.style.fontFamily = '"TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    const tagline = document.createElement('div');
    tagline.textContent = taglineText;
    tagline.style.margin = '5px 10px 10px 10px';
    tagline.style.color = '#2B2C30';
    tagline.style.fontFamily = '"TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    newDiv.appendChild(headline);
    newDiv.appendChild(tagline);

    const imageElement = cardWrapper.querySelector('img');

    cardWrapper.appendChild(newDiv, imageElement);
  }
}

window.addEventListener("load", () => {
  let attempts = 0;
  const maxAttempts = 10; 
  const intervalTime = 1000; 

  // check for existing card wrappers before mutation observer is set up
  const intervalId = setInterval(() => {
    const existingCardWrappers = document.querySelectorAll('[data-testid="card.wrapper"]');
    if (existingCardWrappers.length > 0 || attempts >= maxAttempts) {
      clearInterval(intervalId); // Stop the interval
      existingCardWrappers.forEach(createHTMLElements);
    }
    attempts++;
  }, intervalTime);

  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node: any) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const cardWrappers = node.querySelectorAll('[data-testid="card.wrapper"]');
            cardWrappers.forEach(createHTMLElements);
          }
        });
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
