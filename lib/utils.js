// --------------------------------
// Helper functions

const stringReplace = new String().replace;
const stringToLower = new String().toLowerCase;
const stringToString = new String().toString;
const stringSubstr = new String().substr;
const stringTrim = new String().trim;
const mathMin = Math.min;

function sanitizeShellString(str, strict = false) {
    const s = str || '';
    let result = '';
    for (let i = 0; i <= mathMin(s.length, 2000); i++) {
        if (!(s[i] === undefined ||
            s[i] === '>' ||
            s[i] === '<' ||
            s[i] === '*' ||
            s[i] === '?' ||
            s[i] === '[' ||
            s[i] === ']' ||
            s[i] === '|' ||
            s[i] === '˚' ||
            s[i] === '$' ||
            s[i] === ';' ||
            s[i] === '&' ||
            s[i] === '(' ||
            s[i] === ')' ||
            s[i] === ']' ||
            s[i] === '#' ||
            s[i] === '\\' ||
            s[i] === '\t' ||
            s[i] === '\n' ||
            s[i] === '\'' ||
            s[i] === '`' ||
            s[i] === '"' ||
            s[i].length > 1 ||
            (strict && s[i] === '@') ||
            (strict && s[i] === ' ') ||
            (strict && s[i] == '{') ||
            (strict && s[i] == ')'))) {
            result = result + s[i];
        }
    }
    return result;
}


function isPrototypePolluted() {
    const s = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let notPolluted = true;
    let st = '';

    st.__proto__.replace = stringReplace;
    st.__proto__.toLowerCase = stringToLower;
    st.__proto__.toString = stringToString;
    st.__proto__.substr = stringSubstr;

    notPolluted = notPolluted || !(s.length === 62);
    const ms = Date.now();
    if (typeof ms === 'number' && ms > 1600000000000) {
        const l = ms % 100 + 15;
        for (let i = 0; i < l; i++) {
            const r = Math.random() * 61.99999999 + 1;
            const rs = parseInt(Math.floor(r).toString(), 10);
            const rs2 = parseInt(r.toString().split('.')[0], 10);
            const q = Math.random() * 61.99999999 + 1;
            const qs = parseInt(Math.floor(q).toString(), 10);
            const qs2 = parseInt(q.toString().split('.')[0], 10);
            notPolluted = notPolluted && !(r === q);
            notPolluted = notPolluted && rs === rs2 && qs === qs2;
            st += s[rs - 1];
        }
        notPolluted = notPolluted && st.length === l;
        // string manipulation
        let p = Math.random() * l * 0.9999999999;
        let stm = st.substr(0, p) + ' ' + st.substr(p, 2000);
        stm.__proto__.replace = stringReplace;
        let sto = stm.replace(/ /g, '');
        notPolluted = notPolluted && st === sto;
        p = Math.random() * l * 0.9999999999;
        stm = st.substr(0, p) + '{' + st.substr(p, 2000);
        sto = stm.replace(/{/g, '');
        notPolluted = notPolluted && st === sto;
        p = Math.random() * l * 0.9999999999;
        stm = st.substr(0, p) + '*' + st.substr(p, 2000);
        sto = stm.replace(/\*/g, '');
        notPolluted = notPolluted && st === sto;
        p = Math.random() * l * 0.9999999999;
        stm = st.substr(0, p) + '$' + st.substr(p, 2000);
        sto = stm.replace(/\$/g, '');
        notPolluted = notPolluted && st === sto;

        // lower
        const stl = st.toLowerCase();
        notPolluted = notPolluted && (stl.length === l) && stl[l - 1] && !(stl[l]);
        for (let i = 0; i < l; i++) {
            const s1 = st[i];
            s1.__proto__.toLowerCase = stringToLower;
            const s2 = stl ? stl[i] : '';
            const s1l = s1.toLowerCase();
            notPolluted = notPolluted && s1l[0] === s2 && s1l[0] && !(s1l[1]);
        }
    }
    return !notPolluted;
}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function nanoSeconds() {
    const time = process.hrtime();
    if (!Array.isArray(time) || time.length !== 2) {
        return 0;
    }
    return +time[0] * 1e9 + +time[1];
}

function noop() { }

exports.isFunction = isFunction;
exports.nanoSeconds = nanoSeconds;
exports.noop = noop;
exports.sanitizeShellString = sanitizeShellString;
exports.isPrototypePolluted = isPrototypePolluted;
exports.stringReplace = stringReplace;
exports.stringToLower = stringToLower;
exports.stringToString = stringToString;
exports.stringSubstr = stringSubstr;
exports.stringTrim = stringTrim;
exports.mathMin = mathMin;
