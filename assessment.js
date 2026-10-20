const questions = [
  {
    category: 'Passwords',
    title: 'Do you use a unique password for each important account?',
    help: 'Important accounts include email, banking, work, school, health, and cloud services.',
    action: 'Replace reused passwords with unique passwords, beginning with email and financial accounts.'
  },
  {
    category: 'Passwords',
    title: 'Do you use a reputable password manager or another approved method to create and store strong passwords?',
    help: 'Answer at the practice level. Never enter a password or recovery code into CyberReady.',
    action: 'Adopt a reputable password manager or an organization-approved password process.'
  },
  {
    category: 'MFA',
    title: 'Is multifactor authentication enabled for your important accounts?',
    help: 'Prioritize email, financial, administrative, work, and cloud accounts.',
    action: 'Enable multifactor authentication on important accounts, starting with email and administrator access.'
  },
  {
    category: 'MFA',
    title: 'Do you use an authenticator app, passkey, or security key when a stronger option is available?',
    help: 'These options can provide better protection than text-message codes.',
    action: 'Review available sign-in methods and choose a phishing-resistant option when supported.'
  },
  {
    category: 'Updates',
    title: 'Are automatic security updates enabled on your primary devices?',
    help: 'Include computers, phones, tablets, and other devices that regularly access important information.',
    action: 'Enable automatic security updates and confirm that your primary devices receive them.'
  },
  {
    category: 'Updates',
    title: 'Do you promptly update browsers, applications, and network equipment?',
    help: 'Routers and other connected devices may require a separate firmware update process.',
    action: 'Create a routine for checking application, browser, router, and device updates.'
  },
  {
    category: 'Backups',
    title: 'Are important files backed up in more than one protected location?',
    help: 'A strong backup approach keeps a separate copy that cannot be changed by the same incident.',
    action: 'Create protected backup copies of important files in separate locations.'
  },
  {
    category: 'Backups',
    title: 'Have you tested whether an important file can be restored from backup?',
    help: 'A backup provides value only when the data can be recovered when needed.',
    action: 'Perform a safe test restoration and document the result.'
  },
  {
    category: 'Phishing awareness',
    title: 'Do you verify unexpected requests for passwords, payments, or sensitive information?',
    help: 'Use a known contact method instead of replying to the unexpected message.',
    action: 'Use a separate, trusted contact method to verify unexpected or urgent requests.'
  },
  {
    category: 'Phishing awareness',
    title: 'Do you know how to inspect and report a suspicious email, text message, or link?',
    help: 'Look for unusual sender details, urgency, unexpected attachments, and mismatched destinations.',
    action: 'Learn the approved reporting process and practice checking senders and links safely.'
  },
  {
    category: 'Device protection',
    title: 'Do your devices use an automatic screen lock and built-in security protection?',
    help: 'Protection may include device encryption, malware protection, or an organization-managed security tool.',
    action: 'Enable automatic screen locking and verify that built-in or approved security protection is active.'
  },
  {
    category: 'Device protection',
    title: 'Do you remove unneeded applications and avoid using an administrator account for routine work?',
    help: 'Reducing unnecessary software and privileges can limit the impact of a compromise.',
    action: 'Remove unused software and use a standard account for routine activity where practical.'
  },
  {
    category: 'Network security',
    title: 'Does your home or small-organization Wi-Fi use WPA2 or WPA3 with changed router credentials?',
    help: 'Default router administrator passwords should be replaced with unique credentials.',
    action: 'Secure Wi-Fi with WPA2 or WPA3 and replace default router administrator credentials.'
  },
  {
    category: 'Network security',
    title: 'Do you avoid sensitive activity on untrusted public networks or use an approved secure connection?',
    help: 'A trusted hotspot, approved VPN, or known secure network can reduce exposure.',
    action: 'Use a trusted network or approved secure connection for sensitive activity.'
  }
];

const state = { current: 0, answers: Array(questions.length).fill(null) };
const intro = document.getElementById('assessment-intro');
const questionView = document.getElementById('question-view');
const resultView = document.getElementById('result-view');
const startButton = document.getElementById('start-assessment');
const progressBar = document.getElementById('progress-bar');
const questionCount = document.getElementById('question-count');
const categoryName = document.getElementById('category-name');
const questionTitle = document.getElementById('question-title');
const questionHelp = document.getElementById('question-help');
const backButton = document.getElementById('back-button');
const nextButton = document.getElementById('next-button');
const validationMessage = document.getElementById('validation-message');
const choices = [...document.querySelectorAll('input[name="answer"]')];

function selectedValue() {
  return choices.find((choice) => choice.checked)?.value ?? null;
}

function renderQuestion() {
  const question = questions[state.current];
  const progress = ((state.current + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute('aria-valuenow', String(Math.round(progress)));
  questionCount.textContent = `Question ${state.current + 1} of ${questions.length}`;
  categoryName.textContent = question.category;
  questionTitle.textContent = question.title;
  questionHelp.textContent = question.help;
  validationMessage.textContent = '';
  choices.forEach((choice) => { choice.checked = choice.value === state.answers[state.current]; });
  backButton.disabled = state.current === 0;
  nextButton.textContent = state.current === questions.length - 1 ? 'View Results' : 'Next';
  questionTitle.focus({ preventScroll: true });
}

function startAssessment() {
  intro.classList.add('hidden');
  resultView.classList.add('hidden');
  questionView.classList.remove('hidden');
  state.current = 0;
  renderQuestion();
}

function scoreFor(answer) {
  if (answer === 'yes') return 2;
  if (answer === 'unsure') return 1;
  return 0;
}

function displayResults() {
  const earned = state.answers.reduce((total, answer) => total + scoreFor(answer), 0);
  const overall = Math.round((earned / (questions.length * 2)) * 100);
  let band = 'Priority Improvement';
  let summary = 'Several baseline safeguards are missing or need verification. Begin with the priority actions below.';
  if (overall >= 80) {
    band = 'Strong';
    summary = 'Many baseline practices are in place. Maintain them and review any weaker category or uncertain response.';
  } else if (overall >= 60) {
    band = 'Developing';
    summary = 'Several practices are present, with meaningful gaps that can be addressed through the priority actions below.';
  }

  const categoryNames = [...new Set(questions.map((question) => question.category))];
  const categoryScores = categoryNames.map((category) => {
    const indexes = questions.map((q, index) => q.category === category ? index : -1).filter((index) => index >= 0);
    const points = indexes.reduce((total, index) => total + scoreFor(state.answers[index]), 0);
    return { category, score: Math.round((points / (indexes.length * 2)) * 100) };
  });

  const recommendations = questions
    .map((question, index) => ({ ...question, answer: state.answers[index] }))
    .filter((item) => item.answer !== 'yes')
    .sort((a, b) => scoreFor(a.answer) - scoreFor(b.answer));

  document.getElementById('score-ring').style.setProperty('--score', overall);
  document.getElementById('score-value').innerHTML = `${overall}<small>/100</small>`;
  document.getElementById('result-band').textContent = band;
  document.getElementById('result-summary').textContent = summary;
  document.getElementById('category-results').innerHTML = categoryScores.map((item) => `
    <div class="category-result">
      <div class="category-result-head"><span>${item.category}</span><span>${item.score}%</span></div>
      <div class="mini-track" aria-hidden="true"><div class="mini-bar" style="width:${item.score}%"></div></div>
    </div>
  `).join('');

  document.getElementById('recommendation-list').innerHTML = recommendations.length
    ? recommendations.slice(0, 7).map((item) => `
      <li><span class="${item.answer === 'no' ? 'priority-high' : 'priority-verify'}">${item.answer === 'no' ? 'Priority' : 'Verify'}:</span> ${item.action}</li>
    `).join('')
    : '<li>Maintain current safeguards, review them after major changes, and test backups and recovery regularly.</li>';

  questionView.classList.add('hidden');
  resultView.classList.remove('hidden');
  document.getElementById('results-title').focus({ preventScroll: true });
}

startButton?.addEventListener('click', startAssessment);
backButton?.addEventListener('click', () => {
  state.answers[state.current] = selectedValue() ?? state.answers[state.current];
  if (state.current > 0) state.current -= 1;
  renderQuestion();
});
nextButton?.addEventListener('click', () => {
  const answer = selectedValue();
  if (!answer) {
    validationMessage.textContent = 'Select Yes, No, or Not sure before continuing.';
    choices[0].focus();
    return;
  }
  state.answers[state.current] = answer;
  if (state.current === questions.length - 1) displayResults();
  else {
    state.current += 1;
    renderQuestion();
  }
});

document.getElementById('review-answers')?.addEventListener('click', () => {
  state.current = 0;
  resultView.classList.add('hidden');
  questionView.classList.remove('hidden');
  renderQuestion();
});

document.getElementById('retake-assessment')?.addEventListener('click', () => {
  state.current = 0;
  state.answers = Array(questions.length).fill(null);
  resultView.classList.add('hidden');
  intro.classList.remove('hidden');
  startButton.focus();
});

document.getElementById('print-results')?.addEventListener('click', () => window.print());
