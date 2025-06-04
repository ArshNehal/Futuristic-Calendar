const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const MOCK_EVENTS = { 
        // Example: "2024-07-15": "Team Meeting at 2 PM",
    };

    let currentDisplayDate = new Date();
    let selectedDate = null; 

    const monthYearDisplay = document.getElementById('month-year-display');
    const calendarDayNamesGrid = document.getElementById('calendar-day-names');
    const calendarDaysGrid = document.getElementById('calendar-days-grid');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIconSun = document.getElementById('theme-icon-sun');
    const themeIconMoon = document.getElementById('theme-icon-moon');
    const calendarFooterMessage = document.getElementById('calendar-footer-message');

    const monthYearEditor = document.getElementById('month-year-editor');
    const yearInput = document.getElementById('year-input');
    const monthSelect = document.getElementById('month-select');
    const goToDateBtn = document.getElementById('go-to-date-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const monthYearViewContainer = document.getElementById('month-year-view-container');


    function setInitialTheme() {
      const savedTheme = localStorage.getItem('calendar-theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIconSun.classList.add('hidden');
        themeIconMoon.classList.remove('hidden');
      } else {
        // Default to light theme if no preference or 'light' is saved
        document.body.classList.remove('dark-mode');
        themeIconSun.classList.remove('hidden');
        themeIconMoon.classList.add('hidden');
      }
    }

    function toggleTheme() {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('calendar-theme', isDarkMode ? 'dark' : 'light');
      themeIconSun.classList.toggle('hidden', isDarkMode);
      themeIconMoon.classList.toggle('hidden', !isDarkMode);
    }

    function updateFooterMessage(message) {
        calendarFooterMessage.textContent = message || 'Futuristic Calendar Interface v1.0';
    }
    
    function getEventMessageForDate(date) {
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return MOCK_EVENTS[dateString];
    }

    function populateMonthYearEditor() {
        yearInput.value = currentDisplayDate.getFullYear();
        monthSelect.innerHTML = '';
        MONTH_NAMES.forEach((name, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = name;
            if (index === currentDisplayDate.getMonth()) {
                option.selected = true;
            }
            monthSelect.appendChild(option);
        });
    }

    function showMonthYearEditor() {
        populateMonthYearEditor();
        monthYearDisplay.classList.add('hidden');
        monthYearEditor.classList.add('active');
        yearInput.focus();
    }

    function hideMonthYearEditor() {
        monthYearEditor.classList.remove('active');
        monthYearDisplay.classList.remove('hidden');
    }
    
    function handleGoToDate() {
        const year = parseInt(yearInput.value);
        const month = parseInt(monthSelect.value);
        if (!isNaN(year) && yearInput.value.length === 4 && year >= 1900 && year <= 2100 && !isNaN(month)) {
            currentDisplayDate = new Date(year, month, 1);
            selectedDate = null; 
            updateFooterMessage();
            renderCalendar();
        } else {
             // Optionally provide feedback for invalid input
            alert("Please enter a valid year (1900-2100) and select a month.");
        }
        hideMonthYearEditor();
    }


    function renderCalendar() {
      const dateToRender = new Date(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth(), 1);
      const year = dateToRender.getFullYear();
      const month = dateToRender.getMonth();

      monthYearDisplay.textContent = dateToRender.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });

      calendarDayNamesGrid.innerHTML = '';
      DAYS_OF_WEEK.forEach(day => {
        const dayNameCell = document.createElement('div');
        dayNameCell.className = 'day-name';
        dayNameCell.textContent = day;
        calendarDayNamesGrid.appendChild(dayNameCell);
      });

      calendarDaysGrid.classList.add('grid-fade-out');

      setTimeout(() => {
        calendarDaysGrid.innerHTML = ''; 

        const firstDayOfMonthOffset = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayFull = new Date();
        const currentRealYear = todayFull.getFullYear();
        const currentRealMonth = todayFull.getMonth();
        const currentRealDay = todayFull.getDate();

        for (let i = 0; i < firstDayOfMonthOffset; i++) {
          const emptyCell = document.createElement('div');
          emptyCell.className = 'day-cell empty-cell';
          calendarDaysGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
          const dayCell = document.createElement('div');
          dayCell.className = 'day-cell';
          
          const dayNumberSpan = document.createElement('span');
          dayNumberSpan.textContent = day;
          dayCell.appendChild(dayNumberSpan);
          
          const cellDate = new Date(year, month, day);
          const eventDescription = getEventMessageForDate(cellDate);

          if (eventDescription) {
              const dot = document.createElement('div');
              dot.className = 'event-dot';
              dayCell.appendChild(dot);
          }

          dayCell.addEventListener('click', () => {
            let footerMsg = "";
            if (selectedDate && selectedDate.getTime() === cellDate.getTime()) {
              selectedDate = null; 
              footerMsg = eventDescription ? `Event: ${eventDescription}` : "Date deselected.";
            } else {
              selectedDate = cellDate; 
              footerMsg = `Selected: ${selectedDate.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`;
              if (eventDescription) {
                  footerMsg += ` | Event: ${eventDescription}`;
              }
            }
            updateFooterMessage(footerMsg);
            // No need to call renderCalendar() fully again for selection, just update classes
            // This avoids the fade effect on simple selection.
            // First, clear selection from all cells
            document.querySelectorAll('.calendar-days-grid .day-cell.selected').forEach(cell => cell.classList.remove('selected'));
            // Then, add selection to the clicked cell if it's now selected
            if (selectedDate && selectedDate.getTime() === cellDate.getTime()) {
                dayCell.classList.add('selected');
            }
          });
          
          if (selectedDate && selectedDate.getTime() === cellDate.getTime()) {
            dayCell.classList.add('selected');
          } 
          // 'today' should always be highlighted if it's not selected, or styled as selected if it is today and selected.
          // The CSS handles the `today.selected` combination by specificity or later rule.
          if (year === currentRealYear && month === currentRealMonth && day === currentRealDay) {
            dayCell.classList.add('today');
          }
          calendarDaysGrid.appendChild(dayCell);
        }
        calendarDaysGrid.classList.remove('grid-fade-out');
        calendarDaysGrid.classList.add('grid-fade-in');
        setTimeout(() => calendarDaysGrid.classList.remove('grid-fade-in'), 300); 

        if(selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === month) {
            const eventForSelected = getEventMessageForDate(selectedDate);
            let msg = `Selected: ${selectedDate.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`;
            if(eventForSelected) msg += ` | Event: ${eventForSelected}`;
            updateFooterMessage(msg);
        } else if (!selectedDate) {
             updateFooterMessage(); 
        }
      }, 150); 
    }

    prevMonthBtn.addEventListener('click', () => {
      currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
      selectedDate = null; 
      updateFooterMessage();
      renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
      currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
      selectedDate = null; 
      updateFooterMessage();
      renderCalendar();
    });

    themeToggleBtn.addEventListener('click', toggleTheme);
    
    monthYearDisplay.addEventListener('click', showMonthYearEditor);
    goToDateBtn.addEventListener('click', handleGoToDate);
    cancelEditBtn.addEventListener('click', hideMonthYearEditor);
    
    document.addEventListener('click', (event) => {
        if (monthYearEditor.classList.contains('active')) {
            const isClickInsideEditor = monthYearEditor.contains(event.target) || goToDateBtn.contains(event.target) || cancelEditBtn.contains(event.target);
            const isClickOnDisplay = monthYearDisplay.contains(event.target);
            if (!isClickInsideEditor && !isClickOnDisplay) {
                hideMonthYearEditor();
            }
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
      setInitialTheme();
      renderCalendar();
      if (selectedDate) {
          const eventForSelected = getEventMessageForDate(selectedDate);
          let msg = `Selected: ${selectedDate.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`;
          if(eventForSelected) msg += ` | Event: ${eventForSelected}`;
          updateFooterMessage(msg);
      } else {
          updateFooterMessage(); 
      }
    });
