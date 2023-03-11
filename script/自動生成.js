class Con {
    constructor(ch, bui, shu, yuu) {
        this.ch = ch;
        this.bui = ["両唇", "唇歯", "歯茎", "後部歯茎", "歯茎硬口蓋", "硬口蓋", "軟口蓋", "声門"].includes(bui) ? bui : null;
        this.shu = ["鼻", "破裂", "はじき", "摩擦", "接近", "側面接近"].includes(shu) ? shu : null;
        this.yuu = yuu;
        this._shuon = false;
    }

    set shuon(shuon) {
        this._shuon = shuon;
    }

    get igil() {
        let returnee = this.ch;
        if (this._shuon) returnee += "'";
        return returnee;
    }

    copy() {
        return new Con(this.ch, this.bui, this.shu, this.yuu);
    } /*ディープコピー*/
}

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
];

const q = [
    new Con("'", "軟口蓋", "破裂", false), /* 今回使わない */
];

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

    print(){
        console.log( this.kakus.join(" ") );
        console.log( this.cvcvs.join(" ") );
    }
}

/*べんりだよ*/
/*重み付き乱択*/

class Array_Omomi{
    constructor( ar ){
        this.ar = ar;
        this._omomi = new Map();
    }
    get length(){
        return this.ar.length;
    }

    omomi( key, omomi ){
        if( this.length === omomi.length ){
            this._omomi.set( key, new Omomi( omomi ) );
            return this; /*チェーンできる*/
        }else{
            return null;
        }
    }
    random(key){
        const {av, index, threshold} = this._omomi.has( key ) ? this._omomi.get(key).box : {
            av : 1,
            index : [],
            threshold : [ ...new Array( this.length ) ].fill( 1 )
        } ;
        
        const _r_ = Math.floor( Math.random() * this.length );
        return this.ar[
            threshold[ _r_ ] > Math.random() * av ? _r_ : index[ _r_ ]
        ];
    }
}

class Omomi{
    constructor( ratio ){
        this.ratio = ratio; /* [1,2]とか */
    }
    get length(){
        return this.ratio.length;
    }
    get box(){
        this._box ??= ((omomi)=>{

            const av = omomi.ratio.reduce( (a,b)=> a+b ) / omomi.length;

            const fyne = [];
            const w = [];

            for( let i = 0; i < omomi.length; i++ ){
                if( omomi.ratio[i] <= av ){
                    fyne.push(i);
                }else{
                    w.push(i);
                }
            }
            
            const index = [];
            const threshold = [...omomi.ratio];
            
            while( fyne.length !== 0 && w.length !== 0 ){
                const _fyne = fyne.pop();
                const _w = w.pop();
                index[ _fyne ] = _w;
                threshold[ _w ] -= av - threshold[ _fyne ];
                if( threshold[ _w ] <= av ){
                    fyne.push( _w );
                }else{
                    w.push( _w );
                }
            }

            return {av, index, threshold};

        })(this);
        return this._box;
    }
}

const rantaku = {
    haku : new Array_Omomi( [...Array(6)].map((_, i) => i+1) ).omomi( "normal", [0.03, 0.21, 0.51, 0.24, 0.005, 0.005] ),
    cvcv : new Array_Omomi(["C","CV","V"]).omomi( "normal", [ 0.15, 0.50, 0.35] ),
    c    : new Array_Omomi( c ),
    v    : new Array_Omomi( v ),
    bion : new Array_Omomi( bion )
};
Object.freeze(rantaku);

/*重み付き乱択おわり*/

/*作る関数*/
const ptyol = () => {


    /*出力先*/
    const theji = new Theji();


    /*拍数決め*/
    const haku = rantaku.haku.random("normal");
    
    const all_open = Math.random() < 0.3;


    /*それぞれの拍にて*/

    let _flag = {
        /*一個前の情報読み取り専用*/
        kaku: "",   /* bya */
        cvcv: null,  /* "CV" */
        iqo: null,   /* /a/ */
        lo: false,
        cc: false,
        shuon: false
    };

    /* cvcv
        0: C
        1: CV
        2: V
        3: Q
        4: R (上昇母音)
    */

    for( let i = 0; i < haku; i++ ){

        const flag = {
            /*今の情報書き取り専用*/
            kaku: "",   /* "bya" */
            cvcv: null,  /* "CV" */
            iqo: null,    /* /a/ */
            lo: false,
            cc: false,
            shuon: false
        };

        /*拍の種類決め*/
        if( haku === 1 ){
            flag.cvcv = "CV"; /*一拍Vの単語作ってもしょうがないので*/
        }else if( all_open ){
            if( Math.random() < 0.1 ){
                flag.cvcv = "V";
            }else{
                flag.cvcv = "CV";
            }
        }else{
            flag.cvcv = rantaku.cvcv.random( "normal" );

            if( (_flag.cvcv === "C" && flag.cvcv === "V") || ( flag.cc && flag.cvcv === "C" && Math.random() < 0.8 ) ){
                flag.cvcv = "CV";
                flag.cc = false;
            }
        }

        if( _flag.cvcv === "C" && flag.cvcv === "C" ){
            flag.cc = true;
        }

        
        /* 音決め */

        let _t_;

        /*子音決定*/
        if( flag.cvcv.includes("C") ){

            do{
                _t_ = rantaku.c.random().copy();
            } while ( i !== 0 && ( ["sc", "cs", "gz", "zg", "gs", "gz", "cj", "jc"].includes( _flag.iqo.igil + _t_.igil ) ) )

            /*促音*/
            if( i !== 0 && flag.cvcv === "CV" && _flag.cvcv.includes("V") && i != haku-1 && Math.random() < 0.3 ){
                theji.kakus.push( _t_.igil );
                theji.cvcvs.push( "Q" );
                i++;
            }

            flag.kaku += _t_.igil;

        }

        /*母音決定*/
        if( flag.cvcv.includes("V") ){
            if( i === 0 && Math.random() < 0.06 && ( flag.cvcv === "CV" && !bion.includes( _t_ ) ) ){
                /*音節主音*/
                _t_ = rantaku.bion.random();
                _t_.shuon = true;
                flag.shuon = true;
            }else{
                /*母音*/

                do{
                    _t_ = rantaku.v.random();
                } while ( i !== 0 && /*二重連続母音は事前に回避*/ _flag.iqo === _t_ )
                
                /*二重連続母音*/
                if( i !== 0 && i !== haku-1 && Math.random() < 0.14 ){
                    /*今*/
                    flag.kaku += _t_.igil;
                    theji.kakus.push( flag.kaku );
                    theji.cvcvs.push( flag.cvcv );

                    i++;

                    /*上昇部に進む*/
                    flag.kaku = "";
                    flag.cvcv = "R";
                }
            }
            flag.kaku += (_t_.igil);
        }

        /*たまに問答無用で繰り返すとこ*/
        if( i !== haku-1 && flag.cvcv === "CV" && !_flag.lo && Math.random() < 0.2 && !flag.shuon ){
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
        Object.freeze( _flag ); /*安全*/

    }

    return theji;

};


/*おまけ*/
/* コンソールに o 個の単語を出力 */
const nhol = (o) => { for (i = 0; i < o; i++){const oo = ptyol();console.log(oo.igil);} };

/* bodyタグに o 個の単語の文字列を段落で出力 */
const hutstakl = (o) => {
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