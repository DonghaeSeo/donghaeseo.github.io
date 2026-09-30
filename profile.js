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

// Assemble the public address on interaction; this only deters simple scrapers.
(() => {
  const disclosure = document.querySelector('.email-disclosure');
  if (!disclosure) return;
  const trigger = disclosure.querySelector('.email-trigger');
  const address = disclosure.querySelector('.email-address');
  if (!trigger || !address) return;
  let hovered = false;
  let focused = false;
  let pinned = false;
  let dismissed = false;
  let revealed = false;

  const reveal = () => {
    if (revealed) return;
    const local = 'donghae.seo';
    const domain = 'kaist.ac.kr';
    const email = `${local}@${domain}`;
    address.textContent = email;
    address.href = `mailto:${email}`;
    address.hidden = false;
    revealed = true;
  };
  const render = () => {
    const open = !dismissed && (hovered || focused || pinned);
    if (open) reveal();
    disclosure.open = open;
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
  disclosure.addEventListener('focusin', (event) => {
    focused = event.target !== trigger || trigger.matches(':focus-visible');
    if (focused) dismissed = false;
    render();
  });
  disclosure.addEventListener('focusout', (event) => {
    // Tab from the summary to the address must leave the link available.
    if (disclosure.contains(event.relatedTarget)) return;
    focused = false;
    close();
  });
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    pinned = !pinned;
    dismissed = !pinned;
    render();
  });
  document.addEventListener('keydown', (event) => {
    if (!disclosure.open || event.key !== 'Escape') return;
    if (disclosure.contains(document.activeElement) && document.activeElement !== trigger) {
      trigger.focus({ preventScroll: true });
    }
    close();
  });
  document.addEventListener('pointerdown', (event) => {
    if (!disclosure.contains(event.target)) close();
  });
  document.addEventListener('focusin', (event) => {
    if (!disclosure.contains(event.target)) close();
  });
})();
