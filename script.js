document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const programData = [
        {
            week: 1, phase: 'Accumulation', days: [
                { day: 'Sunday', title: 'Volume Bench', exercise: 'Bench Press', sets: 4, reps: 8, intensity: 0.65 },
                { day: 'Thursday', title: 'Strength Bench', exercise: 'Bench Press', sets: 5, reps: 5, intensity: 0.775 },
                { day: 'Friday', title: 'Strength Squat', exercise: 'Squat', sets: 5, reps: 5, intensity: 0.75 }
            ]
        },
        {
            week: 2, phase: 'Accumulation', days: [
                { day: 'Sunday', title: 'Volume Bench', exercise: 'Bench Press', sets: 4, reps: 8, intensity: 0.675 },
                { day: 'Thursday', title: 'Strength Bench', exercise: 'Bench Press', sets: 5, reps: 5, intensity: 0.80 },
                { day: 'Friday', title: 'Strength Squat', exercise: 'Squat', sets: 5, reps: 5, intensity: 0.775 }
            ]
        },
        {
            week: 3, phase: 'Accumulation', days: [
                { day: 'Sunday', title: 'Volume Bench', exercise: 'Bench Press', sets: 4, reps: 8, intensity: 0.70 },
                { day: 'Thursday', title: 'Strength Bench', exercise: 'Bench Press', sets: 5, reps: 5, intensity: 0.825 },
                { day: 'Friday', title: 'Strength Squat', exercise: 'Squat', sets: 5, reps: 5, intensity: 0.80 }
            ]
        },
        {
            week: 4, phase: 'Deload', days: [
                { day: 'Sunday', title: 'Technical Bench', exercise: 'Bench Press', sets: 3, reps: 5, intensity: 0.60 },
                { day: 'Thursday', title: 'Technical Bench', exercise: 'Bench Press', sets: 3, reps: 5, intensity: 0.60 },
                { day: 'Friday', title: 'Technical Squat', exercise: 'Squat', sets: 3, reps: 5, intensity: 0.60 }
            ]
        },
        {
            week: 5, phase: 'Intensification', days: [
                { day: 'Sunday', title: 'Technical Bench', exercise: 'Bench Press', sets: 4, reps: 5, intensity: 0.70 },
                { day: 'Thursday', title: 'Intensity Bench', exercise: 'Bench Press', sets: 4, reps: 3, intensity: 0.875 },
                { day: 'Friday', title: 'Intensity Squat', exercise: 'Squat', sets: 5, reps: 3, intensity: 0.85 }
            ]
        },
        {
            week: 6, phase: 'Intensification', days: [
                { day: 'Sunday', title: 'Technical Bench', exercise: 'Bench Press', sets: 4, reps: 5, intensity: 0.725 },
                { day: 'Thursday', 'title': 'Intensity Bench', exercise: 'Bench Press', sets: 3, reps: 3, intensity: 0.90 },
                { day: 'Friday', title: 'Intensity Squat', exercise: 'Squat', sets: 4, reps: 3, intensity: 0.875 }
            ]
        },
        {
            week: 7, phase: 'Intensification', days: [
                { day: 'Sunday', title: 'Activation Bench', exercise: 'Bench Press', sets: 5, reps: 3, intensity: 0.75 },
                { day: 'Thursday', title: 'Peak Bench', exercise: 'Bench Press', sets: 3, reps: 2, intensity: 0.925 },
                { day: 'Friday', title: 'Peak Squat', exercise: 'Squat', sets: 3, reps: 3, intensity: 0.90 }
            ]
        },
        // Week 8: Peak & Test
        {
            week: 8, phase: 'Peak & Test', days: [
                { day: 'Thursday', title: 'Peak Test', exercise: 'Bench Press', sets: 3, reps: 1, intensity: 0.95 },
                { day: 'Friday', title: 'Peak Test', exercise: 'Squat', sets: 3, reps: 1, intensity: 0.95 }
            ]
        }
    ];
    const workoutProgram = JSON.parse(JSON.stringify(programData));

    let CANONICAL_TITLE_OPTIONS = {};

    // --- APPLICATION STATE ---
    let state = {
        benchPressTM: 0,
        squatTM: 0,
        progressData: {},
        editMode: false,
        history: [],
        program: JSON.parse(JSON.stringify(programData)),
        viewMode: 'all', // 'all' or 'single'
        currentWeek: 1   // 1-based index of the current week being viewed
    };

    // --- DOM ELEMENTS ---
    const benchTmInput = document.getElementById('bench-tm');
    const squatTmInput = document.getElementById('squat-tm');
    const workoutContainer = document.getElementById('workout-plan');
    const editModeToggle = document.getElementById('edit-mode-toggle');
    const archiveBtn = document.getElementById('archive-cycle-btn');
    const viewHistoryBtn = document.getElementById('view-history-btn');
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');
    const viewToggleBtn = document.getElementById('view-toggle-btn');
    const viewControls = document.querySelector('.view-controls');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');

    // --- LOCALSTORAGE LOGIC ---
    function saveData() {
        localStorage.setItem('workoutLogData', JSON.stringify(state));
    }

    function loadData() {
        const savedData = localStorage.getItem('workoutLogData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Merge saved data with default state to ensure new properties are not lost
            state = { ...state, ...parsedData };
            state.history = parsedData.history || []; // Ensure history is an array
        }
    }

    // --- UTILITY FUNCTIONS ---
     function getExerciseIcon(exercise) {
        const icons = {
            'Bench Press': '🏋️', // 使用卧推的 emoji
            'Squat': '🦵',       // 使用深蹲的 emoji
        };
        return icons[exercise] ? `<span class="exercise-icon">${icons[exercise]}</span>` : '';
    }

   function getUniqueOptions(program, key) {
        const allValues = program.flatMap(week => week.days.map(day => day[key]));
        return [...new Set(allValues)];
    }

    function getTitleOptionsByExercise(program) {
        const mapping = {};
        program.forEach(week => {
            week.days.forEach(day => {
                if (!mapping[day.exercise]) {
                    mapping[day.exercise] = new Set();
                }
                mapping[day.exercise].add(day.title);
            });
        });

        // Convert sets to arrays
        for (const exercise in mapping) {
            mapping[exercise] = [...mapping[exercise]];
        }

        return mapping;
    }

    function createSelectHTML(options, selectedValue, dataAttributes) {
        let attrs = '';
        for (const key in dataAttributes) {
            attrs += `data-${key}="${dataAttributes[key]}" `;
        }

        let optionsHTML = options.map(option =>
            `<option value="${option}" ${option === selectedValue ? 'selected' : ''}>${option}</option>`
        ).join('');

        return `<select ${attrs}>${optionsHTML}</select>`;
    }
    function calculateWeight(tm, intensity) {
        if (tm <= 0) return 0;
        const weight = tm * intensity;
        return Math.round(weight / 2.5) * 2.5;
    }

    function isDayCompleted(weekData, day, dayIndex, progressData, isHistory, historyIndex) {
        for (let i = 0; i < day.sets; i++) {
            const progressId = isHistory
                ? `h${historyIndex}w${weekData.week}d${dayIndex}s${i}`
                : `w${weekData.week}d${dayIndex}s${i}`;
            if (!progressData[progressId]) {
                return false; // If any set is not completed, the day is not completed
            }
        }
        return day.sets > 0; // Return true only if there are sets to complete.
    }

    // --- RENDER/DISPLAY FUNCTIONS ---
    function updateDisplay() {
        updateWorkoutPlan();
        updateTMInputs();
        updateHeaderButtons();
        renderHistory();
        updateViewControls();
    }

    function renderHistory() {
        const historyContainer = document.getElementById('history-container');
        historyContainer.innerHTML = ''; // Clear existing
        const h2 = document.querySelector('#history-view h2');

        if (!state.history || state.history.length === 0) {
            h2.textContent = 'No Archived Cycles Found';
            historyContainer.innerHTML = '';
            return;
        }

        h2.textContent = 'Archived Cycles';

        state.history.forEach((archive, index) => {
            const archiveWrapper = document.createElement('div');
            archiveWrapper.className = 'archive-cycle';

            const archiveHeader = document.createElement('h3');
            archiveHeader.className = 'archive-header'; // Make it clickable
            archiveHeader.dataset.historyIndex = index; // Add index for click handling
            const archiveDate = new Date(archive.archivedAt).toLocaleString();
            const isEditing = archive.editMode || false;
            archiveHeader.innerHTML = `
                        <span>Cycle Archived on ${archiveDate}</span>
                        <div class="archive-tms">
                            <div class="tm-item">
                                <label>Bench TM:</label>
                                <input type="number" value="${archive.benchPressTM}" data-history-index="${index}" data-tm-type="bench" ${!isEditing ? 'disabled' : ''}>
                            </div>
                            <div class="tm-item">
                                <label>Squat TM:</label>
                                <input type="number" value="${archive.squatTM}" data-history-index="${index}" data-tm-type="squat" ${!isEditing ? 'disabled' : ''}>
                            </div>
                        </div>
                        <button class="btn-edit-archive" data-history-index="${index}">${isEditing ? 'Save' : 'Edit'}</button>
                        <button class="btn-delete-history" data-history-index="${index}">Delete</button>
                    `;
            archiveWrapper.appendChild(archiveHeader);

            const contentWrapper = document.createElement('div');
            const isCollapsed = archive.isCollapsed !== false; // Default to true
            contentWrapper.className = `archive-content ${isCollapsed ? 'collapsed' : ''}`;
            archiveWrapper.appendChild(contentWrapper);

            const planContainer = document.createElement('div');
            planContainer.className = 'archived-plan';
            contentWrapper.appendChild(planContainer);

            const tmData = { benchPressTM: archive.benchPressTM, squatTM: archive.squatTM };
            const isEditable = archive.editMode || false; // Assume false if not set
            renderPlan(planContainer, archive.program, tmData, archive.progressData, isEditable, true, index);

            historyContainer.appendChild(archiveWrapper);
        });
    }

    function updateTMInputs() {
        benchTmInput.value = state.benchPressTM > 0 ? state.benchPressTM : '';
        squatTmInput.value = state.squatTM > 0 ? state.squatTM : '';
    }

    function updateHeaderButtons() {
        editModeToggle.classList.toggle('btn-secondary', !state.editMode);
        archiveBtn.classList.add('btn-secondary');
    }

    function updateViewControls() {
        if (state.viewMode === 'single') {
            document.body.classList.add('single-week-view');
            viewToggleBtn.textContent = 'Switch to All Weeks View';
            prevWeekBtn.style.display = 'inline-block';
            nextWeekBtn.style.display = 'inline-block';

            // Disable buttons at boundaries
            prevWeekBtn.disabled = state.currentWeek <= 1;
            nextWeekBtn.disabled = state.currentWeek >= state.program.length;

        } else { // 'all' view
            document.body.classList.remove('single-week-view');
            viewToggleBtn.textContent = 'Switch to Single Week View';
            prevWeekBtn.style.display = 'none';
            nextWeekBtn.style.display = 'none';
        }
    }

    function renderPlan(containerElement, programData, tmData, progressData, isEditable, isHistory, historyIndex = -1) {
        const uniqueDays = getUniqueOptions(programData, 'day');
        const uniqueExercises = getUniqueOptions(programData, 'exercise');
        const titleOptionsByExercise = CANONICAL_TITLE_OPTIONS;

        containerElement.innerHTML = ''; // Clear previous content

        const weeksToRender = state.viewMode === 'single' && !isHistory
            ? programData.filter(week => week.week === state.currentWeek)
            : programData;

        weeksToRender.forEach(weekData => {
            const weekContainer = document.createElement('div');
            weekContainer.className = 'week-container';

            const weekHeader = document.createElement('h2');
            weekHeader.className = 'week-header';
            weekHeader.textContent = `Week ${weekData.week}: ${weekData.phase}`;
            weekContainer.appendChild(weekHeader);

            weekData.days.forEach((day, dayIndex) => {
                const dayCard = document.createElement('div');
                dayCard.className = 'card';
                if (!isEditable && isDayCompleted(weekData, day, dayIndex, progressData, isHistory, historyIndex)) {
                    dayCard.classList.add('day-completed');
                }
                if (isEditable) {
                    dayCard.classList.add('editable');
                }

                if (isEditable) {
                    const weekIdx = weekData.week - 1;

                    // Data attributes to identify which part of the state to update
                    const baseDataAttrs = {
                        'week-idx': weekIdx,
                        'day-idx': dayIndex,
                    };
                    if (isHistory) {
                        baseDataAttrs['history-idx'] = historyIndex;
                    }

                    const createDataAttrs = (prop) => ({ ...baseDataAttrs, prop });

                    const daySelectHTML = createSelectHTML(uniqueDays, day.day, createDataAttrs('day'));
                    const relevantTitles = titleOptionsByExercise[day.exercise] || [];
                    const titleSelectHTML = createSelectHTML(relevantTitles, day.title, createDataAttrs('title'));
                    const exerciseSelectHTML = createSelectHTML(uniqueExercises, day.exercise, createDataAttrs('exercise'));

                    const createInput = (type, value, prop) => {
                        let stepAttr = '';
                        if (type === 'number') {
                            stepAttr = (prop === 'intensity') ? 'step="0.01"' : 'step="1" min="0"';
                        }
                        return `<input type="${type}" value="${value}" ${stepAttr} ` +
                            Object.entries(createDataAttrs(prop)).map(([key, val]) => `data-${key}="${val}"`).join(' ') +
                            '>';
                    }


                    dayCard.innerHTML = `
                                <div>Day: ${daySelectHTML}</div>
                                <div>Exercise: ${exerciseSelectHTML}</div>
                                <div>Title: ${titleSelectHTML}</div>
                                <div class="numeric-inputs-wrapper">
                                    <div class="numeric-input-item">
                                        <label>Sets</label>
                                        ${createInput('number', day.sets, 'sets')}
                                    </div>
                                    <div class="numeric-input-item">
                                        <label>Reps</label>
                                        ${createInput('number', day.reps, 'reps')}
                                    </div>
                                    <div class="numeric-input-item">
                                        <label>Intensity</label>
                                        ${createInput('number', day.intensity, 'intensity')}
                                    </div>
                                </div>
                            `;
                } else {
                    let content = `<h3>${day.day} - ${day.title}</h3>`;
                    const tm = day.exercise === 'Bench Press' ? tmData.benchPressTM : tmData.squatTM;
                    const weight = calculateWeight(tm, day.intensity);
                    const icon = getExerciseIcon(day.exercise);
                    content += `<div class="exercise-info"><p>${icon} ${day.exercise}</p><p class="weight-details"><strong>${weight}kg</strong> (${day.intensity * 100}%)</p><p>${day.sets} sets of ${day.reps} reps</p></div>`;

                    let progressHTML = '<div class="progress-container">';
                    for (let i = 0; i < day.sets; i++) {
                        const progressId = isHistory
                            ? `h${historyIndex}w${weekData.week}d${dayIndex}s${i}`
                            : `w${weekData.week}d${dayIndex}s${i}`;
                        const isCompleted = progressData[progressId] ? 'completed' : '';
                        const progressBoxAttrs = isHistory
                            ? 'style="cursor: default;"'
                            : `data-progress-id="${progressId}"`;
                        progressHTML += `<div class="progress-box ${isCompleted}" ${progressBoxAttrs}></div>`;
                    }
                    progressHTML += '</div>';
                    content += progressHTML;
                    dayCard.innerHTML = content;
                }
                weekContainer.appendChild(dayCard);
            });
            containerElement.appendChild(weekContainer);
        });
    }

    // Renders the entire 8-week program to the page.
    function updateWorkoutPlan() {
        const tmData = { benchPressTM: state.benchPressTM, squatTM: state.squatTM };
        renderPlan(workoutContainer, state.program, tmData, state.progressData, state.editMode, false);
    }

    // --- EVENT HANDLERS ---
    function handleTMChange(event) {
        const { id, value } = event.target;
        const tmValue = parseFloat(value) || 0;

        if (id === 'bench-tm') {
            state.benchPressTM = tmValue;
        } else if (id === 'squat-tm') {
            state.squatTM = tmValue;
        }

        saveData();
        updateWorkoutPlan(); // Re-render the entire plan with new weights
    }

    function handleProgressToggle(event) {
        const target = event.target;
        if (target.classList.contains('progress-box')) {
            const progressId = target.dataset.progressId;
            if (!progressId) return; // Ignore clicks on history progress boxes

            state.progressData[progressId] = !state.progressData[progressId];
            target.classList.toggle('completed');
            saveData();

            // Check if the whole day is complete now and update card style
            const dayCard = target.closest('.card');
            const allBoxes = dayCard.querySelectorAll('.progress-box');
            const allCompleted = [...allBoxes].every(box => box.classList.contains('completed'));

            if (allCompleted) {
                dayCard.classList.add('day-completed');
            } else {
                dayCard.classList.remove('day-completed');
            }
        }
    }

    function handleHistoryClick(event) {
        const deleteBtn = event.target.closest('.btn-delete-history');
        if (deleteBtn) {
            const historyIndex = parseInt(deleteBtn.dataset.historyIndex, 10);
            showModal({
                title: 'Delete History?',
                text: 'Are you sure you want to permanently delete this archived cycle?',
                confirmText: 'Delete',
                onConfirm: () => {
                    state.history.splice(historyIndex, 1);
                    saveData();
                    renderHistory(); // Re-render the history view
                }
            });
            return;
        }

        const editArchiveBtn = event.target.closest('.btn-edit-archive');
        if (editArchiveBtn) {
            const historyIndex = parseInt(editArchiveBtn.dataset.historyIndex, 10);
            state.history[historyIndex].editMode = !state.history[historyIndex].editMode;
            saveData();
            renderHistory();
            return;
        }

        const header = event.target.closest('.archive-header');
        if (header && !event.target.closest('button, input')) {
            const historyIndex = parseInt(header.dataset.historyIndex, 10);
            if (!isNaN(historyIndex)) {
                const isCollapsed = state.history[historyIndex].isCollapsed !== false;
                state.history[historyIndex].isCollapsed = !isCollapsed;
                saveData();
                renderHistory();
            }
        }
    }

    function handleHistoryTMChange(event) {
        if (event.target.matches('[data-tm-type]')) {
            const historyIndex = parseInt(event.target.dataset.historyIndex, 10);
            const tmType = event.target.dataset.tmType;
            const newValue = parseFloat(event.target.value) || 0;

            if (tmType === 'bench') {
                state.history[historyIndex].benchPressTM = newValue;
            } else if (tmType === 'squat') {
                state.history[historyIndex].squatTM = newValue;
            }
            // Changes are saved when the user clicks 'Save'
        }
    }


    function handleWorkoutDataChange(event) {
        const { historyIdx, weekIdx, dayIdx, prop } = event.target.dataset;
        let value = event.target.value;

        // Determine the target program to modify
        const isHistory = historyIdx !== undefined;
        const program = isHistory ? state.history[historyIdx].program : state.program;
        const dayData = program[weekIdx].days[dayIdx];

        // Coerce to number if the input type is number
        if (event.target.type === 'number') {
            value = parseFloat(value) || 0;
        }

        // If the value hasn't actually changed, do nothing.
        if (dayData[prop] == value) return;

        // Update the property that triggered the event
        dayData[prop] = value;

        // If the exercise was changed, we must also update the title
        if (prop === 'exercise') {
            const validTitles = CANONICAL_TITLE_OPTIONS[dayData.exercise] || [];
            if (!validTitles.includes(dayData.title)) {
                dayData.title = validTitles.length > 0 ? validTitles[0] : '';
            }

            saveData();
            // Re-render either the main plan or the history view
            if (isHistory) {
                renderHistory();
            } else {
                updateWorkoutPlan();
            }
            return;
        }

        saveData();
    }

    // --- MODAL LOGIC ---
    let modalConfirmCallback = null;

    function showModal({ title, text, bodyHtml = '', confirmText = 'Confirm', cancelText = 'Cancel', onConfirm }) {
        document.getElementById('modal-title').textContent = title;
        const modalText = document.getElementById('modal-text');
        const modalBody = document.getElementById('modal-body');

        if (bodyHtml) {
            modalText.style.display = 'none';
            modalBody.innerHTML = bodyHtml;
            modalBody.style.display = 'block';
        } else {
            modalText.textContent = text;
            modalText.style.display = 'block';
            modalBody.innerHTML = '';
            modalBody.style.display = 'none';
        }

        const confirmBtn = document.getElementById('modal-confirm-btn');
        const cancelBtn = document.getElementById('modal-cancel-btn');

        confirmBtn.textContent = confirmText;
        cancelBtn.textContent = cancelText;

        confirmBtn.style.display = confirmText ? 'inline-block' : 'none';
        cancelBtn.style.display = cancelText ? 'inline-block' : 'none';

        modalConfirmCallback = onConfirm;
        document.getElementById('custom-modal').classList.add('visible');
    }

    function hideModal() {
        document.getElementById('custom-modal').classList.remove('visible');
        modalConfirmCallback = null;
    }

    function handleModalConfirm() {
        if (modalConfirmCallback) {
            modalConfirmCallback();
        }
        hideModal();
    }

    function archiveAndStartNewCycle() {
        showModal({
            title: 'Archive Cycle?',
            text: 'Are you sure? Your current progress will be saved to history.',
            onConfirm: () => {
                const archive = {
                    archivedAt: new Date().toISOString(),
                    program: JSON.parse(JSON.stringify(state.program)),
                    progressData: JSON.parse(JSON.stringify(state.progressData)),
                    benchPressTM: state.benchPressTM,
                    squatTM: state.squatTM,
                    editMode: false, // Track edit state for the plan
                    isCollapsed: true
                };
                state.history.unshift(archive);
                state.program = JSON.parse(JSON.stringify(workoutProgram));
                state.progressData = {};
                saveData();
                updateDisplay();

                showModal({
                    title: 'Success!',
                    text: 'Cycle archived. A new cycle is ready.',
                    confirmText: 'OK',
                    cancelText: null
                });
            }
        });
    }

    function toggleHistoryView() {
        const mainPlan = document.getElementById('workout-plan');
        const historyView = document.getElementById('history-view');
        const tmInputs = document.querySelector('.tm-inputs');
        const mainHeader = document.querySelector('header h1');
        const isHistoryVisible = historyView.style.display !== 'none';

        if (isHistoryVisible) {
            // Switch back to main view
            historyView.style.display = 'none';
            mainPlan.style.display = '';
            tmInputs.style.display = 'flex';
            mainHeader.style.display = 'block';
            editModeToggle.style.display = 'inline-block'; // Show
            archiveBtn.style.display = 'inline-block';     // Show
            viewControls.style.display = 'flex';     // Show
            viewHistoryBtn.textContent = 'View History';
        } else {
            // When entering history view, reset all states to default
            state.history.forEach(archive => {
                archive.editMode = false;
                archive.isCollapsed = true;
            });
            saveData();
            renderHistory(); // Re-render with reset states before showing

            // Switch to history view
            historyView.style.display = 'block';
            mainPlan.style.display = 'none';
            tmInputs.style.display = 'none';
            mainHeader.style.display = 'none';
            editModeToggle.style.display = 'none'; // Hide
            archiveBtn.style.display = 'none';     // Hide
            viewControls.style.display = 'none';   // Hide
            viewHistoryBtn.textContent = 'Back to Current Cycle';
        }
    }

    function handleEditModeToggle() {
        state.editMode = !state.editMode;
        updateDisplay();
    }

    function handleViewToggle() {
        state.viewMode = state.viewMode === 'all' ? 'single' : 'all';
        updateDisplay();
    }

    function handlePrevWeek() {
        if (state.currentWeek > 1) {
            state.currentWeek--;
            updateDisplay();
        }
    }

    function handleNextWeek() {
        if (state.currentWeek < state.program.length) {
            state.currentWeek++;
            updateDisplay();
        }
    }

    // --- INITIALIZATION ---
    function init() {
        loadData();
        CANONICAL_TITLE_OPTIONS = getTitleOptionsByExercise(workoutProgram);

        benchTmInput.addEventListener('input', handleTMChange);
        squatTmInput.addEventListener('input', handleTMChange);
        editModeToggle.addEventListener('click', handleEditModeToggle);
        workoutContainer.addEventListener('click', handleProgressToggle);
        workoutContainer.addEventListener('change', handleWorkoutDataChange);
        document.getElementById('history-container').addEventListener('change', handleWorkoutDataChange);
        archiveBtn.addEventListener('click', archiveAndStartNewCycle);
        viewHistoryBtn.addEventListener('click', toggleHistoryView);
        prevWeekBtn.addEventListener('click', handlePrevWeek);
        nextWeekBtn.addEventListener('click', handleNextWeek);
        viewToggleBtn.addEventListener('click', handleViewToggle);
        modalConfirmBtn.addEventListener('click', handleModalConfirm);
        modalCancelBtn.addEventListener('click', hideModal);
        document.getElementById('history-container').addEventListener('click', handleHistoryClick);
        document.getElementById('history-container').addEventListener('input', handleHistoryTMChange);

        updateDisplay(); // Initial render
    }

    init();
});