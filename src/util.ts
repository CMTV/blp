export default {
    removeCaret,
    reduceSpaceLines,
    removeIndent
}

//
//
//

function removeCaret(str: string)
{
    return str.replace(/\r/gm, '');
}

function reduceSpaceLines(str: string)
{
    return str.replace(/^[ \t]+$/gm, '');
}

function removeIndent(str: string)
{
    let spaces = str.match(/^[ \t]*(?<!$)/gm);

    if (!spaces)
        return str;

    let indent = Math.min(...spaces.map(match => match.length));

    if (indent === 0)
        return str;
        
    let indentRegexp = new RegExp(`^[ \\t]{${indent}}`, 'gm');

    return str.replace(indentRegexp, '');
}