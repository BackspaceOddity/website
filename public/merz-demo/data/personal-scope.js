// Personal-scope sample nodes — demonstrates the privacy/scope visualization.
// These nodes carry scope: personal and render with a dashed outline + lock dot
// in the graph; they do not flow into corporate/work context. Neutral mock data.

(function () {
  if (!Array.isArray(window.__RAW_NODES)) return;
  const personalNodes = [
    {
      id: 'personal-marathon-training',
      raw: [
        '---',
        'id: personal-marathon-training',
        'type: idea',
        'title: "Marathon training block"',
        'tags: [running, personal]',
        'scope: personal',
        'private: true',
        'created: 2026-05-02',
        '---',
        '',
        '# Marathon training block',
        '',
        'Personal fitness plan — 16-week build toward an October race. Lives only in the personal graph; never surfaces in work context or any shared view.',
      ].join('\n'),
    },
    {
      id: 'personal-reading-list',
      raw: [
        '---',
        'id: personal-reading-list',
        'type: idea',
        'title: "Reading list 2026"',
        'tags: [books, personal]',
        'scope: personal',
        'private: true',
        'created: 2026-04-18',
        '---',
        '',
        '# Reading list 2026',
        '',
        'A running list of books to read this year — fiction and non-fiction. Private; one-way scope barrier keeps it out of work-facing dashboards.',
      ].join('\n'),
    },
  ];
  for (const n of personalNodes) {
    if (!window.__RAW_NODES.find(r => r.id === n.id)) {
      window.__RAW_NODES.push(n);
    }
  }
})();
