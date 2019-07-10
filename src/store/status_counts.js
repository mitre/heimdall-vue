/**
 * Counts the statuses of controls.
 */

 // Helper function for counting a severity in a list of controls
 function countStatus(state, status) {
     return state.allControls.filter(c => c.status === status).length;
 }

export const module = {
    // Puts our data/getters under whatever name we give this module
    namespaced: true,

    getters: {
        passed:         (s, g, rootState) => countStatus(rootState, "Passed"),
        failed:         (s, g, rootState) => countStatus(rootState, "Failed"),
        notApplicable:  (s, g, rootState) => countStatus(rootState, "Not Applicable"),
        notReviewed:    (s, g, rootState) => countStatus(rootState, "Not Reviewed"),
        profileError:   (s, g, rootState) => countStatus(rootState, "Profile Error"),
    }
}
