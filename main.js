

// ==================== Declare All Variables ====================
const pass = document.getElementsByName('password')[0],
rangePass = document.getElementsByName('rangePass')[0],
rangeSpan = document.getElementById('numpass');


const Schars = 'qwertyuiopasdfghjklzxcvbnm',
Cchars = 'QWERTYUIOPASDFGHJKLZXCVBNM',
nums = '0123456789',
SPchars = `~!@#$%^&*_+-=?/\/`;

// ==================== Operations Used ====================
rangePass.onchange = ()=> {
    rangeSpan.textContent= rangePass.value;
    pass.setAttribute("maxlength", rangePass.value);
    pass.value = pass.value.substring(0, rangePass.value);
    console.log(pass.value.length);
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
    var tex = ``;
    pass.value = tex;
}

// Generate and Shuffle Function v1.1 {use algorithm similar to the Fisher-Yates shuffle}
// str >> string text to shuffle it | reqLen >> required length should generate on it | ... >> check the options one by one when generate
function generate_shuffle(str, reqLen, checkSmall = true, checkCap = true, checkNums = true, checkSP = true) {
    if(!str || !len) return reqLen;
    let res= ``;
    return res;
}