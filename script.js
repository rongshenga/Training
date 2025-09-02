document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const programData = [
        {
            week: 1, phase: 'Accumulation', days: [
                { 
                    day: 'Sunday', 
                    exercise: 'Bench Press', 
                    sets: 4, 
                    reps: 8, 
                    intensity: 0.65,
                    groups: [
                        { intensity: 0.65, reps: 8 },
                        { intensity: 0.65, reps: 8 },
                        { intensity: 0.65, reps: 8 },
                        { intensity: 0.65, reps: 8 }
                    ]
                },
                { 
                    day: 'Thursday', 
                    exercise: 'Bench Press', 
                    sets: 5, 
                    reps: 5, 
                    intensity: 0.775,
                    groups: [
                        { intensity: 0.775, reps: 5 },
                        { intensity: 0.775, reps: 5 },
                        { intensity: 0.775, reps: 5 },
                        { intensity: 0.775, reps: 5 },
                        { intensity: 0.775, reps: 5 }
                    ]
                },
                { 
                    day: 'Friday', 
                    exercise: 'Squat', 
                    sets: 5, 
                    reps: 5, 
                    intensity: 0.75,
                    groups: [
                        { intensity: 0.75, reps: 5 },
                        { intensity: 0.75, reps: 5 },
                        { intensity: 0.75, reps: 5 },
                        { intensity: 0.75, reps: 5 },
                        { intensity: 0.75, reps: 5 }
                    ]
                }
            ]
        },
        {
            week: 2, phase: 'Accumulation', days: [
                { day: 'Sunday', exercise: 'Bench Press', sets: 4, reps: 8, intensity: 0.675 },
                { day: 'Thursday', exercise: 'Bench Press', sets: 5, reps: 5, intensity: 0.80 },
                { day: 'Friday', exercise: 'Squat', sets: 5, reps: 5, intensity: 0.775 }
            ]
        },
        {
            week: 3, phase: 'Accumulation', days: [
                { day: 'Sunday', exercise: 'Bench Press', sets: 4, reps: 8, intensity: 0.70 },
                { day: 'Thursday', exercise: 'Bench Press', sets: 5, reps: 5, intensity: 0.825 },
                { day: 'Friday', exercise: 'Squat', sets: 5, reps: 5, intensity: 0.80 }
            ]
        },
        {
            week: 4, phase: 'Deload', days: [
                { day: 'Sunday', exercise: 'Bench Press', sets: 3, reps: 5, intensity: 0.60 },
                { day: 'Thursday', exercise: 'Bench Press', sets: 3, reps: 5, intensity: 0.60 },
                { day: 'Friday', exercise: 'Squat', sets: 3, reps: 5, intensity: 0.60 }
            ]
        },
        {
            week: 5, phase: 'Intensification', days: [
                { day: 'Sunday', exercise: 'Bench Press', sets: 4, reps: 5, intensity: 0.70 },
                { day: 'Thursday', exercise: 'Bench Press', sets: 4, reps: 3, intensity: 0.875 },
                { day: 'Friday', exercise: 'Squat', sets: 5, reps: 3, intensity: 0.85 }
            ]
        },
        {
            week: 6, phase: 'Intensification', days: [
                { day: 'Sunday', exercise: 'Bench Press', sets: 4, reps: 5, intensity: 0.725 },
                { day: 'Thursday', exercise: 'Bench Press', sets: 3, reps: 3, intensity: 0.90 },
                { day: 'Friday', exercise: 'Squat', sets: 4, reps: 3, intensity: 0.875 }
            ]
        },
        {
            week: 7, phase: 'Intensification', days: [
                { day: 'Sunday', exercise: 'Bench Press', sets: 5, reps: 3, intensity: 0.75 },
                { day: 'Thursday', exercise: 'Bench Press', sets: 3, reps: 2, intensity: 0.925 },
                { day: 'Friday', exercise: 'Squat', sets: 3, reps: 3, intensity: 0.90 }
            ]
        },
        // Week 8: Peak & Test
        {
            week: 8, phase: 'Peak & Test', days: [
                { day: 'Sunday', exercise: 'Bench Press', sets: 5, reps: 5, intensity: 0.70 },
                { day: 'Thursday', exercise: 'Bench Press', sets: 3, reps: 1, intensity: 0.95 },
                { day: 'Friday', exercise: 'Squat', sets: 3, reps: 1, intensity: 0.95 }
            ]
        }
    ];
    const workoutProgram = JSON.parse(JSON.stringify(programData));
    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];



    // --- APPLICATION STATE ---
    let state = {
        benchPressTM: 0,
        squatTM: 0,
        progressData: {},
        editMode: false,
        history: [],
        program: JSON.parse(JSON.stringify(programData)),
        viewMode: 'all', // 'all' or 'single'
        currentWeek: 1,   // 1-based index of the current week being viewed
        displayStyle: 'traditional' // 'traditional' or 'group'
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
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFileInput = document.getElementById('import-file');
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
            state.editMode = false;
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
        const setsCount = (day.groups && day.groups.length > 0) ? day.groups.length : day.sets;
        if (setsCount === 0) return false;

        for (let i = 0; i < setsCount; i++) {
            const progressId = isHistory
                ? `h${historyIndex}w${weekData.week}d${dayIndex}s${i}`
                : `w${weekData.week}d${dayIndex}s${i}`;
            if (!progressData[progressId]) {
                return false; // If any set is not completed, the day is not completed
            }
        }
        return true;
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
        editModeToggle.textContent = state.editMode ? 'Done' : 'Edit';
        editModeToggle.classList.toggle('btn-secondary', !state.editMode);
        archiveBtn.classList.add('btn-secondary');
    }

    function updateViewControls() {
        if (state.viewMode === 'single') {
            document.body.classList.add('single-week-view');
            viewToggleBtn.textContent = 'All Weeks View';
            prevWeekBtn.style.display = 'inline-block';
            nextWeekBtn.style.display = 'inline-block';

            // Disable buttons at boundaries
            prevWeekBtn.disabled = state.currentWeek <= 1;
            nextWeekBtn.disabled = state.currentWeek >= state.program.length;

        } else { // 'all' view
            document.body.classList.remove('single-week-view');
            viewToggleBtn.textContent = 'Single Week View';
            prevWeekBtn.style.display = 'none';
            nextWeekBtn.style.display = 'none';
        }
    }

    function renderPlan(containerElement, programData, tmData, progressData, isEditable, isHistory, historyIndex = -1) {
        const uniqueDays = dayOrder;
        const uniqueExercises = getUniqueOptions(programData, 'exercise');

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

            // Sort days to ensure consistent order (Sunday -> Saturday)
            weekData.days.sort((a, b) => {
                const dayA_index = dayOrder.indexOf(a.day);
                const dayB_index = dayOrder.indexOf(b.day);
                // Handle cases where a day might not be in the order array
                if (dayA_index === -1) return 1;
                if (dayB_index === -1) return -1;
                return dayA_index - dayB_index;
            });

            weekData.days.forEach((day, dayIndex) => {
                // Ensure every day object has a `groups` array for consistency.
                if (!day.groups || day.groups.length === 0) {
                    day.groups = Array.from({ length: day.sets }, () => ({
                        reps: day.reps,
                        intensity: day.intensity
                    }));
                }

                const dayCard = document.createElement('div');
                dayCard.className = 'card';
                if (!isEditable && isDayCompleted(weekData, day, dayIndex, progressData, isHistory, historyIndex)) {
                    dayCard.classList.add('day-completed');
                }
                if (isEditable) {
                    dayCard.classList.add('editable');
                    if (day.displayStyle === 'group') {
                        dayCard.classList.add('group-display');
                    }
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

                    const createDataAttrs = (prop, groupIdx) => {
                        const attrs = { ...baseDataAttrs, prop };
                        if (groupIdx !== undefined) {
                            attrs['group-idx'] = groupIdx;
                        }
                        return attrs;
                    };


                    const daySelectHTML = createSelectHTML(uniqueDays, day.day, createDataAttrs('day'));
                    const exerciseSelectHTML = createSelectHTML(uniqueExercises, day.exercise, createDataAttrs('exercise'));

                    const createInput = (type, value, prop, groupIdx) => {
                        let stepAttr = '';
                        if (type === 'number') {
                            stepAttr = (prop === 'intensity') ? 'step="0.01"' : 'step="1" min="0"';
                        }
                        return `<input type="${type}" value="${value}" ${stepAttr} ` +
                            Object.entries(createDataAttrs(prop, groupIdx)).map(([key, val]) => `data-${key}="${val}"`).join(' ') +
                            '>';
                    }


                    let editorContent = '';
                    if (day.displayStyle === 'group') {
                        let groupsHTML = day.groups.map((group, groupIdx) => `
                            <div class="group-edit-row">
                                <div class="group-edit-inputs">
                                    <div class="form-item">
                                        <label>Reps</label>
                                        ${createInput('number', group.reps, 'reps', groupIdx)}
                                    </div>
                                    <div class="form-item">
                                        <label>Intensity</label>
                                        ${createInput('number', group.intensity, 'intensity', groupIdx)}
                                    </div>
                                </div>
                                <div class="group-edit-actions">
                                     <button class="btn-delete-group" data-week-idx="${weekIdx}" data-day-idx="${dayIndex}" data-group-idx="${groupIdx}" ${isHistory ? `data-history-idx="${historyIndex}"` : ''}>&times;</button>
                                </div>
                            </div>
                        `).join('');

                        editorContent = `
                            <div class="group-editor-container">
                                ${groupsHTML}
                                <button class="btn-add-group" data-week-idx="${weekIdx}" data-day-idx="${dayIndex}" ${isHistory ? `data-history-idx="${historyIndex}"` : ''}>+ Add Group</button>
                            </div>
                        `;
                    } else {
                        editorContent = `
                            <div class="form-row">
                                <div class="form-item">
                                    <label>Sets</label>
                                    ${createInput('number', day.sets, 'sets')}
                                </div>
                                <div class="form-item">
                                    <label>Reps</label>
                                    ${createInput('number', day.reps, 'reps')}
                                </div>
                                <div class="form-item">
                                    <label>Intensity</label>
                                    ${createInput('number', day.intensity, 'intensity')}
                                </div>
                            </div>
                        `;
                    }


                    dayCard.innerHTML = `
                                <div class="form-row">
                                    <div class="form-item">
                                        <label>Day</label>
                                        ${daySelectHTML}
                                    </div>
                                    <div class="form-item">
                                        <label>Exercise</label>
                                        ${exerciseSelectHTML}
                                    </div>
                                </div>
                                ${editorContent}
                                <div class="card-actions">
                                     <button class="btn-toggle-style" title="Toggle view style" data-week-idx="${weekIdx}" data-day-idx="${dayIndex}" ${isHistory ? `data-history-idx="${historyIndex}"` : ''}>
                                        ⇄
                                    </button>
                                    <button class="btn-delete-day" data-week-idx="${weekIdx}" data-day-idx="${dayIndex}" ${isHistory ? `data-history-idx="${historyIndex}"` : ''}>&times;</button>
                                </div>
                            `;
                } else {
                    let content = `<h3>${day.day}</h3>`;
                    const tm = day.exercise === 'Bench Press' ? tmData.benchPressTM : tmData.squatTM;
                    const icon = getExerciseIcon(day.exercise);

                    if (day.displayStyle === 'group') {
                        content += `<div class="exercise-info"><p>${icon} ${day.exercise}</p></div>`;
                        let progressHTML = '<div class="group-progress-container">';
                        day.groups.forEach((group, i) => {
                            const weight = calculateWeight(tm, group.intensity);
                            const progressId = isHistory
                                ? `h${historyIndex}w${weekData.week}d${dayIndex}s${i}`
                                : `w${weekData.week}d${dayIndex}s${i}`;
                            const isCompleted = progressData[progressId] ? 'completed' : '';
                             const progressBoxAttrs = isHistory
                                ? 'style="cursor: default;"'
                                : `data-progress-id="${progressId}"`;

                            progressHTML += `
                                <div class="group-row">
                                    <div class="group-details">
                                        ${i + 1}: <strong>${weight}kg</strong> (${(group.intensity * 100).toFixed(1)}%) for ${group.reps} reps
                                    </div>
                                    <div class="group-completion">
                                        <div class="progress-box ${isCompleted}" ${progressBoxAttrs}></div>
                                    </div>
                                </div>
                            `;
                        });
                        progressHTML += '</div>';
                        content += progressHTML;
                    } else {
                        const weight = calculateWeight(tm, day.intensity);
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
                    }
                    dayCard.innerHTML = content;
                }
                weekContainer.appendChild(dayCard);
            });

            if (isEditable) {
                const addDayBtn = document.createElement('button');
                addDayBtn.className = 'btn btn-add-day';
                addDayBtn.textContent = '+ Add Day';
                const weekIdx = weekData.week - 1;
                addDayBtn.dataset.weekIdx = weekIdx;
                if (isHistory) {
                    addDayBtn.dataset.historyIdx = historyIndex;
                }
                weekContainer.appendChild(addDayBtn);
            }
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
        const { historyIdx, weekIdx, dayIdx, groupIdx, prop } = event.target.dataset;
        let value = event.target.value;

        // Determine the target program to modify
        const isHistory = historyIdx !== undefined;
        const program = isHistory ? state.history[historyIdx].program : state.program;
        const dayData = program[weekIdx].days[dayIdx];

        // Coerce to number if the input type is number
        if (event.target.type === 'number') {
            value = parseFloat(value) || 0;
        }

        if (groupIdx !== undefined) {
            // Editing a specific group
            const groupData = dayData.groups[groupIdx];
            if (groupData[prop] == value) return;
            groupData[prop] = value;

        } else {
            // Editing a top-level day property
            if (dayData[prop] == value) return;
            dayData[prop] = value;
        }


        // If a core property is changed in traditional edit mode, regenerate the groups to match
        if (['sets', 'reps', 'intensity'].includes(prop) && groupIdx === undefined) {
            dayData.groups = Array.from({ length: dayData.sets }, () => ({
                reps: dayData.reps,
                intensity: dayData.intensity
            }));
        }


        saveData();
    }

    // --- MODAL LOGIC ---
    let modalConfirmCallback = null;

    function handleCardActions(event) {
        const toggleBtn = event.target.closest('.btn-toggle-style');
        if (toggleBtn) {
            const { historyIdx, weekIdx, dayIdx } = toggleBtn.dataset;
            const isHistory = historyIdx !== undefined;
            const program = isHistory ? state.history[parseInt(historyIdx, 10)].program : state.program;
            const dayData = program[parseInt(weekIdx, 10)].days[parseInt(dayIdx, 10)];

            // Toggle the display style
            dayData.displayStyle = dayData.displayStyle === 'group' ? 'traditional' : 'group';

            saveData();
            isHistory ? renderHistory() : updateWorkoutPlan();
            return;
        }

        const addGroupBtn = event.target.closest('.btn-add-group');
        if (addGroupBtn) {
            const { historyIdx, weekIdx, dayIdx } = addGroupBtn.dataset;
            const isHistory = historyIdx !== undefined;
            const program = isHistory ? state.history[parseInt(historyIdx, 10)].program : state.program;
            const dayData = program[parseInt(weekIdx, 10)].days[parseInt(dayIdx, 10)];
            
            const lastGroup = dayData.groups[dayData.groups.length - 1] || { reps: 5, intensity: 0.75 };
            dayData.groups.push({ ...lastGroup });
            dayData.sets = dayData.groups.length; // Sync sets count

            saveData();
            isHistory ? renderHistory() : updateWorkoutPlan();
            return;
        }

        const deleteGroupBtn = event.target.closest('.btn-delete-group');
        if (deleteGroupBtn) {
            const { historyIdx, weekIdx, dayIdx, groupIdx } = deleteGroupBtn.dataset;
            const isHistory = historyIdx !== undefined;
            const program = isHistory ? state.history[parseInt(historyIdx, 10)].program : state.program;
            const dayData = program[parseInt(weekIdx, 10)].days[parseInt(dayIdx, 10)];

            dayData.groups.splice(parseInt(groupIdx, 10), 1);
            dayData.sets = dayData.groups.length; // Sync sets count

            saveData();
            isHistory ? renderHistory() : updateWorkoutPlan();
            return;
        }

        const addBtn = event.target.closest('.btn-add-day');
        if (addBtn) {
            const { historyIdx, weekIdx } = addBtn.dataset;
            const isHistory = historyIdx !== undefined;
            const program = isHistory ? state.history[parseInt(historyIdx, 10)].program : state.program;
            const weekIndex = parseInt(weekIdx, 10);

            const newDay = { day: 'Sunday', exercise: 'Bench Press', sets: 3, reps: 5, intensity: 0.7 };
            program[weekIndex].days.push(newDay);

            saveData();
            isHistory ? renderHistory() : updateWorkoutPlan();
            return; // Action handled, exit early.
        }

        const deleteBtn = event.target.closest('.btn-delete-day');
        if (deleteBtn) {
            const { historyIdx, weekIdx, dayIdx } = deleteBtn.dataset;

            showModal({
                title: 'Delete Training Day?',
                text: 'Are you sure you want to permanently delete this day?',
                confirmText: 'Delete',
                onConfirm: () => {
                    const isHistory = historyIdx !== undefined;
                    const program = isHistory ? state.history[parseInt(historyIdx, 10)].program : state.program;
                    const weekIndex = parseInt(weekIdx, 10);
                    const dayIndex = parseInt(dayIdx, 10);

                    program[weekIndex].days.splice(dayIndex, 1);

                    saveData();
                    isHistory ? renderHistory() : updateWorkoutPlan();
                }
            });
        }
    }

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
            exportBtn.style.display = 'inline-block';
            importBtn.style.display = 'inline-block';
            viewControls.style.display = 'flex';     // Show
            viewHistoryBtn.textContent = 'History';
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
            exportBtn.style.display = 'none';
            importBtn.style.display = 'none';
            viewControls.style.display = 'none';   // Hide
            viewHistoryBtn.textContent = 'Back to Cycle';
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

    function exportPlan() {
        const dataToExport = {
            benchPressTM: state.benchPressTM,
            squatTM: state.squatTM,
            progressData: state.progressData,
            program: state.program,
        };

        const dataStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workout-plan.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importPlan() {
        importFileInput.click();
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate imported data structure
                if (
                    typeof importedData.benchPressTM === 'number' &&
                    typeof importedData.squatTM === 'number' &&
                    typeof importedData.progressData === 'object' &&
                    Array.isArray(importedData.program)
                ) {
                    state.benchPressTM = importedData.benchPressTM;
                    state.squatTM = importedData.squatTM;
                    state.progressData = importedData.progressData;
                    state.program = importedData.program;

                    saveData();
                    updateDisplay();

                     showModal({
                        title: 'Success!',
                        text: 'Plan imported successfully.',
                        confirmText: 'OK',
                        cancelText: null
                    });
                } else {
                    throw new Error('Invalid file format.');
                }
            } catch (error) {
                 showModal({
                    title: 'Import Error',
                    text: `Failed to import plan: ${error.message}`,
                    confirmText: 'OK',
                    cancelText: null
                });
            } finally {
                // Reset file input to allow re-selection of the same file
                importFileInput.value = '';
            }
        };
        reader.readAsText(file);
    }

    // --- INITIALIZATION ---
    function init() {
        loadData();

        benchTmInput.addEventListener('input', handleTMChange);
        squatTmInput.addEventListener('input', handleTMChange);
        editModeToggle.addEventListener('click', handleEditModeToggle);
        workoutContainer.addEventListener('click', handleProgressToggle);
        workoutContainer.addEventListener('click', handleCardActions);
        workoutContainer.addEventListener('change', handleWorkoutDataChange);
        document.getElementById('history-container').addEventListener('change', handleWorkoutDataChange);
        archiveBtn.addEventListener('click', archiveAndStartNewCycle);
        viewHistoryBtn.addEventListener('click', toggleHistoryView);
        prevWeekBtn.addEventListener('click', handlePrevWeek);
        nextWeekBtn.addEventListener('click', handleNextWeek);
        viewToggleBtn.addEventListener('click', handleViewToggle);
        exportBtn.addEventListener('click', exportPlan);
        importBtn.addEventListener('click', importPlan);
        importFileInput.addEventListener('change', handleFileSelect);
        modalConfirmBtn.addEventListener('click', handleModalConfirm);
        modalCancelBtn.addEventListener('click', hideModal);
        document.getElementById('history-container').addEventListener('click', handleHistoryClick);
        document.getElementById('history-container').addEventListener('click', handleCardActions);
        document.getElementById('history-container').addEventListener('input', handleHistoryTMChange);

        updateDisplay(); // Initial render
    }

    init();
});