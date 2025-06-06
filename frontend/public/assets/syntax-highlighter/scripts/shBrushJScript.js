/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */

// Import SyntaxHighlighter from the shCore.js module
import { SyntaxHighlighter } from './shCore.js';

class Brush {
    constructor() {
        var keywords = 'break case catch continue ' +
            'default delete do else false  ' +
            'for function if in instanceof ' +
            'new null return super switch ' +
            'this throw true try typeof var while with';

        var r = SyntaxHighlighter.regexLib;

        this.regexList = [
            { regex: r.multiLineDoubleQuotedString, css: 'string' }, // double quoted strings
            { regex: r.multiLineSingleQuotedString, css: 'string' }, // single quoted strings
            { regex: r.singleLineCComments, css: 'comments' }, // one line comments
            { regex: r.multiLineCComments, css: 'comments' }, // multiline comments
            { regex: /\s*#.*/gm, css: 'preprocessor' }, // preprocessor tags like #region and #endregion
            { regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword' } // keywords
        ];

        this.forHtmlScript(r.scriptScriptTags);
    }

    getKeywords(keywordStr) {
        return '\\b(?:' + keywordStr.split(' ').join('|') + ')\\b';
    }
};

Brush.prototype = new SyntaxHighlighter.Highlighter();
Brush.aliases = ['js', 'jscript', 'javascript'];

// Export the Brush class for ESM
export { Brush };
