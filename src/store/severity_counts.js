/**
 * Counts the severities of controls.
 */


 // Helper function for counting a severity in a list of controls
 function countSeverity(state, severity) {
     return state.allControls.filter(c => c.impact === severity).length;
 }

export const module = {
    // Puts our data/getters under whatever name we give this module
    namespaced: true,

    getters: {
        low:        (s, g, rootState) => countSeverity(rootState, "low"),
        medium:     (s, g, rootState) => countSeverity(rootState, "medium"),
        high:       (s, g, rootState) => countSeverity(rootState, "high"),
        critical:   (s, g, rootState) => countSeverity(rootState, "critical"),
    }
}