import { writable } from "svelte/store"

let SelectedStates = writable(['Oregon','California', 'Washington']);
let SelectedStatesAbbrv = writable(["WA", "OR"]);
let SelectedYear = writable("2010");

export {SelectedStates}
export {SelectedStatesAbbrv}
export {SelectedYear}