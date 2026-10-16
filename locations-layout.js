// Nearby groups provide a name list without moving or replacing geographic dots.
window.LOCATION_MARKERS = {
  group(points, distance) {
    const remaining = new Set(points);
    const groups = [];
    while (remaining.size) {
      const members = [remaining.values().next().value];
      remaining.delete(members[0]);
      for (let i = 0; i < members.length; i++) {
        for (const point of remaining) {
          if (Math.hypot(point.x - members[i].x, point.y - members[i].y) < distance) {
            members.push(point);
            remaining.delete(point);
          }
        }
      }
      members.sort((a, b) => a.place.short.localeCompare(b.place.short, 'en'));
      groups.push({
        key: members.map(point => point.place.id).sort().join('|'),
        members
      });
    }
    return groups;
  }
};
