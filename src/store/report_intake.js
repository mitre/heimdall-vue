/**
 * Counts the severities of controls.
 */

 import { InspecOutput, Profile, Control } from "inspecjs";

 // Helper function for counting a severity in a list of controls
 function countSeverity(state, severity) {
     return state.allControls.filter(c => c.impact === severity).length;
 }

export const module = {
    // Puts our actions under whatever name we give this module
    namespaced: true,

    actions: {
        loadReportFile({state, commit, rootState}, reportText) {
            // Parse the given text. TODO: Error checking

            // Parse from json
            var content = JSON.parse(reportText);

            // Construct a report
            var report = InspecOutput(content);

            // Deliver
            commit("addReport", report, {root: true});
        },

        loadProfileFile({state, commit, rootState}, profileText) {
            // Parse the given text as a profile, and deliver it to the store. TODO: Error checking

            // Parse from json
            var content = JSON.parse(reportText);

            // Construct a profile
            var profile = Profile(null, content);

            // Deliver
            commit("addProfile", profile, {root: true});
        }
    }
}