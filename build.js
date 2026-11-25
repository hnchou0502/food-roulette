// 把 index.html（Claude 網頁格式：沒有 doctype／head）包成完整網頁，輸出到 docs/index.html 給 GitHub Pages 用。
// 用法：node build.js        → 重新產生 docs/index.html
//       node build.js --check → 只檢查 docs/index.html 是否和 index.html 同步（不寫檔）
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'index.html');
const OUT = path.join(__dirname, 'docs', 'index.html');

function build() {
  const body = fs.readFileSync(SRC, 'utf8');
  const head = [
    '<!doctype html>',
    '<html lang="zh-Hant">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="description" content="從 1,000 道一人份的午餐、晚餐裡轉一道。可篩選菜系與飯麵、避開最近吃過的，轉到後一鍵找附近的店。">',
    '<meta property="og:title" content="今天吃什麼">',
    '<meta property="og:description" content="1,000 道一人份午晚餐的轉盤，轉到就吃。">',
    '<meta property="og:type" content="website">',
    '<meta name="theme-color" content="#EDF1EA">',
    // Claude 網頁外殼原本會補的基本重設：body 無外距、內容避開手機瀏海與底部橫條
    '<style>body{margin:0}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>',
  ].join('\n');
  // 說明註解放在最後：放在 doctype 前面會讓部分瀏覽器進怪異模式
  return head + '\n' + body.trim() + '\n</html>\n'
    + '<!-- 由 build.js 從 ../index.html 產生：請改 index.html 再跑 node build.js，不要直接改這個檔 -->\n';
}

const out = build();
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur === out) { console.log('docs/index.html 已同步'); process.exit(0); }
  console.log('docs/index.html 過期：請跑 node build.js'); process.exit(1);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log('已產生 docs/index.html（' + Buffer.byteLength(out) + ' bytes）');
