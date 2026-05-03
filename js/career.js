// ===== 準備パート =====
// 画面の中から、操作したい要素を全部探してくる

// すべての <details> 要素を探す（全カードの開閉ボタン）
const allDetails = document.querySelectorAll('.p-career details');

// すべてのカード（タイトル＋本文が入る箱）を探す
const allItems = document.querySelectorAll('.p-career__item');

// すべての年ラベル（2021.01 とか 04 とか）を探す
const allYears = document.querySelectorAll('.p-career__year');


// ===== 元の位置を覚えるパート =====
const originalGridRows = new Map();

[...allItems, ...allYears].forEach((el) => {
    const row = getComputedStyle(el).gridRow;
    originalGridRows.set(el, row);
});


// ===== 計算用の数値 CSSを変更したらここも買える =====
const ROW_HEIGHT = 24;


// ===== 開閉時の処理を仕込むパート =====
allDetails.forEach((details) => {
    details.addEventListener('toggle', () => {
        recalculate();
    });
});


// ===== 再計算 =====
function recalculate() {
    // 1：全要素を一旦元の位置に戻す
    [...allItems, ...allYears].forEach((el) => {
        el.style.gridRow = originalGridRows.get(el);
    });
    
    // 2：今開いてる <details> を全部探す
    const openedDetails = [...allDetails].filter((d) => d.open);
    
    // 3：開いてる <details> を、行の上から順に並べる
    openedDetails.sort((a, b) => {
        const itemA = a.closest('.p-career__item');
        const itemB = b.closest('.p-career__item');
        const rowA = parseInt(getComputedStyle(itemA).gridRowStart, 10);
        const rowB = parseInt(getComputedStyle(itemB).gridRowStart, 10);
        return rowA - rowB;
    });
    
    // 4：各 <details> について押し下げ判定して、必要なら下を動かす
    openedDetails.forEach((details) => {
        const openedItem = details.closest('.p-career__item');
        const openedRow = parseInt(getComputedStyle(openedItem).gridRowStart, 10);
        
        // 下にある最も近い Item を探す（Year は無視）
        let nextRow = Infinity;
        allItems.forEach((el) => {
            if (el === openedItem) return;
            const currentRow = parseInt(getComputedStyle(el).gridRowStart, 10);
            if (currentRow > openedRow && currentRow < nextRow) {
                nextRow = currentRow;
            }
        });
        
        const availableHeight = (nextRow - openedRow) * ROW_HEIGHT;
        const itemActualHeight = openedItem.scrollHeight;
        
        // 余裕内なら何もしない
        if (itemActualHeight <= availableHeight) {
            return;
        }
        
        // 余裕を超えた分だけ押し下げ
        const overflow = itemActualHeight - availableHeight;
        const extraRows = Math.ceil(overflow / ROW_HEIGHT);
        
        // ↓↓↓ ここから下が、貼ってくれたコードでは切れてた部分 ↓↓↓
        [...allItems, ...allYears].forEach((el) => {
            if (el === openedItem) return;
            const currentRow = parseInt(getComputedStyle(el).gridRowStart, 10);
            if (currentRow > openedRow) {
                el.style.gridRow = currentRow + extraRows;
            }
        });
    });
}