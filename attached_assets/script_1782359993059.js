document.addEventListener('DOMContentLoaded', () => {
  const views = [...document.querySelectorAll('[data-view]')];
  const navTriggers = [...document.querySelectorAll('[data-view-target]')];
  const viewMap = new Map(views.map((view) => [view.id, view]));
  const triggersByTarget = new Map();
  let currentViewId = '';
  let activeNavTriggers = [];
  let handleViewChange = () => {};

  const setText = (element, value) => {
    if (element && element.textContent !== value) {
      element.textContent = value;
    }
  };

  const setHidden = (element, hidden) => {
    if (element) {
      element.classList.toggle('hidden', hidden);
    }
  };

  const setAriaPressed = (element, pressed) => {
    if (element && element.getAttribute('aria-pressed') !== String(pressed)) {
      element.setAttribute('aria-pressed', String(pressed));
    }
  };

  const setAriaCurrent = (element, active) => {
    if (!element || !element.matches('.nav-link')) return;
    if (active) {
      element.setAttribute('aria-current', 'page');
    } else {
      element.removeAttribute('aria-current');
    }
  };

  navTriggers.forEach((trigger) => {
    const { viewTarget } = trigger.dataset;
    if (!viewTarget) return;

    if (!triggersByTarget.has(viewTarget)) {
      triggersByTarget.set(viewTarget, []);
    }
    triggersByTarget.get(viewTarget).push(trigger);
  });

  const showView = (viewId) => {
    if (!viewId || currentViewId === viewId) return;

    const nextView = viewMap.get(viewId);
    if (!nextView) return;

    handleViewChange(currentViewId, viewId);

    if (currentViewId) {
      setHidden(viewMap.get(currentViewId), true);
      activeNavTriggers.forEach((trigger) => {
        trigger.classList.remove('active');
        setAriaCurrent(trigger, false);
      });
    }

    setHidden(nextView, false);

    activeNavTriggers = triggersByTarget.get(viewId) || [];
    activeNavTriggers.forEach((trigger) => {
      trigger.classList.add('active');
      setAriaCurrent(trigger, true);
    });

    currentViewId = viewId;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-view-target]');
    if (!trigger) return;

    event.preventDefault();
    showView(trigger.dataset.viewTarget);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const trigger = event.target.closest('.tool-card[data-view-target]');
    if (!trigger) return;

    event.preventDefault();
    showView(trigger.dataset.viewTarget);
  });

  const todayDate = document.getElementById('todayDate');
  if (todayDate) {
    setText(todayDate, new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(new Date()));
  }

  const customizeToggle = document.getElementById('customizeToggle');
  const customizePanel = document.getElementById('customizePanel');
  const customizeDone = document.getElementById('customizeDone');
  const widgetToggles = [...document.querySelectorAll('[data-widget-toggle]')];
  const dashboardBlocksByKey = new Map();

  document.querySelectorAll('[data-dashboard-block]').forEach((block) => {
    const key = block.dataset.dashboardBlock;
    if (!dashboardBlocksByKey.has(key)) {
      dashboardBlocksByKey.set(key, []);
    }
    dashboardBlocksByKey.get(key).push(block);
  });

  const syncDashboardBlocks = () => {
    widgetToggles.forEach((checkbox) => {
      const key = checkbox.dataset.widgetToggle;
      const blocks = dashboardBlocksByKey.get(key) || [];
      blocks.forEach((block) => setHidden(block, !checkbox.checked));
    });
  };

  if (customizeToggle && customizePanel) {
    customizeToggle.addEventListener('click', () => {
      const expanded = customizeToggle.getAttribute('aria-expanded') === 'true';
      customizePanel.classList.toggle('hidden', expanded);
      customizeToggle.classList.toggle('active', !expanded);
      customizeToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  if (customizeDone && customizePanel && customizeToggle) {
    customizeDone.addEventListener('click', () => {
      customizePanel.classList.add('hidden');
      customizeToggle.classList.remove('active');
      customizeToggle.setAttribute('aria-expanded', 'false');
    });
  }

  widgetToggles.forEach((toggle) => toggle.addEventListener('change', syncDashboardBlocks));
  syncDashboardBlocks();

  const wellbeingButtons = [...document.querySelectorAll('[data-wellbeing]')];
  const wellbeingStatus = document.getElementById('wellbeingStatus');
  let activeWellbeingButton = null;
  wellbeingButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (activeWellbeingButton === button) return;
      setAriaPressed(activeWellbeingButton, false);
      setAriaPressed(button, true);
      activeWellbeingButton = button;
      setText(wellbeingStatus, button.dataset.wellbeing);
    });
  });

  let timerInterval = null;
  const timerMinutes = document.getElementById('timerMinutes');
  const timerDigits = document.getElementById('timerDigits');
  const timerStatus = document.getElementById('timerStatus');
  const timerRing = document.getElementById('timerRing');
  const timerDone = document.getElementById('timerDone');
  const presetButtons = [...document.querySelectorAll('.preset-btn')];
  const timerStart = document.getElementById('timerStart');
  const timerRadius = 140;
  const timerCircumference = 2 * Math.PI * timerRadius;
  let totalSeconds = Number(timerMinutes?.value || 25) * 60;
  let remainingSeconds = totalSeconds;
  let lastValidMinutes = Math.max(1, Math.min(120, Number(timerMinutes?.value || 25)));

  const updateTimerRing = () => {
    if (!timerRing) return;
    const progress = totalSeconds === 0 ? 0 : remainingSeconds / totalSeconds;
    timerRing.style.strokeDasharray = `${timerCircumference}`;
    timerRing.style.strokeDashoffset = `${timerCircumference * (1 - progress)}`;
  };

  const renderTimer = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    setText(timerDigits, `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    updateTimerRing();
  };

  const stopTimer = (statusText = 'Ready to start') => {
    clearInterval(timerInterval);
    timerInterval = null;
    setText(timerStatus, statusText);
  };

  const applyTimerMinutes = (minutes) => {
    lastValidMinutes = Math.max(1, Math.min(120, Math.round(minutes)));
    if (timerMinutes) {
      timerMinutes.value = String(lastValidMinutes);
    }
    totalSeconds = lastValidMinutes * 60;
    remainingSeconds = totalSeconds;
    setHidden(timerDone, true);
    renderTimer();
  };

  const getSanitizedMinutes = () => {
    const rawValue = timerMinutes?.value.trim() ?? '';
    if (rawValue === '') return null;

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) return lastValidMinutes;
    return Math.max(1, Math.min(120, Math.round(parsed)));
  };

  const syncTimerFromInput = ({ forceFallback = false } = {}) => {
    const sanitizedMinutes = getSanitizedMinutes();

    if (sanitizedMinutes === null) {
      if (forceFallback) {
        if (timerInterval) {
          if (timerMinutes) {
            timerMinutes.value = String(lastValidMinutes);
          }
        } else {
          applyTimerMinutes(lastValidMinutes);
          setText(timerStatus, 'Ready to start');
        }
        return lastValidMinutes;
      } else if (!timerInterval) {
        setText(timerStatus, 'Enter minutes');
      }
      return null;
    }

    if (!timerInterval) {
      applyTimerMinutes(sanitizedMinutes);
      setText(timerStatus, 'Ready to start');
    } else {
      lastValidMinutes = sanitizedMinutes;
      if (timerMinutes && timerMinutes.value !== String(sanitizedMinutes)) {
        timerMinutes.value = String(sanitizedMinutes);
      }
    }

    return sanitizedMinutes;
  };

  if (timerMinutes) {
    timerMinutes.addEventListener('input', () => {
      if (timerMinutes.value === '') {
        if (!timerInterval) {
          setText(timerStatus, 'Enter minutes');
        }
        return;
      }

      syncTimerFromInput();
    });

    timerMinutes.addEventListener('blur', () => {
      syncTimerFromInput({ forceFallback: true });
    });
  }

  presetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      presetButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      if (timerMinutes) {
        timerMinutes.value = button.dataset.minutes;
      }
      stopTimer();
      syncTimerFromInput({ forceFallback: true });
    });
  });

  timerStart?.addEventListener('click', () => {
    if (timerInterval) return;

    const currentMinutes = syncTimerFromInput({ forceFallback: true });
    if (!currentMinutes) return;

    if (remainingSeconds <= 0) {
      applyTimerMinutes(currentMinutes);
    }

    setText(timerStatus, 'Session in progress');
    setHidden(timerDone, true);

    timerInterval = window.setInterval(() => {
      remainingSeconds -= 1;
      renderTimer();

      if (remainingSeconds <= 0) {
        remainingSeconds = 0;
        renderTimer();
        stopTimer('Complete');
        setHidden(timerDone, false);
        openCelebration('Focus session complete');
      }
    }, 1000);
  });
  renderTimer();

  let butterflyInterval = null;
  let boxInterval = null;
  const butterflyStates = [
    {
      status: 'Breathe in slowly',
      instruction: 'Open your chest and breathe in together for four calm counts.'
    },
    {
      status: 'Breathe out gently',
      instruction: 'Lower your shoulders and release the breath for four calm counts.'
    }
  ];
  const boxStates = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  let butterflyStep = 0;
  let boxStep = 0;
  let boxCycle = 1;

  const butterflyStatus = document.getElementById('butterflyStatus');
  const butterflyInstruction = document.getElementById('butterflyInstruction');
  const boxStatus = document.getElementById('boxStatus');
  const boxInstruction = document.getElementById('boxInstruction');
  const boxCounter = document.getElementById('boxCounter');
  const breathingTabs = [...document.querySelectorAll('[data-breathing-tab]')];
  const butterflyExercise = document.getElementById('butterflyExercise');
  const boxExercise = document.getElementById('boxExercise');
  let activeBreathingTab = '';

  const stopButterflyPrompts = (status = 'Paused', instruction = 'Restart when the class is ready for another calm breathing round.') => {
    clearInterval(butterflyInterval);
    butterflyInterval = null;
    setText(butterflyStatus, status);
    setText(butterflyInstruction, instruction);
  };

  const stopBoxPrompts = (status = 'Paused', instruction = 'Restart the breathing guide when students are ready.') => {
    clearInterval(boxInterval);
    boxInterval = null;
    setText(boxStatus, status);
    setText(boxInstruction, instruction);
  };

  const showBreathingTab = (tab) => {
    if (!tab || activeBreathingTab === tab) return;
    const showButterfly = tab === 'butterfly';
    setHidden(butterflyExercise, !showButterfly);
    setHidden(boxExercise, showButterfly);
    breathingTabs.forEach((button) => {
      const active = button.dataset.breathingTab === tab;
      button.setAttribute('aria-selected', String(active));
      button.classList.toggle('btn--green-teal', active && tab === 'butterfly');
      button.classList.toggle('btn--blue', active && tab === 'box');
      if (!active) {
        button.classList.remove('btn--green-teal', 'btn--blue');
        button.classList.add('btn--gray');
      } else {
        button.classList.remove('btn--gray');
      }
    });
    activeBreathingTab = tab;
  };

  breathingTabs.forEach((button) => {
    button.addEventListener('click', () => showBreathingTab(button.dataset.breathingTab));
  });
  showBreathingTab('butterfly');

  document.getElementById('butterflyStart')?.addEventListener('click', () => {
    clearInterval(butterflyInterval);
    butterflyStep = 0;
    butterflyInterval = window.setInterval(() => {
      const state = butterflyStates[butterflyStep % butterflyStates.length];
      setText(butterflyStatus, state.status);
      setText(butterflyInstruction, state.instruction);
      butterflyStep += 1;
    }, 4000);
    const state = butterflyStates[0];
    setText(butterflyStatus, state.status);
    setText(butterflyInstruction, state.instruction);
  });

  document.getElementById('butterflyStop')?.addEventListener('click', () => {
    stopButterflyPrompts();
  });

  document.getElementById('boxStart')?.addEventListener('click', () => {
    clearInterval(boxInterval);
    boxStep = 0;
    boxCycle = 1;
    boxInterval = window.setInterval(() => {
      const state = boxStates[boxStep % boxStates.length];
      setText(boxStatus, state);
      setText(boxInstruction, `${state} for four steady counts.`);
      setText(boxCounter, `Cycle ${boxCycle} of 4`);
      boxStep += 1;
      if (boxStep % boxStates.length === 0) {
        boxCycle = Math.min(boxCycle + 1, 4);
      }
    }, 4000);
    setText(boxStatus, boxStates[0]);
    setText(boxInstruction, 'Inhale for four steady counts.');
    setText(boxCounter, 'Cycle 1 of 4');
  });

  document.getElementById('boxStop')?.addEventListener('click', () => {
    stopBoxPrompts();
  });

  handleViewChange = (fromViewId, toViewId) => {
    if (fromViewId === 'breathing' && toViewId !== 'breathing') {
      if (butterflyInterval) {
        stopButterflyPrompts();
      }
      if (boxInterval) {
        stopBoxPrompts();
      }
    }
  };

  const zonePanels = [...document.querySelectorAll('[data-zone-target]')];
  const zoneDetailMap = new Map(
    [...document.querySelectorAll('.zone-detail')].map((detail) => [detail.id.replace('zone-', ''), detail])
  );
  let activeZoneDetail = null;
  zonePanels.forEach((panel) => {
    panel.addEventListener('click', () => {
      const target = panel.dataset.zoneTarget;
      const nextZoneDetail = zoneDetailMap.get(target);
      if (!nextZoneDetail || nextZoneDetail === activeZoneDetail) return;
      setHidden(activeZoneDetail, true);
      setHidden(nextZoneDetail, false);
      activeZoneDetail = nextZoneDetail;
    });
  });

  let selectedScheduleSlot = null;
  const scheduleSlots = [...document.querySelectorAll('[data-schedule-slot]')];
  const iconChips = [...document.querySelectorAll('[data-icon]')];

  scheduleSlots.forEach((slot) => {
    slot.addEventListener('click', () => {
      if (selectedScheduleSlot === slot) return;
      setAriaPressed(selectedScheduleSlot, false);
      selectedScheduleSlot = slot;
      setAriaPressed(slot, true);
    });
  });

  iconChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (!selectedScheduleSlot) selectedScheduleSlot = scheduleSlots[0] || null;
      if (selectedScheduleSlot) {
        selectedScheduleSlot.textContent = chip.dataset.icon;
      }
    });
  });

  let selectedNowNextSlot = document.querySelector('[data-nownext-slot="now"]');
  const nowNextSlots = [...document.querySelectorAll('[data-nownext-slot]')];
  const nowNextChips = [...document.querySelectorAll('[data-nownext-icon]')];

  setAriaPressed(selectedNowNextSlot, true);

  nowNextSlots.forEach((slot) => {
    slot.addEventListener('click', () => {
      if (selectedNowNextSlot === slot) return;
      setAriaPressed(selectedNowNextSlot, false);
      selectedNowNextSlot = slot;
      setAriaPressed(slot, true);
    });
  });

  nowNextChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (selectedNowNextSlot) selectedNowNextSlot.textContent = chip.dataset.nownextIcon;
    });
  });

  const starCountElement = document.getElementById('starCount');
  const starProgressLabel = document.getElementById('starProgressLabel');
  const jarStars = document.getElementById('jarStars');
  const rewardInput = document.getElementById('rewardInput');
  let starCount = 0;
  const starGoal = 10;

  const starPath = 'M12 1.8 15.1 8.5 22.4 9.3 17 14.2 18.5 21.5 12 17.8 5.5 21.5 7 14.2 1.6 9.3 8.9 8.5Z';
  const starPositions = [
    [68, 184], [104, 194], [136, 182], [82, 154], [124, 154],
    [62, 122], [100, 126], [138, 122], [82, 92], [124, 92]
  ];

  const renderStars = () => {
    setText(starCountElement, String(starCount));
    setText(starProgressLabel, `${starCount} of ${starGoal} stars collected`);
    if (!jarStars) return;

    jarStars.innerHTML = '';
    for (let index = 0; index < starCount; index += 1) {
      const [x, y] = starPositions[index];
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('transform', `translate(${x}, ${y}) scale(1.2)`);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', starPath);
      path.setAttribute('fill', index % 2 === 0 ? '#facc15' : '#f59e0b');
      path.setAttribute('stroke', '#ca8a04');
      path.setAttribute('stroke-width', '1.5');
      group.appendChild(path);
      jarStars.appendChild(group);
    }
  };

  document.getElementById('addStar')?.addEventListener('click', () => {
    starCount = Math.min(starGoal, starCount + 1);
    renderStars();
    if (starCount === starGoal) openCelebration(rewardInput?.value || 'Reward unlocked');
  });

  document.getElementById('removeStar')?.addEventListener('click', () => {
    starCount = Math.max(0, starCount - 1);
    renderStars();
  });

  document.getElementById('resetStars')?.addEventListener('click', () => {
    starCount = 0;
    renderStars();
  });

  document.getElementById('celebrateStars')?.addEventListener('click', () => {
    openCelebration(rewardInput?.value || 'Reward unlocked');
  });

  renderStars();

  const celebrationBanner = document.getElementById('celebrationBanner');
  const celebrationReward = document.getElementById('celebrationReward');

  function createConfetti() {
    if (!celebrationBanner) return;
    celebrationBanner.querySelectorAll('.confetti').forEach((piece) => piece.remove());
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];
    for (let index = 0; index < 28; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = '-10px';
      piece.style.width = '12px';
      piece.style.height = '12px';
      piece.style.borderRadius = '4px';
      piece.style.background = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      celebrationBanner.appendChild(piece);
    }
  }

  function openCelebration(message) {
    if (!celebrationBanner || !celebrationReward) return;
    setText(celebrationReward, message);
    celebrationBanner.classList.remove('hidden');
    createConfetti();
  }

  const closeCelebration = () => {
    celebrationBanner?.classList.add('hidden');
  };

  document.getElementById('closeCelebration')?.addEventListener('click', closeCelebration);
  celebrationBanner?.addEventListener('click', (event) => {
    if (event.target === celebrationBanner) closeCelebration();
  });

  const helpModal = document.getElementById('helpModal');
  const bookmarkReminder = document.getElementById('bookmarkReminder');
  const closeHelpModal = document.getElementById('closeHelpModal');

  bookmarkReminder?.addEventListener('click', () => helpModal?.classList.remove('hidden'));
  closeHelpModal?.addEventListener('click', () => helpModal?.classList.add('hidden'));
  helpModal?.addEventListener('click', (event) => {
    if (event.target === helpModal) helpModal.classList.add('hidden');
  });

  const wheelCanvas = document.getElementById('wheel-canvas');
  const wheelNames = document.getElementById('wheel-names');
  const wheelCountLabel = document.getElementById('wheelCountLabel');
  const wheelWinner = document.getElementById('wheelWinner');
  const updateWheelButton = document.getElementById('updateWheel');
  const shuffleWheelButton = document.getElementById('shuffleWheel');
  const spinWheelButton = document.getElementById('spinWheel');
  const ctx = wheelCanvas?.getContext('2d');
  const wheelColors = ['#14b8a6', '#0ea5e9', '#f59e0b', '#8b5cf6', '#22c55e', '#ec4899', '#6366f1', '#f97316'];
  let wheelItems = [];
  let wheelRotation = 0;
  let spinning = false;

  const parseWheelItems = () => {
    wheelItems = (wheelNames?.value || '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    setText(wheelCountLabel, `${wheelItems.length} ${wheelItems.length === 1 ? 'entry' : 'entries'}`);
    if (wheelItems[0]) {
      setText(wheelWinner, wheelItems[0]);
    } else {
      setText(wheelWinner, '—');
    }
  };

  const drawWheel = () => {
    if (!ctx || !wheelCanvas) return;
    const size = wheelCanvas.width;
    const center = size / 2;
    const radius = center - 10;
    ctx.clearRect(0, 0, size, size);

    if (wheelItems.length === 0) {
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6b7280';
      ctx.font = '700 24px "Libre Franklin", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Add entries', center, center);
      return;
    }

    const slice = (Math.PI * 2) / wheelItems.length;
    wheelItems.forEach((item, index) => {
      const start = wheelRotation + slice * index;
      const end = start + slice;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = wheelColors[index % wheelColors.length];
      ctx.fill();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + slice / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 22px "Libre Franklin", sans-serif';
      ctx.fillText(item, radius - 24, 8);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, 36, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  };

  const getWinner = () => {
    if (wheelItems.length === 0) return '';
    const slice = (Math.PI * 2) / wheelItems.length;
    const normalized = ((Math.PI * 1.5 - wheelRotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const index = Math.floor(normalized / slice) % wheelItems.length;
    return wheelItems[index];
  };

  const spinWheel = () => {
    if (spinning || wheelItems.length === 0) return;
    spinning = true;
    const start = performance.now();
    const initial = wheelRotation;
    const extraTurns = Math.PI * 2 * (4 + Math.random() * 3);
    const finalRotation = initial + extraTurns + Math.random() * Math.PI * 2;
    const duration = 4200;

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      wheelRotation = initial + (finalRotation - initial) * eased;
      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        const winner = getWinner();
        if (winner) {
          setText(wheelWinner, winner);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  updateWheelButton?.addEventListener('click', () => {
    parseWheelItems();
    drawWheel();
  });

  shuffleWheelButton?.addEventListener('click', () => {
    parseWheelItems();
    for (let index = wheelItems.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [wheelItems[index], wheelItems[swapIndex]] = [wheelItems[swapIndex], wheelItems[index]];
    }
    if (wheelNames) wheelNames.value = wheelItems.join('\n');
    drawWheel();
  });

  spinWheelButton?.addEventListener('click', spinWheel);
  wheelNames?.addEventListener('input', () => {
    parseWheelItems();
    drawWheel();
  });

  parseWheelItems();
  drawWheel();
  showView('dashboard');
});
