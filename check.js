// 驗證 index.html：菜單筆數、是否重複、每類分布、頁面腳本語法。
// 用法：node check.js
const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');

const block = html.split('<script type="text/plain" id="dishes">')[1].split('</script>')[0];
const kindSrc = html.match(/function kindOf\(name\)\{[\s\S]*?\n  \}/)[0];
const kindOf = vm.runInNewContext('(' + kindSrc + ')');

let g = '', s = '';
const dishes = [];
for (let line of block.split('\n')) {
  line = line.trim();
  if (!line || line.startsWith('/*')) continue;
  if (line[0] === '@') { [g, s] = line.slice(1).split('|'); continue; }
  dishes.push({ name: line, group: g, sub: s, kind: kindOf(line) });
}

const names = dishes.map(d => d.name);
const dup = names.filter((n, i) => names.indexOf(n) !== i);
const byGroup = {}, byKind = {};
dishes.forEach(d => { byGroup[d.group] = (byGroup[d.group] || 0) + 1; byKind[d.kind] = (byKind[d.kind] || 0) + 1; });

const app = html.split('<script>')[1].split('</script>')[0];
let syntaxOk = true;
try { new vm.Script(app); } catch (e) { syntaxOk = false; console.log('腳本語法錯誤：', e.message); }

console.log('餐點數：', dishes.length, '（目標 1000）');
console.log('重複：', dup.length ? dup.join('、') : '無');
console.log('分類：', byGroup);
console.log('飯／麵／其他：', byKind);
console.log('頁面腳本語法：', syntaxOk ? 'OK' : '錯誤');

const { execFileSync } = require('child_process');
let synced = true;
try { execFileSync(process.execPath, [__dirname + '/build.js', '--check'], { stdio: 'pipe' }); }
catch (e) { synced = false; }
console.log('GitHub 版 docs/index.html：', synced ? '已同步' : '過期，請跑 node build.js');

const ok = dishes.length === 1000 && dup.length === 0 && syntaxOk && synced;
console.log(ok ? 'PASS' : 'FAIL');
process.exit(ok ? 0 : 1);
