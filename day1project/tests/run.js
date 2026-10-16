// Smoke tests for the study-plan frontend (tickets T1 + T2).
// Loads the inline <script> from index.html in a stubbed DOM and asserts
// external scheduler/tagger behavior only. Run: npm test
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const src = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));

function el() {
  return {
    hidden: false, value: '', textContent: '',
    classList: { add() {}, remove() {} },
    style: {}, dataset: {},
    addEventListener() {}, removeAttribute() {}, setAttribute() {},
  };
}
const store = {};
const sandbox = {
  console, module: { exports: {} },
  setTimeout, clearTimeout,
  localStorage: {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
  },
  document: { getElementById: () => el(), querySelectorAll: () => [] },
};
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const { generatePlan, tagText } = sandbox.module.exports;

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log('ok -', name); }
  else { fail++; console.log('FAIL -', name); }
}
const both = { useMath: true, useEng: true };

// T1: exact N days
for (const n of [1, 5, 7, 14, 30, 90]) {
  ok(generatePlan({ ...both, days: n, hours: 2 }).length === n, `exactly ${n} days`);
}
// T1: revision reserve (~20%)
ok(generatePlan({ ...both, days: 14, hours: 2 }).filter((d) => d.revision).length === 2, '14 days -> 2 revision');
ok(generatePlan({ ...both, days: 30, hours: 2 }).filter((d) => d.revision).length === 6, '30 days -> 6 revision');
ok(generatePlan({ ...both, days: 5, hours: 1 }).filter((d) => d.revision).length === 1, '5 days -> 1 revision');
// T1: squeeze merges, order preserved
const sq = generatePlan({ ...both, days: 5, hours: 1 });
ok(sq.filter((d) => !d.revision).every((d) => d.topics.length > 1), 'squeeze merges topics into combined days');
// T1: stretch expands with deep practice
const st = generatePlan({ useMath: true, useEng: false, days: 30, hours: 2 });
ok(st.some((d) => d.topics.some((t) => t.includes('deep practice'))), 'stretch adds deep-practice days');
// T1: per-hour trim + minutes
const m2 = generatePlan({ useMath: true, useEng: false, days: 7, hours: 2 });
ok(m2.filter((d) => !d.revision).every((d) => d.questions.length === 10 && d.minutes === 120), 'math 2h -> 10 Qs, 120 min/day');
const e2 = generatePlan({ useMath: false, useEng: true, days: 7, hours: 2 });
ok(e2.filter((d) => !d.revision).every((d) => d.questions.length === 2), 'english 2h -> 2 Qs/day');

// T2: tagger
const tA = tagText('Revise algebraic expressions tonight')[0];
ok(tA.subject === 'math' && tA.topic === 'Algebraic expressions', 'tags math topic');
const tB = tagText('Review your grammar and usage rules')[0];
ok(tB.subject === 'english' && tB.topic === 'Grammar & usage', 'tags english topic');
const tC = tagText('xyzzy nonsense qqq')[0];
ok(tC.subject === '' && tC.topic === '', 'untaggable text stays untagged');

// T6: custom questions fold into plan, untagged lands on last day
const custom = tagText('Revise algebraic expressions tonight\nxyzzy nonsense qqq');
const plan = generatePlan({ ...both, days: 7, hours: 2, customQuestions: custom });
ok(plan.length === 7, 'custom questions keep exact day count');
ok(plan.filter((d) => !d.revision).pop().questions.includes('xyzzy nonsense qqq'), 'untagged lands on last study day');
ok(plan.some((d) => d.questions.includes('Revise algebraic expressions tonight')), 'tagged lands in plan');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
