

import moment from 'moment'
export const PEOPLE = 'PEOPLE'
export const TIME_STAMP = 'TIME_STAMP'


export class LocalService {

    static savePeople(data) {
        try {
            localStorage.setItem(TIME_STAMP, moment().toString())
            localStorage.setItem(PEOPLE, JSON.stringify(data))
        } catch (e) {
            console.log('localstorage problem')
        }
    }

    static getPeople() {
        return JSON.parse(localStorage.getItem(PEOPLE))
    }

    static checktime() {
        let time = localStorage.getItem(TIME_STAMP)
        if (!time) {
            return true
        }
        return moment(time).isBefore(moment().subtract(1, 'week'))
    }
}