// ----- VARIABLES -----

const monthSelect = document.querySelector("#monthSelect");
const yearInput = document.querySelector("#yearInput");
const goButton = document.querySelector("#goButton");
const invalidInputMessage = document.querySelector("#invalidInput");
const calendar = document.querySelector("#calendar");
const addEventButton = document.querySelector("#addEventButton");
const eventInfoBox = document.querySelector("#eventInfo");
const eventInfoHeading = document.querySelector("#eventInfoHeading");
const eventInfoEventInput = document.querySelector("#eventInfoEventInput");
const eventInfoMonthSelect = document.querySelector("#eventInfoMonthSelect");
const eventInfoDateInput = document.querySelector("#eventInfoDateInput");
const eventInfoYearInput = document.querySelector("#eventInfoYearInput");
const eventInfoTimeCheckbox = document.querySelector("#eventInfoTimeCheckbox");
const eventInfoHourInput = document.querySelector("#eventInfoHourInput");
const eventInfoTimeColon = document.querySelector("#eventInfoTimeColon");
const eventInfoMinuteInput = document.querySelector("#eventInfoMinuteInput");
const eventInfoTimePeriodSelect = document.querySelector("#eventInfoTimePeriodSelect");
const eventInfoReminderCheckbox = document.querySelector("#eventInfoReminderCheckbox");
const eventInfoReminderInput = document.querySelector("#eventInfoReminderInput");
const eventInfoReminderUnit = document.querySelector("#eventInfoReminderUnit");
const eventInfoBeforeText = document.querySelector("#eventInfoBeforeText");
const createEventButton = document.querySelector("#createEventButton");
const cancelEventButton = document.querySelector("#cancelEventButton");
const saveEventButton = document.querySelector("#saveEventButton");
const cancelEventEditsButton = document.querySelector("#cancelEventEditsButton");
const deleteEventButton = document.querySelector("#deleteEventButton");
const usHolidaysCheckbox = document.querySelector("#usHolidaysCheckbox");

const calendarBoxes = document.querySelectorAll(".calendarBox");

const today = new Date();

const MIN_YEAR = 1753;
const MAX_YEAR = today.getFullYear() + 100;
const STARTING_YEAR = 2020;

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 12 values for January to December
const startingDays = [3, 6, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2]; // The day of the week each month starts on in STARTING_YEAR; 0 is Sunday

let events = []; // Used to store information about events the user adds

let isCalculating = false;
let monthInputted;
let yearInputted;
let startingDay;
let eventViewingIndex;

// ----- FUNCTIONS -----

function displayInputError(message) {
    invalidInputMessage.textContent = message;
    invalidInputMessage.removeAttribute("hidden");

    monthSelect.style.top = "10px";
    yearInput.style.top = "10px";
    goButton.style.top = "10px";

    isCalculating = false;
}

function validateInput(month, year) {
    if (!Number(year) || (year && year.indexOf(".") != -1)) {
        displayInputError("Please enter a valid year");
        return;
    }

    year = Number(year);

    if (year < MIN_YEAR || year > MAX_YEAR) {
        displayInputError("Please enter a year between " + MIN_YEAR + " and " + MAX_YEAR);
        return;
    }

    monthInputted = month;
    yearInputted = year;

    invalidInputMessage.setAttribute("hidden", "");
    monthSelect.style.top = "20px";
    yearInput.style.top = "20px";
    goButton.style.top = "20px";

    return true;
}

function isLeapYear(year) {
    if (year % 4 == 0 && year % 400 != 100 && year % 400 != 200 && year % 400 != 300) {
        return true;
    }
}

function calculateStartingDay(month, year) {
    let sd = startingDays[month];

    function increaseStartingDay() {
        sd++;
    
        if (sd > 6) {
            sd -= 7;
        }
    }
    
    function decreaseStartingDay() {
        sd--;
    
        if (sd < 0) {
            sd += 7;
        }
    }

    if (year > STARTING_YEAR) {
        for (let i = STARTING_YEAR + 1; i <= year; i++) {
            increaseStartingDay();

            if (((monthInputted == 0 || monthInputted == 1) && isLeapYear(i - 1)) || (monthInputted >= 2 && monthInputted <= 11 && isLeapYear(i))) {
                increaseStartingDay();
            }
        }
    }
    else if (year < STARTING_YEAR) {
        for (let i = STARTING_YEAR - 1; i >= year; i--) {
            decreaseStartingDay();

            if (((monthInputted == 0 || monthInputted == 1) && isLeapYear(i)) || (monthInputted >= 2 && monthInputted <= 11 && isLeapYear(i + 1))) {
                decreaseStartingDay();
            }
        }
    }

    return sd;
}

function getDaysInMonthInputted() {
    if (monthInputted == 1 && isLeapYear(yearInputted)) {
        return 29;
    }
    else {
        return daysInMonth[monthInputted];
    }
}

function removeEvents() {
    $(".event").remove();
    $(".holiday").remove();
}

function addEventToCalendar(classToAdd, indexNumber, textContent, date) {
    const eventElement = document.createElement("div");

    eventElement.classList.add(classToAdd);
    eventElement.textContent = textContent;

    if (indexNumber != null) {
        eventElement.dataset.indexNumber = indexNumber;
    }

    const targetBoxIndex = date + startingDay - 1;
    const targetBoxDiv = calendarBoxes[targetBoxIndex];

    targetBoxDiv.insertAdjacentElement("beforeend", eventElement);
    targetBoxDiv.style.height = "";

    const targetBoxHeight = targetBoxDiv.getBoundingClientRect().height;
    let referenceBoxIndex = targetBoxIndex + 1;

    if (referenceBoxIndex % 7 == 0) {
        referenceBoxIndex -= 7;
    }

    const referenceBox = calendarBoxes[referenceBoxIndex]
    const referenceBoxHeight = referenceBox.getBoundingClientRect().height;

    if (targetBoxHeight <= referenceBoxHeight) {
        targetBoxDiv.style.height = referenceBox.style.height;
        return;
    }

    const calendarRowHeight = calendar.getBoundingClientRect().height / 6;
    const heightRatio = Math.max(calendarRowHeight, targetBoxHeight) / calendarRowHeight;

    $(targetBoxDiv).parent().find(".calendarBox").css("height", "calc((((100vh - 75px) / 6) * " + heightRatio + ") + 1vh)");
}

function displayEvents() {
    $(".calendarBox").css("height", "");

    if (usHolidaysCheckbox.checked) {
        const holidayKeys = Object.keys(usHolidays);

        for (let i = 0; i < holidayKeys.length; i++) {
            const holidayDate = usHolidays[holidayKeys[i]](yearInputted);

            if (holidayDate != null && holidayDate[0] == monthInputted) {
                addEventToCalendar("holiday", null, holidayKeys[i], holidayDate[1]);
            }
        }
    }

    events.forEach(function(event, index) {
        if (event.month == monthInputted && event.year == yearInputted) {
            let textContent = null;

            if (event.hour == null || event.minute == null || event.timePeriod == null) {
                textContent = event.name;
            }
            else {
                const eventMinuteString = String(event.minute).padStart(2, "0");
                textContent = event.hour + ":" + eventMinuteString + " " + (event.timePeriod).toUpperCase() + " - " + event.name;
            }

            addEventToCalendar("event", index, textContent, event.date);
        }
    })

    $(document).on("click", ".event", function() {
        eventViewingIndex = this.dataset.indexNumber;

        const eventViewingArray = events[eventViewingIndex];

        eventInfoEventInput.value = eventViewingArray.name;
        eventInfoMonthSelect.value = eventViewingArray.month;
        eventInfoDateInput.value = eventViewingArray.date;
        eventInfoYearInput.value = eventViewingArray.year;

        if (eventViewingArray.hour == null || eventViewingArray.minute == null || eventViewingArray.timePeriod == null) {
            eventInfoTimeCheckbox.checked = false;
            displayTimeInputs();

            eventInfoHourInput.value = 12;
            eventInfoMinuteInput.value = "00";
            eventInfoTimePeriodSelect.value = "am";
        }
        else {
            eventInfoTimeCheckbox.checked = true;
            displayTimeInputs();

            eventInfoHourInput.value = eventViewingArray.hour;
            eventInfoMinuteInput.value = String(eventViewingArray.minute).padStart(2, "0");
            eventInfoTimePeriodSelect.value = eventViewingArray.timePeriod;
        }

        if (eventViewingArray.reminderInput == null || eventViewingArray.reminderUnit == null) {
            eventInfoReminderCheckbox.checked = false;
            displayReminderInputs();

            eventInfoReminderInput.value = 1;
            eventViewingArray.reminderUnit = "hours";
        }
        else {
            eventInfoReminderCheckbox.checked = true;
            displayReminderInputs();

            eventInfoReminderInput.value = eventViewingArray.reminderInput;
            eventInfoReminderUnit.value = eventViewingArray.reminderUnit;
        }

        eventInfoBox.removeAttribute("hidden");
        eventInfoHeading.textContent = "Edit Event";

        createEventButton.setAttribute("hidden", "");
        cancelEventButton.setAttribute("hidden", "");

        saveEventButton.removeAttribute("hidden");
        cancelEventEditsButton.removeAttribute("hidden");
        deleteEventButton.removeAttribute("hidden");
    })
}

function updateCalendarBoxes() {
    $(".calendarBox").each(function() {
        if ($(this).hasClass("firstRowBox")) {
            $(this).find("div").text("");
        } else {
            $(this).text("");
        }
    });

    const daysInMonthInputted = getDaysInMonthInputted();

    for (let i = startingDay; i < startingDay + daysInMonthInputted; i++) {
        const date = String(i - startingDay + 1);

        if (calendarBoxes[i].classList.contains("firstRowBox")) {
            calendarBoxes[i].querySelector("div").textContent = date;
        }
        else {
            calendarBoxes[i].textContent = date;
        }
    }

    removeEvents();
    displayEvents();
}

function displayCalendar(month, year) {
    if (isCalculating) {
        return;
    }

    isCalculating = true;

    let isInputValid = validateInput(month, year);

    if (!isInputValid) {
        return;
    }

    startingDay = calculateStartingDay(month, year);

    updateCalendarBoxes();

    isCalculating = false;
}

function displayCurrentCalendar() {
    const month = today.getMonth();
    const year = today.getFullYear();

    monthSelect.value = String(month);
    yearInput.value = String(year);

    displayCalendar(month, String(year));
}

function makeEventInputBoxRed(inputBox) {
    inputBox.style.backgroundColor = "rgb(255, 90, 90)";
}

function makeEventInputBoxWhite(inputBox) {
    inputBox.style.backgroundColor = "white";
}

function validateEventInput() {
    const eventName = String(eventInfoEventInput.value);
    const month = Number(eventInfoMonthSelect.value);
    const date = Number(eventInfoDateInput.value);
    const year = Number(eventInfoYearInput.value);
    const hourOfDay = Number(eventInfoHourInput.value);
    const minuteOfHour = Number(eventInfoMinuteInput.value);
    const reminderInput = Number(eventInfoReminderInput.value);

    let invalidInput = false;

    if (!eventName || eventName == "") {
        makeEventInputBoxRed(eventInfoEventInput);
        invalidInput = true;
    }
    else {
        makeEventInputBoxWhite(eventInfoEventInput);
    }

    if (!date || (date && date > daysInMonth[month])) {
        makeEventInputBoxRed(eventInfoDateInput);
        invalidInput = true;
    }
    else {
        makeEventInputBoxWhite(eventInfoDateInput);
    }

    if (!year || (year && (year < MIN_YEAR || year > MAX_YEAR))) {
        makeEventInputBoxRed(eventInfoYearInput);
        invalidInput = true;
    }
    else {
        makeEventInputBoxWhite(eventInfoYearInput);
    }

    if (eventInfoTimeCheckbox.checked) {
        if (!hourOfDay || (hourOfDay && (hourOfDay < 1 || hourOfDay > 12))) {
            makeEventInputBoxRed(eventInfoHourInput);
            invalidInput = true;
        }
        else {
            makeEventInputBoxWhite(eventInfoHourInput);
        }

        if ((!minuteOfHour && minuteOfHour != 0) || (minuteOfHour && (minuteOfHour < 0 || minuteOfHour > 59))) {
            makeEventInputBoxRed(eventInfoMinuteInput);
            invalidInput = true;
        }
        else {
            makeEventInputBoxWhite(eventInfoMinuteInput);
        }
    }

    if (eventInfoReminderCheckbox.checked && (!reminderInput || (reminderInput && reminderInput < 0))) {
        makeEventInputBoxRed(eventInfoReminderInput);
        invalidInput = true;
    }
    else {
        makeEventInputBoxWhite(eventInfoReminderInput);
    }

    return !invalidInput;
}

function addEvent() {
    const eventName = String(eventInfoEventInput.value);
    const month = Number(eventInfoMonthSelect.value);
    const date = Number(eventInfoDateInput.value);
    const year = Number(eventInfoYearInput.value);

    let hourOfDay = null;
    let minuteOfHour = null;
    let timePeriod = null;

    if (eventInfoTimeCheckbox.checked) {
        hourOfDay = Number(eventInfoHourInput.value);
        minuteOfHour = Number(eventInfoMinuteInput.value);
        timePeriod = eventInfoTimePeriodSelect.value;
    }

    let reminderInput = null;
    let reminderUnit = null;

    if (eventInfoReminderCheckbox.checked) {
        reminderInput = Number(eventInfoReminderInput.value);
        reminderUnit = eventInfoReminderUnit.value;
    }

    events.push({
        name: eventName,
        month: month,
        date: date,
        year: year,
        hour: hourOfDay,
        minute: minuteOfHour,
        timePeriod: timePeriod,
        reminderInput: reminderInput,
        reminderUnit: reminderUnit
    });
}

function closeEventInfoBox() {
    eventInfoBox.setAttribute("hidden", "");
    eventViewingIndex = null;
}

function saveEventEdits() {
    const isInputValid = validateEventInput();

    if (!isInputValid) {
        return;
    }

    const eventViewingArray = events[eventViewingIndex];

    eventViewingArray.name = String(eventInfoEventInput.value);
    eventViewingArray.month = Number(eventInfoMonthSelect.value);
    eventViewingArray.date = Number(eventInfoDateInput.value);
    eventViewingArray.year = Number(eventInfoYearInput.value);

    if (eventInfoTimeCheckbox.checked) {
        eventViewingArray.hour = Number(eventInfoHourInput.value);
        eventViewingArray.minute = Number(eventInfoMinuteInput.value);
        eventViewingArray.timePeriod = eventInfoTimePeriodSelect.value;
    }
    else {
        eventViewingArray.hour = null;
        eventViewingArray.minute = null;
        eventViewingArray.timePeriod = null;
    }

    if (eventInfoReminderCheckbox.checked) {
        eventViewingArray.reminderInput = Number(eventInfoReminderInput.value);
        eventViewingArray.reminderUnit = eventInfoReminderUnit.value;
    }
    else {
        eventViewingArray.reminderInput = null;
        eventViewingArray.reminderUnit = null;
    }

    updateCalendarBoxes();
    closeEventInfoBox();
}

function deleteEvent() {
    if (eventViewingIndex != null) {
        events.splice(eventViewingIndex, 1);

        updateCalendarBoxes();
        closeEventInfoBox();
    }
}

function displayReminderInputs() {
    if (eventInfoReminderCheckbox.checked) {
        eventInfoReminderInput.removeAttribute("hidden");
        eventInfoReminderUnit.removeAttribute("hidden");
        eventInfoBeforeText.removeAttribute("hidden");
    }
    else {
        eventInfoReminderInput.setAttribute("hidden", "");
        eventInfoReminderUnit.setAttribute("hidden", "");
        eventInfoBeforeText.setAttribute("hidden", "");
    }
}

function displayTimeInputs() {
    if (eventInfoTimeCheckbox.checked) {
        eventInfoHourInput.removeAttribute("hidden");
        eventInfoTimeColon.removeAttribute("hidden");
        eventInfoMinuteInput.removeAttribute("hidden");
        eventInfoTimePeriodSelect.removeAttribute("hidden");
    }
    else {
        eventInfoHourInput.setAttribute("hidden", "");
        eventInfoTimeColon.setAttribute("hidden", "");
        eventInfoMinuteInput.setAttribute("hidden", "");
        eventInfoTimePeriodSelect.setAttribute("hidden", "");
    }
}

// ----- EVENTS -----

$(goButton).on("click", function() {
    displayCalendar(Number(monthSelect.value), String(yearInput.value));
})

$(addEventButton).on("click", function() {
    eventInfoHeading.textContent = "Create Event";

    saveEventButton.setAttribute("hidden", "");
    cancelEventEditsButton.setAttribute("hidden", "");
    deleteEventButton.setAttribute("hidden", "");

    createEventButton.removeAttribute("hidden");
    cancelEventButton.removeAttribute("hidden");

    const currentTime = new Date();

    eventInfoEventInput.value = "";
    eventInfoMonthSelect.value = currentTime.getMonth();
    eventInfoDateInput.value = currentTime.getDate();
    eventInfoYearInput.value = currentTime.getFullYear();
    eventInfoTimeCheckbox.checked = false;
    eventInfoHourInput.value = "12";
    eventInfoMinuteInput.value = "00";
    eventInfoTimePeriodSelect.value = "am";
    eventInfoReminderCheckbox.checked = false;
    eventInfoReminderInput.value = "1";
    eventInfoReminderUnit.value = "hours";

    eventInfoReminderInput.setAttribute("hidden", "");
    eventInfoReminderUnit.setAttribute("hidden", "");
    eventInfoBeforeText.setAttribute("hidden", "");
    eventInfoHourInput.setAttribute("hidden", "");
    eventInfoTimeColon.setAttribute("hidden", "");
    eventInfoMinuteInput.setAttribute("hidden", "");
    eventInfoTimePeriodSelect.setAttribute("hidden", "");

    eventInfoBox.removeAttribute("hidden");
})

$(cancelEventButton).on("click", function() {
    eventInfoBox.setAttribute("hidden", "");
})

$(createEventButton).on("click", function() {
    const isInputValid = validateEventInput();

    if (isInputValid) {
        addEvent();
        updateCalendarBoxes();
        closeEventInfoBox();
    }
});

$(saveEventButton).on("click", saveEventEdits);
$(cancelEventEditsButton).on("click", closeEventInfoBox);
$(deleteEventButton).on("click", deleteEvent);

$(usHolidaysCheckbox).on("change", updateCalendarBoxes);
$(eventInfoTimeCheckbox).on("change", displayTimeInputs);
$(eventInfoReminderCheckbox).on("change", displayReminderInputs);

window.addEventListener("resize", updateCalendarBoxes);

// ----- CODE -----

displayCurrentCalendar();