

// ==================== Classes Used ====================

class PassClass {

    /*
        arr_pass_checked >> array {containing all checked passes} as object {that has the information about this password} for
        each pass [{status: <htmlEle+string?not secure>, secure_points: <number>, len: <number>, pass: <string>}];
        maximum passes is 5;
        array with queue structure;
        secure_points: maximum points is 8 as [5 for the types of chars | 3 for the length of pass];
        len: maximum length is 60 char;
        status: for each status make an icon; 4 of status available [not password: 0-3, not secure: 4, okay work: 5-6, secure: 7-8];
    */
    static arr_pass_checked = []; // ^
    static password_length = 7; // 7: max len accepts at begin
    static static_secure_points= 8;

    constructor(default_password_length) {
        this.password_length = default_password_length;
    }

    // -------------------- given methods --------------------
    static change_pass_length(default_password_length= 7) {this.password_length = default_password_length}

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
        let random_len = random_num(reqLen) + (this.password_length - 3) // random number from [len_limit - 3] to [required length]
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
    static get_points() {
        let points= 0;
        // check the points of types char
        if(/[a-z]/.test(pass.value)) points++; // small
        if(/[A-Z]/.test(pass.value)) points++; // capital
        if(/[0-9]/.test(pass.value)) points++; // digits
        if(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass.value)) points++; // symbols
        if(/\s/.test(pass.value)) points++; // space

        // check length of the pass
        let len = pass.value.length;
        if( len >= 0 && len <= 3) points+= 0;
        else if( len >= 4 && len <= 8) points+= 1;
        else if( len >= 9 && len <= 16) points+= 2;
        else if( len >= 17 ) points+= 3;

        return points;
    }
    static get_status(points) {
        let res= '';
        if( points >= 0 && points <= 3 ) res= '<ion-icon name="bug-outline"></ion-icon> Not Pass';
        else if( points == 4 ) res= '<ion-icon name="alert-circle-outline"></ion-icon> Not Secure';
        else if( points == 5 || points == 6 ) res= '<ion-icon name="lock-closed-outline"></ion-icon> Okay, work';
        else if( points >= 7 && points <= 8 ) res= '<ion-icon name="finger-print-outline"></ion-icon> Secure';

        return res;
    }

    // final to call it and get changed the [arr_pass_checked]
    static make_checked_obj() {
        // will make the array as queue structure, has 5 items only
        let points = this.get_points(), newObj = {};

        // fill the new object
        newObj.secure_points = points;
        newObj.status = this.get_status(points);
        newObj.len = pass.value.length;
        newObj.pass = pass.value;

        // push it to the arr
        PassClass.arr_pass_checked.unshift(newObj);

        // check the arr to make it max 5 items
        if(PassClass.arr_pass_checked.length > 5) PassClass.arr_pass_checked.pop();
    }
}

class PassUI {
    static update_table(arr_pass_checked) {
        let res= '';

        for(let i=0; i < arr_pass_checked.length; i++) {
            res+= `<tr>
                        <td>${arr_pass_checked[i].status}</td>
                        <td><span>${arr_pass_checked[i].secure_points}/${PassClass.static_secure_points}</span></td>
                        <td><span>${arr_pass_checked[i].len}</span></td>
                        <td><input type="text" value="${arr_pass_checked[i].pass}" class="pass_review" data-item="${i}" readonly></td>
                        <td>
                            <div class="pop">
                                <button title="copy" class="copy_review" data-item="${i}"><ion-icon name="copy-outline"></ion-icon></button>
                                <span class="pop_text">copied</span>
                            </div>
                            <button title="hide/show password" class="hideShow_review" data-item="${i}"><ion-icon name="eye-outline"></ion-icon></button>
                        </td>
                    </tr>`;
        }
        table_tbody.innerHTML = res;
    }

    static ranging_pass() {
        PassClass.password_length = rangePass.value;
        rangeSpan.textContent= PassClass.password_length;
        pass.setAttribute("maxlength", PassClass.password_length);
        pass.value = pass.value.substring(0, PassClass.password_length);
    }

    static strong_checker() {
        if(strongCheck.checked) {
            symbolsCheck.checked= true;smallCheck.checked = true; capitalCheck.checked= true; digitsCheck.checked= true;spaceCheck.checked= false;
        }else {
            symbolsCheck.checked= false;smallCheck.checked = true; capitalCheck.checked= false; digitsCheck.checked= true;spaceCheck.checked= false;
        }
        re_generate();
    }

    static click_check() {
        if(!pass.value) return;

        // make checked passes
        PassClass.make_checked_obj();

        // make ui process
        PassUI.update_table(PassClass.arr_pass_checked);

        generate_box.classList.add('hide');tester_box.classList.remove('hide');

        // activate the methods of buttons when update
        let passReviews = document.querySelectorAll('main .tester_box table tbody .pass_review'),
        hideShowBtns = document.querySelectorAll('main .tester_box table tbody .hideShow_review');
        hideShowBtns.forEach((btn, i)=> btn.onclick = ()=> hide_show_pass(passReviews[i]))

        let copyBtns = document.querySelectorAll('main .tester_box table tbody .copy_review');
        copyBtns.forEach(btn=> btn.onclick = ()=> copy_pass(btn.parentElement))
    }
}

// ==================== Declare All Variables ====================
const generate_box = document.querySelector('.box.gener'),
tester_box = document.querySelector('.box.tester_box'),

pass = document.getElementsByName('password')[0],
rangePass = document.getElementsByName('rangePass')[0],
rangeSpan = document.getElementById('numpass'),
hideShowBtn = document.getElementById('hideShowBtn'),
copyBtn = document.getElementById('copyBtn'),

strongCheck = document.getElementById('strong'),
symbolsCheck = document.getElementById('symbols_check'),
smallCheck = document.getElementById('sm_chars'),
capitalCheck = document.getElementById('cap_chars'),
digitsCheck = document.getElementById('digits_check'),
spaceCheck = document.getElementById('space_char'),
repCheck = document.getElementById('repeated'),

checkBtn = document.getElementById('check_btn'),
backBtn = document.getElementById('back_btn'),

modeBtns = document.querySelectorAll('main .mode'),

table_tbody = document.querySelector('main .tester_box table tbody');


// ==================== Static Used ====================
const Schars = 'qwertyuiopasdfghjklzxcvbnm',
Cchars = 'QWERTYUIOPASDFGHJKLZXCVBNM',
nums = '0123456789',
SymbolsChars = `~!@#$%^&*_+-=?/\/`;


// ==================== Operations Used ====================
// control the range of (password length)
rangePass.onchange = ()=> PassUI.ranging_pass();

// when make strong check is (make it strong) method
strongCheck.onchange = ()=> PassUI.strong_checker();

// to navigate between the boxes [generate box | tester box]
checkBtn.onclick = () => PassUI.click_check();
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


hideShowBtn.onclick = () => hide_show_pass(pass);
copyBtn.onclick = () => copy_pass(copyBtn.parentElement);


// ==================== All Functions Used ====================
function hide_show_pass(passEle) {passEle.type == 'text' ? passEle.type = 'password' : passEle.type = 'text';}

function random_num(len= 10) {return Math.floor(Math.random() * len);}

function copy_pass(popEle) {
    pass.select();
    if (!navigator.clipboard){
        document.execCommand("copy");
    } else{
        navigator.clipboard.writeText(pass.value).then(()=>{
                popEle.classList.add('show');
                setTimeout(()=> popEle.classList.remove('show'), 1500);
            }).catch(()=>{console.warn("Error copy method"); });
    }
}

function re_generate () {
    pass.value = PassClass.generate_shuffle(PassClass.password_length, smallCheck.checked, capitalCheck.checked, spaceCheck.checked, digitsCheck.checked, symbolsCheck.checked, repCheck.checked);
}
