const calendarGrid = document.querySelector('#calendarGrid');
const monthLabel = document.querySelector('#monthLabel');
const selectedDateLabel = document.querySelector('#selectedDateLabel');
const eventList = document.querySelector('#eventList');
const prevMonthButton = document.querySelector('#prevMonth');
const nextMonthButton = document.querySelector('#nextMonth');
const todayButton = document.querySelector('#todayButton');

const state = {
  visibleDate: startOfMonth(new Date()),
  selectedDate: stripTime(new Date()),
  events: [],
};

init();

async function init() {
  state.events = await loadEvents();
  bindEvents();
  render();
}

function bindEvents() {
  prevMonthButton.addEventListener('click', () => {
    state.visibleDate = addMonths(state.visibleDate, -1);
    render();
  });

  nextMonthButton.addEventListener('click', () => {
    state.visibleDate = addMonths(state.visibleDate, 1);
    render();
  });

  todayButton.addEventListener('click', () => {
    state.visibleDate = startOfMonth(new Date());
    state.selectedDate = stripTime(new Date());
    render();
  });
}

async function loadEvents() {
  try {
    const response = await fetch('data/events.json');

    if (!response.ok) {
      throw new Error(`Không thể tải dữ liệu sự kiện: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(error);
    return [];
  }
}

function render() {
  renderMonthLabel();
  renderCalendarGrid();
  renderSelectedDateEvents();
}

function renderMonthLabel() {
  monthLabel.textContent = state.visibleDate.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });
}

function renderCalendarGrid() {
  calendarGrid.innerHTML = '';

  const calendarDays = getCalendarDays(state.visibleDate);

  for (const date of calendarDays) {
    const button = document.createElement('button');
    const dateKey = toDateKey(date);
    const events = getEventsForDate(dateKey);

    button.type = 'button';
    button.className = getDayClassName(date);
    button.setAttribute('aria-label', getDayAriaLabel(date, events.length));

    button.innerHTML = `
      <span class="day-number">${date.getDate()}</span>
      ${renderEventDots(events.length)}
    `;

    button.addEventListener('click', () => {
      state.selectedDate = stripTime(date);
      state.visibleDate = startOfMonth(date);
      render();
    });

    calendarGrid.appendChild(button);
  }
}

function renderSelectedDateEvents() {
  const dateKey = toDateKey(state.selectedDate);
  const events = getEventsForDate(dateKey);

  selectedDateLabel.textContent = state.selectedDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (events.length === 0) {
    eventList.innerHTML = `
      <div class="empty-state">
        <p>Chưa có sự kiện nào cho ngày này.</p>
      </div>
    `;
    return;
  }

  eventList.innerHTML = events
    .map((event) => `
      <article class="event-item">
        <span class="event-time">${escapeHtml(event.time || 'Cả ngày')}</span>
        <h3>${escapeHtml(event.title)}</h3>
        <p>${escapeHtml(event.description || '')}</p>
      </article>
    `)
    .join('');
}

function getCalendarDays(monthDate) {
  const firstDay = startOfMonth(monthDate);
  const firstWeekday = normalizeMondayFirst(firstDay.getDay());
  const startDate = addDays(firstDay, -firstWeekday);

  return Array.from({ length: 42 }, (_, index) => addDays(startDate, index));
}

function getEventsForDate(dateKey) {
  return state.events
    .filter((event) => event.date === dateKey)
    .sort((a, b) => String(a.time || '').localeCompare(String(b.time || '')));
}

function getDayClassName(date) {
  const classes = ['day-card'];

  if (date.getMonth() !== state.visibleDate.getMonth()) {
    classes.push('is-muted');
  }

  if (isSameDate(date, state.selectedDate)) {
    classes.push('is-selected');
  }

  if (isSameDate(date, new Date())) {
    classes.push('is-today');
  }

  return classes.join(' ');
}

function getDayAriaLabel(date, eventCount) {
  const label = date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return eventCount > 0 ? `${label}, có ${eventCount} sự kiện` : `${label}, không có sự kiện`;
}

function renderEventDots(count) {
  if (count === 0) {
    return '';
  }

  const dots = Array.from({ length: Math.min(count, 4) }, () => '<span class="event-dot"></span>').join('');
  return `<span class="event-dot-row" aria-hidden="true">${dots}</span>`;
}

function normalizeMondayFirst(day) {
  return day === 0 ? 6 : day - 1;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
