// Local geographic assets keep the map usable offline.
(() => {
  const disclosure = document.querySelector('.location-disclosure');
  if (!disclosure || !window.d3 || !window.AFFILIATION_LAND || !window.LOCATION_MARKERS) return;
  const trigger = disclosure.querySelector('summary');
  const panel = disclosure.querySelector('.location-panel');
  const svg = d3.select(disclosure.querySelector('.location-map'));
  const caption = disclosure.querySelector('.location-map-caption');
  const zoom = disclosure.querySelector('.location-zoom');
  const zoomIn = disclosure.querySelector('.location-zoom-in');
  const zoomOut = disclosure.querySelector('.location-zoom-out');
  const picker = disclosure.querySelector('.location-picker');
  const clusterPanel = disclosure.querySelector('.location-cluster');
  const clusterList = disclosure.querySelector('.location-cluster-list');
  const clusterTitle = disclosure.querySelector('.location-cluster-title');
  const clusterClose = disclosure.querySelector('.location-cluster-close');
  // Geographic source URLs live with the data.
  const places = window.AFFILIATION_PLACES;
  if (!places?.length) return;
  let selected = places[0];
  let mode = 'map';
  let zoomLevel = 0;
  const scales = [85, 1150, 4600, 18400];
  let expandedKey = null;
  let expandSelected = false;
  let renderedListKey = null;
  let groups = [];
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
  const positionPanel = () => {
    if (!disclosure.open) return;
    const anchor = trigger.getBoundingClientRect();
    const viewport = window.visualViewport;
    const leftEdge = viewport?.offsetLeft || 0;
    const topEdge = viewport?.offsetTop || 0;
    const width = Math.min(viewport?.width || window.innerWidth, document.documentElement.clientWidth);
    const height = Math.min(viewport?.height || window.innerHeight, document.documentElement.clientHeight);
    panel.style.maxWidth = Math.max(0, width - 32) + 'px';
    panel.style.maxHeight = Math.max(0, height - 32) + 'px';
    const bounds = panel.getBoundingClientRect();
    const beside = anchor.right + 12 + bounds.width <= leftEdge + width - 16;
    const left = beside ? anchor.right + 12 : anchor.left;
    const top = beside ? anchor.top - 24 : anchor.bottom + 8;
    panel.style.left = Math.max(leftEdge + 16, Math.min(left, leftEdge + width - bounds.width - 16)) + 'px';
    panel.style.top = Math.max(topEdge + 16, Math.min(top, topEdge + height - bounds.height - 16)) + 'px';
  };
  const updateClusterList = group => {
    if (!group && clusterPanel.contains(document.activeElement)) picker.focus({ preventScroll: true });
    clusterPanel.hidden = !group;
    if (!group) { renderedListKey = null; return; }
    clusterTitle.textContent = 'Nearby institutions';
    if (renderedListKey !== group.key) {
      const focusedId = clusterList.contains(document.activeElement) ? document.activeElement.dataset.placeId : null;
      clusterList.replaceChildren();
      group.members.forEach(({ place }) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.placeId = place.id;
        button.textContent = place.short;
        button.addEventListener('click', () => selectPlace(place.id));
        item.append(button);
        clusterList.append(item);
      });
      renderedListKey = group.key;
      if (focusedId) {
        const replacement = [...clusterList.querySelectorAll('button')].find(button => button.dataset.placeId === focusedId);
        (replacement || picker).focus({ preventScroll: true });
      }
    }
    clusterList.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.placeId === selected.id)));
  };
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
    positionPanel();
    const closeup = zoomLevel > 0;
    const projection = mode === 'globe'
      ? d3.geoOrthographic().rotate(rotation).translate([160, 90]).scale(scales[zoomLevel]).precision(.3)
      : closeup
        ? d3.geoEqualEarth().rotate([-selected.point[0], 0, 0]).center([0, selected.point[1]]).translate([160, 90]).scale(scales[zoomLevel]).precision(.3)
        : d3.geoEqualEarth().rotate([-20, 0, 0]).fitExtent([[4, 8], [316, 172]], sphere).precision(.3);
    projection.clipExtent([[0, 0], [320, 180]]);
    const path = d3.geoPath(projection);
    ocean.attr('d', path(sphere));
    grid.attr('d', path(graticule));
    land.attr('d', path(closeup ? window.AFFILIATION_LAND : (window.AFFILIATION_LAND_WORLD || window.AFFILIATION_LAND)));
    annotations.selectAll('*').remove();
    const center = projection.invert([160, 90]);
    const visible = point => mode !== 'globe' || d3.geoDistance(point, center) < Math.PI / 2;
    const points = places.filter(place => visible(place.point)).map(place => {
      const [x, y] = projection(place.point);
      return { place, x, y };
    }).filter(point => point.x >= 0 && point.x <= 320 && point.y >= 0 && point.y <= 180);
    const unit = 320 / Math.max(220, svg.node().getBoundingClientRect().width);
    groups = window.LOCATION_MARKERS.group(points, 18 * unit);
    if (expandSelected) {
      expandedKey = groups.find(group => group.members.length > 1 && group.members.some(point => point.place === selected))?.key || null;
      expandSelected = false;
    }
    const expanded = groups.find(group => group.key === expandedKey && group.members.length > 1);
    if (!expanded) expandedKey = null;
    const addAction = (mark, attributes, label) => {
      mark.attr('class', 'map-marker-button').attr('role', 'button').attr('tabindex', '0').attr('aria-label', label);
      for (const [key, value] of Object.entries(attributes)) mark.attr(key, value);
      mark.on('click', event => { event.stopPropagation(); if (mode !== 'globe' || event.detail === 0) activateMarker(attributes, event.detail === 0); })
        .on('keydown', event => {
          if (!['Enter', ' '].includes(event.key)) return;
          event.preventDefault();
          event.stopPropagation();
          activateMarker(attributes, true);
        });
    };
    const drawPlace = ({ place, x, y }) => {
      const active = place === selected;
      const mark = annotations.append('g');
      mark.append('title').text(`${place.name} · ${place.city}`);
      addAction(mark, { 'data-place-id': place.id }, `${place.name}, ${place.city}`);
      if (active) mark.append('circle').attr('class', 'map-halo').attr('cx', x).attr('cy', y).attr('r', 8 * unit).attr('stroke', place.color);
      mark.append('circle').attr('class', 'map-marker').attr('cx', x).attr('cy', y)
        .attr('r', (active ? 4 : 3.2) * unit).attr('fill', place.kind === 'visit' ? '#fff' : place.color)
        .style('stroke', place.kind === 'visit' ? place.color : '#fff').style('stroke-width', place.kind === 'visit' ? 1.5 : 1.2);
      mark.append('circle').attr('class', 'map-marker-hit').attr('cx', x).attr('cy', y).attr('r', 9 * unit);
    };
    // Every dot stays at its geographic projection, including overlapping dots.
    points.filter(point => point.place !== selected).concat(points.filter(point => point.place === selected)).forEach(drawPlace);
    updateClusterList(expanded);
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
    caption.textContent = expanded ? 'Choose an institution below' : mode === 'globe' ? 'Drag to rotate' : 'Select a dot';
    caption.hidden = false;
    zoom.textContent = 'World view';
    zoom.disabled = !closeup;
    zoomIn.disabled = zoomLevel === scales.length - 1;
    zoomOut.disabled = zoomLevel === 0;
    zoomIn.setAttribute('aria-label', `Zoom in (${zoomLevel + 1} of ${scales.length})`);
    zoomOut.setAttribute('aria-label', `Zoom out (${zoomLevel + 1} of ${scales.length})`);
    disclosure.querySelectorAll('[data-map-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mapView === mode)));
    picker.value = selected.id;
    [['.location-name', selected.name], ['.location-city', `${selected.city}, ${selected.country}`]].forEach(([selector, value]) => {
      const field = disclosure.querySelector(selector);
      if (field.textContent !== value) field.textContent = value;
    });
    positionPanel();
  };
  function activateMarker(attributes, keyboard = false) {
    const id = attributes['data-place-id'];
    const nearby = groups.find(group => group.members.length > 1 && group.members.some(point => point.place.id === id));
    if (nearby && expandedKey !== nearby.key) {
      expandedKey = nearby.key;
      render();
      if (keyboard) clusterList.querySelector('button')?.focus({ preventScroll: true });
      return;
    }
    selectPlace(id);
    if (keyboard) picker.focus({ preventScroll: true });
  }
  function selectPlace(id) {
    const place = places.find(item => item.id === id);
    if (!place) return;
    selected = place;
    zoomLevel = Math.max(1, zoomLevel);
    expandSelected = true;
    rotation = homeRotation();
    render();
  }
  const scheduleRender = () => {
    if (pendingFrame) return;
    pendingFrame = requestAnimationFrame(() => { pendingFrame = null; render(); });
  };
  disclosure.addEventListener('toggle', () => {
    if (disclosure.open) {
      disclosure.closest('.identity')?.getAnimations().forEach(animation => animation.cancel());
      initialized = true;
      render();
    }
  });
  disclosure.querySelectorAll('[data-map-view]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mapView;
    expandedKey = null;
    if (mode === 'globe') rotation = homeRotation();
    render();
  }));
  const setZoom = level => {
    zoomLevel = Math.max(0, Math.min(scales.length - 1, level));
    expandedKey = null;
    render();
  };
  zoom.addEventListener('click', () => setZoom(0));
  zoomIn.addEventListener('click', () => setZoom(zoomLevel + 1));
  zoomOut.addEventListener('click', () => setZoom(zoomLevel - 1));
  clusterClose.addEventListener('click', () => {
    expandedKey = null;
    render();
    picker.focus({ preventScroll: true });
  });
  picker.addEventListener('change', () => selectPlace(picker.value));
  const map = svg.node();
  map.addEventListener('pointerdown', event => {
    dragMoved = false;
    if (mode !== 'globe' || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const marker = event.target.closest('[data-place-id]');
    drag = { x: event.clientX, y: event.clientY, rotation: [...rotation], id: event.pointerId,
      attributes: marker ? { 'data-place-id': marker.getAttribute('data-place-id') } : null };
    map.setPointerCapture(event.pointerId);
    map.focus({ preventScroll: true });
  });
  map.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 4) dragMoved = true;
    if (!dragMoved) return;
    expandedKey = null;
    const sensitivity = .45 * scales[0] / scales[zoomLevel];
    rotation = [drag.rotation[0] + (event.clientX - drag.x) * sensitivity,
      Math.max(-85, Math.min(85, drag.rotation[1] - (event.clientY - drag.y) * sensitivity)), 0];
    scheduleRender();
  });
  const endDrag = () => { drag = null; };
  map.addEventListener('pointerup', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const attributes = drag.attributes;
    const wasClick = !dragMoved;
    endDrag();
    if (wasClick && attributes) activateMarker(attributes);
  });
  map.addEventListener('pointercancel', endDrag);
  map.addEventListener('lostpointercapture', endDrag);
  map.addEventListener('keydown', event => {
    if (mode !== 'globe' || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
    event.preventDefault();
    map.focus({ preventScroll: true });
    expandedKey = null;
    const step = 12 * scales[0] / scales[zoomLevel];
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
  window.addEventListener('scroll', positionPanel, { passive: true });
  const onResize = () => { if (initialized && disclosure.open) scheduleRender(); };
  window.addEventListener('resize', onResize);
  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(svg.node());
  }
  window.visualViewport?.addEventListener('resize', onResize);
  window.visualViewport?.addEventListener('scroll', positionPanel);
})();
