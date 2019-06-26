<template>
  <b-card no-body class="mb-3">
    <b-card-header>
      <font-awesome-icon icon="chart-area"/> NIST SP 800-53 Coverage <b-button v-on:click="clear" style="float:right;" variant="outline-primary">Clear Filter</b-button>
      <div v-bind:title="testBind"></div>
    </b-card-header>
    <b-card-body>
      <div class="treemap">
        <!-- The SVG structure is explicitly defined in the template with attributes derived from component data -->
        <svg id="chartBody" :height="height" style="margin-left: 15px;" :width="width">
          <g style="shape-rendering: crispEdges;" transform="translate(0,20)">
            <!-- We can use Vue transitions too! -->
            <transition-group name="list" tag="g" class="depth" v-if="selectedNode._children">
              <!-- Generate each of the visible squares at a given zoom level (the current selected node) -->
                <g
                  class="children"
                  v-for="children in selectedNode._children"
                  :key="'c_' + children.id"
                  >

                  <!-- Generate the children squares (only visible on hover of a square) -->
                  <rect
                    v-for="child in children._children"
                    class="child"
                    :id="child.id"
                    :key="(child.data && child.data.unique_id) || child.id"
                    :unique_id="child.data.unique_id"
                    :height="y(child.y1) - y(child.y0)"
                    :width="x(child.x1) - x(child.x0)"
                    :x="x(child.x0)"
                    :y="y(child.y0)"
                    :style="{ fill: color(child.data) }"
                    >
                  </rect>

                  <!--
                    The visible square rect element.
                    You can attribute directly an event, that fires a method that changes the current node,
                    restructuring the data tree, that reactivly gets reflected in the template.
                  -->
                  <rect
                    class="parent"
                    v-on:click="selectNode"
                    :id="children.id"
                    :key="(children.data && children.data.unique_id) || children.id"
                    :unique_id="children.data.unique_id"
                    :x="x(children.x0)"
                    :y="y(children.y0)"
                    :width="x(children.x1 - children.x0 + children.parent.x0)"
                    :height="y(children.y1 - children.y0 + children.parent.y0)"
                    :style="{ fill: color(children.data) }"
                    >

                    <!-- The title attribute -->
                    <title>{{ children.data.desc ? children.data.desc + ' | ' + children.data.count : children.data.count }}</title>
                  </rect>

                  <!-- The visible square text element with the title and value of the child node -->
                  <text
                    dy="1em"
                    :key="'t_' + children.id"
                    :x="x(children.x0) + 6"
                    :y="y(children.y0) + 6"
                    style="fill-opacity: 1;"
                    >
                    {{ children.data.name}}
                  </text>

                  <text
                    dy="2.25em"
                    :key="'tt_' + children.id"
                    :x="x(children.x0) + 6"
                    :y="y(children.y0) + 6"
                    style="fill-opacity: 1;"
                    >

                    {{ children.data.count > 0 ? children.data.count : '' }}
                  </text>

                </g>
            </transition-group>

            <!-- The top most element, representing the previous node -->
            <g class="grandparent">

              <rect
                :height="margin.top"
                :width="width"
                :y="(margin.top * -1)"
                v-on:click="selectNode"
                :id="parentId">
              </rect>

              <!-- The visible square text element with the id (basically a breadcumb, if you will) -->
              <text
                dy=".65em"
                x="6"
                y="-14">

                {{ selectedNode.id }}
              </text>
            </g>
          </g>
        </svg>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import {scaleLinear, scaleOrdinal} from 'd3-scale'
import {schemeCategory10} from 'd3-scale-chromatic'
import {json} from 'd3-request'
import {hierarchy, treemap} from 'd3-hierarchy'
import { store } from "../store.js";

// To be explicit about which methods are from D3 let's wrap them around an object
// Is there a better way to do this?

var isMounted = false;

let d3 = {
  scaleLinear: scaleLinear,
  scaleOrdinal: scaleOrdinal,
  schemeCategory10: schemeCategory10,
  json: json,
  hierarchy: hierarchy,
  treemap: treemap
}

export default {
  name: 'Treemap',
  // the component's data
  data () {
    return {
      jsonData: null,
      rootNode: {},
      margin: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
      },
      //width: window.innerWidth - 300,
      width: document.getElementById("chart") ? document.getElementById("chart").offsetWidth - 100 : window.innerWidth - window.innerWidth/3,
      height: 530,
      selected: null,
      color: {}
    }
  },
  // You can do whatever when the selected node changes
  watch: {
    selectedNode (newData, oldData) {
      console.log('The selected node changed...')
    }
  },
  // In the beginning...
  mounted () {
    var that = this
    // An array with colors (can probably be replaced by a vuejs method)
    //that.color = d3.scaleOrdinal(d3.schemeCategory10)

    that.color = function(obj) {
      var colors = {
        "Passed": "rgb(137, 204, 81)",
        "Failed": "rgb(255, 0, 41)",
        "Not Applicable": "#4579B2",
        "Not Reviewed": "rgb(255, 200, 87)",
        "Profile Error": "#DDEDF6",
        "Empty": "rgb(187, 187, 187)"
      }
      var clr = "rgb(187, 187, 187)";
      if (obj.status in colors) {
        clr = colors[obj.status];
      }
      //console.log(obj.name + ", " + obj.status + ": " + clr);
      return clr;
    };
    // loads the data and calls the initialization methods
    that.jsonData = store.getNistHash();
    that.initialize()
    that.accumulate(that.rootNode, that)
    that.treemap(that.rootNode)
  },
  updated () {
    if (isMounted == false) {
      isMounted = true;
    } else {
      isMounted = false;
      var that = this

      // An array with colors (can probably be replaced by a vuejs method)
      //that.color = d3.scaleOrdinal(d3.schemeCategory10)
      that.color = function(obj) {
        var colors = {
          "Passed": "rgb(137, 204, 81)",
          "Failed": "rgb(255, 0, 41)",
          "Not Applicable": "#4579B2",
          "Not Reviewed": "rgb(255, 200, 87)",
          "Profile Error": "#DDEDF6",
          "Empty": "rgb(187, 187, 187)"
        }
        var clr = "rgb(187, 187, 187)";
        if (obj.status in colors) {
          clr = colors[obj.status];
        }
        return clr;
      };

      // loads the data and calls the initialization methods
      that.jsonData = store.getNistHash();
      //this.width = '100%';
      that.initialize()
      that.accumulate(that.rootNode, that)
      that.treemap(that.rootNode)
    }
  },
  // The reactive computed variables that fire rerenders
  computed: {
    testBind: function() {
      return store.getStatusFilter() + store.getImpactFilter() + store.getSearchTerm();
    },
    // The grandparent id
    parentId () {
      if (this.selectedNode.parent === undefined || this.selectedNode.parent === null) {
        return this.selectedNode.id
      } else {
        return this.selectedNode.parent.id
      }
    },
    // Returns the x position within the current domain
    // Maybe it can be replaced by a vuejs method
    x () {
      return d3.scaleLinear()
        .domain([0, this.width])
        .range([0, this.width])
    },
    // Returns the y position within the current domain
    // Maybe it can be replaced by a vuejs method
    y () {
      return d3.scaleLinear()
        .domain([0, this.height - this.margin.top - this.margin.bottom])
        .range([0, this.height - this.margin.top - this.margin.bottom])
    },
    // The D3 function that recursively subdivides an area into rectangles
    treemap () {
      return d3.treemap()
      .size([this.width, this.height])
      .round(false)
      .paddingInner(0)
    },
    // The current selected node
    selectedNode () {
      let node = null

      if (this.selected) {
        let nd = this.getNodeById(this.rootNode, this.selected, this)

        if (nd._children) {
          node = nd
        } else {
          node = nd.parent
        }
      } else {
        node = this.rootNode
      }

      // Recalculates the y and x domains
      this.x.domain([node.x0, node.x0 + (node.x1 - node.x0)])
      this.y.domain([node.y0, node.y0 + (node.y1 - node.y0)])

      return node
    }
  },
  methods: {
    // Called once, to create the hierarchical data representation
    initialize () {
      let that = this

      if (that.jsonData) {
        // Make a function that converts controls into simple objects, for d3 heirarchy
        // This allows us to convert controls on demand to have whatever properties we require
        function children(d) {
          if(d.children && d.children.length) { // Simple test: does this item have children? Fall through case doesn't matter
            if(d.children[0].rule_title) { // If so, we want to know: are the children controls? Only controls have a rule_title
              // Controls aren't what we want. Instead, map them to simplified representations
              return d.children.map(control => {
                return {
                  name: control.id || control.tags.gid,
                  unique_id: control.unique_id,
                  status: control.status,
                  value: 1,
                }
              });
            } else { // Children aren't controls
              return d.children;
            }
          }
        }

        that.rootNode = d3.hierarchy(that.jsonData, children)
        .eachBefore(function (d) { 
          d.id = (d.parent ? d.parent.id + '.' : '') + d.data.name;
          
        })
        .sum((d) => d.value)
        .sort(function (a, b) {
          return b.height - a.height || b.value - a.value
        })
        that.rootNode.x = that.rootNode.y = 0
        that.rootNode.x1 = that.width
        that.rootNode.y1 = that.height
        that.rootNode.depth = 0
      }
    },
    // Calculates the accumulated value (sum of children values) of a node - its weight,
    // represented afterwards in the area of its square
    accumulate (d, context) {
      d._children = d.children

      if (d._children) {
        d.value = d._children.reduce(function (p, v) { return p + context.accumulate(v, context) }, 0)
        return d.value
      } else {
        return d.value
      }
    },
    // Helper method - gets a node by its id attribute
    getNodeById (node, id, context) {
      if (node.id === id) {
        return node
      } else if (node._children) {
        for (var i = 0; i < node._children.length; i++) {
          var nd = context.getNodeById(node._children[i], id, context)
          if (nd) {
            return nd
          }
        }
      }
    },
    // When a user clicks a square, changes the selected data attribute
    // which fires the computed selectedNode, which in turn finds the Node by the id of the square clicked
    // and the template reflects the changes
    selectNode (event) {
      this.selected = event.target.id
      var fams = event.target.id.split('.');
      var length = fams.length;
      if (length == 1) {
        // They've clicked the top level item
        console.log("Clicked root " + fams[0]);
        store.setSelectedFamily(null);
      } else if (length == 2) {
        // They've clicked a family
        console.log("Clicked family " + fams[1]);
        store.setSelectedFamily(fams[1]);
        store.setSelectedSubFamily(null);
        store.setSelectedControl(null);
      } else if (length == 3) {
        // They've clicked a subfamily/category
        console.log("Clicked category " + fams[2]);
        store.setSelectedFamily(fams[1]);
        store.setSelectedSubFamily(fams[2]);
        store.setSelectedControl(null);
      } else if (length == 4) {
        // They've clicked a control
        // This means that our event.target should contain the unique_id of its cassociated control
        console.log("Clicked control " + fams[3] + "with unique id " + parseInt(event.target.getAttribute("unique_id")));
        console.log(event);
        store.setSelectedFamily(fams[1]);
        store.setSelectedSubFamily(fams[2]);
        store.setSelectedControl(parseInt(event.target.getAttribute("unique_id")));
      }
    },
    clear: function (event) {
      store.setSearchTerm(null);
      store.setStatusFilter(null);
      store.setImpactFilter(null);
    }
  }
}
</script>

<style scoped>

text {
  pointer-events: none;
}

.grandparent text {
  font-weight: bold;
  color: red;
}

rect {
  fill: none;
  stroke: #fff;
}

rect.parent,
.grandparent rect {
  stroke-width: 2px;
}

.grandparent rect {
  fill: #99ccff;
}

.grandparent:hover rect {
  fill: #99ccff;
}

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}

.children rect.parent {
  fill: #bbb;
  fill-opacity: 1.0;
}

.children:hover rect.parent {
  fill-opacity: 0.0;
}
.children:hover rect.child {
  fill: #bbb;
  fill-opacity: .5;
}

.children text{
  font-size: 0.8em;
}

.grandparent text{
  font-size: 0.9em;
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
}

</style>
