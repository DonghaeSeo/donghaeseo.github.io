// Native details provides click/keyboard support even without JavaScript.
(() => {
  const disclosure = document.querySelector('.name-disclosure');
  if (!disclosure) return;
  const trigger = disclosure.querySelector('summary');
  let hovered = false;
  let focused = false;
  let pinned = false;
  let dismissed = false;

  const render = () => {
    disclosure.open = !dismissed && (hovered || focused || pinned);
  };
  const close = () => {
    pinned = false;
    dismissed = true;
    render();
  };

  disclosure.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    hovered = true;
    dismissed = false;
    render();
  });
  disclosure.addEventListener('pointerleave', () => {
    hovered = false;
    if (!focused && !pinned) dismissed = false;
    render();
  });
  trigger.addEventListener('focus', () => {
    focused = trigger.matches(':focus-visible');
    if (focused) dismissed = false;
    render();
  });
  trigger.addEventListener('blur', () => {
    focused = false;
    if (!hovered && !pinned) dismissed = false;
    render();
  });
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    pinned = !pinned;
    dismissed = !pinned;
    render();
  });
  document.addEventListener('keydown', (event) => {
    const leaving = event.key === 'Tab' && disclosure.contains(event.target);
    if (disclosure.open && (event.key === 'Escape' || leaving)) close();
  });
  document.addEventListener('pointerdown', (event) => {
    if (!disclosure.contains(event.target)) close();
  });
  document.addEventListener('focusin', (event) => {
    if (!disclosure.contains(event.target)) close();
  });
})();
