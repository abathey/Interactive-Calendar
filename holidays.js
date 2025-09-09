// Easter dates are from 2000 - 2049 (10 per row)
const easterDates = [[3, 23], [3, 15], [2, 31], [3, 20], [3, 11], [2, 27], [3, 16], [3, 8], [2, 23], [3, 12],
    [3, 4], [3, 24], [3, 8], [2, 31], [3, 20], [3, 5], [2, 27], [3, 16], [3, 1], [3, 21],
    [3, 12], [3, 4], [3, 17], [3, 9], [2, 31], [3, 20], [3, 5], [2, 28], [3, 16], [3, 1],
    [3, 21], [3, 13], [2, 28], [3, 17], [3, 9], [2, 25], [3, 13], [3, 5], [3, 25], [3, 10],
    [3, 1], [3, 21], [3, 6], [2, 29], [3, 17], [3, 9], [2, 25], [3, 14], [3, 5], [3, 18]
];

function getFirstDayOfWeekInMonth(dayOfWeek, startingDay) {
    let firstDay;

    if (startingDay < dayOfWeek + 1) {
        firstDay = dayOfWeek - startingDay + 1;
    }
    else {
        firstDay = (dayOfWeek + 7) - startingDay + 1;
    }

    return firstDay;
}

const usHolidays = {
    "New Year's Day":
    function getHolidayDate(year) {
        if (year >= 1777) {
            return [0, 1];
        }
    },

    "Martin Luther King Jr. Day":
    function getHolidayDate(year) {
        if (year < 1986) {
            return;
        }

        let startingDay = calculateStartingDay(0, year);
        let firstMonday = getFirstDayOfWeekInMonth(1, startingDay);

        return [0, firstMonday + 14];
    },

    "Valentine's Day":
    function getHolidayDate(year) {
        if (year >= 1777) {
            return [1, 14];
        }
    },

    "Presidents' Day":
    function getHolidayDate(year) {
        if (year >= 1880 && year <= 1970) {
            return [1, 22];
        }
        else if (year >= 1971) {
            let startingDay = calculateStartingDay(1, year);
            let firstMonday = getFirstDayOfWeekInMonth(1, startingDay);
    
            return [1, firstMonday + 14];
        }
    },

    "Daylight Saving Time starts":
    function getHolidayDate(year) {
        if (year >= 1976 && year <= 1986) {
            let startingDay = calculateStartingDay(3, year);
            let firstSunday = getFirstDayOfWeekInMonth(0, startingDay);

            if (firstSunday > 2) {
                return [3, firstSunday + 21];
            }
            else {
                return [3, firstSunday + 28];
            }
        }

        if (year >= 1987 && year <= 2006) {
            let startingDay = calculateStartingDay(3, year);
            let firstSunday = getFirstDayOfWeekInMonth(0, startingDay);

            return [3, firstSunday];
        }

        if (year >= 2007) {
            let startingDay = calculateStartingDay(2, year);
            let firstSunday = getFirstDayOfWeekInMonth(0, startingDay);

            return [2, firstSunday + 7];
        }
    },

    "Saint Patrick's Day":
    function getHolidayDate(year) {
        if (year >= 1777) {
            return [2, 17];
        }
    },

    "Easter":
    function getHolidayDate(year) {
        if (year >= 2000 && year <= 2049) {
            return easterDates[year - 2000];
        }
    },

    "Mother's Day":
    function getHolidayDate(year) {
        if (year < 1908) {
            return;
        }

        let startingDay = calculateStartingDay(4, year);
        let firstSunday = getFirstDayOfWeekInMonth(0, startingDay);

        return [4, firstSunday + 7];
    },

    "Memorial Day":
    function getHolidayDate(year) {
        if (year >= 1868 && year <= 1970) {
            return [4, 30];
        }

        if (year > 1970) {
            let startingDay = calculateStartingDay(4, year);
            let firstMonday = getFirstDayOfWeekInMonth(1, startingDay);

            if (firstMonday > 3) {
                return [4, firstMonday + 21];
            }
            else {
                return [4, firstMonday + 28];
            }
        }
    },

    "Flag Day":
    function getHolidayDate(year) {
        if (year >= 1950) {
            return [5, 14];
        }
    },

    "Father's Day":
    function getHolidayDate(year) {
        if (year < 1910) {
            return;
        }

        let startingDay = calculateStartingDay(5, year);
        let firstSunday = getFirstDayOfWeekInMonth(0, startingDay);

        return [5, firstSunday + 14];
    },

    "Independence Day":
    function getHolidayDate(year) {
        if (year >= 1777) {
            return [6, 4];
        }
    },

    "Labor Day":
    function getHolidayDate(year) {
        if (year < 1894) {
            return;
        }

        let startingDay = calculateStartingDay(8, year);
        let firstMonday = getFirstDayOfWeekInMonth(1, startingDay);

        return [8, firstMonday];
    },

    "Columbus Day":
    function getHolidayDate(year) {
        if (year >= 1937 && year <= 1970) {
            return [9, 12];
        }

        if (year > 1970) {
            let startingDay = calculateStartingDay(9, year);
            let firstMonday = getFirstDayOfWeekInMonth(1, startingDay);

            return [9, firstMonday + 7];
        }
    },

    "Halloween":
    function getHolidayDate(year) {
        if (year >= 1777) {
            return [9, 31];
        }
    },

    "Daylight Saving Time ends":
    function getHolidayDate(year) {
        if (year >= 1976 && year <= 2006) {
            let startingDay = calculateStartingDay(9, year);
            let firstSunday = getFirstDayOfWeekInMonth(0, startingDay);

            if (firstSunday > 3) {
                return [9, firstSunday + 21];
            }
            else {
                return [9, firstSunday + 28];
            }
        }

        if (year >= 2007) {
            let startingDay = calculateStartingDay(10, year);
            let firstSunday = getFirstDayOfWeekInMonth(0, startingDay);

            return [10, firstSunday];
        }
    },

    "Election Day":
    function getHolidayDate(year) {
        if (year < 1792) {
            return;
        }

        let startingDay = calculateStartingDay(10, year);
        let firstMonday = getFirstDayOfWeekInMonth(1, startingDay);

        return [10, firstMonday + 1];
    },

    "Veterans Day":
    function getHolidayDate(year) {
        if (year >= 1938) {
            return [10, 11];
        }
    },

    "Thanksgiving":
    function getHolidayDate(year) {
        if (year >= 1863 && year <= 1938) {
            let startingDay = calculateStartingDay(10, year);
            let firstThursday = getFirstDayOfWeekInMonth(4, startingDay);

            if (firstThursday > 2) {
                return [10, firstThursday + 21];
            }
            else {
                return [10, firstThursday + 28];
            }
        }

        if (year == 1939) {
            return [10, 23];
        }

        if (year == 1940) {
            return [10, 21];
        }

        if (year == 1941) {
            return [10, 20];
        }

        if (year > 1941) {
            let startingDay = calculateStartingDay(10, year);
            let firstThursday = getFirstDayOfWeekInMonth(4, startingDay);

            return [10, firstThursday + 21];
        }
    },

    "Black Friday":
    function getHolidayDate(year) {
        if (year < 1975) {
            return;
        }

        let startingDay = calculateStartingDay(10, year);
        let firstThursday = getFirstDayOfWeekInMonth(4, startingDay);

        return [10, firstThursday + 22];
    },

    "Christmas Eve":
    function getHolidayDate(year) {
        if (year >= 1866) {
            return [11, 24];
        }
    },

    "Christmas":
    function getHolidayDate(year) {
        if (year >= 1777) {
            return [11, 25];
        }
    },

    "New Year's Eve":
    function getHolidayDate(year) {
        if (year >= 1777) {
            return [11, 31];
        }
    }
};