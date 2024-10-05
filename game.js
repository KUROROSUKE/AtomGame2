let P1_hand = [] ; let P2_hand = []
const CARD_NUM = 8
let P1_selecting_element = [] ; let P2_selecting_element = []
let P1_selecting_index   = [...Array(CARD_NUM).fill(0)] ; let P2_selecting_index   = [...Array(CARD_NUM).fill(0)]

const elementToNumber = {"H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,"Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 10, "S": 16, "Cl": 17, "Ar": 18, "K": 19, "Ca": 20,"Fe": 26, "Cu": 29, "Zn": 30, "I": 53}
const elements = [...Array(30).fill('H'), ...Array(25).fill('O'), ...Array(20).fill('C'),'He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I']
const element = ['H','O','C','He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I']

let turn = "P1"

let MIN_SIZE = 0; Win_HEIGHT = 0
window.addEventListener("resize", () => { MIN_SIZE,Win_HEIGHT = reportWindowSize() ;document.getElementById("P2_hand").style.marginTop=`${Win_HEIGHT}px`})


function view_P1_hand() {
    const area = document.getElementById("P1_hand")
    P1_hand.forEach((element, index) => {
        const img = document.createElement("img")
        img.src   = `../../image/${elementToNumber[element]}.png`
        img.alt   = element
        img.title = index
        img.style.width  = `${MIN_SIZE * 0.15}px`
        img.style.height = `${MIN_SIZE * 0.15}px`
        img.style.margin = `${MIN_SIZE * 0.03 }px`
        img.style.border = `2px solid #000`
        img.addEventListener("click", function() {
            if (turn=="P1"){
                if (this.classList.contains("selecting")) {
                    this.classList.remove("selecting")
                    this.style.border = `2px solid #000`
                    P1_selecting_element.splice(P1_selecting_element.indexOf(this.alt), 1)
                    P1_selecting_index[this.title] = 0
                } else {
                    this.classList.add("selecting")
                    img.style.border = `2px solid #F00`
                    P1_selecting_element.push(this.alt)
                    P1_selecting_index[this.title] = 1
                }
                console.log(P1_selecting_index)
            }
        })
        area.appendChild(img)
    })
}

function view_P2_hand() {
    const area = document.getElementById("P2_hand")
    P2_hand.forEach((element, index) => {
        const img = document.createElement("img")
        img.src   = `../../image/${elementToNumber[element]}.png`
        img.alt   = element
        img.title = index
        img.style.width  = `${MIN_SIZE * 0.15}px`
        img.style.height = `${MIN_SIZE * 0.15}px`
        img.style.margin = `${MIN_SIZE * 0.03 }px`
        img.style.border = `2px solid #000`
        img.style.transform = `scale(-1,-1)`
        img.addEventListener("click", function() {
            if (turn=="P2") {
                if (this.classList.contains("selecting")) {
                    this.classList.remove("selecting")
                    this.style.border = `2px solid #000`
                    P2_selecting_element.splice(P2_selecting_element.indexOf(this.alt), 1)
                    P2_selecting_index[this.title] = 0
                } else {
                    this.classList.add("selecting")
                    img.style.border = `2px solid #F00`
                    P2_selecting_element.push(this.alt)
                    P2_selecting_index[this.title] = 1
                }
                console.log(P2_selecting_index)
            }
        })
        area.appendChild(img)
    })
}


// 物質を読み込む
async function loadMaterials() {
    const response = await fetch('../compound/standard.json')
    const data = await response.json()
    if (!data.material || !Array.isArray(data.material)) {
        console.error('Loaded data does not contain a valid "material" array:', data)
        return []
    }
    return data.material
}

// 配列を渡し、それで作れる物質を返す
async function search(select_element) {
    select_element = ToObjectLiteral(select_element)
    const materials = await loadMaterials()
    return materials.filter(material => {
        for (const element in components) {
            if (!material.components[element] || material.components[element] !== components[element]) {
                return false
            }
        }
        for (const element in material.components) {
            if (!components[element]) {
                return false
            }
        }
        return true
    })
}

// ウィンドウのサイズを返す
function reportWindowSize() {
    const HEIGHT = window.innerHeight
    const WIDTH  = window.innerWidth
    return HEIGHT > WIDTH ? WIDTH : HEIGHT, HEIGHT
}

// ランダムをカードを返す
function random_card() {
    return elements[Math.floor(Math.random() * elements.length)]
}

// カードの初期化、最初のカード表示、ロードが完了するまで待つ
async function initialize() {
    await waitForLoad()
    
    MIN_SIZE = reportWindowSize()
    P1_hand = [] ; P2_hand = []
    for (let i = 0; i < CARD_NUM; i++) {
        P1_hand.push(random_card())
        P2_hand.push(random_card())
    }
    console.log(P1_hand, P2_hand)

    view_P1_hand()
    view_P2_hand()
}

// ロード完了を待つPromiseを作成
function waitForLoad() {
    return new Promise((resolve) => {
        window.addEventListener("load", resolve)
    })
}

// 配列をオブジェクトリテラルに変換する（各要素の個数を数え、{種類:個数}で記録する）
function ToObjectLiteral(selecting_cards) {
    return selecting_cards.reduce((acc, element) => {
        if ( !acc[element] ) {acc[element] = 1} else { acc[element]++ }
        return acc
    }, {})
}