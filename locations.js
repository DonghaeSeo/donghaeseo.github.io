// Local geographic assets keep the map usable offline.
(() => {
  const disclosure = document.querySelector('.location-disclosure');
  if (!disclosure || !window.d3 || !window.AFFILIATION_LAND) return;
  const trigger = disclosure.querySelector('summary');
  const panel = disclosure.querySelector('.location-panel');
  const svg = d3.select(disclosure.querySelector('.location-map'));
  const caption = disclosure.querySelector('.location-map-caption');
  const zoom = disclosure.querySelector('.location-zoom');
  const picker = disclosure.querySelector('.location-picker');
  // Geographic source URLs live with the data.
  const places = window.AFFILIATION_PLACES;
  if (!places?.length) return;
  let selected = places[0];
  let mode = 'map';
  let closeup = false;
  const homeRotation = () => [-selected.point[0], -selected.point[1], 0];
  let rotation = homeRotation();
  let initialized = false;
  let pendingFrame;
  let drag;
  let dragMoved = false;
  const sphere = { type: 'Sphere' };
  const graticule = d3.geoGraticule10();
  const ocean = svg.append('path').attr('class', 'map-ocean');
  const grid = svg.append('path').attr('class', 'map-grid');
  const land = svg.append('path').attr('class', 'map-land');
  const annotations = svg.append('g');
  picker.replaceChildren();
  [['affiliation', 'Affiliations'], ['visit', 'Visits']].forEach(([kind, label]) => {
    const group = document.createElement('optgroup');
    group.label = label;
    const groupPlaces = places.filter(place => place.kind === kind);
    if (kind === 'visit') groupPlaces.sort((a, b) => a.short.localeCompare(b.short, 'en'));
    groupPlaces.forEach(place => {
      const option = document.createElement('option');
      option.value = place.id;
      option.textContent = `${place.short} · ${place.city}`;
      group.append(option);
    });
    picker.append(group);
  });

  const render = () => {
    const projection = mode === 'globe'
      ? d3.geoOrthographic().rotate(rotation).translate([160, 90]).scale(closeup ? 1150 : 85).precision(.3)
      : closeup
        ? d3.geoEqualEarth().rotate([-selected.point[0], 0, 0]).center([0, selected.point[1]]).translate([160, 90]).scale(1100).precision(.3)
        : d3.geoEqualEarth().rotate([-20, 0, 0]).fitExtent([[4, 8], [316, 172]], sphere).precision(.3);
    projection.clipExtent([[0, 0], [320, 180]]);
    const path = d3.geoPath(projection);
    ocean.attr('d', path(sphere));
    grid.attr('d', path(graticule));
    land.attr('d', path(closeup ? window.AFFILIATION_LAND : (window.AFFILIATION_LAND_WORLD || window.AFFILIATION_LAND)));
    annotations.selectAll('*').remove();
    const center = projection.invert([160, 90]);
    const visible = point => mode !== 'globe' || d3.geoDistance(point, center) < Math.PI / 2;
    const ordered = places.filter(place => place !== selected).concat(selected);
    ordered.forEach(place => {
      if (!visible(place.point)) return;
      const [x, y] = projection(place.point);
      if (x < -10 || x > 330 || y < -10 || y > 190) return;
      const active = place === selected;
      const mark = annotations.append('g');
      mark.append('title').text(`${place.name} · ${place.city}`);
      if (active) mark.append('circle').attr('class', 'map-halo').attr('cx', x).attr('cy', y).attr('r', closeup ? 8 : 6).attr('stroke', place.color);
      mark.append('circle').attr('class', 'map-marker').attr('cx', x).attr('cy', y)
        .attr('r', active ? 3.5 : 2.7).attr('fill', place.kind === 'visit' ? '#fff' : place.color)
        .style('stroke', place.kind === 'visit' ? place.color : '#fff').style('stroke-width', place.kind === 'visit' ? 1.5 : 1.2);
      mark.append('circle').attr('class', 'map-marker-hit').attr('cx', x).attr('cy', y).attr('r', 7)
        .attr('data-place-id', place.id)
        .on('click', event => { event.stopPropagation(); if (mode !== 'globe') selectPlace(place.id); });
    });
    if (visible(selected.point)) {
      const [x, y] = projection(selected.point);
      if (x > 5 && x < 315 && y > 5 && y < 175) {
        const right = x < 235;
        annotations.append('text').attr('class', 'map-label').attr('pointer-events', 'none')
          .attr('x', x + (right ? 10 : -10)).attr('y', Math.max(12, y - 10))
          .attr('text-anchor', right ? 'start' : 'end').text(selected.city.split(',')[0]);
      }
    }
    svg.classed('is-globe', mode === 'globe').attr('tabindex', mode === 'globe' ? '0' : null)
      .attr('aria-label', mode === 'globe'
        ? `Globe showing affiliations and visits. Selected: ${selected.name}. Drag or use arrow keys to rotate.`
        : `${closeup ? 'Close-up around ' + selected.city : 'World map'} showing affiliations and visits. Selected: ${selected.name}.`);
    caption.textContent = mode === 'globe' ? 'Drag to rotate · arrow keys work too' : '';
    caption.hidden = mode !== 'globe';
    zoom.textContent = closeup ? 'World view' : 'Closer look';
    zoom.setAttribute('aria-pressed', String(closeup));
    disclosure.querySelectorAll('[data-map-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mapView === mode)));
    picker.value = selected.id;
    [['.location-name', selected.name], ['.location-city', `${selected.city}, ${selected.country}`]].forEach(([selector, value]) => {
      const field = disclosure.querySelector(selector);
      if (field.textContent !== value) field.textContent = value;
    });
  };
  function selectPlace(id) {
    const place = places.find(item => item.id === id);
    if (!place) return;
    selected = place;
    closeup = true;
    rotation = homeRotation();
    render();
  }
  const scheduleRender = () => {
    if (pendingFrame) return;
    pendingFrame = requestAnimationFrame(() => { pendingFrame = null; render(); });
  };
  disclosure.addEventListener('toggle', () => {
    if (disclosure.open && !initialized) { initialized = true; render(); }
  });
  disclosure.querySelectorAll('[data-map-view]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mapView;
    if (mode === 'globe') rotation = homeRotation();
    render();
  }));
  zoom.addEventListener('click', () => {
    closeup = !closeup;
    if (mode === 'globe') rotation = homeRotation();
    render();
  });
  picker.addEventListener('change', () => selectPlace(picker.value));
  const map = svg.node();
  map.addEventListener('pointerdown', event => {
    dragMoved = false;
    if (mode !== 'globe' || (event.pointerType === 'mouse' && event.button !== 0)) return;
    drag = { x: event.clientX, y: event.clientY, rotation: [...rotation], id: event.pointerId,
      placeId: event.target.getAttribute('data-place-id') };
    map.setPointerCapture(event.pointerId);
    map.focus({ preventScroll: true });
  });
  map.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 4) dragMoved = true;
    if (!dragMoved) return;
    const sensitivity = closeup ? .045 : .45;
    rotation = [drag.rotation[0] + (event.clientX - drag.x) * sensitivity,
      Math.max(-85, Math.min(85, drag.rotation[1] - (event.clientY - drag.y) * sensitivity)), 0];
    scheduleRender();
  });
  const endDrag = () => { drag = null; };
  map.addEventListener('pointerup', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const placeId = drag.placeId;
    const wasClick = !dragMoved;
    endDrag();
    if (wasClick && placeId) selectPlace(placeId);
  });
  map.addEventListener('pointercancel', endDrag);
  map.addEventListener('lostpointercapture', endDrag);
  map.addEventListener('keydown', event => {
    if (mode !== 'globe' || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
    event.preventDefault();
    const step = closeup ? 1 : 12;
    if (event.key === 'Home') rotation = homeRotation();
    if (event.key === 'ArrowLeft') rotation[0] -= step;
    if (event.key === 'ArrowRight') rotation[0] += step;
    if (event.key === 'ArrowUp') rotation[1] = Math.min(85, rotation[1] + step);
    if (event.key === 'ArrowDown') rotation[1] = Math.max(-85, rotation[1] - step);
    render();
  });
  document.addEventListener('keydown', event => {
    if (!disclosure.open || event.key !== 'Escape') return;
    if (panel.contains(document.activeElement)) trigger.focus({ preventScroll: true });
    disclosure.open = false;
  });
  document.addEventListener('pointerdown', event => {
    if (!disclosure.contains(event.target)) disclosure.open = false;
  });
  document.addEventListener('focusin', event => {
    if (!disclosure.contains(event.target)) disclosure.open = false;
  });
})();
