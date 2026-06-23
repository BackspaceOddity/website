// Mock review feed for the embeddable demo. Keeps the inbox surface non-empty
// without shipping any real internal data.
(function () {
  if (!window.INBOX_DATA) {
    console.warn('[inbox-review] window.INBOX_DATA not loaded yet — review feed not injected');
    return;
  }
  window.INBOX_DATA.review = [
    {
      id: 'rev-stale-pricing',
      kind: 'stale-evidence',
      severity: 'warn',
      title: 'Pricing assumption may be stale',
      slug: 'decision-usage-based-pricing',
      reason: 'Evidence behind the usage-based pricing call is 90+ days old.',
      age: '3mo',
      source: 'decision-usage-based-pricing',
    },
    {
      id: 'rev-due-icp',
      kind: 'due-for-review',
      severity: 'info',
      title: 'Re-review due: ICP definition',
      slug: 'concept-ideal-customer-profile',
      reason: 'Scheduled re-review window has opened.',
      age: '6mo',
      source: 'concept-ideal-customer-profile',
    },
    {
      id: 'rev-open-q-hiring',
      kind: 'open-question',
      severity: 'info',
      title: 'Open question: when to hire a second engineer?',
      slug: 'decision-first-engineering-hire',
      reason: 'Decision references a fork that was never resolved.',
      age: '1mo',
      source: 'decision-first-engineering-hire',
    },
  ];
})();
