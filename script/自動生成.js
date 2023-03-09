class Con {
    constructor(ch, bui, shu, yuu) {
        this.ch = ch;
        this.bui = ["両唇", "唇歯", "歯茎", "後部歯茎", "歯茎硬口蓋", "硬口蓋", "軟口蓋", "声門"].includes(bui) ? bui : null;
        this.shu = ["鼻", "破裂", "はじき", "摩擦", "接近", "側面接近"].includes(shu) ? shu : null;
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

    get igil() {
        let returnee = this.ch;
        this._semvo.forEach(e => {
            returnee += e.igil;
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
        this.semi = ["硬口蓋化", "唇音化"].includes(semi) ? semi : null;
    }
    get igil() {
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
        this.tate = ["狭", "中央", "広"].includes(tate) ? tate : null;
        this.yoko = ["前舌", "後舌"].includes(yoko) ? yoko : null;
    }
    get igil() {
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

class Theji{
    constructor( kakus, cvcvs ){
        this.kakus = Array.isArray( kakus ) ? kakus : [] ;
        this.cvcvs = Array.isArray( cvcvs ) ? cvcvs : [] ;
    }

    get igil(){
        return this.kakus.join("");
    }
}

ptyol = () => {

    let _r_; /*ランダム入れ場*/

    /*出力先*/
    const theji = new Theji();


    /*拍数決め*/    
    let haku = 1;
    const haku_p = [0.03, 0.24, 0.75, 0.99, 0.995, 1.00];
    _r_ = Math.random();
    while (_r_ > haku_p[haku - 1]) {
        haku++;
    }
    
    const all_open = Math.random() < 0.3;


    /*それぞれの拍にて*/

    let _flag = {
        /*一個前の情報読み取り専用*/
        kaku: "",   // bya
        cvcv: NaN,  // 1
        iqo: null,    // /a/
        lo: false,
        cc: false,
        shuon: false
    };
    Object.freeze( _flag );

    /* cvcv
        0: C
        1: CV
        2: V
        3: Q
        4: JV (上昇母音)
    */

    for( let i = 0; i < haku; i++ ){

        const flag = {
            /*今の情報書き取り専用*/
            kaku: "",   // "bya"
            cvcv: NaN,  // 1
            iqo: null,    // /a/
            lo: false,
            cc: false,
            shuon: false
        };

        let kaku_p = [ 0.15, 0.65, 1.00 ];

        if( haku === 1 ){
            flag.cvcv = 1;
        }else if( all_open ){
            if( Math.random() < 0.1 ){
                flag.cvcv = 2;
            }else{
                flag.cvcv = 1;
            }
        }else{
            _r_ = Math.random();
            flag.cvcv = 0;
            while( _r_ > kaku_p[ flag.cvcv ] ){
                flag.cvcv++;
            }
            if( (_flag.cvcv === 0 && flag.cvcv === 2) || ( flag.cc && flag.cvcv === 0 && Math.random() < 0.8 ) ){
                flag.cvcv = 1;
                flag.cc = false;
            }
        }

        if( _flag.cvcv === 0 && flag.cvcv === 0 ){
            flag.cc = true;
        }

        
        /* 音決め */

        let _t_;

        if( flag.cvcv < 2 ){

            /*子音決定*/
            do{
                _t_ = c[ Math.floor( Math.random() * c.length ) ].copy();
            } while ( i !== 0 && _flag.cvcv === 0 && ( _t_.shu === "接近" || ["sc", "cs", "sh", "gz", "zg", "gs", "gz", "cj", "jc"].includes( _flag.iqo.igil + _t_.igil ) || _flag.iqo.bui === _t_.bui ) )

            /*促音*/
            if( flag.cvcv === 1 && (_flag.cvcv === 1 || _flag.cvcv === 2) && haku !== 1 && i !== 1 && i != haku-1 && ["r","h"].includes( _t_.igil ) && Math.random() < 0.5 ){
                theji.kakus.push( _t_.igil );
                theji.cvcvs.push( 3 );
                i++;
            }

            /*半母音*/
            if( Math.random() < 0.15 ){
                let _g_;
                do{
                    _g_ = g[Math.floor(Math.random() * g.length)];
                } while ( ["j","g"].includes( _t_.ch ) && _g_.ch === "y" )
                _t_.semvo = _g_;
            }

            flag.kaku += _t_.igil;

        }

        /*母音*/
        if( flag.cvcv !== 0 ){
            if( i === 0 && Math.random() < 0.03 ){
                /*音節主音*/
                _t_ = bion[Math.floor(Math.random() * bion.length)].copy();
                _t_.shuon = true;
                flag.shuon = true;
            }else{
                /*母音*/

                do{
                    _t_ = v[Math.floor(Math.random() * v.length)];
                } while ( i !== 0 && /*二重母音は回避*/ _flag.iqo === _t_ )
                
                /*二重母音*/
                if( i !== 0 && i !== haku-1 && Math.random() < 0.14 && ( _flag.cvcv !== 4 || (flag.cvcv !== 1 && flag.cvcv !== 2) ) ){
                    /*今*/
                    theji.kakus.push( _t_.igil );
                    theji.cvcvs.push( flag.cvcv );

                    i++;

                    /*上昇部に進む*/
                    theji.cvcvs.push( 4 );
                    flag.cvcv = 4;
                }
            }
            flag.kaku += (_t_.igil)
        }

        /*たまに問答無用で繰り返すとこ*/
        if( i !== haku-1 && flag.cvcv === 1 && !_flag.lo && Math.random() < 0.2 && !flag.shuon ){
            flag.lo = true;
            theji.kakus.push( flag.kaku );
            theji.cvcvs.push( flag.cvcv );
        }else{
            flag.lo = false;
        }

        flag.iqo = _t_;

        /*出力書き込み*/
        theji.kakus.push( flag.kaku );
        theji.cvcvs.push( flag.cvcv );

        /*次の拍へ*/
        _flag = Object.assign(flag);
        Object.freeze( _flag );

    }

    return theji;

}

/* コンソールに o 個の単語を出力 */
nhol = (o) => { for (i = 0; i < o; i++){const oo = ptyol();console.log(oo.igil);} };

/* bodyタグに o 個の単語の文字列を段落で出力 */
hutstakl = (o) => {
    const sji = document.createElement("style");
    sji.innerText = "p{margin:0.5rem 1rem;font-size:2em;}";
    document.head.appendChild(sji);
    document.body.innerHTML = "";
    for (i = 0; i < o; i++) {
        const q = document.createElement("p");
        q.innerText = ptyol().igil;
        document.body.appendChild(q)
    }
};