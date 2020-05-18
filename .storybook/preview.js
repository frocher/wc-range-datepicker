import { addParameters, setCustomElements } from '@open-wc/demoing-storybook';

//import 'https://fonts.googleapis.com/css?family=Material+Icons&display=block';

addParameters({
  docs: {
    iframeHeight: '200px',
  },
});

async function run() {
  const customElements = await (
    await fetch(new URL('../custom-elements.json', import.meta.url))
  ).json();

  setCustomElements(customElements);
}

run();
