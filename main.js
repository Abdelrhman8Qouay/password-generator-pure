

// ==================== Declare All Variables ====================
const pass = document.getElementsByName('password')[0],
rangePass = document.getElementsByName('rangePass')[0],
rangeSpan = document.getElementById('numpass'),

strongCheck = document.getElementById('strong'),
SPcharCheck = document.getElementById('sp_chars'),
ScharCheck = document.getElementById('sm_chars'),
CcharCheck = document.getElementById('cap_chars'),
numbersCheck = document.getElementById('numbers'),
SPACEcharCheck = document.getElementById('space_char');


const Schars = 'qwertyuiopasdfghjklzxcvbnm',
Cchars = 'QWERTYUIOPASDFGHJKLZXCVBNM',
nums = '0123456789',
SPchars = `~!@#$%^&*_+-=?/\/`,
spaceChar = ' ';

// ==================== Operations Used ====================
rangePass.onchange = ()=> {
    rangeSpan.textContent= rangePass.value;
    pass.setAttribute("maxlength", rangePass.value);
    pass.value = pass.value.substring(0, rangePass.value);
    console.log(pass.value.length);
}

strongCheck.onchange = ()=> {
    if(strongCheck.checked) {
        SPcharCheck.checked= true;ScharCheck.checked = true; CcharCheck.checked= true; numbersCheck.checked= true;SPACEcharCheck.checked= false;
    }else {
        SPcharCheck.checked= false;ScharCheck.checked = true; CcharCheck.checked= false; numbersCheck.checked= true;SPACEcharCheck.checked= false;
    }
}

// ==================== All Functions Used ====================
function hideShowPass() {
    pass.type == 'text' ? pass.type = 'password' : pass.type = 'text';
}

function copyPass() {
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

function reGenerate() {
    console.log('re generate')
    var text = generate_shuffle(pass.value);
    pass.value = text;
}

// Generate and Shuffle Function v1.1 {use algorithm similar to the Fisher-Yates shuffle}
// str >> string text to shuffle it | reqLen >> required length should generate on it | ... >> check the options one by one when generate
function generate_shuffle(str, reqLen, checkSmall = true, checkCap = true, checkNums = true, checkSP = true) {
    // if(!str || !reqLen) return reqLen;
    let res= str.split('');
    for(let i= 0; i < str.length; i++) {
        // get a random number to shuffle it | contains the old character before anything
        let randToShuffle = Math.floor(Math.random() * str.length),
        oldChar = res[i];

        // change the current char =to= random char
        res[i] = res[randToShuffle];

        // then make the random index[char] = the old char {that was the current}
        res[randToShuffle] = oldChar;

    }
    return res.join('');
}