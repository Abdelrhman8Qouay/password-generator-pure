

// ==================== Classes Used ====================

class PassClass {

    /*
        pass_arr >> array {containing all checked passes} as object for
        each pass [{icon: <htmlEle>, status: <string?not secure>, secure_points: <number>, len: <number>, pass: <string>}];
        maximum passes is 5;
        array with queue structure;
        secure_points: maximum points is 8 as [5 for the types of chars | 3 for the length of pass];
        len: maximum length is 60 char;
        status: 4 of status available [not password: 0-3, not secure: 4, okay work: 5-6, secure: 7-8];
        icon: for each status make an icon;
    */
    static pass_arr = [];
    static password_length = 7; // 7: max len accepts at begin

    constructor(password, password_arr) {
        this.pass = password;
        this.pass_arr = password_arr;
    }

    // -------------------- given methods --------------------
    change_pass(password) {this.pass = password}

    // -------------------- Operations Used --------------------
    ranging_pass() {
        password_length = rangePass.value;
        rangeSpan.textContent= password_length;
        pass.setAttribute("maxlength", password_length);
        pass.value = pass.value.substring(0, password_length);
    }

    random_num(len= 10) {return Math.floor(Math.random() * len);}

    // Generate and Shuffle Function v1.4 {use algorithm similar to the Fisher-Yates shuffle}
    // str >> string text to shuffle it | reqLen >> required length should generate on it | ... >> check the options one by one when generate
    static generate_shuffle(reqLen, checkSmall= true, checkCap= true, checkSpace= true, checkDigits= true, checkSymbols= true, checkRep=true) {
        if(!reqLen) return reqLen;

        let str = '', form= '';

        // get all accepted chars before generate
        if(checkSmall) form+= Schars;
        if(checkCap) form+= Cchars;
        if(checkSpace) form+= ' ';
        if(checkDigits) form+= nums;
        if(checkSymbols) form+= SymbolsChars;
        if(!form) return '';

        // generate new pass
        let random_len = random_num(reqLen) + 7 // random number from [7] to [required length]
        if(checkRep) { // if accepted to repeat the char (so make the current case)
            for(let i=0; i< random_len; i++) {
                str+= form[random_num(form.length)];
            }
        } else { // else (do not repeat the char in the text)
            for(let i=0; i< random_len; i++) {
                let newChar = form[random_num(form.length)];
                str+= newChar;
                form.replace(newChar,'');
            }
        }

        // shuffle it
        let res= str.split('');
        for(let i= 0; i < str.length; i++) {
            // get a random number to shuffle it | contains the old character before anything
            let randToShuffle = random_num(str.length),
            oldChar = res[i];

            // change the current char =to= random char
            res[i] = res[randToShuffle];

            // then make the random index[char] = the old char {that was the current}
            res[randToShuffle] = oldChar;

        }
        return res.join('');
    }


    // -------------------- checker methods --------------------
    get_points() {
    }

    get_status() {}
    get_icon() {}

    make_status() {}

    // final to call it and get returned
    make_checked_obj() {}
}

// ==================== Declare All Variables ====================
const generate_box = document.querySelector('.box.gener'),
tester_box = document.querySelector('.box.tester_box'),

pass = document.getElementsByName('password')[0],
rangePass = document.getElementsByName('rangePass')[0],
rangeSpan = document.getElementById('numpass'),

strongCheck = document.getElementById('strong'),
symbolsCheck = document.getElementById('symbols_check'),
smallCheck = document.getElementById('sm_chars'),
capitalCheck = document.getElementById('cap_chars'),
digitsCheck = document.getElementById('digits_check'),
spaceCheck = document.getElementById('space_char'),
repCheck = document.getElementById('repeated'),

checkBtn = document.getElementById('check_btn'),
backBtn = document.getElementById('back_btn'),

modeBtns = document.querySelectorAll('main .mode');



// ==================== Static Used ====================
const Schars = 'qwertyuiopasdfghjklzxcvbnm',
Cchars = 'QWERTYUIOPASDFGHJKLZXCVBNM',
nums = '0123456789',
SymbolsChars = `~!@#$%^&*_+-=?/\/`;

const pass_app = new PassClass();

// ==================== Operations Used ====================
// control the range of (password length)
rangePass.onchange = ()=> pass_app.ranging_pass();

// when make strong check is (make it strong) method
strongCheck.onchange = ()=> {
    if(strongCheck.checked) {
        symbolsCheck.checked= true;smallCheck.checked = true; capitalCheck.checked= true; digitsCheck.checked= true;spaceCheck.checked= false;
    }else {
        symbolsCheck.checked= false;smallCheck.checked = true; capitalCheck.checked= false; digitsCheck.checked= true;spaceCheck.checked= false;
    }
    re_generate();
}

// to navigate between the boxes [generate box | tester box]
checkBtn.onclick = () => {
    if(!pass.value) return;
    generate_box.classList.add('hide');tester_box.classList.remove('hide');
}
backBtn.onclick = () => {generate_box.classList.remove('hide');tester_box.classList.add('hide');}

// change color mode of the page [with (nightMode) class]
modeBtns.forEach(btn=> {
    btn.onclick = ()=> {
        if(document.body.classList.contains('nightMode')) {
            document.body.classList.remove('nightMode');
            btn.innerHTML = `<ion-icon name="sunny-outline"></ion-icon>`;
            btn.classList.add('right'); btn.classList.remove('left');
        }else {
            document.body.classList.add('nightMode');
            btn.innerHTML = `<ion-icon name="moon-outline"></ion-icon>`;
            btn.classList.remove('right'); btn.classList.add('left');
        }
    }
})


// ==================== All Functions Used ====================
function hide_show_pass() {pass.type == 'text' ? pass.type = 'password' : pass.type = 'text';}

function random_num(len= 10) {return Math.floor(Math.random() * len);}

function copy_pass() {
    pass.select();
    if (!navigator.clipboard){
        document.execCommand("copy");
    } else{
        navigator.clipboard.writeText(pass.value).then(
            function(){
                alert("password copied"); // success
            })
          .catch(
             function() {
                alert("err copying"); // error
          });
    }
}

function re_generate () {pass.value = PassClass.generate_shuffle(PassClass.password_length, smallCheck.checked, capitalCheck.checked, spaceCheck.checked, digitsCheck.checked, symbolsCheck.checked, repCheck.checked);}



// Check Password Function v1.1
// function check_password() {
//     if() return;
// }