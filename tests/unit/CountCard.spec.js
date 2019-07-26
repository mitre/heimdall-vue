import { shallowMount } from "@vue/test-utils";
import CountCard from "@/components/CountCard.vue";
import PropChecker from "@/test/PropChecker.js";

const testProps = {
  index: 1,
  statistic: "My Statistic",
  statisticTitle: "My Statistic Title",
  statisticSub: "My Statistic Sub",
  background: "My Background"
}

const wrapper = shallowMount(CountCard, testProps);
const props = wrapper.vm.$options.props;
const propChecker = new PropChecker();

describe("Index", () => {
  propChecker.check(props.index);
});

describe("Statistic", () => {
  propChecker.check(props.statistic);
});

describe("Statistic Title", () => {
  propChecker.check(props.statisticTitle);
});

describe("Statistic Sub", () => {
  propChecker.check(props.statisticSub);
});

describe("Background", () => {
  propChecker.check(props.background);
});