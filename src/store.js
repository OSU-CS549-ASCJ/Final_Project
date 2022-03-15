import { writable } from "svelte/store"

let SelectedStates = writable(["Oregon", "Washington", "Texas"]);
let SelectedStatesAbbrv = writable(["OR", "WA", "TX"]);
let SelectedYear = writable("2010");

export {SelectedStates}
export {SelectedStatesAbbrv}
export {SelectedYear}