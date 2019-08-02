/**
 * Counts the severities of controls.
 */

import { Module, VuexModule, getModule } from "vuex-module-decorators";
import DataModule, {Filter, SearchTerm} from "./data_store";
import Store from "./store";
import {
    ControlStatus,
    Severity,
    InspecOutput,
    Profile,
    Control,
    } from "inspecjs/dist/types";
import {
    ControlNistHash,
    NistHash,
    generateNewControlHash,
    generateNewNistHash,
    ControlGroupStatus,
    } from "inspecjs/dist/nist";
import { faFilter } from '@fortawesome/free-solid-svg-icons';


class ControlFilter {
  status: ControlStatus | null = null;
  severity: Severity | null = null;
  searchTerm: string | null = null;

  /**
   * Returns true if the given control satisfies the status, impact, and search term filters
   */
  accepts(control: Control): boolean {
      if (this.status && this.status != control.status) {
          return false;
      }
      // Must stringify the impact, but otherwise just check equality
      else if (this.severity && this.severity != control.severity) {
          return false;
      }
      // Finally, if there's a search term, we return based on that
      if (this.searchTerm) {
          let term = this.searchTerm.toLowerCase();
          // Check if any of the following list contain it, in lower case
          return [
              control.id,
              control.rule_title,
              control.severity,
              control.status,
              control.finding_details,
              control.code,
          ]
              .map(s => s.toLowerCase())
              .map(s => s.includes(term))
              .reduce((a, b) => a || b);
      } else {
          // No search term; we're fine
          return true;
      }
  }
}






function simplifyNistTags(rawNistTags: string[]): string[] {
  if (rawNistTags === []) {
      return ["UM-1"];
  } else {
      let nist: string[] = [];
      let pattern = /^[A-Z]{2}-[0-9]+/;
      rawNistTags.forEach(tag => {
          let match = tag.match(pattern);
          if (match && !nist.includes(match[0])) {
              nist.push(match[0]);
          }
      });
      return nist;
  }
}

//    USAGE: console.log(this.$store.getters["treemap/nistControls"]);
@Module({
  namespaced: true,
  name: "treemap",
})
class Treemap extends VuexModule {
  // These fields relate to the currently selected options
  /** The currently selected NIST family, if any */
  selectedFamily: string | null = null;
  /** The currently selected NIST category, if any. */
  selectedSubFamily: string | null = null;
  /**  The currently selected NIST control, if any. Value should be a unique ID, not the control ID */
  selectedControlID: number | null = null;
  /**  The filters. Broken out into a separate class for sensibility. TODO: Add "selectedControlID" and siblings to this */
  filter: ControlFilter = new ControlFilter();

  get nist(): ControlNistHash {
    return generateNewControlHash();
  }
  get nistControls(): Control[] {
    // Begin with an empty list
    let nistControls: Control[] = [];

    // The following 2 lines had to be added
    let data = getModule(DataModule, Store);
    let filter: Filter = {} ;

    // Now iterate over controls, adding only if they pass inspection
    // Originally data was 'this' 
    data.allControls(filter).forEach(control => {
      // Check that it matches our current filters. if so, add it
      //if (filter.accepts(control)) {
        nistControls.push(control);
      //}
    });
    return nistControls;
  }
  
  get nistHash(): NistHash {
      let data = getModule(DataModule, Store);
      let filter: Filter = {} ;

      let nistHash: NistHash = generateNewNistHash();
      let controlNistHash = this.ControlNistHash;
      // Update the counts/statuses/values on each family, tracking a miniateurized version of each control
      // TODO: Determine whether this miniateurization is necessary. Hunch is no, and that it's just some back-compat stuff we could ez fix elsewhere. But we'll see
      nistHash.children.forEach(family => {
          // Track statuses for the family
          let familyStatuses: ControlGroupStatus[] = [];
          // Go through each family item
          family.children.forEach(category => {
              // Fetch the relevant controls
              let categoryControls = controlNistHash[category.name];
              // If they exist, we want a summary of their statuses and to count them as well
              if (categoryControls) {
                  // Track statuses for the category
                  let categoryStatuses: ControlStatus[] = [];
                  // Iterate over the controls we cached in the step before this in ctl_hash
                  categoryControls.forEach(control => {
                      // Save the status
                      categoryStatuses.push(control.status);
                      // Save the control
                      category.children.push(control);
                      // Count
                      category.count += 1;
                      family.count += 1;
                  });
                  // Finally, derive the status for the category, and track it in the family list
                  category.status = this.statusValue(categoryStatuses);
                  familyStatuses.push(category.status);
              }
          });
          // Store the summarized status
          family.status = this.statusValue(familyStatuses);
      });
      // Job's done
      return nistHash;
  }


   
  get ControlNistHash(): ControlNistHash {
    let data = getModule(DataModule, Store);
      // Make an empty hash
      let controlNistHash: ControlNistHash = generateNewControlHash();
      // Get all of our controls as well, based on the status/severity/search BUT NOT selected family filters
      var controls = this.nistControls;
      // For each control, go through its nist tags and put a reference to the control in the corresponding array of our controls hash
      controls.forEach(control => {
          let rawTags: any = control.tags["nist"];
          let controlTags: string[];
          // Ensure its a list of strings
          if (typeof rawTags === "string") {
              controlTags = [rawTags];
          } else if (
              rawTags instanceof Array &&
              rawTags
                  .map(s => typeof s === "string")
                  .reduce((a: boolean, b: boolean) => a && b)
          ) {
              // It's an array of strings
              controlTags = rawTags;
          } else {
              // Just give up -  we don't know how to handle this type
              controlTags = [];
          }
          // Now, we simplify
          controlTags = simplifyNistTags(controlTags);
          // Add them to the hash
          controlTags.forEach(tag => {
              if (tag in controlNistHash) {
                  controlNistHash[tag].push(control);
              } else {
                  controlNistHash[tag] = [control];
              }
          });
      });
      return controlNistHash;
  }
  /*
  setImpactFilter(val: string): void {
    this.setSeverityFilter(val as Severity);
  }

  setSeverityFilter(val: Severity): void {
    let filter: Filter = {} ;
    filter.severity = val;
  }

  get impactFilter(): string | null {
    let filter: Filter = {} ;
    return filter.impact;
  }
*/

  get searchTerm(): string | null {
    let filter: Filter = {} ;
    return filter.searchTerm;
  }

  setSearchTerm(val: SearchTerm): void {
    let filter: Filter = {} ;
    filter.searchTerm = val;
  }

  get statusFilter(): ControlStatus | null {
    let filter: Filter = {} ;
      return filter.status;
  }

  setStatusFilter(val: ControlStatus): void {
    let filter: Filter = {} ;
      filter.status = val;
  }

  setSelectedFamily(val: string): void {
    this.selectedFamily = val;
  }
  
  setSelectedSubFamily(val: string): void {
    this.selectedSubFamily = val;
  }

  setSelectedControl(val: number): void {
      this.selectedControlID = val;
  }
  
  /**
   * This function is similar to getNistControls (and in fact USUALLY returns a subset of it).
   * However, it differs in the following two ways:
   * 1. If we have a control selected, then we only return that control in a one-item array
   * 2. If we have a family or subfamily filter, only return controls that meet the criteria
   *    of getNistControls AND are relevant to that nist family/category
   *
   * Rule #1 is somewhat odd in that it just completely ignores the getNistControls filters.
   * If we have a selection, then that's what we return, full stop.
   */

   /*
  get FilteredNistControls(): Control[] {
    let data = getModule(DataModule, Store);
      // if we have one selected just set as that
      let selected = data.getSelectedControl();
      if (selected) {
          return [selected];
      }
      // Otherwise we just apply additional filtering to nist controls
      // Set our family filter to the subfamily if it is set, else the family
      let fam_filter: string | null = null;
      if (data.selectedSubFamily) {
          fam_filter = data.selectedSubFamily;
      } else if (data.selectedFamily) {
          fam_filter = data.selectedFamily;
      }
      // If we have a family filter, then build from nist controls.
      if (fam_filter) {
          let filteredNistControls: Control[] = [];
          data.getNistControls().forEach(control => {
              // Create a string of all the nist tags for searching
              let nist_val = control.tags.nist.join();
              // Verify that it includes our family filter
              if (nist_val.includes(fam_filter as string)) {
                  // The "as string" is necessary because we know fam_filter to be not null, but TypeScript can't tell
                  filteredNistControls.push(control);
              }
          });
          return filteredNistControls;
      } else {
          // If there is no family filter, then just make it the same as nistControls
          return data.getNistControls();
      }
  } */


  /**
   * The name here is a misnomer - nistHash already provides the filtered families.
   * What this does is provide a modified record structure of all currently visible controls, removing any empty families/categories,
   * as well as replacing each control with a slightly modified version. Unclear exactly why, but so it goes.
   * TODO: Figure out why the record needs to be in that particular format. On-site processing probably better
   */


   
   
   
   
   /*
  get FilteredFamilies(): FilteredFamily[] {
      let data = getModule(DataModule, Store);
      let filteredFamilies: FilteredFamily[] = [];
      // For each family, we want to explore its categories and
      this.nistHash.children.forEach(family => {
          // This record tracks entries for each categories controls
          let categoryEntries: FilteredFamilyCategory[] = []; // TODO: properly annotate this type
          family.children.forEach(category => {
              let children: FilteredFamilyItem[] = [];
              category.children.forEach(control => {
                  // For some reason, we undo the earlier replacement of "\n" -> <br>
                  // We only need these parameters, and we deliberately avoid modifying the control itself
                  // TODO: As with the ControlHash in nist.ts, we would like to examine the possibility
                  //       of not having any special conversion occur here, instead using the control directly.
                  //       This would obviate this entire function (except for the debatable utility of clearing empty lists)
                  let modifiedControlHash: FilteredFamilyItem = {
                      vuln_discuss: control.vuln_discuss.replace(
                          /<br>/g,
                          "\n"
                      ),
                      check_content: control.tags.check_content.replace(
                          /<br>/g,
                          "\n"
                      ),
                      fix_text: control.tags.fix_text.replace(/<br>/g, "\n"),
                  };
                  // Push it in
                  children.push(modifiedControlHash);
              });
              // If we actually found any children, add this category to our list of listings to display for this family
              if (children) {
                  categoryEntries.push({
                      name: category.name,
                      items: children,
                  });
              }
          });
          // If any of our categories had
          if (categoryEntries.length > 0) {
              filteredFamilies.push({
                  name: family.name,
                  desc: family.desc,
                  items: categoryEntries,
              });
          }
      });
      return filteredFamilies;
  }
  */

  /**
   * Returns a list of controls to show, based on factors such as filters, search terms, and current selections.
   * More specifically:
   * - If we have a search term, only return controls that contain that term
   * - If we have a impact filter, only return controls that match that filter
   * - If we have a status filter, only return controls that match that filter
   */
  /**
   * Returns the nist hash, which is essentially just a categorization of controls by family/category.
   * See nist.ts for more involved documentation about what exactly it contains.
   */
  /**
   * Return the current status hash mapping statuses to control count. */
   



  /*
  get StatusHash(): StatusHash {
    let data = getModule(DataModule, Store);
      let statusHash: StatusHash = {
          "Passed": 0,
          "Failed": 0,
          "Not Applicable": 0,
          "Not Reviewed": 0,
          "Profile Error": 0,
      };
      data.getFilteredNistControls().forEach((control: Control) => {
          statusHash[control.status] += 1;
      });
      return statusHash;
  }
  */
  /**
   * Returns the current severity hash, mapping severities to control counts.
   */

   /*
  get SeverityHash(): SeverityHash {
    let data = getModule(DataModule, Store);
      let severityHash: SeverityHash = {
          none: 0,
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
      };
      data.getFilteredNistControls().forEach((control: Control) => {
          severityHash[control.severity] += 1;
      });
      return severityHash;
  }*/
  /**
   * Return the current status counts, pairings of [Status, #ControlsWithThatStatus]
   */
  /*
  get StatusCount(): StatusCount[] {
    let data = getModule(DataModule, Store);
      let statusCount: StatusCount[] = [];
      let statusHash = data.getStatusHash();
      STATUSES.forEach(status => {
          statusCount.push([status, statusHash[status]]);
      });
      return statusCount;
  }
  */
  /**
   * * Return the current severity counts, pairings of [Severity, #ControlsWithThatSeverity]
   */
  /*
  get SeverityCount(): SeverityCount[] {
    let data = getModule(DataModule, Store);
      // Build our severities
      let severityCount: SeverityCount[] = [];
      let severityHash = data.getSeverityHash();
      SEVERITIES.forEach(severity => {
          severityCount.push([severity, severityHash[severity]]);
      });
      return severityCount;
  }
  */
  /**
   * Returns the current search term.
   */
  /*
  get SearchTerm(): string | null {
    let filter: Filter = {} ;
    let data = getModule(DataModule, Store);
      return filter.searchTerm;
  }
  */
  /**
   * Get the currently selected control, if there is one. Returns null if none
   */
  /*
  get SelectedControl(): Control | null {
    let data = getModule(DataModule, Store);
      if (data.selectedControlID) {
          let found = data.getControlByUniqueID(data.selectedControlID);
          if (found === undefined) {
              console.error(
                  "Somehow user-selected control with id ${this.selectedControlID} does not exist"
              );
              return null;
          } else {
              return found;
          }
      } else {
          return null;
      }
  }
  */
  /**
   * Returns the currently selected family
   */
  /*
  get SelectedFamily(): string | null {
    let data = getModule(DataModule, Store);
      return data.selectedFamily;
  }
  */
  /**
   * Returns the currently selected sub-family (or as I've taken to calling them, category)
   */
  /*
  get SelectedSubFamily(): string | null {
    let data = getModule(DataModule, Store);
      return data.selectedSubFamily;
  }
  */
  /**
   * Returns the current severity filter. Of debatable usefulness, but harmless.
   */
  /*
  get SeverityFilter(): Severity | null {
    let filter: Filter = {} ;
    let data = getModule(DataModule, Store);
      return filter.severity;
  }
  */
  /**
   * Returns the current showing data. I HIGHLY Suggest that this be moved to an independent Vuex state
   */
  /*
  get Showing(): string {
    let data = getModule(DataModule, Store);
      return data.showing;
  }
  */
  /**
   * Returns the current status filter. Of debatable usefulness, but harmless.
   */
  /*
  get StatusFilter(): ControlStatus | null {
    let filter: Filter = {} ;
    let data = getModule(DataModule, Store);
      return filter.status;
  }
  */
  /**
   * Returns the current title. TODO: Investigate ways to more simply setup these trivial getter/setter pairs, if such would be worthwhile
   */
  /*
  get Title(): string {
    let data = getModule(DataModule, Store);
      return data.title;
  }
  */
  /* Data modification */
  /**
   * @deprecated Same reason as with get
   */
  /*
  setImpactFilter(val: string): void {
    let data = getModule(DataModule, Store);
      data.setSeverityFilter(val as Severity);
  }
  */
  /**
   * Sets the search term
   */
  /*
  setSearchTerm(val: string): void {
    let filter: Filter = {} ;
    let data = getModule(DataModule, Store);
      filter.searchTerm = val;
  }
  */
  /**
   * Sets the selected control id
   */
  /*
  setSelectedControl(val: number): void {
    let data = getModule(DataModule, Store);
      data.selectedControlID = val;
  }
  */
  /**
   * Sets the selected family filter
   */
  /*
  setSelectedFamily(val: string): void {
    let data = getModule(DataModule, Store);
      data.selectedFamily = val;
  }
  */
  /**
   * Sets the selected subfamily filter
   */
  /*
  setSelectedSubFamily(val: string): void {
    let data = getModule(DataModule, Store);
      data.selectedSubFamily = val;
  }
  */
  /**
   * Sets our severity filter.
   * TODO: error checking
   */
  /*
  setSeverityFilter(val: Severity): void {
    let filter: Filter = {} ;
    let data = getModule(DataModule, Store);
      filter.severity = val;
  }
  */
  /**
   * Sets the current showing page item.
   * TODO: Make this strongly typed and in its own class. HeimdallState currently is a mess of different concepts.
   */
  /*
  setShowing(val: string): void {
    let data = getModule(DataModule, Store);
      data.showing = val;
  }
  */
  /**
   * Sets the status filter.
   * TODO: Error checking
   */
  /*
  setStatusFilter(val: ControlStatus): void {
    let filter: Filter = {} ;
    let data = getModule(DataModule, Store);
      filter.status = val;
  }
  */
  /**
   * Sets the title, and for some reason also the showing.
   */
  /*
  setTitle(val: string): void {
    let data = getModule(DataModule, Store);
      data.title = val;
  }
  */
  /**
   * Deletes all data in the store and clears all filters
   */
  /*
  reset(): void {
    let filter: Filter = {} ;
    let data = getModule(DataModule, Store);
      data.reset();
      // Simple - just wipe controls, and reset filters.
      // May need to modify this later. TODO
      filter = new data.ControlFilter();
      data.selectedControlID = null;
      data.selectedFamily = null;
      data.selectedSubFamily = null;
      data.title = "";
  }
  parseFile(content: string, file_name: string) {
    let filter: Filter = {} ;
    let data = getModule(DataModule, Store);
      // Clear old controls
      data.reset();
      // Parse to json
      var json = JSON.parse(content);
      // Add all
      if (json.profiles == undefined) {
          // Is a profile? Interpret all controls
          let profile = new Profile(null, json);
          data.addInspecProfile(profile);
      } else {
          // It's a result. Handle each profile in turn
          let result = new InspecOutput(json);
          data.addInspecOutput(result);
      }
      // Reset our filters
      filter = new data.ControlFilter();
      data.selectedControlID = null;
      data.selectedFamily = null;
      data.selectedSubFamily = null;
  }
  */
  /**
   * Sumarrizes an array of status into a single status
   */
  get statusValue(): (statuses: ControlGroupStatus[]) => ControlGroupStatus {
    return (statuses: ControlGroupStatus[]) => {
    var fam_status: ControlGroupStatus = "Empty";
      if (statuses.includes("Failed")) {
          fam_status = "Failed";
      } else if (statuses.includes("Profile Error")) {
          fam_status = "Profile Error";
      } else if (statuses.includes("Not Reviewed")) {
          fam_status = "Not Reviewed";
      } else if (statuses.includes("Passed")) {
          fam_status = "Passed";
      } else if (statuses.includes("Not Applicable")) {
          fam_status = "Not Applicable";
      }
      return fam_status;
    }
  }
}
export default Treemap;