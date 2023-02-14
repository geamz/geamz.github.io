window.addEventListener("load", () => {

    const audio_stocks = [
        {
            "title": "Beep",
            "uri": "audio/beep.wav",
            "start": 0.01,
            "f": {
                "intro": "Windows Boot Manager has experienced a problem.",
                "status": "0xc000000f",
                "info": "An error occurred transferring exectuion.",
                "ato_eto": "You can try to recover the system with the Microsoft Windows System Recovery Tools. (You might need to restart the system manually.)",
                "ato_qamw": "If the problem continues, please contact your system administrator or computer manufacturer."
            }
        },
        {
            "title": "Yaju Sempai",
            "uri": "audio/yaju_sempai.mp3",
            "start": 0.43,
            "f": {
                "intro": "Windows Boot Manager has experienced a problem.",
                "status": "0xc114514f",
                "info": "There's no inari. What are you going to do for this?",
                "ato_eto": "You can try to recover the system with the Microsoft Windows System Recovery Tools. (You might need to restart the system manually.)",
                "ato_qamw": "If the problem continues, please contact your system administrator or computer manufacturer."
            }
        },
        {
            "title": "Charge-Man Ken",
            "uri": "audio/charge-man_ken.m4a",
            "start": 4.23,
            "f": {
                "intro": "Windows Boot Manager has experienced a problem.",
                "status": "No.12",
                "info": "A Bomb is in his head!",
                "ato_eto": "You can try to recover the system with the Microsoft Windows System Recovery Tools. (You might need to restart the system manually.)",
                "ato_qamw": "Forgive me, Dr.Volga."
            }
        },
        {
            "title": "Nonomura",
            "uri": "audio/nonomura.m4a",
            "start": 4.00,
            "f": {
                "intro": "Windows Boot Manager has experienced a problem.",
                "status": "0xc000000f",
                "info": "Senator Nonomura embezzled public funds.",
                "ato_eto": "ｺﾉｾｶｲｦ! ｶｴﾀｲ! ｿﾉ ｲｯｼﾝﾃﾞ! ﾔ゛ｯﾄﾞｷﾞｲﾝﾆ˝ﾅ˝ｯﾀﾞﾝ˝ﾃﾞｽ!!",
                "ato_qamw": "ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝ｱ˝!"
            }
        },
        /*{
            "title": "Pugya",
            "uri": "audio/pugya.mp3",
            "start": 0.23,
            "f": {
                "intro": "m9(^Д^)ﾌﾟｷﾞｬｰ m9(^w^)ﾌﾟｷﾞｬｰ m9(^..^)ﾌﾟｷﾞｬｰ m9(^∀^)ﾌﾟｷﾞｬｰ m9(^q^)ﾌﾟｷﾞｬｰ",
                "status": "0xc000000f",
                "info": " m9(͜͜͏̘̣͔͙͎͎̘̜̫̗͍͚͓͜͜͏̘̣͔͙͎͎^͜͜͏̘̣͔͙͎͎Д̟̤̖̗͖͇̍͋̀͆̓́͞͡^̜ͪ̅̍̅͂͊)ﾌﾟｷﾞｬｰｰｰｰwwwwww",
                "ato_eto": "(´･w･`)",
                "ato_qamw": ""
            }
        },*/
        {
            "title": "Dededon",
            "uri": "audio/dededon.webm",
            "start": 0.23,
            "f": {
                "intro": "Windows Boot Manager has experienced a problem.",
                "status": "0xc000000f",
                "info": "Dededon!",
                "ato_eto": "You can try to recover the system with the Microsoft Windows System Recovery Tools. (You might need to restart the system manually.)",
                "ato_qamw": "If the problem continues, please contact your system administrator or computer manufacturer."
            }
        }
    ];

    let current = 0;
    let kote = current;

    function __init__() {
        for (let key of Object.keys(audio_stocks[current].f)) {
            document.getElementById(`f_${key}`).innerText = audio_stocks[current].f[key];
        }
    }
    __init__();


    for (let i = 0; i < audio_stocks.length; i++) {
        const li = document.createElement("li");
        li.innerText = audio_stocks[i].title;
        if (i === current) li.classList.add("selected");
        voice.appendChild(li);
    }

    navib.innerText = "SPACE=Continue";



    const command_keys = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "a", "b"];
    function* order(arr) {
        const tail = arr.pop();
        yield* arr;
        return tail;
    }

    let ite = order(command_keys.concat());

    let flag_command = false;


    window.addEventListener("keydown", (e) => {
        if (flag_command) {
            switch (e.code) {
                case "ArrowUp":
                    if (current !== 0) {
                        voice.children[current].classList.remove("selected");
                        voice.children[--current].classList.add("selected");
                    }
                    break;

                case "ArrowDown":
                    if (current !== audio_stocks.length - 1) {
                        voice.children[current].classList.remove("selected");
                        voice.children[++current].classList.add("selected");
                    }
                    break;

                case "Escape":
                    navib.innerText = "SPACE=Continue";
                    command.classList.add("unvis");
                    visual.classList.remove("unvis");
                    voice.children[current].classList.remove("selected");
                    voice.children[kote].classList.add("selected");
                    current = kote;
                    flag_command = false;
                    break;

                case "Enter":
                    __init__();
                    navib.innerText = "SPACE=Continue";
                    command.classList.add("unvis");
                    visual.classList.remove("unvis");
                    kote = current;
                    flag_command = false;
                    break;

                default:
                    void (0);
            }
        } else {

            const next = ite.next();

            if (next.value === e.key) {
                if (next.done) {
                    command.classList.remove("unvis");
                    visual.classList.add("unvis");
                    navib.innerText = "AllowUp/Down=Move, Enter=Select, Esc=Ignore";
                    flag_command = true;
                    ite = order(command_keys.concat());
                }
            } else {
                ite = order(command_keys.concat());
                if (e.key === command_keys[0]) {
                    ite.next();
                }
            }

        }

        const audio = new Audio(audio_stocks[current].uri);
        audio.currentTime = audio_stocks[current].start;
        audio.play();

    });




});
