// Mock capture feed for the embeddable demo. Believable ambient-intake items
// for a startup founder's second brain. No real internal data.
(function () {
  if (!window.INBOX_DATA) {
    console.warn('[inbox-capture] window.INBOX_DATA not loaded yet — capture feed not injected');
    return;
  }
  window.INBOX_DATA.capture = [
    {
      id: 'capture-slack-onboarding',
      source: 'slack',
      sourceLabel: 'Slack · #product',
      kind: 'note',
      age: '2h',
      title: 'Two trial users got stuck on workspace setup',
      excerpt: 'Support flagged the same onboarding step twice today — workspace creation is confusing. Possible cause of the activation dip.',
    },
    {
      id: 'capture-gmail-investor-intro',
      source: 'gmail',
      sourceLabel: 'Gmail · Inbox',
      kind: 'email',
      age: '5h',
      title: 'Warm intro to a seed fund partner',
      excerpt: 'An advisor offered to introduce us to a partner who leads dev-tools investments. Worth a reply before fundraising starts.',
    },
    {
      id: 'capture-slack-churn',
      source: 'slack',
      sourceLabel: 'Slack · #customers',
      kind: 'note',
      age: '1d',
      title: 'Mid-market account hinted at churn risk',
      excerpt: 'Champion is leaving; new owner has not logged in. Map this to the retention playbook before the renewal call.',
    },
    {
      id: 'capture-gmail-newsletter',
      source: 'gmail',
      sourceLabel: 'Gmail · Newsletters',
      kind: 'newsletter',
      age: '2d',
      title: 'Benchmark report: SaaS activation rates 2026',
      excerpt: 'Median activation for self-serve B2B SaaS sits around 35%. Useful comparison for our own funnel numbers.',
    },
    {
      id: 'capture-slack-pricing-idea',
      source: 'slack',
      sourceLabel: 'Slack · #founders',
      kind: 'note',
      age: '3d',
      title: 'Idea: usage-based tier for power teams',
      excerpt: 'A peer founder described a seat + usage hybrid that lifted expansion revenue. Could fit our heaviest accounts.',
    },
  ];
})();
