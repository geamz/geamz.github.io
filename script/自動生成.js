class Con {
    constructor(ch, bui, shu, yuu) {
        this.ch = ch;
        this.bui = ["両唇", "唇歯", "歯茎", "後部歯茎", "歯茎硬口蓋", "硬口蓋", "軟口蓋", "声門"].includes(bui) ? bui : undefined;
        this.shu = ["鼻", "破裂", "はじき", "摩擦", "接近", "側面接近"].includes(shu) ? shu : undefined;
        this.yuu = yuu;
        this._semvo = [];
        this._shuon = false;
    }

    set semvo(semvo) {
        if (!this._semvo.includes(semvo)) {
            this._semvo.push(semvo);
        }
    }

    set shuon(shuon) {
        this._shuon = shuon
    }

    get show() {
        let returnee = this.ch;
        this._semvo.forEach(e => {
            returnee += e.show;
        });
        if (this._shuon) returnee += "'";
        return returnee;
    }

    copy() {
        return new Con(this.ch, this.bui, this.shu, this.yuu);
    }
}

const c = [
    new Con("m", "両唇", "鼻", true),
    new Con("n", "歯茎", "鼻", true),
    new Con("p", "両唇", "破裂", false),
    new Con("b", "両唇", "破裂", true),
    new Con("t", "歯茎", "破裂", false),
    new Con("d", "歯茎", "破裂", true),
    new Con("k", "軟口蓋", "破裂", false),
    new Con("g", "軟口蓋", "破裂", true),
    new Con("r", "歯茎", "はじき", true),
    new Con("f", "唇歯", "摩擦", false),
    new Con("v", "唇歯", "摩擦", true),
    new Con("s", "歯茎", "摩擦", false),
    new Con("z", "歯茎", "摩擦", true),
    new Con("c", "後部歯茎", "摩擦", false),
    new Con("g", "後部歯茎", "摩擦", true),
    new Con("j", "歯茎硬口蓋", "摩擦", true),
    new Con("x", "軟口蓋", "摩擦", false),
    new Con("h", "声門", "摩擦", false),
    new Con("y", "硬口蓋", "接近", true),
    new Con("w", "軟口蓋", "接近", true),
    new Con("l", "歯茎", "側面接近", true)
];

const bion = [
    new Con("m", "両唇", "鼻", true),
    new Con("n", "歯茎", "鼻", true),
]

const q = [
    new Con("'", "軟口蓋", "破裂", false), /* 今回使わない */
]

class Semvo {
    constructor(ch, semi) {
        this.ch = ch;
        this.semi = ["硬口蓋化", "唇音化"].includes(semi) ? semi : undefined;
    }
    get show() {
        return this.ch;
    }
}

const g = [
    new Semvo("y", "硬口蓋化"),
    new Semvo("w", "唇音化")
];

class Vowel {
    constructor(ch, tate, yoko) {
        this.ch = ch;
        this.tate = ["狭", "中央", "広"].includes(tate) ? tate : undefined;
        this.yoko = ["前舌", "後舌"].includes(yoko) ? yoko : undefined;
    }
    get show() {
        return this.ch;
    }
}


const v = [
    new Vowel("a", "広", "前舌"),
    new Vowel("i", "狭", "前舌"),
    new Vowel("u", "狭", "後舌"),
    new Vowel("e", "中央", "前舌"),
    new Vowel("o", "中央", "後舌")
];

const __dum__ = new Vowel("", null, null);


ptyol = () => {

    const theji = {
        chs: "",  // "byal"
        kk: [],   // ["CV","C"]
    };


    const flag = {
        _cvcv: NaN,  // 2
        _kaku: "",  // "bya"
        _on: __dum__,    // /a/
        aa: false,
        lo: false
    };

    let _r_;

    /*拍決め*/

    _r_ = Math.random();

    let haku = 1;

    const haku_n = [0.03, 0.24, 0.63, 0.94, 0.98, 0.99, 1.00];
    while (_r_ > haku_n[haku - 1]) {
        haku++;
    }


    /*核決め*/

    /*たまに開音節を保証*/
    const _tci = Math.random() < 0.1

    for (let i = 0; i < haku; i++) {


        let kaku_n = [0.15, 0.5, 1.0];
        if (i == haku - 1) kaku_n[0] = 0.05;

        /*たまに問答無用で繰り返すとこ*/
        if (Math.random() < 0.2 && flag._cvcv === 2 && !flag.lo) {
            flag.lo = true;
            theji.chs += flag._kaku;
            theji.kk.push(theji.kk.at(-1));
            continue;
        }
        flag.lo = false;
        flag._kaku = "";

        /*各核決め*/

        /*ご都合*/
        let j;
        if (haku === 1 || _tci) {
            j = 2;
        } else {
            _r_ = Math.random();
            j = 0;
            while (_r_ > kaku_n[j]) {
                j++
            }
            if (flag._cvcv === 0 && j === 1) {
                j = 2;
            }
        }


        switch (j) {
            case 0:
                theji.kk.push("C");
                break;
            case 1:
                theji.kk.push("V");
                break;
            case 2:
                theji.kk.push("CV");
                break;
            default:
                theji.kk.push("Q");
        }

        let _t_;

        if ([0, 2].includes(j)) {

            do {
                _t_ = c[Math.floor(Math.random() * c.length)].copy();
            } while (flag._cvcv === 0 && (_t_.shu === "接近" || ["sc", "cs", "sh", "gz", "zg", "gs", "gz", "cj", "jc"].includes(flag._on.show + _t_.show) /*妥協*/ || flag._on.bui === _t_.bui))
            /*促音*/
            if (Math.random() < 0.5 && j === 2 && [1, 2].includes(flag._cvcv) && i !== 1 && i != haku - 1) {
                theji.chs += _t_.show;
                theji.kk.push("Q");
                flag._cvcv = 3; /*ごめん*/
                i++;
            }

            if (Math.random() < 0.15) {
                do {
                    _g_ = g[Math.floor(Math.random() * g.length)]
                } while (["j", "g"].includes(_t_.ch) && _g_.show === "y")
                _t_.semvo = _g_;
            }



            flag._kaku = _t_.show;


            if (j == 2) {
                if (i === 0 && Math.random() < 0.03) {
                    _t_ = bion[Math.floor(Math.random() * bion.length)].copy();
                    _t_.shuon = true;
                } else {
                    _t_ = v[Math.floor(Math.random() * v.length)];
                    if (flag._on.show === _t_.show) flag.aa = true;
                }

                flag._kaku += _t_.show;
            }


        } else {

            if (flag.aa) {
                do {
                    _t_ = v[Math.floor(Math.random() * v.length)];
                } while (flag._on.show === _t_.show)
                flag.aa = false;
            } else if (i === 0 && haku !== 1 && Math.random() < 0.14 && v.includes(flag._on)) {
                _t_ = bion[Math.floor(Math.random() * bion.length)].copy();
                _t_.shuon = true;
            } else {
                _t_ = v[Math.floor(Math.random() * v.length)];
                if (flag._on === _t_) flag.aa = true;
            }

            flag._kaku = _t_.show;
        }
        theji.chs += flag._kaku;
        flag._on = _t_;
        flag._cvcv = j;

    }

    return theji;


}

/* コンソールに o 個の単語を出力 */
nhol = (o) => { for (i = 0; i < o; i++)console.log(ptyol()); };

/* bodyタグに o 個の単語の文字列を段落で出力 */
hutstakl = (o) => {
    const sji = document.createElement("style");
    sji.innerText = "p{margin:0.5rem 1rem;font-size:2em;}";
    document.head.appendChild(sji);
    document.body.innerHTML = "";
    for (i = 0; i < o; i++) {
        const q = document.createElement("p");
        q.innerText = ptyol().chs;
        document.body.appendChild(q)
    }
};