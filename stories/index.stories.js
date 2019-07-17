/* eslint-disable react/react-in-jsx-scope */

import { storiesOf } from "@storybook/vue";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

storiesOf("CountCard", module).add("Passing Count Card", () => ({
  template:
    '<CountCard title="Passed" explanation="(all tests passed)" fas_icon="check" color_variant="success"></CountCard>)'
}));

storiesOf("VxCard", module).add("VxCard initial test", () => ({
  template: "<VxCard>No Idea how to use this</VxCard>"
}));

storiesOf("AboutContent", module).add("Test story 0", () => ({
  template: '<AboutContent v-if="shouldShowAbout" />'
}));
storiesOf("ComplianceChart", module).add("Test story 1", () => ({
  template: "<ComplianceChart/>"
}));
storiesOf("ControlImpact", module).add("Test story 3", () => ({
  template: "<ControlImpact/>"
}));
storiesOf("ControlStatus", module).add("Test story 4", () => ({
  template: "<ControlStatus/>"
}));
storiesOf("")
storiesOf("CountCard", module).add("Test story 5", () => ({
  template:
    '<CountCard title="Passed" explanation="(all tests passed)" fas_icon="check" color_variant="success"></CountCard> <CountCard title="Failed" explanation="(has tests that failed)" fas_icon="times" color_variant="danger"></CountCard> <CountCard title="Not Applicable" explanation="(exception for this system and/or absent component)" fas_icon="ban" color_variant="primary"></CountCard> <CountCard title="Not Reviewed" explanation="(can only be tested manually or disabled test)" fas_icon="exclamation-triangle" color_variant="warning"></CountCard> <CountCard title="Profile Error" explanation="(check profile run privileges or check with profile author)" fas_icon="exclamation-circle" color_variant="info"></CountCard>'
}));
storiesOf("DataTable", module).add("Test story 6", () => ({
  template: '<DataTable :controls="filteredControls"></DataTable>'
}));
storiesOf("NavHeader", module).add("Test story 8", () => ({
  template: "<NavHeader/>"
}));
storiesOf("SspContent", module).add("Test story 9", () => ({
  template: '<SspContent v-else-if="shouldShowSSP" />'
}));
storiesOf("Treemap", module).add("Test story 10", () => ({
  template: '<Treemap :key="resizeKey"/>'
}));
