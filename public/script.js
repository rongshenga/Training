// ==========================================================================
// 1. CONFIGURATION & INITIAL DATA
// ==========================================================================
const config = {
    dayOrder: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    programData: [
        {
            week: 1, phase: 'Accumulation', days: [
                { day: 'Sunday', exercise: 'Bench Press', sets: 4, reps: 8, intensity: 0.65, groups: [ { intensity: 0.65, reps: 8 }, { intensity: 0.65, reps: 8 }, { intensity: 0.65, reps: 8 }, { intensity: 0.65, reps: 8 } ] },
                { day: 'Thursday', exercise: 'Bench Press', sets: 5, reps: 5, intensity: 0.775, groups: [ { intensity: 0.775, reps: 5 }, { intensity: 0.775, reps: 5 }, { intensity: 0.775, reps: 5 }, { intensity: 0.775, reps: 5 }, { intensity: 0.775, reps: 5 } ] },
                { day: 'Friday', exercise: 'Squat', sets: 5, reps: 5, intensity: 0.75, groups: [ { intensity: 0.75, reps: 5 }, { intensity: 0.75, reps: 5 }, { intensity: 0.75, reps: 5 }, { intensity: 0.75, reps: 5 }, { intensity: 0.75, reps: 5 } ] }
            ]
        },
        { week: 2, phase: 'Accumulation', days: [ { day: 'Sunday', exercise: 'Bench Press', sets: 4, reps: 8, intensity: 0.675 }, { day: 'Thursday', exercise: 'Bench Press', sets: 5, reps: 5, intensity: 0.80 }, { day: 'Friday', exercise: 'Squat', sets: 5, reps: 5, intensity: 0.775 } ] },
        { week: 3, phase: 'Accumulation', days: [ { day: 'Sunday', exercise: 'Bench Press', sets: 4, reps: 8, intensity: 0.70 }, { day: 'Thursday', exercise: 'Bench Press', sets: 5, reps: 5, intensity: 0.825 }, { day: 'Friday', exercise: 'Squat', sets: 5, reps: 5, intensity: 0.80 } ] },
        { week: 4, phase: 'Deload', days: [ { day: 'Sunday', exercise: 'Bench Press', sets: 3, reps: 5, intensity: 0.60 }, { day: 'Thursday', exercise: 'Bench Press', sets: 3, reps: 5, intensity: 0.60 }, { day: 'Friday', exercise: 'Squat', sets: 3, reps: 5, intensity: 0.60 } ] },
        { week: 5, phase: 'Intensification', days: [ { day: 'Sunday', exercise: 'Bench Press', sets: 4, reps: 5, intensity: 0.70 }, { day: 'Thursday', exercise: 'Bench Press', sets: 4, reps: 3, intensity: 0.875 }, { day: 'Friday', exercise: 'Squat', sets: 5, reps: 3, intensity: 0.85 } ] },
        { week: 6, phase: 'Intensification', days: [ { day: 'Sunday', exercise: 'Bench Press', sets: 4, reps: 5, intensity: 0.725 }, { day: 'Thursday', exercise: 'Bench Press', sets: 3, reps: 3, intensity: 0.90 }, { day: 'Friday', exercise: 'Squat', sets: 4, reps: 3, intensity: 0.875 } ] },
        { week: 7, phase: 'Intensification', days: [ { day: 'Sunday', exercise: 'Bench Press', sets: 5, reps: 3, intensity: 0.75 }, { day: 'Thursday', exercise: 'Bench Press', sets: 3, reps: 2, intensity: 0.925 }, { day: 'Friday', exercise: 'Squat', sets: 3, reps: 3, intensity: 0.90 } ] },
        { week: 8, phase: 'Peak & Test', days: [ { day: 'Sunday', exercise: 'Bench Press', sets: 5, reps: 5, intensity: 0.70 }, { day: 'Thursday', exercise: 'Bench Press', sets: 3, reps: 1, intensity: 0.95 }, { day: 'Friday', exercise: 'Squat', sets: 3, reps: 1, intensity: 0.95 } ] }
    ]
};

// ==========================================================================
// 2. APPLICATION CORE
// ==========================================================================
const app = {
    // 2.1. STATE MANAGEMENT
    state: {
        benchPressTM: 0,
        squatTM: 0,
        progressData: {},
        editMode: false,
        history: [],
        program: [],
        viewMode: 'all', // 'all' or 'single'
        currentWeek: 1,
        displayStyle: 'traditional'
    },

    // 2.2. DOM ELEMENT CACHE
    dom: {},

    // 2.3. INITIALIZATION
    init() {
        this.dom = {
            benchTmInput: document.getElementById('bench-tm'),
            squatTmInput: document.getElementById('squat-tm'),
            workoutContainer: document.getElementById('workout-plan'),
            historyContainer: document.getElementById('history-container'),
            editModeToggle: document.getElementById('edit-mode-toggle'),
            archiveBtn: document.getElementById('archive-cycle-btn'),
            viewHistoryBtn: document.getElementById('view-history-btn'),
            prevWeekBtn: document.getElementById('prev-week-btn'),
            nextWeekBtn: document.getElementById('next-week-btn'),
            viewToggleBtn: document.getElementById('view-toggle-btn'),
            viewControls: document.querySelector('.view-controls'),
            exportBtn: document.getElementById('export-btn'),
            importBtn: document.getElementById('import-btn'),
            importFileInput: document.getElementById('import-file'),
            modal: document.getElementById('custom-modal'),
            modalTitle: document.getElementById('modal-title'),
            modalText: document.getElementById('modal-text'),
            modalBody: document.getElementById('modal-body'),
            modalConfirmBtn: document.getElementById('modal-confirm-btn'),
            modalCancelBtn: document.getElementById('modal-cancel-btn'),
            mainHeader: document.querySelector('header h1'),
            historyView: document.getElementById('history-view'),
            tmInputs: document.querySelector('.tm-inputs')
        };

        this.storage.load();
        this.render.updateDisplay();
        this.setupEventListeners();
    },

    // 2.4. EVENT LISTENER SETUP
    setupEventListeners() {
        // Main controls
        this.dom.benchTmInput.addEventListener('input', this.handlers.handleTMChange.bind(this));
        this.dom.squatTmInput.addEventListener('input', this.handlers.handleTMChange.bind(this));
        this.dom.editModeToggle.addEventListener('click', this.handlers.handleEditModeToggle.bind(this));
        this.dom.archiveBtn.addEventListener('click', this.handlers.archiveAndStartNewCycle.bind(this));
        this.dom.viewHistoryBtn.addEventListener('click', this.handlers.toggleHistoryView.bind(this));
        this.dom.exportBtn.addEventListener('click', this.handlers.exportPlan.bind(this));
        this.dom.importBtn.addEventListener('click', this.handlers.importPlan.bind(this));
        this.dom.importFileInput.addEventListener('change', this.handlers.handleFileSelect.bind(this));

        // View controls
        this.dom.prevWeekBtn.addEventListener('click', this.handlers.handlePrevWeek.bind(this));
        this.dom.nextWeekBtn.addEventListener('click', this.handlers.handleNextWeek.bind(this));
        this.dom.viewToggleBtn.addEventListener('click', this.handlers.handleViewToggle.bind(this));

        // Workout plan interactions
        this.dom.workoutContainer.addEventListener('click', (e) => {
            this.handlers.handleProgressToggle(e);
            this.handlers.handleCardActions(e);
        });
        this.dom.workoutContainer.addEventListener('change', this.handlers.handleWorkoutDataChange.bind(this));

        // History view interactions
        this.dom.historyContainer.addEventListener('click', (e) => {
            this.handlers.handleHistoryClick(e);
            this.handlers.handleCardActions(e);
        });
        this.dom.historyContainer.addEventListener('change', this.handlers.handleWorkoutDataChange.bind(this));
        this.dom.historyContainer.addEventListener('input', this.handlers.handleHistoryTMChange.bind(this));

        // Modal interactions
        this.dom.modalConfirmBtn.addEventListener('click', this.handlers.handleModalConfirm.bind(this));
        this.dom.modalCancelBtn.addEventListener('click', this.render.hideModal.bind(this));
    }
};

// ==========================================================================
// 3. UTILITY FUNCTIONS
// ==========================================================================
app.utils = {
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    getExerciseIcon(exercise) {
        const icons = { 'Bench Press': '🏋️', 'Squat': '🦵' };
        return icons[exercise] ? `<span class="exercise-icon">${icons[exercise]}</span>` : '';
    },

    getUniqueOptions(program, key) {
        const allValues = program.flatMap(week => week.days.map(day => day[key]));
        return [...new Set(allValues)];
    },

    calculateWeight(tm, intensity) {
        if (tm <= 0) return 0;
        const weight = tm * intensity;
        return Math.round(weight / 2.5) * 2.5;
    },

    isDayCompleted(weekData, day, dayIndex, progressData, isHistory, historyIndex) {
        const setsCount = (day.groups && day.groups.length > 0) ? day.groups.length : day.sets;
        if (setsCount === 0) return false;

        for (let i = 0; i < setsCount; i++) {
            const progressId = isHistory
                ? `h${historyIndex}w${weekData.week}d${dayIndex}s${i}`
                : `w${weekData.week}d${dayIndex}s${i}`;
            if (!progressData[progressId]) return false;
        }
        return true;
    }
};

// ==========================================================================
// 4. LOCALSTORAGE MANAGEMENT
// ==========================================================================
app.storage = {
    save() {
        localStorage.setItem('workoutLogData', JSON.stringify(app.state));
    },

    load() {
        const savedData = localStorage.getItem('workoutLogData');
        const defaultState = {
            benchPressTM: 0, squatTM: 0, progressData: {}, editMode: false, history: [],
            program: app.utils.deepClone(config.programData),
            viewMode: 'all', currentWeek: 1, displayStyle: 'traditional'
        };
        
        let loadedState = defaultState;
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // Merge to ensure new properties from defaultState are included
                loadedState = { ...defaultState, ...parsedData };
                loadedState.history = parsedData.history || [];
            } catch (e) {
                console.error("Failed to parse saved data from localStorage.", e);
            }
        }
        app.state = loadedState;
        app.state.editMode = false; // Always start in view mode
    }
};

// ==========================================================================
// 5. RENDERING & UI
// ==========================================================================
app.render = {
    // Main update function
    updateDisplay() {
        this.updateTMInputs();
        this.updateHeaderButtons();
        this.updateViewControls();
        this.updateWorkoutPlan();
        this.renderHistory();
    },

    // Component updaters
    updateTMInputs() {
        app.dom.benchTmInput.value = app.state.benchPressTM > 0 ? app.state.benchPressTM : '';
        app.dom.squatTmInput.value = app.state.squatTM > 0 ? app.state.squatTM : '';
    },

    updateHeaderButtons() {
        app.dom.editModeToggle.textContent = app.state.editMode ? 'Done' : 'Edit';
        app.dom.editModeToggle.classList.toggle('btn-secondary', !app.state.editMode);
    },

    updateViewControls() {
        if (app.state.viewMode === 'single') {
            document.body.classList.add('single-week-view');
            app.dom.viewToggleBtn.textContent = 'All Weeks View';
            app.dom.prevWeekBtn.style.display = 'inline-block';
            app.dom.nextWeekBtn.style.display = 'inline-block';
            app.dom.prevWeekBtn.disabled = app.state.currentWeek <= 1;
            app.dom.nextWeekBtn.disabled = app.state.currentWeek >= app.state.program.length;
        } else {
            document.body.classList.remove('single-week-view');
            app.dom.viewToggleBtn.textContent = 'Single Week View';
            app.dom.prevWeekBtn.style.display = 'none';
            app.dom.nextWeekBtn.style.display = 'none';
        }
    },

    updateWorkoutPlan() {
        const tmData = { benchPressTM: app.state.benchPressTM, squatTM: app.state.squatTM };
        this.renderPlan(app.dom.workoutContainer, app.state.program, tmData, app.state.progressData, app.state.editMode, false);
    },
    
    renderHistory() {
        const { historyContainer } = app.dom;
        historyContainer.innerHTML = '';
        const h2 = app.dom.historyView.querySelector('h2');

        if (!app.state.history || app.state.history.length === 0) {
            h2.textContent = 'No Archived Cycles Found';
            return;
        }
        h2.textContent = 'Archived Cycles';

        app.state.history.forEach((archive, index) => {
            const archiveWrapper = document.createElement('div');
            archiveWrapper.className = 'archive-cycle';
            archiveWrapper.innerHTML = this.createHistoryHeaderHTML(archive, index);
            
            const contentWrapper = document.createElement('div');
            const isCollapsed = archive.isCollapsed !== false;
            contentWrapper.className = `archive-content ${isCollapsed ? 'collapsed' : ''}`;
            
            const planContainer = document.createElement('div');
            planContainer.className = 'archived-plan';
            contentWrapper.appendChild(planContainer);
            
            this.renderPlan(planContainer, archive.program, { benchPressTM: archive.benchPressTM, squatTM: archive.squatTM }, archive.progressData, archive.editMode, true, index);
            
            archiveWrapper.appendChild(contentWrapper);
            historyContainer.appendChild(archiveWrapper);
        });
    },

    // The main plan renderer (for both main view and history)
    renderPlan(container, programData, tmData, progressData, isEditable, isHistory, historyIndex = -1) {
        container.innerHTML = '';
        const weeksToRender = app.state.viewMode === 'single' && !isHistory
            ? programData.filter(week => week.week === app.state.currentWeek)
            : programData;

        weeksToRender.forEach(weekData => {
            const weekContainer = document.createElement('div');
            weekContainer.className = 'week-container';
            weekContainer.innerHTML = `<h2 class="week-header">Week ${weekData.week}: ${weekData.phase}</h2>`;

            weekData.days.sort((a, b) => config.dayOrder.indexOf(a.day) - config.dayOrder.indexOf(b.day));
            
            weekData.days.forEach((day, dayIndex) => {
                const dayCard = this.createDayCard(weekData, day, dayIndex, tmData, progressData, isEditable, isHistory, historyIndex);
                weekContainer.appendChild(dayCard);
            });

            if (isEditable) {
                const addDayBtn = document.createElement('button');
                addDayBtn.className = 'btn btn-add-day';
                addDayBtn.textContent = '+ Add Day';
                addDayBtn.dataset.prop = 'add-day';
                addDayBtn.dataset.weekIdx = weekData.week - 1;
                if (isHistory) addDayBtn.dataset.historyIdx = historyIndex;
                weekContainer.appendChild(addDayBtn);
            }
            container.appendChild(weekContainer);
        });
    },
    
    // Card creation logic
    createDayCard(weekData, day, dayIndex, tmData, progressData, isEditable, isHistory, historyIndex) {
        // Ensure groups array exists for consistency
        if (!day.groups || day.groups.length === 0) {
            day.groups = Array.from({ length: day.sets || 0 }, () => ({
                reps: day.reps, intensity: day.intensity
            }));
        }

        const dayCard = document.createElement('div');
        dayCard.className = 'card';
        if (isEditable) {
            dayCard.classList.add('editable');
            if (day.displayStyle === 'group') dayCard.classList.add('group-display');
            dayCard.innerHTML = this.createEditableCardContent(weekData, day, dayIndex, tmData, isHistory, historyIndex);
        } else {
            if (app.utils.isDayCompleted(weekData, day, dayIndex, progressData, isHistory, historyIndex)) {
                dayCard.classList.add('day-completed');
            }
            dayCard.innerHTML = this.createDisplayCardContent(weekData, day, dayIndex, tmData, progressData, isHistory, historyIndex);
        }
        return dayCard;
    },

    // HTML generators for card content
    createEditableCardContent(weekData, day, dayIndex, tmData, isHistory, historyIndex) {
        const weekIdx = weekData.week - 1;
        const tm = day.exercise === 'Bench Press' ? tmData.benchPressTM : tmData.squatTM;
        const baseAttrs = { 'week-idx': weekIdx, 'day-idx': dayIndex };
        if (isHistory) baseAttrs['history-idx'] = historyIndex;
        
        const createDataAttrs = (prop, groupIdx) => {
            const attrs = { ...baseAttrs, prop };
            if (groupIdx !== undefined) attrs['group-idx'] = groupIdx;
            return Object.entries(attrs).map(([k, v]) => `data-${k}="${v}"`).join(' ');
        };

        const createSelect = (options, selected, prop) => `<select ${createDataAttrs(prop)}>${options.map(o => `<option value="${o}" ${o === selected ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
        const createInput = (type, val, prop, groupIdx) => `<input type="${type}" value="${val}" ${createDataAttrs(prop, groupIdx)} ${prop==='intensity'?'step="0.01"':''}>`;
        
        const daySelect = createSelect(config.dayOrder, day.day, 'day');
        const exerciseSelect = createSelect(app.utils.getUniqueOptions(app.state.program, 'exercise'), day.exercise, 'exercise');

        let editorContent;
        if (day.displayStyle === 'group') {
            const groupsHTML = day.groups.map((group, groupIdx) => `
                <div class="group-edit-row">
                    <div class="group-edit-inputs">
                        <div class="form-item"><label>Reps</label>${createInput('number', group.reps, 'reps', groupIdx)}</div>
                        <div class="form-item"><label>Intensity</label>${createInput('number', group.intensity, 'intensity', groupIdx)}</div>
                        <div class="form-item"><label>Weight (kg)</label>${createInput('number', app.utils.calculateWeight(tm, group.intensity), 'weight', groupIdx)}</div>
                    </div>
                    <div class="group-edit-actions"><button class="btn-delete-group" ${createDataAttrs('delete-group', groupIdx)}>&times;</button></div>
                </div>
            `).join('');
            editorContent = `<div class="group-editor-container">${groupsHTML}<button class="btn btn-add-group" ${createDataAttrs('add-group')}>+ Add Group</button></div>`;
        } else {
            editorContent = `
                <div class="form-row form-row-numeric">
                    <div class="form-item"><label>Sets</label>${createInput('number', day.sets, 'sets')}</div>
                    <div class="form-item"><label>Reps</label>${createInput('number', day.reps, 'reps')}</div>
                    <div class="form-item"><label>Intensity</label>${createInput('number', day.intensity, 'intensity')}</div>
                    <div class="form-item"><label>Weight (kg)</label>${createInput('number', app.utils.calculateWeight(tm, day.intensity), 'weight')}</div>
                </div>`;
        }
        
        return `
            <div class="form-row form-row-select">
                <div class="form-item"><label>Day</label>${daySelect}</div>
                <div class="form-item"><label>Exercise</label>${exerciseSelect}</div>
            </div>
            ${editorContent}
            <div class="card-actions">
                <button class="btn-toggle-style" title="Toggle view style" ${createDataAttrs('toggle-style')}>⇄</button>
                <button class="btn-delete-day" ${createDataAttrs('delete-day')}>&times;</button>
            </div>`;
    },

    createDisplayCardContent(weekData, day, dayIndex, tmData, progressData, isHistory, historyIndex) {
        const tm = day.exercise === 'Bench Press' ? tmData.benchPressTM : tmData.squatTM;
        const icon = app.utils.getExerciseIcon(day.exercise);
        let content = `<h3>${day.day}</h3>`;
        
        if (day.displayStyle === 'group') {
            const groupsHTML = day.groups.map((group, i) => {
                const progressId = isHistory ? `h${historyIndex}w${weekData.week}d${dayIndex}s${i}` : `w${weekData.week}d${dayIndex}s${i}`;
                const isCompleted = progressData[progressId] ? 'completed' : '';
                return `
                    <div class="group-row">
                        <div class="group-details">${i + 1}: <strong>${app.utils.calculateWeight(tm, group.intensity)}kg</strong> (${(group.intensity * 100).toFixed(1)}%) for ${group.reps} reps</div>
                        <div class="group-completion"><div class="progress-box ${isCompleted}" data-progress-id="${progressId}"></div></div>
                    </div>`;
            }).join('');
            content += `<div class="exercise-info"><p>${icon} ${day.exercise}</p></div><div class="group-progress-container">${groupsHTML}</div>`;
        } else {
            const weight = app.utils.calculateWeight(tm, day.intensity);
            const progressBoxes = Array.from({ length: day.sets }, (_, i) => {
                const progressId = isHistory ? `h${historyIndex}w${weekData.week}d${dayIndex}s${i}` : `w${weekData.week}d${dayIndex}s${i}`;
                const isCompleted = progressData[progressId] ? 'completed' : '';
                return `<div class="progress-box ${isCompleted}" data-progress-id="${progressId}"></div>`;
            }).join('');
            content += `
                <div class="exercise-info">
                    <p>${icon} ${day.exercise}</p>
                    <p class="weight-details"><strong>${weight}kg</strong> (${day.intensity * 100}%)</p>
                    <p>${day.sets} sets of ${day.reps} reps</p>
                </div>
                <div class="progress-container">${progressBoxes}</div>`;
        }
        return content;
    },
    
    createHistoryHeaderHTML(archive, index) {
        const archiveDate = new Date(archive.archivedAt).toLocaleString();
        const isEditing = archive.editMode || false;
        return `
            <h3 class="archive-header" data-history-index="${index}">
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
                <button class="btn btn-edit-archive" data-history-index="${index}">${isEditing ? 'Save' : 'Edit'}</button>
                <button class="btn btn-delete-history" data-history-index="${index}">Delete</button>
            </h3>`;
    },

    // Modal display
    showModal({ title, text, bodyHtml = '', confirmText = 'Confirm', cancelText = 'Cancel', onConfirm }) {
        this.modalConfirmCallback = onConfirm;
        app.dom.modalTitle.textContent = title;
        app.dom.modalText.style.display = bodyHtml ? 'none' : 'block';
        app.dom.modalBody.style.display = bodyHtml ? 'block' : 'none';
        app.dom.modalText.textContent = text;
        app.dom.modalBody.innerHTML = bodyHtml;

        app.dom.modalConfirmBtn.textContent = confirmText;
        app.dom.modalCancelBtn.textContent = cancelText;
        app.dom.modalConfirmBtn.style.display = confirmText ? 'inline-block' : 'none';
        app.dom.modalCancelBtn.style.display = cancelText ? 'inline-block' : 'none';

        app.dom.modal.classList.add('visible');
    },

    hideModal() {
        app.dom.modal.classList.remove('visible');
        this.modalConfirmCallback = null;
    }
};

// ==========================================================================
// 6. EVENT HANDLERS
// ==========================================================================
app.handlers = {
    // TM inputs
    handleTMChange(event) {
        const { id, value } = event.target;
        const tmValue = parseFloat(value) || 0;
        app.state[id === 'bench-tm' ? 'benchPressTM' : 'squatTM'] = tmValue;
        app.storage.save();
        app.render.updateWorkoutPlan();
    },

    // Progress boxes
    handleProgressToggle(event) {
        const target = event.target;
        if (target.classList.contains('progress-box')) {
            const progressId = target.dataset.progressId;
            if (!progressId || progressId.startsWith('h')) return;

            app.state.progressData[progressId] = !app.state.progressData[progressId];
            target.classList.toggle('completed');
            
            const dayCard = target.closest('.card');
            const allBoxes = dayCard.querySelectorAll('.progress-box');
            const allCompleted = [...allBoxes].every(box => box.classList.contains('completed'));
            dayCard.classList.toggle('day-completed', allCompleted);
            
            app.storage.save();
        }
    },

    // Edit mode
    handleEditModeToggle() {
        app.state.editMode = !app.state.editMode;
        app.render.updateDisplay();
    },

    // Data changes in edit mode
    handleWorkoutDataChange(event) {
        const { historyIdx, weekIdx, dayIdx, groupIdx, prop } = event.target.dataset;
        if (prop === undefined) return;
        
        const isHistory = historyIdx !== undefined;
        const program = isHistory ? app.state.history[historyIdx].program : app.state.program;
        const dayData = program[weekIdx].days[dayIdx];
        const tm = dayData.exercise === 'Bench Press' 
            ? (isHistory ? app.state.history[historyIdx].benchPressTM : app.state.benchPressTM)
            : (isHistory ? app.state.history[historyIdx].squatTM : app.state.squatTM);

        let value = event.target.type === 'number' ? parseFloat(event.target.value) || 0 : event.target.value;
        const targetData = groupIdx !== undefined ? dayData.groups[groupIdx] : dayData;

        if (prop === 'weight') {
            targetData.intensity = tm > 0 ? parseFloat((value / tm).toFixed(3)) : 0;
        } else {
            targetData[prop] = value;
        }

        if (['sets', 'reps', 'intensity'].includes(prop) && groupIdx === undefined) {
            dayData.groups = Array.from({ length: dayData.sets }, () => ({
                reps: dayData.reps, intensity: dayData.intensity
            }));
        }

        app.storage.save();
        isHistory ? app.render.renderHistory() : app.render.updateWorkoutPlan();
    },
    
    // Edit/delete buttons on cards, add group/day
    handleCardActions(event) {
        const button = event.target.closest('button');
        if (!button) return;
        const { historyIdx, weekIdx, dayIdx, groupIdx, prop: action } = button.dataset;

        if (!action) return;

        const isHistory = historyIdx !== undefined;
        const program = isHistory ? app.state.history[historyIdx].program : app.state.program;

        // Action that doesn't need dayData
        if (action === 'add-day') {
            program[weekIdx].days.push({ day: 'Sunday', exercise: 'Bench Press', sets: 3, reps: 5, intensity: 0.7 });
            app.storage.save();
            isHistory ? app.render.renderHistory() : app.render.updateWorkoutPlan();
            return;
        }

        // Actions that need dayData
        const dayData = program[weekIdx].days[dayIdx];
        if (!dayData) return;

        switch (action) {
            case 'toggle-style':
                dayData.displayStyle = dayData.displayStyle === 'group' ? 'traditional' : 'group';
                break;
            case 'add-group':
                const lastGroup = dayData.groups[dayData.groups.length - 1] || { reps: 5, intensity: 0.75 };
                dayData.groups.push({ ...lastGroup });
                dayData.sets = dayData.groups.length;
                break;
            case 'delete-group':
                dayData.groups.splice(groupIdx, 1);
                dayData.sets = dayData.groups.length;
                break;
            case 'delete-day':
                app.render.showModal({
                    title: 'Delete Training Day?',
                    text: 'Are you sure you want to permanently delete this day?',
                    confirmText: 'Delete',
                    onConfirm: () => {
                        program[weekIdx].days.splice(dayIdx, 1);
                        app.storage.save();
                        isHistory ? app.render.renderHistory() : app.render.updateWorkoutPlan();
                    }
                });
                return; // Modal handles rerender
        }
        
        app.storage.save();
        isHistory ? app.render.renderHistory() : app.render.updateWorkoutPlan();
    },

    // Cycle management
    archiveAndStartNewCycle() {
        app.render.showModal({
            title: 'Archive Cycle?',
            text: 'Are you sure? Your current progress will be saved to history.',
            onConfirm: () => {
                const archive = {
                    archivedAt: new Date().toISOString(),
                    program: app.utils.deepClone(app.state.program),
                    progressData: app.utils.deepClone(app.state.progressData),
                    benchPressTM: app.state.benchPressTM,
                    squatTM: app.state.squatTM,
                    editMode: false,
                    isCollapsed: true
                };
                app.state.history.unshift(archive);
                app.state.program = app.utils.deepClone(config.programData);
                app.state.progressData = {};
                app.storage.save();
                app.render.updateDisplay();
                app.render.showModal({ title: 'Success!', text: 'Cycle archived. A new cycle is ready.', confirmText: 'OK', cancelText: null });
            }
        });
    },

    toggleHistoryView() {
        const isHistoryVisible = app.dom.historyView.style.display !== 'none';
        app.dom.historyView.style.display = isHistoryVisible ? 'none' : 'block';
        app.dom.workoutContainer.style.display = isHistoryVisible ? '' : 'none';
        app.dom.tmInputs.style.display = isHistoryVisible ? 'flex' : 'none';
        app.dom.mainHeader.style.display = isHistoryVisible ? 'block' : 'none';
        app.dom.editModeToggle.style.display = isHistoryVisible ? 'inline-block' : 'none';
        app.dom.archiveBtn.style.display = isHistoryVisible ? 'inline-block' : 'none';
        app.dom.exportBtn.style.display = isHistoryVisible ? 'inline-block' : 'none';
        app.dom.importBtn.style.display = isHistoryVisible ? 'inline-block' : 'none';
        app.dom.viewControls.style.display = isHistoryVisible ? 'flex' : 'none';
        app.dom.viewHistoryBtn.textContent = isHistoryVisible ? 'History' : 'Back to Cycle';
        
        if (!isHistoryVisible) { // Entering history view
            app.state.history.forEach(archive => {
                archive.editMode = false;
                archive.isCollapsed = true;
            });
            app.storage.save();
            app.render.renderHistory();
        }
    },
    
    // History View specific actions
    handleHistoryClick(event) {
        const header = event.target.closest('.archive-header');
        const historyIndex = header?.dataset.historyIndex;
        if (historyIndex === undefined) return;
        
        const archive = app.state.history[historyIndex];

        if (event.target.closest('.btn-delete-history')) {
            app.render.showModal({
                title: 'Delete History?',
                text: 'Are you sure you want to permanently delete this archived cycle?',
                confirmText: 'Delete',
                onConfirm: () => {
                    app.state.history.splice(historyIndex, 1);
                    app.storage.save();
                    app.render.renderHistory();
                }
            });
        } else if (event.target.closest('.btn-edit-archive')) {
            archive.editMode = !archive.editMode;
            app.storage.save();
            app.render.renderHistory();
        } else if (!event.target.closest('button, input')) { // Toggle collapse
            archive.isCollapsed = !archive.isCollapsed;
            app.storage.save();
            app.render.renderHistory();
        }
    },
    
    handleHistoryTMChange(event) {
        const input = event.target;
        if (input.matches('[data-tm-type]')) {
            const { historyIndex, tmType } = input.dataset;
            app.state.history[historyIndex][tmType === 'bench' ? 'benchPressTM' : 'squatTM'] = parseFloat(input.value) || 0;
            // No save, saved on "Save" button click
        }
    },

    // View mode toggles
    handleViewToggle() {
        app.state.viewMode = app.state.viewMode === 'all' ? 'single' : 'all';
        app.render.updateDisplay();
    },
    handlePrevWeek() {
        if (app.state.currentWeek > 1) {
            app.state.currentWeek--;
            app.render.updateDisplay();
        }
    },
    handleNextWeek() {
        if (app.state.currentWeek < app.state.program.length) {
            app.state.currentWeek++;
            app.render.updateDisplay();
        }
    },

    // Import / Export
    exportPlan() {
        const dataToExport = {
            benchPressTM: app.state.benchPressTM,
            squatTM: app.state.squatTM,
            progressData: app.state.progressData,
            program: app.state.program,
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
    },
    importPlan() {
        app.dom.importFileInput.click();
    },
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (typeof importedData.benchPressTM !== 'number' || typeof importedData.squatTM !== 'number' || typeof importedData.progressData !== 'object' || !Array.isArray(importedData.program)) {
                    throw new Error('Invalid file format.');
                }
                app.state.benchPressTM = importedData.benchPressTM;
                app.state.squatTM = importedData.squatTM;
                app.state.progressData = importedData.progressData;
                app.state.program = importedData.program;
                app.storage.save();
                app.render.updateDisplay();
                app.render.showModal({ title: 'Success!', text: 'Plan imported successfully.', confirmText: 'OK', cancelText: null });
            } catch (error) {
                app.render.showModal({ title: 'Import Error', text: `Failed to import plan: ${error.message}`, confirmText: 'OK', cancelText: null });
            } finally {
                app.dom.importFileInput.value = '';
            }
        };
        reader.readAsText(file);
    },

    // Modal confirmation
    handleModalConfirm() {
        if (app.render.modalConfirmCallback) {
            app.render.modalConfirmCallback();
        }
        app.render.hideModal();
    }
};

// ==========================================================================
// 7. APP INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
