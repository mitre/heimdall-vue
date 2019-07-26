<template>
  <vx-card code-toggler :title="getControl">
    
        <ToggleButton id="changed-font"
          :labels="{checked: 'Findings', unchecked: 'Details'}"
          :color="{checked: '#157FFB', unchecked: '#157FFB'}"
          :width="110"
          :height="35"
          :value="true"
          @change="toggled = $event.value;"/>
        <div>
          <div v-if="!toggled">
            <pre> {{ getDetails }} {{getDesc}}
                  

Control:	V-6577
Title:	The Web site software used with the web server must have all applicable security patches applied and documented.
Desc:	The IAVM process does not address all patches that have been identified
for the host operating system or, in this case, the web server software
environment. Many vendors have subscription services available to notify
users of known security threats. The site needs to be aware of these fixes
and make determinations based on local policy and what software features are
installed, if these patches need to be applied.

In some cases, patches also apply to middleware and database systems.
Maintaining the security of web servers requires frequent reviews of security
notices. Many security notices mandate the installation of a software patch to
overcome security vulnerabilities.

SAs and ISSOs should regularly check the vendor support web site for patches
and information related to the web server software. All applicable security
patches will be applied to the operating system and to the web server
software. Security patches are deemed applicable if the product is installed,
even if it is not used or is disabled.
Severity:	medium
Impact:	0.5
Nist Ref:	CM-6,Rev_4
Check Text:	Query the web administrator to determine if the site has a
detailed process as part of its configuration management plan to stay
compliant with all security-related patches.

Proposed Questions: How does the SA stay current with web server vendor
patches? How is the SA notified when a new security patch is issued by the
vendor? (Exclude the IAVM.) What is the process followed for applying patches
to the web server?

If the site is not in compliance with all applicable security patches, this is
a finding.
Fix Text:	Establish a detailed process as part of the configuration
management plan to stay compliant with all web server security-related
patches.</pre>
          </div>
          <p v-if="toggled" v-html="getFinding">
          </p>
          <div>
                <v-data-table :items="getFindingTable" 
                :headers="[{text: 'test_result', value: 'test_result'}, {text: 'details', value: 'details'}]"
                >
                </v-data-table>
          </div>
        </div>
      
    <template slot="codeContainer">{{ getCode }}</template>
  </vx-card>
</template>

<script>
import CodeHighlighting from "./CodeHighlighting.vue"
import ToggleButton from "./ToggleButton.vue"
//document.getElementById("color").value = color();

export default {
    data() {
        return {
            currentTab: 'btn1',
            findings: ``,
            details: ``,
            code: ``,
            toggled: true,
            //testSet: [{test: 'passed', value: 'testSet'}]
        }
    },
    computed: {
        currentContent() {
            if (this.currentTab == 'btn1' && this.toggled == false) {
                return this.details
            }
            else if (this.currentTab == 'btn2' && this.toggled == false) {
                return this.code
            }
            else if (this.toggled = true) {
                return this.findings
            }
        },
        getControl() {
            return this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].status
        },
        getCode() {
            return this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].code
        },
        getFinding() {
            let firstTest;
            if (this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].finding_details.indexOf('PASSED') < this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].finding_details.indexOf('FAILED')) {
                firstTest = this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].finding_details.indexOf('PASSED')
            }
            else {
                firstTest = this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].finding_details.indexOf('FAILED')
            }
            return this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].finding_details.substr(0, firstTest - 3)
        },
        getFindingTable() {
            
            let findings = this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].finding_details.replace('N/A', '')
            let items = []
            let passedDetails = findings.split('PASSED')
            let failedDetails = findings.split('FAILED')
            let passed = findings.match(/PASSED/g)
            let failed = findings.match(/FAILED/g)
            let cutOff = 0;
            for (let i = 0; i < failed.length; i++) {
                if (failedDetails[i + 1].indexOf('PASSED') == -1) {
                    cutOff = failedDetails[i + 1].length
                }
                else {
                    cutOff = failedDetails[i + 1].indexOf('PASSED')
                }
                items.push({test_result: failed[i], details: failedDetails[i + 1].substr(3, cutOff)})
            }
            for (let i = 0; i < passed.length; i++) {
                if (passedDetails[i + 1].indexOf('FAILED') == -1) {
                    cutOff = passedDetails[i + 1].length
                }
                else {
                    cutOff = passedDetails[i + 1].indexOf('FAILED')
                }
                items.push({test_result: passed[i], details: passedDetails[i + 1].substr(3, cutOff)})
            }
            //let items = [{status: "PASSED", details: "hello"}]
            console.log(items)
            return items
        },
        getDesc() {
            let code = this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].code
            let desc = code.substr(code.indexOf('desc "') + 6, code.indexOf('"', code.indexOf('desc "') + 6))
            return desc
        },
        getDetails(desc) {
            return '' + this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].id + '\n' + this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].impact +
                   '\n' + this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].severity + '\n' + this.$store.state.data.allControls.filter( c => c.id === 'V-6577')[0].profile_name +
                   '\n'
        }
    },
    methods: {
        setCurrentTab(btn) {
            this.currentTab = btn
        }
    },
    components : {
        CodeHighlighting,
        ToggleButton
    },
    mounted() {
        //document.getElementsByTagName('b-button').setAttribute('variant', color());
    }
}
</script>

<style>
@import "../assets/scss/findingDetails.scss";
</style>
