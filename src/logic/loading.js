

import { createLogic } from 'redux-logic'
import { LOADING_DATA, ERROR_LOADING, DATA_LOADING, SUCCESS_DATA_LOAD, LOCAL_DATA } from '../actions'
import { } from 'moment'
import { flatten } from 'lodash'
import { LocalService } from '../service'
let STAR_WARS_URL = 'https://swapi.co/api/people/'
export const loadLogic = createLogic({
    validate: ({ action }, allow, reject) => {
        if (LocalService.checktime()) {
            allow(action);
        } else {
            reject({ type: LOCAL_DATA })
        }
    },
    type: [LOADING_DATA],
    processOptions: {
        dispatchMultiple: true
    },
    process: async ({ getState, action }, dispatch, done) => {

        dispatch({ type: DATA_LOADING, payload: true })

        try {
            let people = await Promise.all(
                [
                    fetch(STAR_WARS_URL),
                    fetch(STAR_WARS_URL + '?page=2'),
                    fetch(STAR_WARS_URL + '?page=3'),
                    fetch(STAR_WARS_URL + '?page=4'),
                    fetch(STAR_WARS_URL + '?page=5'),
                    fetch(STAR_WARS_URL + '?page=6'),
                    fetch(STAR_WARS_URL + '?page=7'),
                    fetch(STAR_WARS_URL + '?page=8'),
                    fetch(STAR_WARS_URL + '?page=9')
                ]
            )
                .then(async data => await Promise.all(data.map(async d => await d.json())))
                .then(results => {
                    console.log(results)
                    return results.map(data => data.results)
                }
                )
            people = flatten(people)

            people = await Promise.all(people.map(async person => {
                return await getInfo(person)
            }))

            people = people.filter(filterDarthVader)




            dispatch({ type: SUCCESS_DATA_LOAD, payload: { people, peopleByName: people.reduce((a, b) => { a[b.name] = b; return a }, {}) } })

            dispatch({ type: DATA_LOADING, payload: false })
            LocalService.savePeople(people)

        } catch (e) {
            dispatch({ type: DATA_LOADING, payload: false })
            dispatch({ type: ERROR_LOADING, payload: true })
        }


        done()
    }
})


export const loadLocalLogic = createLogic({
    type: [LOCAL_DATA],
    process: async ({ action, getState }, dispatch, done) => {

        let people = LocalService.getPeople()
        dispatch({ type: SUCCESS_DATA_LOAD, payload: { people, peopleByName: people.reduce((a, b) => { a[b.name] = b; return a }, {}) } })
        done()
    }
})



function filterDarthVader(person) {
    return person.name !== 'Darth Vader'
}

async function getMultipleFetch(data) {
    if (!Array.isArray(data)) {
        data = [data]
    }
    if (data.length === 0 || data[0] === undefined || data[0] === null) {
        return []
    }
    let res = await Promise.all(data.map(url => fetch(url)))
        .then(async results => await Promise.all(results.map(async d => await d.json())))

    return res
}
function parseValue(val) {
    if (val === null || val === undefined) {
        val = '-'
    }
    return val
}
async function getInfo(data) {

    let person = {}
    // Person name
    person.name = parseValue(data.name)
    // ○ Gender
    person.gender = parseValue(data.gender)
    // ○ Starship Name(s) belonging to the Person (Display)
    let starships = await getMultipleFetch(data.starships)
    person.starships = '-'
    if (starships && starships.length > 0) {
        person.starships = starships.map(starship => ({
            model: parseValue(starship.model),
            starship_class: parseValue(starship.starship_class),
            hyperdrive_rating: parseValue(starship.hyperdrive_rating),
            cost_in_credits: parseValue(starship.cost_in_credits),
            manufacturer: parseValue(starship.manufacturer)
        }))
    }
    // Vehicle Name(s) belonging to the Person (Display ‘-’ if no
    person.vehicles = '-'
    let vehicles = await getMultipleFetch(data.vehicles)
    if (vehicles && vehicles.length > 0) {
        person.vehicles = vehicles.map(vehicle => ({
            model: parseValue(vehicle.model),
            name: parseValue(vehicle.name),
            cost_in_credits: parseValue(vehicle.cost_in_credits),
        }))
    }
    // Homeworld (just in case the Empire needs to pay him a visit)
    person.homeworld = '-'
    let homeworld = await getMultipleFetch(data.homeworld)
    if (homeworld) {
        homeworld = homeworld.map(hw => ({
            population: parseValue(hw.population),
            name: parseValue(hw.name),
            climate: parseValue(hw.climate),
        }))
        person.homeworld = homeworld[0]
    }
    return person

}