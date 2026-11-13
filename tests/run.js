// Node + Playwright are test-only dependencies. No application build is required.
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const suites=['trainer','backup','active-time','custom-text','symbols','layout'];
let failed=0;
for(const suite of suites){
 console.log('\nRunning '+suite+'.test.js');
 const result=spawnSync(process.execPath,[path.join(__dirname,suite+'.test.js')],{stdio:'inherit',env:process.env});
 if(result.status!==0){failed++;console.error(suite+' failed: '+(result.error?.message||result.signal||result.status));}
}
console.log(`\n${suites.length-failed}/${suites.length} suites passed`);
process.exitCode=failed?1:0;
