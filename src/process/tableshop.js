/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var SourceTableFormat;
(function (SourceTableFormat) {
    SourceTableFormat["JSON"] = "json";
    SourceTableFormat["CSV"] = "csv";
})(SourceTableFormat || (SourceTableFormat = {}));
var DataType;
(function (DataType) {
    DataType["CATEGORICAL"] = "categorical";
    DataType["NUMERICAL"] = "numerical";
})(DataType || (DataType = {}));
// Block
var KEY_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
var KEY_NUMERICAL = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
var KEY_ALPHABETIC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
var Position;
(function (Position) {
    Position["EMBEDDED"] = "embedded";
    Position["LEFT"] = "left";
    Position["RIGHT"] = "right";
    Position["TOP"] = "top";
    Position["BOTTOM"] = "bottom";
})(Position || (Position = {}));
var Pattern;
(function (Pattern) {
    Pattern["ROMAN"] = "I";
    Pattern["NUMERICAL"] = "1";
    Pattern["ALPHABETIC"] = "A";
})(Pattern || (Pattern = {}));
var GridMerge;
(function (GridMerge) {
    GridMerge["Merged"] = "merged";
    GridMerge["UnmergedFirst"] = "unmerged-first";
    GridMerge["UnmergedAll"] = "unmerged-all";
})(GridMerge || (GridMerge = {}));
var BorderPosition;
(function (BorderPosition) {
    BorderPosition["ALL"] = "All";
    BorderPosition["TOP"] = "Top";
    BorderPosition["BOTTOM"] = "Bottom";
    BorderPosition["LEFT"] = "Left";
    BorderPosition["RIGHT"] = "Right";
})(BorderPosition || (BorderPosition = {}));
var FontUnderscore;
(function (FontUnderscore) {
    FontUnderscore[FontUnderscore["None"] = 0] = "None";
    FontUnderscore[FontUnderscore["Single"] = 1] = "Single";
    FontUnderscore[FontUnderscore["Double"] = 2] = "Double";
})(FontUnderscore || (FontUnderscore = {}));
var FontWeight;
(function (FontWeight) {
    FontWeight["REGULAR"] = "Regular";
    FontWeight["BOLD"] = "Bold";
    FontWeight["SEMIBOLD"] = "Semi Bold";
})(FontWeight || (FontWeight = {}));
// function
var FUNC_SUM = "sum";

var CROSS_TABLE = "cross table";
var ROW_TABLE = "row table";
var COLUM_TABLE = "column table";

var SelectorType;
(function (SelectorType) {
    // block level selector
    SelectorType["TABLE"] = ".table";
    SelectorType["HEADER"] = ".header";
    SelectorType["ROW_HEADER"] = ".rowHeader";
    SelectorType["COL_HEADER"] = ".columnHeader";
    SelectorType["CELL"] = ".cell";
    SelectorType["ROW_H_LEVEL"] = ".rl";
    SelectorType["COL_H_LEVEL"] = ".cl";
    // line level selector
    SelectorType["ROW_ODD"] = ".oddRows";
    SelectorType["COL_ODD"] = ".oddCols";
    SelectorType["ROW_EVEN"] = ".evenRows";
    SelectorType["COL_EVEN"] = ".evenCols";
    SelectorType["ROW_LEVEL"] = ".r";
    SelectorType["COL_LEVEL"] = ".c";
    // function selector
    SelectorType["SUM_TITLE"] = ".sumTitle";
    SelectorType["SUM_CELL"] = ".sumCell";
})(SelectorType || (SelectorType = {}));

var deepAssign = function (target, source) {
    for (var key in source) {
        if (typeof source[key] !== "object") {
            target[key] = source[key];
        }
        else {
            if (Array.isArray(source[key])) {
                target[key] = JSON.parse(JSON.stringify(source[key]));
            }
            else {
                if (!target.hasOwnProperty(key))
                    target[key] = {};
                deepAssign(target[key], source[key]);
            }
        }
    }
    return target;
};

// const util = require('util');
// init style selector
var style_selector_fill = function (bId, loc, styles, idDict) {
    if (!bId)
        bId = "undefined";
    var res = {};
    for (var sel in styles) {
        if (sel === SelectorType.TABLE) {
            res = deepAssign(res, styles[sel]);
        }
        else if (sel === SelectorType.HEADER) {
            if (idDict.rowDict[bId] || idDict.colDict[bId])
                res = deepAssign(res, styles[sel]);
        }
        else if (sel === SelectorType.ROW_HEADER) {
            if (idDict.rowDict[bId])
                res = deepAssign(res, styles[sel]);
        }
        else if (sel === SelectorType.COL_HEADER) {
            if (idDict.colDict[bId])
                res = deepAssign(res, styles[sel]);
        }
        else if (sel === SelectorType.CELL) {
            if (idDict.cellDict[bId])
                res = deepAssign(res, styles[sel]);
        }
        else if (sel.startsWith(SelectorType.ROW_H_LEVEL)) {
            var depth = parseInt(sel.slice(3)) - 1;
            if (idDict.rowDict[bId] && idDict.rowDict[bId].depth === depth)
                res = deepAssign(res, styles[sel]);
        }
        else if (sel.startsWith(SelectorType.COL_H_LEVEL)) {
            var depth = parseInt(sel.slice(3)) - 1;
            if (idDict.colDict[bId] && idDict.colDict[bId].depth === depth)
                res = deepAssign(res, styles[sel]);
        }
        else if (sel === SelectorType.SUM_TITLE) {
            if (idDict.rowDict[bId] || idDict.colDict[bId]) {
                if (idDict.rowDict[bId].function === FUNC_SUM)
                    res = deepAssign(res, styles[sel]);
                else if (idDict.colDict[bId].function === FUNC_SUM)
                    res = deepAssign(res, styles[sel]);
            }
        }
        else if (sel === SelectorType.SUM_CELL) {
            if (idDict.cellDict[bId]) {
                var rowPId = idDict.cellDict[bId].rowPId, colPId = idDict.cellDict[bId].colPId;
                var isSet = false;
                if (rowPId && idDict.rowDict[rowPId] && idDict.rowDict[rowPId].function === FUNC_SUM)
                    isSet = true;
                else if (colPId && idDict.colDict[colPId] && idDict.colDict[colPId].function === FUNC_SUM)
                    isSet = true;
                if (isSet)
                    res = deepAssign(res, styles[sel]);
            }
        }
        else if (sel === SelectorType.ROW_ODD) {
            if (loc.x % 2 !== 0)
                res = deepAssign(res, styles[sel]);
        }
        else if (sel === SelectorType.COL_ODD) {
            if (loc.y % 2 !== 0)
                res = deepAssign(res, styles[sel]);
        }
        else if (sel === SelectorType.ROW_EVEN) {
            if (loc.x % 2 === 0)
                res = deepAssign(res, styles[sel]);
        }
        else if (sel === SelectorType.COL_EVEN) {
            if (loc.y % 2 === 0)
                res = deepAssign(res, styles[sel]);
        }
        else if (sel.startsWith(SelectorType.ROW_LEVEL)) {
            var level = parseInt(sel.slice(2));
            if (loc.x === level)
                res = deepAssign(res, styles[sel]);
        }
        else if (sel.startsWith(SelectorType.COL_LEVEL)) {
            var level = parseInt(sel.slice(2));
            if (loc.y === level)
                res = deepAssign(res, styles[sel]);
        }
    }
    return res;
};
// init header info
var header_fill = function (attrInfo, styles, header) {
    var _a, _b, _c, _d, _e;
    if (header !== undefined) {
        var _loop_1 = function (hb) {
            hb.entityMerge = (_a = hb.entityMerge) !== null && _a !== void 0 ? _a : false;
            hb.gridMerge = (_b = hb.gridMerge) !== null && _b !== void 0 ? _b : GridMerge.Merged;
            hb.facet = (_c = hb.facet) !== null && _c !== void 0 ? _c : 1;
            hb.blankLine = (_d = hb.blankLine) !== null && _d !== void 0 ? _d : false;
            if (hb.key && Object.keys(hb.key).length === 0)
                hb.key = undefined;
            var headerStyle = hb.className ? deepAssign({}, styles[hb.className]) : {};
            if (!hb.style || Object.keys(hb.style).length === 0)
                hb.style = {};
            hb.style = deepAssign(headerStyle, hb.style);
            if (hb.function !== undefined) {
                if (hb.function === FUNC_SUM)
                    hb.values = [FUNC_SUM];
                else
                    hb.values = ["Function(Unknown)"];
                return "continue";
            }
            var attr = attrInfo.find(function (obj) {
                return obj.name === hb.attrName;
            });
            if (attr !== undefined)
                hb.values = (_e = hb.values) !== null && _e !== void 0 ? _e : attr.values;
            // if(hb.children && hb.children.length===0) hb.children = undefined
            header_fill(attrInfo, styles, hb.children);
        };
        for (var _i = 0, header_1 = header; _i < header_1.length; _i++) {
            var hb = header_1[_i];
            _loop_1(hb);
        }
    }
};
// init spec default value
var spec_init = function (task) {
    task.data; var spec = task.spec;
    if (spec.rowHeader === undefined)
        spec.rowHeader = new Array();
    if (spec.columnHeader === undefined)
        spec.columnHeader = new Array();
    if (spec.cell === undefined)
        spec.cell = new Array();
    var rowHeader = spec.rowHeader, columnHeader = spec.columnHeader, cell = spec.cell, styles = spec.styles, attrInfo = spec.attrInfo;
    // make sure the header can not be both undefined
    if ((rowHeader === undefined || rowHeader.length === 0) &&
        (columnHeader === undefined || columnHeader.length === 0)) {
        throw new Error("RowHeader and ColumnHeader can not be both undefined!");
    }
    else {
        if (!styles || Object.keys(styles).length === 0)
            spec.styles = {};
        for (var _i = 0, _a = [rowHeader, columnHeader]; _i < _a.length; _i++) {
            var header = _a[_i];
            header_fill(attrInfo, styles, header);
        }
        for (var _b = 0, cell_1 = cell; _b < cell_1.length; _b++) {
            var c = cell_1[_b];
            var cellStyle = c.className ? deepAssign({}, styles[c.className]) : {};
            if (!c.style || Object.keys(c.style).length === 0)
                c.style = {};
            c.style = deepAssign(cellStyle, c.style);
        }
    }
};
// process style to css format
var style_process = function (style) {
    var output = {};
    var border = style.border, font = style.font, background = style.background, indent = style.indent;
    // Border
    if (border) {
        var positionKey = "", bdFormat = new Array();
        var bdWidth = border.width, bdStyle = "solid", bdColor = border.color;
        switch (border.position) {
            case BorderPosition.TOP:
                positionKey = "border-top";
                break;
            case BorderPosition.BOTTOM:
                positionKey = "border-bottom";
                break;
            case BorderPosition.LEFT:
                positionKey = "border-left";
                break;
            case BorderPosition.RIGHT:
                positionKey = "border-right";
                break;
            default:
                positionKey = "border";
                break;
        }
        if (bdWidth)
            bdFormat.push(bdWidth + "px");
        if (bdStyle)
            bdFormat.push(bdStyle);
        if (bdColor)
            bdFormat.push(bdColor);
        output[positionKey] = bdFormat.join(" ");
    }
    // Font
    if (font) {
        if (font.color)
            output['color'] = font.color;
        if (font.size)
            output['font-size'] = font.size + "px";
        if (font.weight) {
            if (font.weight === FontWeight.REGULAR)
                output['font-family'] = "Inter-Regular-9";
            else if (font.weight === FontWeight.BOLD)
                output['font-family'] = "Inter-Bold-4";
            else if (font.weight === FontWeight.SEMIBOLD)
                output['font-family'] = "Inter-Medium-8";
        }
        if (font.underscore === FontUnderscore.Single)
            output['text-decoration'] = "underline";
        else if (font.underscore === FontUnderscore.Double)
            output['text-decoration'] = "underline double";
    }
    // Background
    if (background) {
        if (background.color)
            output['background-color'] = background.color;
    }
    // Indent
    if (indent)
        output['padding-left'] = indent + "px";
    return output;
};
// compute dimension(depth) of rowHeader/columnHeader
var calc_head_depth = function (channel) {
    if (!channel || channel.length == 0)
        return 0;
    var depth = 1;
    for (var _i = 0, channel_1 = channel; _i < channel_1.length; _i++) {
        var hb = channel_1[_i];
        if (hb.children) {
            var selfDepth = hb.entityMerge ? 0 : 1;
            var d = calc_head_depth(hb.children);
            depth = (d + selfDepth > depth) ? d + selfDepth : depth;
        }
    }
    return depth;
};
// compute value counts(size) of rowHeader/columnHeader
var calc_head_size = function (channel) {
    if (!channel || channel.length == 0)
        return 0;
    var size = 0;
    for (var _i = 0, channel_2 = channel; _i < channel_2.length; _i++) {
        var hb = channel_2[_i];
        if (hb.entityMerge) {
            size += hb.values.length;
            for (var _a = 0, _b = hb.values; _a < _b.length; _a++) {
                _b[_a];
                size += calc_head_size(hb.children);
            }
        }
        else {
            var s = (hb.children && hb.children.length > 0) ? calc_head_size(hb.children) : 1;
            size += s * (hb.values.length);
        }
    }
    return size;
};
// compute each depth span length
var calc_head_span = function (channel, headSpan, depth, d, preLen) {
    if (headSpan === void 0) { headSpan = []; }
    if (depth === void 0) { depth = 0; }
    if (d === void 0) { d = 0; }
    if (preLen === void 0) { preLen = 1; }
    if (!channel || channel.length == 0)
        return 0;
    if (headSpan[depth][d])
        headSpan[depth][d] = headSpan[depth][d] < preLen ? preLen : headSpan[depth][d];
    else
        headSpan[depth][d] = preLen;
    for (var _i = 0, channel_3 = channel; _i < channel_3.length; _i++) {
        var hb = channel_3[_i];
        var delta = hb.entityMerge ? 0 : 1;
        var len = hb.entityMerge ? preLen + 1 : 1;
        calc_head_span(hb.children, headSpan, depth + delta, d + 1, len);
    }
};
var calc_current_key_layer = function (channel, tableClass) {
    var beforeLayer = 0, afterLayer = 0;
    if (tableClass === ROW_TABLE) {
        for (var _i = 0, channel_5 = channel; _i < channel_5.length; _i++) {
            var hb = channel_5[_i];
            if (hb.key && hb.key.position === Position.LEFT)
                beforeLayer = 1;
            if (hb.key && hb.key.position === Position.RIGHT)
                afterLayer = 1;
        }
    }
    else if (tableClass === COLUM_TABLE) {
        for (var _a = 0, channel_6 = channel; _a < channel_6.length; _a++) {
            var hb = channel_6[_a];
            if (hb.key && hb.key.position === Position.TOP)
                beforeLayer = 1;
            if (hb.key && hb.key.position === Position.BOTTOM)
                afterLayer = 1;
        }
    }
    var beforeBias = beforeLayer, afterBias = afterLayer;
    return [beforeLayer + afterLayer, beforeBias, afterBias];
};
var calc_each_key_layer = function (channel, layersBias, depth, tableClass) {
    if (layersBias === void 0) { layersBias = []; }
    if (depth === void 0) { depth = 0; }
    if (tableClass === void 0) { tableClass = ROW_TABLE; }
    if (!channel || channel.length == 0)
        return;
    var _a = calc_current_key_layer(channel, tableClass), leftBias = _a[1], rightBias = _a[2];
    if (layersBias[depth] === undefined)
        layersBias[depth] = [leftBias, rightBias];
    else {
        layersBias[depth][0] = layersBias[depth][0] < leftBias ? leftBias : layersBias[depth][0];
        layersBias[depth][1] = layersBias[depth][1] < rightBias ? rightBias : layersBias[depth][1];
    }
    for (var _i = 0, channel_7 = channel; _i < channel_7.length; _i++) {
        var hb = channel_7[_i];
        calc_each_key_layer(hb.children, layersBias, depth + (hb.entityMerge ? 0 : 1), tableClass);
    }
};
// find whether header has facet structure
var get_header_is_facet = function (channel) {
    if (!channel || channel.length == 0)
        return false;
    for (var _i = 0, channel_9 = channel; _i < channel_9.length; _i++) {
        var hb = channel_9[_i];
        if (hb.facet > 1)
            return true;
        var res = get_header_is_facet(hb.children);
        if (res)
            return true;
    }
    return false;
};
// get all header blockId and blankLine info
var get_header_id_dict = function (channel, depth) {
    if (depth === void 0) { depth = 0; }
    if (!channel || channel.length == 0)
        return {};
    var res = {};
    for (var _i = 0, channel_10 = channel; _i < channel_10.length; _i++) {
        var hb = channel_10[_i];
        var info = get_header_id_dict(hb.children, depth + 1);
        info[hb.blockId] = {
            attrName: hb.attrName,
            hasBlank: hb.blankLine,
            gridMerge: hb.gridMerge,
            locList: new Array(),
            depth: depth,
            function: hb.function,
        };
        res = deepAssign(res, info);
    }
    return res;
};
// get all cell blockId
var get_cell_id_dict = function (channel) {
    if (!channel || channel.length == 0)
        return {};
    var res = {};
    for (var _i = 0, channel_11 = channel; _i < channel_11.length; _i++) {
        var c = channel_11[_i];
        res[c.blockId] = {
            rowPId: c.rowParentId,
            colPId: c.columnParentId,
        };
    }
    return res;
};
var get_cell_head_is_valid = function (preVal, data) {
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var d = data_1[_i];
        var flag = true;
        for (var k in preVal) {
            if (d[k] !== preVal[k]) {
                flag = false;
                break;
            }
        }
        if (flag)
            return true;
    }
    return false;
};
var get_cell_val = function (preVal, data, key) {
    var res = new Array();
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var d = data_2[_i];
        var flag = true;
        for (var k in preVal) {
            if (d[k] !== preVal[k]) {
                flag = false;
                break;
            }
        }
        // if(flag) return d[key]
        if (flag)
            res.push(d[key]);
    }
    if (res.length === 0)
        return undefined;
    else
        return res.join(',');
};
var get_key = function (key, level, preKey) {
    if (!key)
        return '';
    var nowKey = '';
    if (key.pattern === Pattern.ROMAN) {
        nowKey = KEY_ROMAN[level];
    }
    else if (key.pattern === Pattern.NUMERICAL) {
        nowKey = KEY_NUMERICAL[level];
    }
    else if (key.pattern === Pattern.ALPHABETIC) {
        nowKey = KEY_ALPHABETIC[level];
    }
    return (key.isInherited && preKey !== '') ? [preKey, nowKey].join('.') : nowKey;
};
// Aggregate Function
// TODO: add more function
var aggregate_use = function (preVal, data, key, funcName) {
    if (funcName === void 0) { funcName = FUNC_SUM; }
    if (funcName === FUNC_SUM)
        return aggregate_sum(preVal, data, key);
};
var aggregate_sum = function (preVal, data, key) {
    var ans = 0, cnt = 0;
    for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
        var d = data_3[_i];
        var flag = true;
        for (var k in preVal) {
            if (d[k] !== preVal[k]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            cnt++;
            ans += d[key];
        }
    }
    if (cnt === 0)
        return undefined;
    return ans;
};
// check cell type which used for agg function
var agg_type_check = function (attrInfo, attrName) {
    var attr = attrInfo.find(function (obj) {
        return obj.name == attrName;
    });
    if (attr && attr.dataType === DataType.NUMERICAL)
        return true;
    return false;
};
// generate intermediate row table
var gen_inter_row_table = function (interRowTable, rowHeader, extra, width, depth, outerX, bias, isPreMerge, preKey, keyBias) {
    var _a;
    if (bias === void 0) { bias = 0; }
    if (isPreMerge === void 0) { isPreMerge = false; }
    if (preKey === void 0) { preKey = ''; }
    if (keyBias === void 0) { keyBias = 0; }
    if (rowHeader === undefined || rowHeader.length === 0)
        return 1;
    var innerX = 0;
    var leftBias = 0, rightBias = 0;
    var _b = extra.layersBias[depth], lb = _b[0], rb = _b[1];
    leftBias = lb, rightBias = rb;
    var currentKeyLayer = leftBias + rightBias;
    for (var _i = 0, rowHeader_1 = rowHeader; _i < rowHeader_1.length; _i++) {
        var rh = rowHeader_1[_i];
        var isLeaf = (rh.children && rh.children.length) ? false : true;
        var sourceBlockId = rh.blockId, source = (_a = rh.attrName) !== null && _a !== void 0 ? _a : rh.function;
        var headerDepth = depth + keyBias + leftBias, keyDepth = headerDepth;
        // let headerStyle = style_process(rh.style)
        var headerStyle = rh.style;
        var isKeyEmbedded = false;
        if (rh.key && rh.key.position === Position.LEFT)
            keyDepth = headerDepth - 1;
        if (rh.key && rh.key.position === Position.RIGHT)
            keyDepth = headerDepth + 1;
        if (rh.key && rh.key.position === Position.EMBEDDED)
            isKeyEmbedded = true;
        for (var i = 0; i < rh.values.length; i++) {
            var iterCount = void 0, key = rh.key ? get_key(rh.key, i, preKey) : '';
            var headValue = isKeyEmbedded ? key + ' ' + rh.values[i] : rh.values[i];
            var span = extra.headSpan[depth];
            var keyData = {
                value: key,
                source: '@KEY',
                sourceBlockId: '@KEY',
                rowSpan: 1, colSpan: 1,
                isUsed: false,
                isLeaf: isLeaf,
                isKey: true,
                style: headerStyle
            };
            if (source)
                extra.preVal[source] = rh.values[i];
            if (rh.entityMerge) {
                iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth, outerX + innerX + 1, bias, rh.entityMerge, key, keyBias);
            }
            else {
                iterCount = gen_inter_row_table(interRowTable, rh.children, extra, width, depth + 1, outerX + innerX, bias, rh.entityMerge, key, currentKeyLayer + keyBias);
            }
            if (innerX + outerX + iterCount > width) {
                console.log('Error', innerX, outerX, iterCount, width);
                throw new Error("Over rowHeader width!");
            }
            // process entities merged
            if (rh.entityMerge) {
                interRowTable[innerX + outerX + bias][keyDepth] = keyData;
                interRowTable[innerX + outerX + bias][headerDepth] = {
                    value: headValue,
                    source: source,
                    sourceBlockId: sourceBlockId,
                    rowSpan: 1, colSpan: span,
                    isUsed: false,
                    isLeaf: isLeaf,
                    isKey: false,
                    style: headerStyle
                };
                // // process cells unmerged-first
                // } else if(rh.gridMerge === GridMerge.UnmergedFirst) {
                //   interRowTable[innerX+outerX+bias][keyDepth] = keyData
                //   interRowTable[innerX+outerX+bias][headerDepth] = {
                //     value: headValue,
                //     source,
                //     sourceBlockId,
                //     rowSpan: 1, colSpan: span,
                //     isUsed: false,
                //     isLeaf,
                //     isKey: false,
                //     style: headerStyle
                //   }
                // // process cells merged and unmerged-all
            }
            else {
                // let rs = (rh.gridMerge===GridMerge.UnmergedAll) ? 1 : iterCount
                var rs = iterCount;
                keyData.rowSpan = rs;
                for (var j = 0; j < iterCount; j++) {
                    interRowTable[innerX + outerX + j + bias][keyDepth] = __assign({}, keyData);
                    interRowTable[innerX + outerX + j + bias][headerDepth] = {
                        value: headValue,
                        source: source,
                        sourceBlockId: sourceBlockId,
                        rowSpan: rs, colSpan: span,
                        isUsed: false,
                        isLeaf: isLeaf,
                        isKey: false,
                        style: headerStyle
                    };
                }
            }
            // process cell unit
            if (!extra.notSearchCell && isLeaf) {
                for (var _c = 0, _d = extra.cell; _c < _d.length; _c++) {
                    var c = _d[_c];
                    if (c.rowParentId === rh.blockId) {
                        // let cellStyle = style_process(c.style)
                        var cellStyle = c.style;
                        // process function cell
                        if (rh.function) {
                            if (!agg_type_check(extra.attrInfo, c.attrName))
                                throw new Error("Function can only be used to numerical>");
                            delete extra.preVal[source];
                            extra.cellTable[innerX + outerX + bias].push({
                                value: aggregate_use(extra.preVal, extra.data, c.attrName, FUNC_SUM),
                                source: c.attrName,
                                sourceBlockId: c.blockId,
                                style: cellStyle
                            });
                            // Process attr cell
                        }
                        else {
                            extra.cellTable[innerX + outerX + bias].push({
                                value: get_cell_val(extra.preVal, extra.data, c.attrName),
                                source: c.attrName,
                                sourceBlockId: c.blockId,
                                style: cellStyle
                            });
                        }
                    }
                }
            }
            if (extra.notSearchCell && isLeaf) {
                if (rh.function)
                    delete extra.preVal[source];
                extra.valIdx.push({
                    idx: innerX + outerX + bias,
                    preVal: Object.assign({}, extra.preVal),
                    blockId: rh.blockId,
                    isAgg: rh.function ? true : false
                });
            }
            innerX += iterCount;
            delete extra.preVal[source];
        }
    }
    return innerX + (isPreMerge ? 1 : 0);
};
// generate intermediate column table
var gen_inter_column_table = function (interColumnTable, columnHeader, extra, width, depth, outerY, bias, isPreMerge, preKey, keyBias) {
    var _a;
    if (bias === void 0) { bias = 0; }
    if (isPreMerge === void 0) { isPreMerge = false; }
    if (preKey === void 0) { preKey = ''; }
    if (keyBias === void 0) { keyBias = 0; }
    if (columnHeader === undefined || columnHeader.length === 0)
        return 1;
    var innerY = 0;
    var topBias = 0, bottomBias = 0;
    var _b = extra.layersBias[depth], tb = _b[0], bb = _b[1];
    topBias = tb, bottomBias = bb;
    var currentKeyLayer = topBias + bottomBias;
    for (var _i = 0, columnHeader_1 = columnHeader; _i < columnHeader_1.length; _i++) {
        var ch = columnHeader_1[_i];
        var isLeaf = (ch.children && ch.children.length) ? false : true;
        var sourceBlockId = ch.blockId, source = (_a = ch.attrName) !== null && _a !== void 0 ? _a : ch.function;
        var headerDepth = depth + keyBias + topBias, keyDepth = headerDepth;
        // let headerStyle = style_process(ch.style)
        var headerStyle = ch.style;
        var isKeyEmbedded = false;
        if (ch.key && ch.key.position === Position.TOP)
            keyDepth = headerDepth - 1;
        if (ch.key && ch.key.position === Position.BOTTOM)
            keyDepth = headerDepth + 1;
        if (ch.key && ch.key.position === Position.EMBEDDED)
            isKeyEmbedded = true;
        for (var i = 0; i < ch.values.length; i++) {
            var iterCount = void 0, key = ch.key ? get_key(ch.key, i, preKey) : '';
            var headValue = isKeyEmbedded ? key + ' ' + ch.values[i] : ch.values[i];
            var span = extra.headSpan[depth];
            var keyData = {
                value: key,
                source: '@KEY',
                sourceBlockId: '@KEY',
                rowSpan: 1, colSpan: 1,
                isUsed: false,
                isLeaf: isLeaf,
                isKey: true,
                style: headerStyle
            };
            if (source)
                extra.preVal[source] = ch.values[i];
            if (ch.entityMerge) {
                iterCount = gen_inter_column_table(interColumnTable, ch.children, extra, width, depth, outerY + innerY + 1, bias, ch.entityMerge, key, keyBias);
            }
            else {
                iterCount = gen_inter_column_table(interColumnTable, ch.children, extra, width, depth + 1, outerY + innerY, bias, ch.entityMerge, key, currentKeyLayer + keyBias);
            }
            if (innerY + outerY + iterCount > width) {
                console.log('Error', innerY, outerY, iterCount, width);
                throw new Error("Over columnHeader width!");
            }
            // process entities merged
            if (ch.entityMerge) {
                interColumnTable[keyDepth][innerY + outerY + bias] = keyData;
                interColumnTable[headerDepth][innerY + outerY + bias] = {
                    value: headValue,
                    source: source,
                    sourceBlockId: sourceBlockId,
                    rowSpan: span, colSpan: 1,
                    isUsed: false,
                    isLeaf: isLeaf,
                    isKey: false,
                    style: headerStyle
                };
                // // process cells unmerged-first
                // } else if(ch.gridMerge === GridMerge.UnmergedFirst) {
                //   interColumnTable[keyDepth][innerY+outerY+bias] = keyData
                //   interColumnTable[headerDepth][innerY+outerY+bias] = {
                //     value: headValue,
                //     source,
                //     sourceBlockId,
                //     rowSpan: span, colSpan: 1,
                //     isUsed: false,
                //     isLeaf,
                //     isKey: false,
                //     style: headerStyle
                //   }
                // // process cells merged and unmerged-all
            }
            else {
                // let cs = (ch.gridMerge===GridMerge.UnmergedAll) ? 1 : iterCount
                var cs = iterCount;
                keyData.colSpan = cs;
                for (var j = 0; j < iterCount; j++) {
                    interColumnTable[keyDepth][innerY + outerY + j + bias] = __assign({}, keyData);
                    interColumnTable[headerDepth][innerY + outerY + j + bias] = {
                        value: headValue,
                        source: source,
                        sourceBlockId: sourceBlockId,
                        rowSpan: span, colSpan: cs,
                        isUsed: false,
                        isLeaf: isLeaf,
                        isKey: false,
                        style: headerStyle
                    };
                }
            }
            // process cell unit
            if (!extra.notSearchCell && isLeaf) {
                for (var _c = 0, _d = extra.cell; _c < _d.length; _c++) {
                    var c = _d[_c];
                    if (c.colParentId === ch.blockId) {
                        // let cellStyle = style_process(c.style)
                        var cellStyle = c.style;
                        // process function cell
                        if (ch.function) {
                            if (!agg_type_check(extra.attrInfo, c.attrName))
                                throw new Error("Function can only be used to numerical>");
                            delete extra.preVal[source];
                            extra.cellTable[innerY + outerY + bias].push({
                                value: aggregate_use(extra.preVal, extra.data, c.attrName, FUNC_SUM),
                                source: c.attrName,
                                sourceBlockId: c.blockId,
                                style: cellStyle
                            });
                            // Process attr cell
                        }
                        else {
                            extra.cellTable[innerY + outerY + bias].push({
                                value: get_cell_val(extra.preVal, extra.data, c.attrName),
                                source: c.attrName,
                                sourceBlockId: c.blockId,
                                style: cellStyle
                            });
                        }
                    }
                }
            }
            if (extra.notSearchCell && isLeaf) {
                if (ch.function)
                    delete extra.preVal[source];
                extra.valIdx.push({
                    idx: innerY + outerY + bias,
                    preVal: Object.assign({}, extra.preVal),
                    blockId: ch.blockId,
                    isAgg: ch.function ? true : false
                });
            }
            innerY += iterCount;
            delete extra.preVal[source];
        }
    }
    return innerY + (isPreMerge ? 1 : 0);
};
// generate intermediate cross table
var gen_inter_cross_table = function (interCrossTable, rowExtra, colExtra, cell) {
    var rowValIdx = rowExtra.valIdx, colValIdx = colExtra.valIdx;
    for (var i = 0; i < rowValIdx.length; i++) {
        for (var j = 0; j < colValIdx.length; j++) {
            for (var _i = 0, cell_2 = cell; _i < cell_2.length; _i++) {
                var c = cell_2[_i];
                if (c.rowParentId === rowValIdx[i].blockId && c.colParentId === colValIdx[j].blockId) {
                    // let cellStyle = style_process(c.style)
                    var cellStyle = c.style;
                    var x = rowValIdx[i].idx, y = colValIdx[j].idx;
                    if (rowValIdx[i].isAgg || colValIdx[j].isAgg) {
                        if (!agg_type_check(rowExtra.attrInfo, c.attrName))
                            throw new Error("Function can only be used to numerical>");
                        interCrossTable[x][y] = {
                            value: aggregate_use(__assign(__assign({}, rowValIdx[i].preVal), colValIdx[j].preVal), rowExtra.data, c.attrName, FUNC_SUM),
                            // source: c.attrName,
                            sourceBlockId: c.blockId,
                            rowSpan: 1, colSpan: 1,
                            style: cellStyle
                        };
                    }
                    else {
                        interCrossTable[x][y] = {
                            value: get_cell_val(__assign(__assign({}, rowValIdx[i].preVal), colValIdx[j].preVal), rowExtra.data, c.attrName),
                            // source: c.attrName,
                            sourceBlockId: c.blockId,
                            rowSpan: 1, colSpan: 1,
                            style: cellStyle
                        };
                    }
                }
            }
        }
    }
};
// generate facet and blankLine structure table
var gen_blank_facet_table = function (rawTable, header, info, depth, outerX, bias, isPreMerge, keyBias) {
    var _a, _b;
    if (bias === void 0) { bias = 0; }
    if (isPreMerge === void 0) { isPreMerge = false; }
    if (keyBias === void 0) { keyBias = 0; }
    if (header === undefined || header.length === 0)
        return [1, info.cellLength, 1, 0];
    var innerX = 0, maxLen = info.cellLength, facetSpan = 0, blankLine = 0;
    var _c = info.layersBias[depth], beforeBias = _c[0], afterBias = _c[1];
    var keyLayer = beforeBias + afterBias;
    for (var _i = 0, header_2 = header; _i < header_2.length; _i++) {
        var hb = header_2[_i];
        var start = innerX + outerX + bias, subFacetSpan = 0;
        var nowBeforeBias = 0, nowAfterBias = 0;
        if (hb.key) {
            if (info.tbClass === ROW_TABLE) {
                if (hb.key.position === Position.LEFT)
                    nowBeforeBias = 1;
                if (hb.key.position === Position.RIGHT)
                    nowAfterBias = 1;
            }
            else if (info.tbClass === COLUM_TABLE) {
                if (hb.key.position === Position.TOP)
                    nowBeforeBias = 1;
                if (hb.key.position === Position.BOTTOM)
                    nowAfterBias = 1;
            }
        }
        for (var i = 0; i < hb.values.length; i++) {
            var iterCount = 1, len = info.cellLength, tmpFacetSpan = 1, blank = 0;
            var x = innerX + outerX + bias, y = depth + keyBias;
            if (hb.entityMerge) {
                _a = gen_blank_facet_table(rawTable, hb.children, info, depth, outerX + innerX + 1, bias, hb.entityMerge, keyBias), iterCount = _a[0], len = _a[1], tmpFacetSpan = _a[2], blank = _a[3];
            }
            else {
                _b = gen_blank_facet_table(rawTable, hb.children, info, depth + 1, outerX + innerX, bias, hb.entityMerge, keyBias + keyLayer), iterCount = _b[0], len = _b[1], tmpFacetSpan = _b[2], blank = _b[3];
            }
            for (var j = 0; j < iterCount; j++) {
                // console.log('xxxxxx',  info.oldTable[x+j][y+beforeBias].value, x+j, y+beforeBias);
                if (rawTable[x + j][y + beforeBias] !== undefined && !hb.entityMerge) {
                    if (info.tbClass === ROW_TABLE) {
                        // if(beforeBias > 0) rawTable[x+j][y].rowSpan = tmpFacetSpan + blank
                        if (nowBeforeBias > 0)
                            rawTable[x + j][y].rowSpan = tmpFacetSpan + blank;
                        rawTable[x + j][y + beforeBias].rowSpan = tmpFacetSpan + blank;
                        // if(afterBias > 0) rawTable[x+j][y+beforeBias+afterBias].rowSpan = tmpFacetSpan + blank
                        if (nowAfterBias > 0)
                            rawTable[x + j][y + beforeBias + afterBias].rowSpan = tmpFacetSpan + blank;
                    }
                    else if (info.tbClass === COLUM_TABLE) {
                        // if(beforeBias > 0) rawTable[x+j][y].colSpan = tmpFacetSpan + blank
                        if (nowBeforeBias > 0)
                            rawTable[x + j][y].colSpan = tmpFacetSpan + blank;
                        rawTable[x + j][y + beforeBias].colSpan = tmpFacetSpan + blank;
                        // if(afterBias > 0) rawTable[x+j][y+beforeBias+afterBias].colSpan = tmpFacetSpan + blank
                        if (nowAfterBias > 0)
                            rawTable[x + j][y + beforeBias + afterBias].colSpan = tmpFacetSpan + blank;
                    }
                }
                if (rawTable[x + j][y + beforeBias] !== undefined && j === 0 && hb.blankLine) {
                    if (beforeBias > 0)
                        rawTable[x + j][y].hasBlank = true;
                    rawTable[x + j][y + beforeBias].hasBlank = true;
                    if (afterBias > 0)
                        rawTable[x + j][y + beforeBias + afterBias].hasBlank = true;
                }
            }
            if (hb.facet > 1) {
                var copyLen = len - y;
                var group = i % hb.facet;
                for (var j = 0; j < iterCount; j++) {
                    for (var k = 0; k < copyLen; k++) {
                        var tarX = start + Math.floor(i / hb.facet) * iterCount + j, tarY = y + k + group * copyLen;
                        rawTable[tarX][tarY] = rawTable[x + j][y + k];
                        if (rawTable[x + j][y + k] !== undefined && (tarX !== x + j || tarY !== y + k))
                            rawTable[x + j][y + k] = { isDelete: true };
                    }
                }
                if (info.alignHeader) {
                    for (var i_1 = 0; i_1 < info.alignHeader.length; i_1++) {
                        for (var j = 0; j < copyLen; j++) {
                            var tarY = y + j + group * copyLen;
                            info.alignHeader[i_1][tarY] = info.alignHeader[i_1][y + j];
                        }
                    }
                }
                var delta = (hb.facet - 1) * copyLen;
                len += delta;
            }
            innerX += iterCount;
            if (maxLen < len)
                maxLen = len;
            subFacetSpan += tmpFacetSpan;
        }
        if (hb.facet > 1)
            subFacetSpan = Math.ceil(subFacetSpan / hb.facet);
        facetSpan += subFacetSpan;
        if (hb.blankLine)
            blankLine += Math.ceil(hb.values.length / hb.facet);
    }
    var delta1 = isPreMerge ? 1 : 0;
    return [innerX + delta1, maxLen, facetSpan + delta1, blankLine];
};
var gen_final_table = function (table, tableClass) {
    var h = 0, oldLen = table.length, maxLength = 0;
    var spanList = new Array();
    for (var i = 0; i < oldLen; i++) {
        var isDelete = true;
        for (var j = 0; j < table[h].length; j++) {
            if (table[h][j] === undefined || table[h][j].isDelete)
                continue;
            if (tableClass === ROW_TABLE)
                spanList[j] = table[h][j].colSpan;
            else if (tableClass === COLUM_TABLE)
                spanList[j] = table[h][j].rowSpan;
            isDelete = false;
        }
        if (isDelete)
            table.splice(h, 1);
        else {
            if (table[h].length > maxLength)
                maxLength = table[h].length;
            h++;
        }
    }
    // fill each length
    for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
        var t = table_1[_i];
        var resLen = maxLength - t.length, tmp = t.length;
        for (var i = 0; i < resLen; i++) {
            if (tableClass === ROW_TABLE)
                t.push({ rowSpan: 1, colSpan: spanList[i + tmp] });
            else if (tableClass === COLUM_TABLE)
                t.push({ rowSpan: spanList[i + tmp], colSpan: 1 });
        }
    }
    var finalTable = Array.from({ length: table.length }, function () { return new Array(); });
    var locMap = new Array(maxLength).fill(0);
    for (var i = 0; i < table.length; i++) {
        var t = table[i], isBlank = false;
        for (var j = 0; j < table[i].length; j++) {
            if (table[i][j] === undefined) {
                if (i + 1 >= table.length)
                    throw new Error("Final Table: Over Boundary");
                if (isBlank) {
                    if (finalTable[locMap[j]] === undefined)
                        finalTable[locMap[j]] = new Array();
                    if (tableClass === ROW_TABLE)
                        finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i + 1][j].colSpan });
                    else if (tableClass === COLUM_TABLE)
                        finalTable[locMap[j]].push({ rowSpan: table[i + 1][j].rowSpan, colSpan: 1 });
                    locMap[j]++;
                }
                if (finalTable[locMap[j]] === undefined)
                    finalTable[locMap[j]] = new Array();
                if (tableClass === ROW_TABLE)
                    finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i + 1][j].colSpan });
                else if (tableClass === COLUM_TABLE)
                    finalTable[locMap[j]].push({ rowSpan: table[i + 1][j].rowSpan, colSpan: 1 });
                locMap[j]++;
            }
            else if (!table[i][j].isDelete) {
                if (table[i][j].hasBlank) {
                    delete table[i][j].hasBlank;
                    isBlank = true;
                }
                if (isBlank) {
                    if (finalTable[locMap[j]] === undefined)
                        finalTable[locMap[j]] = new Array();
                    if (tableClass === ROW_TABLE)
                        finalTable[locMap[j]].push({ rowSpan: 1, colSpan: table[i][j].colSpan });
                    else if (tableClass === COLUM_TABLE)
                        finalTable[locMap[j]].push({ rowSpan: table[i][j].rowSpan, colSpan: 1 });
                    locMap[j]++;
                }
                if (finalTable[locMap[j]] === undefined)
                    finalTable[locMap[j]] = new Array();
                finalTable[locMap[j]].push(table[i][j]);
                if (tableClass === ROW_TABLE)
                    locMap[j] += table[i][j].rowSpan;
                else if (tableClass === COLUM_TABLE)
                    locMap[j] += table[i][j].colSpan;
            }
        }
    }
    if (tableClass === COLUM_TABLE) {
        var newFinalTable = new Array();
        var useRecord = new Array(finalTable.length).fill(0);
        for (var i = 0; i < maxLength; i++) {
            newFinalTable[i] = new Array();
            for (var j = 0; j < finalTable.length; j++) {
                var tmp = useRecord[j];
                newFinalTable[i].push(finalTable[j][tmp]);
                useRecord[j]++;
                j += finalTable[j][tmp].colSpan - 1;
            }
        }
        finalTable = newFinalTable;
    }
    return finalTable;
};
// generate matched value table
var gen_valid_value_table = function (table, tableClass, data, idDict) {
    var rowLen = 0;
    for (var _i = 0, _a = table[0]; _i < _a.length; _i++) {
        var t = _a[_i];
        rowLen += t.colSpan;
    }
    var vvTable = Array.from({ length: table.length }, function () { return new Array(rowLen)
        .fill(null).map(function (_) { return ({ rowSpan: 1, colSpan: 1 }); }); });
    var useRecord = Array.from({ length: table.length }, function () { return new Array(rowLen).fill(false); });
    for (var i = 0; i < table.length; i++) {
        for (var j = 0; j < table[i].length; j++) {
            var tmp = table[i][j], loc = new Array(), id = tmp.sourceBlockId, fixJ = j;
            while (useRecord[i][fixJ])
                fixJ++;
            if (id) {
                if (idDict.rowDict[id])
                    idDict.rowDict[id].locList.push(i);
                else if (idDict.colDict[id])
                    idDict.colDict[id].locList.push(fixJ);
            }
            for (var p = 0; p < tmp.rowSpan; p++) {
                for (var q = 0; q < tmp.colSpan; q++) {
                    loc.push({ x: i + p, y: fixJ + q });
                    vvTable[i + p][fixJ + q] = __assign(__assign({}, tmp), { loc: loc, isSkip: false });
                    useRecord[i + p][fixJ + q] = true;
                }
            }
        }
    }
    if (tableClass === ROW_TABLE || tableClass === CROSS_TABLE) {
        var _loop_2 = function (i) {
            var hasHeader = false, hasCell = false, hasCellVal = false, hasBlank = false;
            var lastBlank = -1, lastBId = "";
            var headSet = {}, keyList = new Array(), isHeadValid = false;
            for (var j = 0; j < rowLen; j++) {
                var tmp = vvTable[i][j], id = tmp.sourceBlockId;
                if (id && idDict.rowDict[id]) {
                    hasHeader = true;
                    if (idDict.rowDict[id].attrName) {
                        if (headSet[idDict.rowDict[id].attrName]) {
                            if (get_cell_head_is_valid(headSet, data))
                                isHeadValid = true;
                            var tmpKey = keyList.pop();
                            while (tmpKey !== idDict.rowDict[id].attrName) {
                                delete headSet[tmpKey];
                                tmpKey = keyList.pop();
                            }
                        }
                        headSet[idDict.rowDict[id].attrName] = tmp.value;
                        keyList.push(idDict.rowDict[id].attrName);
                    }
                    if (idDict.rowDict[id].hasBlank) {
                        hasBlank = true;
                        lastBlank = j;
                        lastBId = id;
                    }
                }
                if (id && idDict.cellDict[id]) {
                    hasCell = true;
                    if (tmp.value)
                        hasCellVal = true;
                }
            }
            if (get_cell_head_is_valid(headSet, data))
                isHeadValid = true;
            if ((hasHeader && !hasCell && !isHeadValid) || (hasHeader && hasCell && !hasCellVal)) {
                var dealBlank = false;
                if (hasBlank) {
                    var res = idDict.rowDict[lastBId].locList.find(function (e) { return e === i; });
                    if (res && vvTable[i][lastBlank].rowSpan <= 1)
                        dealBlank = true;
                }
                for (var j = 0; j < rowLen; j++) {
                    var tmp = vvTable[i][j], delta = 1;
                    tmp.isSkip = true;
                    if (dealBlank) {
                        vvTable[i - 1][j].isSkip = true;
                        delta++;
                    }
                    for (var _e = 0, _f = tmp.loc; _e < _f.length; _e++) {
                        var _g = _f[_e], x = _g.x, y = _g.y;
                        vvTable[x][y].rowSpan -= j < lastBlank ? delta : 1;
                    }
                }
            }
        };
        for (var i = 0; i < vvTable.length; i++) {
            _loop_2(i);
        }
    }
    if (tableClass === COLUM_TABLE || tableClass === CROSS_TABLE) {
        var _loop_3 = function (j) {
            var hasHeader = false, hasCell = false, hasCellVal = false, hasBlank = false;
            var lastBlank = -1, lastBId = "";
            var headSet = {}, keyList = new Array(), isHeadValid = false;
            for (var i = 0; i < vvTable.length; i++) {
                var tmp = vvTable[i][j], id = tmp.sourceBlockId;
                if (id && idDict.colDict[id]) {
                    hasHeader = true;
                    if (idDict.colDict[id].attrName) {
                        if (headSet[idDict.colDict[id].attrName]) {
                            if (get_cell_head_is_valid(headSet, data))
                                isHeadValid = true;
                            var tmpKey = keyList.pop();
                            while (tmpKey !== idDict.colDict[id].attrName) {
                                delete headSet[tmpKey];
                                tmpKey = keyList.pop();
                            }
                        }
                        headSet[idDict.colDict[id].attrName] = tmp.value;
                        keyList.push(idDict.colDict[id].attrName);
                    }
                    if (idDict.colDict[id].hasBlank) {
                        hasBlank = true;
                        lastBlank = i;
                        lastBId = id;
                    }
                }
                if (id && idDict.cellDict[id]) {
                    hasCell = true;
                    if (tmp.value)
                        hasCellVal = true;
                }
            }
            if (get_cell_head_is_valid(headSet, data))
                isHeadValid = true;
            if ((hasHeader && !hasCell && !isHeadValid) || (hasHeader && hasCell && !hasCellVal)) {
                var dealBlank = false;
                if (hasBlank) {
                    var res = idDict.rowDict[lastBId].locList.find(function (e) { return e === j; });
                    if (res && vvTable[lastBlank][j].colSpan <= 1)
                        dealBlank = true;
                }
                for (var i = 0; i < vvTable.length; i++) {
                    var tmp = vvTable[i][j], delta = 1;
                    tmp.isSkip = true;
                    if (dealBlank) {
                        vvTable[i][j - 1].isSkip = true;
                        delta++;
                    }
                    for (var _h = 0, _j = tmp.loc; _h < _j.length; _h++) {
                        var _k = _j[_h], x = _k.x, y = _k.y;
                        vvTable[x][y].colSpan -= i < lastBlank ? delta : 1;
                    }
                }
            }
        };
        for (var j = 0; j < rowLen; j++) {
            _loop_3(j);
        }
    }
    // console.log('vv Table', util.inspect(vvTable, {showHidden: false, depth: null, colors: true}));
    console.log('vv Table', vvTable);
    var retTable = new Array(), pos = 0;
    for (var i = 0; i < vvTable.length; i++) {
        if (!retTable[pos])
            retTable[pos] = new Array();
        for (var j = 0; j < rowLen; j++) {
            var tmp = vvTable[i][j], id = tmp.sourceBlockId;
            var mergeType = GridMerge.Merged;
            var isRowHeader = (id && idDict.rowDict[id]) ? true : false;
            var isColHeader = (id && idDict.colDict[id]) ? true : false;
            if (isRowHeader)
                mergeType = idDict.rowDict[id].gridMerge;
            else if (isColHeader)
                mergeType = idDict.colDict[id].gridMerge;
            var rs = (isRowHeader && mergeType !== GridMerge.Merged) ? 1 : tmp.rowSpan;
            var cs = (isColHeader && mergeType !== GridMerge.Merged) ? 1 : tmp.colSpan;
            if (tmp.isSkip)
                continue;
            retTable[pos].push({
                value: tmp.value,
                sourceBlockId: tmp.sourceBlockId,
                rowSpan: rs,
                colSpan: cs,
                style: tmp.style
            });
            if (mergeType !== GridMerge.UnmergedAll) {
                for (var _b = 0, _c = tmp.loc; _b < _c.length; _b++) {
                    var _d = _c[_b], x = _d.x, y = _d.y;
                    if (mergeType === GridMerge.Merged)
                        vvTable[x][y].isSkip = true;
                    else if (mergeType === GridMerge.UnmergedFirst)
                        vvTable[x][y].value = undefined;
                }
            }
        }
        if (retTable[pos].length > 0)
            pos++;
    }
    // console.log('ret Table', util.inspect(retTable, {showHidden: false, depth: null, colors: true}));
    // console.log('ret Table', retTable);
    return retTable;
};
var gen_styled_table = function (table, styles, idDict) {
    var rowLen = 0, retTable = new Array();
    for (var _i = 0, _a = table[0]; _i < _a.length; _i++) {
        var t = _a[_i];
        rowLen += t.colSpan;
    }
    var useRecord = Array.from({ length: table.length }, function () { return new Array(rowLen).fill(false); });
    for (var i = 0; i < table.length; i++) {
        retTable[i] = new Array();
        for (var j = 0; j < table[i].length; j++) {
            var tmp = __assign({}, table[i][j]), id = tmp.sourceBlockId, fixJ = j;
            while (useRecord[i][fixJ])
                fixJ++;
            var loc = { x: i + 1, y: fixJ + 1 };
            tmp.style = style_process(deepAssign(style_selector_fill(id, loc, styles, idDict), tmp.style));
            retTable[i].push(tmp);
            for (var p = 0; p < tmp.rowSpan; p++) {
                for (var q = 0; q < tmp.colSpan; q++)
                    useRecord[i + p][fixJ + q] = true;
            }
        }
    }
    // console.log('styled Table', util.inspect(retTable, {showHidden: false, depth: null, colors: true}));
    console.log('styled Table', retTable);
    return retTable;
};
var table_process = function (tbClass, data, _a) {
    var rowHeader = _a.rowHeader, columnHeader = _a.columnHeader, cell = _a.cell, attrInfo = _a.attrInfo, styles = _a.styles;
    var interTable, processTable = new Array();
    var finalTable = [];
    var rowDepth = calc_head_depth(rowHeader);
    var colDepth = calc_head_depth(columnHeader);
    var rowSize = calc_head_size(rowHeader);
    var colSize = calc_head_size(columnHeader);
    if (tbClass == ROW_TABLE) {
        var headTmpSpan = Array.from({ length: rowDepth }, function () { return ({}); });
        var headSpan = new Array(rowDepth).fill(1);
        calc_head_span(rowHeader, headTmpSpan);
        console.log('head tmp span', headTmpSpan);
        // for(let i=0; i<headTmpSpan.length; i++) {
        //   let hts = headTmpSpan[i]
        //   for(let k in hts) if(hts[k] > headSpan[i]) headSpan[i] = hts[k]
        // }
        console.log('head span', headSpan);
        var layersBias = [], totalLayer = 0;
        calc_each_key_layer(rowHeader, layersBias, 0, tbClass);
        for (var _i = 0, layersBias_1 = layersBias; _i < layersBias_1.length; _i++) {
            var lb = layersBias_1[_i];
            totalLayer += lb[0] + lb[1];
        }
        rowDepth += totalLayer;
        console.log('layers bias', layersBias);
        console.log('total layer', totalLayer);
        var headKeySpan = new Array();
        for (var i = 0; i < headSpan.length; i++) {
            if (layersBias[i][0] > 0)
                headKeySpan.push(1);
            headKeySpan.push(headSpan[i]);
            if (layersBias[i][1] > 0)
                headKeySpan.push(1);
        }
        console.log("head key span", headKeySpan);
        var extra = {
            preVal: {},
            data: data.values,
            cell: cell,
            cellTable: Array.from({ length: rowSize }, function () { return new Array(); }),
            attrInfo: attrInfo,
            layersBias: layersBias,
            headSpan: headSpan
        };
        interTable = Array.from({ length: rowSize }, function () { return new Array(rowDepth)
            .fill(null).map(function (_) { return ({ rowSpan: 1, colSpan: 1 }); }); });
        gen_inter_row_table(interTable, rowHeader, extra, rowSize, 0, 0);
        // console.log('@@@', interTable);
        var maxLength = 0, tmpLength = [];
        // // when cell is empty, fill one row/col(default)
        // for(let ct of extra.cellTable) {
        //   if(ct.length === 0) ct.push({rowSpan: 1, colSpan: 1})
        // }
        // console.log('cell', extra.cellTable);
        for (var i = 0; i < rowSize; i++) {
            processTable[i] = [], tmpLength[i] = 0;
            for (var j = 0; j < rowDepth; j++) {
                var tmp = interTable[i][j];
                if (tmp.isUsed) {
                    processTable[i].push({ isDelete: true });
                    continue;
                }
                if (tmp.value) {
                    processTable[i].push({
                        value: tmp.value,
                        // source: tmp.source,
                        sourceBlockId: tmp.sourceBlockId,
                        rowSpan: tmp.rowSpan,
                        colSpan: tmp.colSpan,
                        style: tmp.style
                    });
                }
                else {
                    processTable[i].push({
                        value: tmp.value,
                        // source: tmp.source,
                        sourceBlockId: tmp.sourceBlockId,
                        rowSpan: 1,
                        colSpan: headKeySpan[j],
                        style: tmp.style
                    });
                }
                for (var k = 0; k < tmp.rowSpan; k++) {
                    interTable[i + k][j].isUsed = true;
                }
            }
            for (var _b = 0, _c = extra.cellTable[i]; _b < _c.length; _b++) {
                var c = _c[_b];
                tmpLength[i]++;
                processTable[i].push({
                    value: c.value,
                    // source: c.source,
                    sourceBlockId: c.sourceBlockId,
                    rowSpan: 1,
                    colSpan: 1,
                    style: c.style
                });
            }
            maxLength = maxLength > tmpLength[i] ? maxLength : tmpLength[i];
        }
        // fill empty unit
        for (var i = 0; i < processTable.length; i++) {
            var resLength = maxLength - tmpLength[i];
            for (var j = 0; j < resLength; j++)
                processTable[i].push({
                    value: undefined,
                    // source: undefined as any,
                    sourceBlockId: undefined,
                    rowSpan: 1,
                    colSpan: 1,
                    style: undefined
                });
        }
        // process blankLine and facet structure
        var info = {
            layersBias: layersBias,
            cellLength: maxLength + rowDepth,
            tbClass: tbClass,
            // oldTable: JSON.parse(JSON.stringify(processTable))
        };
        gen_blank_facet_table(processTable, rowHeader, info, 0, 0);
        console.log('new', processTable);
        finalTable = gen_final_table(processTable, tbClass);
        console.log('final row', finalTable);
    }
    else if (tbClass == COLUM_TABLE) {
        var headTmpSpan = Array.from({ length: colDepth }, function () { return ({}); });
        var headSpan = new Array(colDepth).fill(1);
        calc_head_span(columnHeader, headTmpSpan);
        console.log('head tmp span', headTmpSpan);
        // for(let i=0; i<headTmpSpan.length; i++) {
        //   let hts = headTmpSpan[i]
        //   for(let k in hts) if(hts[k] > headSpan[i]) headSpan[i] = hts[k]
        // }
        console.log('head span', headSpan);
        var layersBias = [], totalLayer = 0;
        calc_each_key_layer(columnHeader, layersBias, 0, tbClass);
        for (var _d = 0, layersBias_2 = layersBias; _d < layersBias_2.length; _d++) {
            var lb = layersBias_2[_d];
            totalLayer += lb[0] + lb[1];
        }
        colDepth += totalLayer;
        console.log('layers bias', layersBias);
        console.log('total layer', totalLayer);
        var headKeySpan = new Array();
        for (var i = 0; i < headSpan.length; i++) {
            if (layersBias[i][0] > 0)
                headKeySpan.push(1);
            headKeySpan.push(headSpan[i]);
            if (layersBias[i][1] > 0)
                headKeySpan.push(1);
        }
        console.log("head key span", headKeySpan);
        var extra = {
            preVal: {},
            data: data.values,
            cell: cell,
            cellTable: Array.from({ length: colSize }, function () { return new Array(); }),
            attrInfo: attrInfo,
            rootSpan: Array.from({ length: columnHeader.length }, function () { return new Array(); }),
            rootIdList: Array.from({ length: columnHeader.length }, function () { return new Array(); }),
            layersBias: layersBias,
            headSpan: headSpan
        };
        interTable = Array.from({ length: colDepth }, function () { return new Array(colSize)
            .fill(null).map(function (_) { return ({ rowSpan: 1, colSpan: 1 }); }); });
        gen_inter_column_table(interTable, columnHeader, extra, colSize, 0, 0);
        // console.log('@@', interTable);
        var maxLength = 0, tmpLength = [];
        // // when cell is empty, fill one row/col(default)
        // for(let ct of extra.cellTable) {
        //   if(ct.length === 0) ct.push({rowSpan: 1, colSpan: 1})
        // }
        // console.log('cell', extra.cellTable);
        for (var j = 0; j < colSize; j++) {
            processTable[j] = [], tmpLength[j] = 0;
            for (var i = 0; i < colDepth; i++) {
                var tmp = interTable[i][j];
                if (tmp.isUsed) {
                    processTable[j].push({ isDelete: true });
                    continue;
                }
                if (tmp.value) {
                    processTable[j].push({
                        value: tmp.value,
                        // source: tmp.source,
                        sourceBlockId: tmp.sourceBlockId,
                        rowSpan: tmp.rowSpan,
                        colSpan: tmp.colSpan,
                        style: tmp.style
                    });
                }
                else {
                    processTable[j].push({
                        value: tmp.value,
                        // source: tmp.source,
                        sourceBlockId: tmp.sourceBlockId,
                        rowSpan: headKeySpan[i],
                        colSpan: 1,
                        style: tmp.style
                    });
                }
                for (var k = 0; k < tmp.colSpan; k++) {
                    interTable[i][j + k].isUsed = true;
                }
            }
            for (var _e = 0, _f = extra.cellTable[j]; _e < _f.length; _e++) {
                var c = _f[_e];
                tmpLength[j]++;
                processTable[j].push({
                    value: c.value,
                    // source: c.source,
                    sourceBlockId: c.sourceBlockId,
                    rowSpan: 1,
                    colSpan: 1,
                    style: c.style
                });
            }
            maxLength = maxLength > tmpLength[j] ? maxLength : tmpLength[j];
        }
        // fill empty unit
        for (var i = 0; i < processTable.length; i++) {
            var resLength = maxLength - tmpLength[i];
            for (var j = 0; j < resLength; j++)
                processTable[i].push({
                    value: undefined,
                    // source: undefined as any,
                    sourceBlockId: undefined,
                    rowSpan: 1,
                    colSpan: 1,
                    style: undefined
                });
        }
        // process blankLine and facet structure
        var info = {
            layersBias: layersBias,
            cellLength: maxLength + colDepth,
            tbClass: tbClass,
            // oldTable: JSON.parse(JSON.stringify(processTable))
        };
        gen_blank_facet_table(processTable, columnHeader, info, 0, 0);
        // console.log('new', processTable);
        finalTable = gen_final_table(processTable, tbClass);
        console.log('final column', finalTable);
    }
    else {
        // Row Header Process
        var headRowTmpSpan = Array.from({ length: rowDepth }, function () { return ({}); });
        var headRowSpan = new Array(rowDepth).fill(1);
        calc_head_span(rowHeader, headRowTmpSpan);
        console.log('head row tmp span', headRowTmpSpan);
        // for(let i=0; i<headRowTmpSpan.length; i++) {
        //   let hts = headRowTmpSpan[i]
        //   for(let k in hts) if(hts[k] > headRowSpan[i]) headRowSpan[i] = hts[k]
        // }
        console.log('head row span', headRowSpan);
        var layersRowBias = [], totalRowLayer = 0;
        calc_each_key_layer(rowHeader, layersRowBias, 0, ROW_TABLE);
        for (var _g = 0, layersRowBias_1 = layersRowBias; _g < layersRowBias_1.length; _g++) {
            var lb = layersRowBias_1[_g];
            totalRowLayer += lb[0] + lb[1];
        }
        rowDepth += totalRowLayer;
        console.log('layers row bias', layersRowBias);
        console.log('total row layer', totalRowLayer);
        var headKeyRowSpan = new Array();
        for (var i = 0; i < headRowSpan.length; i++) {
            if (layersRowBias[i][0] > 0)
                headKeyRowSpan.push(1);
            headKeyRowSpan.push(headRowSpan[i]);
            if (layersRowBias[i][1] > 0)
                headKeyRowSpan.push(1);
        }
        console.log("head key row span", headKeyRowSpan);
        var rowExtra = {
            preVal: {},
            data: data.values,
            cell: cell,
            cellTable: Array.from({ length: rowSize }, function () { return new Array(); }),
            attrInfo: attrInfo,
            layersBias: layersRowBias,
            headSpan: headRowSpan,
            notSearchCell: true,
            valIdx: new Array(),
        };
        // Column Header Process
        var headColTmpSpan = Array.from({ length: colDepth }, function () { return ({}); });
        var headColSpan = new Array(colDepth).fill(1);
        calc_head_span(columnHeader, headColTmpSpan);
        console.log('head col tmp span', headColTmpSpan);
        // for(let i=0; i<headColTmpSpan.length; i++) {
        //   let hts = headColTmpSpan[i]
        //   for(let k in hts) if(hts[k] > headColSpan[i]) headColSpan[i] = hts[k]
        // }
        console.log('head col span', headColSpan);
        var layersColBias = [], totalColLayer = 0;
        calc_each_key_layer(columnHeader, layersColBias, 0, COLUM_TABLE);
        for (var _h = 0, layersColBias_1 = layersColBias; _h < layersColBias_1.length; _h++) {
            var lb = layersColBias_1[_h];
            totalColLayer += lb[0] + lb[1];
        }
        colDepth += totalColLayer;
        console.log('layers col bias', layersColBias);
        console.log('total col layer', totalColLayer);
        var headKeyColSpan = new Array();
        for (var i = 0; i < headColSpan.length; i++) {
            if (layersColBias[i][0] > 0)
                headKeyColSpan.push(1);
            headKeyColSpan.push(headColSpan[i]);
            if (layersColBias[i][1] > 0)
                headKeyColSpan.push(1);
        }
        console.log("head key col span", headKeyColSpan);
        var colExtra = {
            preVal: {},
            data: data.values,
            cell: cell,
            cellTable: Array.from({ length: rowSize }, function () { return new Array(); }),
            attrInfo: attrInfo,
            layersBias: layersColBias,
            headSpan: headColSpan,
            notSearchCell: true,
            valIdx: new Array(),
        };
        // process interTable
        var crossSize = rowSize + colDepth, crossDepth_1 = rowDepth + colSize;
        interTable = Array.from({ length: crossSize }, function () { return new Array(crossDepth_1)
            .fill(null).map(function (_) { return ({ rowSpan: 1, colSpan: 1 }); }); });
        gen_inter_row_table(interTable, rowHeader, rowExtra, rowSize, 0, 0, colDepth);
        gen_inter_column_table(interTable, columnHeader, colExtra, colSize, 0, 0, rowDepth);
        // console.log('row valIdx', rowExtra.valIdx)
        // console.log('col valIdx', colExtra.valIdx);
        gen_inter_cross_table(interTable, rowExtra, colExtra, cell);
        // console.log('@', interTable)
        var rowPart = new Array(), colPart = new Array();
        if (get_header_is_facet(columnHeader)) {
            // columnHeader with cell
            var rowProcess = new Array(), rowProcTrans = new Array();
            for (var i = 0; i < rowSize; i++) {
                rowProcess[i] = new Array();
                for (var j = 0; j < crossDepth_1; j++) {
                    rowProcess[i].push(__assign({}, interTable[i + colDepth][j]));
                }
            }
            for (var i = 0; i < colDepth; i++) {
                colPart[i] = new Array();
                for (var j = 0; j < colSize; j++) {
                    colPart[i].push(__assign({}, interTable[i][j + rowDepth]));
                }
            }
            // process row part
            for (var i = 0; i < rowSize; i++) {
                rowProcTrans[i] = new Array();
                for (var j = 0; j < rowDepth; j++) {
                    var tmp = rowProcess[i][j];
                    if (tmp.isUsed) {
                        rowProcess[i][j] = { isDelete: true };
                        rowProcTrans[i].push(rowProcess[i][j]);
                        continue;
                    }
                    if (tmp.value) {
                        rowProcess[i][j] = {
                            value: tmp.value,
                            // source: tmp.source,
                            sourceBlockId: tmp.sourceBlockId,
                            rowSpan: tmp.rowSpan,
                            colSpan: tmp.colSpan,
                            style: tmp.style
                        };
                    }
                    else {
                        rowProcess[i][j] = {
                            value: tmp.value,
                            // source: tmp.source,
                            sourceBlockId: tmp.sourceBlockId,
                            rowSpan: 1,
                            colSpan: headKeyRowSpan[j],
                            style: tmp.style
                        };
                    }
                    rowProcTrans[i].push(__assign({}, rowProcess[i][j]));
                    for (var k = 0; k < tmp.rowSpan; k++) {
                        rowProcess[i + k][j].isUsed = true;
                    }
                }
                for (var j = rowDepth; j < crossDepth_1; j++)
                    rowProcTrans[i].push(rowProcess[i][j]);
            }
            var rowInfo = {
                layersBias: layersRowBias,
                cellLength: crossDepth_1,
                tbClass: ROW_TABLE,
            };
            gen_blank_facet_table(rowProcTrans, rowHeader, rowInfo, 0, 0);
            // console.log('transfer', rowProcTrans);
            rowProcess = gen_final_table(rowProcTrans, ROW_TABLE);
            // console.log('row process', rowProcess);
            for (var j = 0; j < rowDepth; j++) {
                rowPart[j] = new Array();
                for (var i = 0; i < rowProcess.length; i++) {
                    rowPart[j].push(rowProcess[i][j]);
                    for (var k = 1; k < rowProcess[i][j].rowSpan; k++) {
                        // rowPart[j].push({isDelete: true})
                        rowProcess[i + k].splice(j, 0, { isDelete: true });
                    }
                }
                for (var i = 0; i < colDepth; i++) {
                    rowPart[j].unshift({
                        rowSpan: headKeyColSpan[i],
                        colSpan: headKeyRowSpan[j]
                    });
                }
            }
            // console.log('row part', rowPart);
            // process column part
            var maxLength = 0;
            for (var i = 0; i < rowProcess.length; i++) {
                colPart[i + colDepth] = rowProcess[i].slice(rowDepth);
            }
            maxLength = colPart.length;
            // console.log('col part', colPart, maxLength);
            var colProcess = new Array();
            for (var j = 0; j < colSize; j++) {
                colProcess[j] = new Array();
                for (var i = 0; i < colDepth; i++) {
                    var tmp = colPart[i][j];
                    if (tmp.isUsed) {
                        colProcess[j].push({ isDelete: true });
                        continue;
                    }
                    if (tmp.value) {
                        colProcess[j].push({
                            value: tmp.value,
                            // source: tmp.source,
                            sourceBlockId: tmp.sourceBlockId,
                            rowSpan: tmp.rowSpan,
                            colSpan: tmp.colSpan,
                            style: tmp.style
                        });
                    }
                    else {
                        colProcess[j].push({
                            value: tmp.value,
                            // source: tmp.source,
                            sourceBlockId: tmp.sourceBlockId,
                            rowSpan: headKeyColSpan[i],
                            colSpan: 1,
                            style: tmp.style
                        });
                    }
                    for (var k = 0; k < tmp.colSpan; k++) {
                        colPart[i][j + k].isUsed = true;
                    }
                }
                for (var i = colDepth; i < colPart.length; i++) {
                    colProcess[j].push(colPart[i][j]);
                }
            }
            var colInfo = {
                layersBias: layersColBias,
                cellLength: maxLength,
                tbClass: COLUM_TABLE,
                alignHeader: rowPart,
            };
            gen_blank_facet_table(colProcess, columnHeader, colInfo, 0, 0);
            // console.log('new', colProcess, maxLength);
            colPart = gen_final_table(colProcess, COLUM_TABLE);
            // console.log('final', colPart);
            for (var j = 0; j < rowPart.length; j++) {
                for (var i = colDepth; i < rowPart[j].length; i++) {
                    if (!finalTable[i])
                        finalTable[i] = new Array();
                    if (!rowPart[j][i].isDelete)
                        finalTable[i].push(rowPart[j][i]);
                }
            }
            for (var i = 0; i < colPart.length; i++) {
                if (!finalTable[i])
                    finalTable[i] = new Array();
                for (var j = 0; j < colPart[i].length; j++) {
                    finalTable[i].push(colPart[i][j]);
                }
            }
            var rs = 0, cs = 0;
            for (var i = 0; i < colDepth; i++)
                rs += headKeyColSpan[i];
            for (var i = 0; i < rowDepth; i++)
                cs += headKeyRowSpan[i];
            finalTable[0].unshift({
                value: undefined, sourceBlockId: undefined,
                rowSpan: rs, colSpan: cs,
                style: undefined
            });
            console.log('final cross', finalTable);
        }
        else {
            // rowHeader with cell
            var colProcess = new Array(), colProcTrans = new Array();
            for (var i = 0; i < crossSize; i++) {
                colProcess[i] = new Array();
                for (var j = rowDepth; j < crossDepth_1; j++) {
                    colProcess[i].push(__assign({}, interTable[i][j]));
                }
            }
            for (var i = 0; i < rowSize; i++) {
                rowPart[i] = new Array();
                for (var j = 0; j < rowDepth; j++) {
                    rowPart[i].push(__assign({}, interTable[i + colDepth][j]));
                }
            }
            // process column part
            for (var j = 0; j < colSize; j++) {
                colProcTrans[j] = new Array();
                for (var i = 0; i < colDepth; i++) {
                    var tmp = colProcess[i][j];
                    if (tmp.isUsed) {
                        colProcess[i][j] = { isDelete: true };
                        colProcTrans[j].push(colProcess[i][j]);
                        continue;
                    }
                    if (tmp.value) {
                        colProcess[i][j] = {
                            value: tmp.value,
                            // source: tmp.source,
                            sourceBlockId: tmp.sourceBlockId,
                            rowSpan: tmp.rowSpan,
                            colSpan: tmp.colSpan,
                            style: tmp.style
                        };
                    }
                    else {
                        colProcess[i][j] = {
                            value: tmp.value,
                            // source: tmp.source,
                            sourceBlockId: tmp.sourceBlockId,
                            rowSpan: headKeyColSpan[i],
                            colSpan: 1,
                            style: tmp.style
                        };
                    }
                    colProcTrans[j].push(__assign({}, colProcess[i][j]));
                    for (var k = 0; k < tmp.colSpan; k++) {
                        colProcess[i][j + k].isUsed = true;
                    }
                }
                for (var i = colDepth; i < crossSize; i++)
                    colProcTrans[j].push(colProcess[i][j]);
            }
            var colInfo = {
                layersBias: layersColBias,
                cellLength: crossSize,
                tbClass: COLUM_TABLE,
            };
            gen_blank_facet_table(colProcTrans, columnHeader, colInfo, 0, 0);
            // console.log('transpose', colProcTrans);
            colProcess = gen_final_table(colProcTrans, COLUM_TABLE);
            // console.log('col process', colProcess);
            for (var i = 0; i < colDepth; i++) {
                // colPart[i] = colProcess[i]
                colPart[i] = new Array();
                for (var j = 0; j < colProcess[i].length; j++) {
                    colPart[i].push(colProcess[i][j]);
                    for (var k = 1; k < colProcess[i][j].colSpan; k++) {
                        colPart[i].push({ isDelete: true });
                    }
                }
                for (var j = 0; j < rowDepth; j++) {
                    colPart[i].unshift({
                        rowSpan: headKeyColSpan[i],
                        colSpan: headKeyRowSpan[j]
                    });
                }
            }
            // console.log('col part', colPart);
            // process raw part
            var maxLength = 0;
            for (var i = 0; i < rowSize; i++) {
                rowPart[i] = rowPart[i].concat(colProcess[i + colDepth]);
                if (maxLength < rowPart[i].length)
                    maxLength = rowPart[i].length;
            }
            // console.log('row part', rowPart, maxLength);
            var rowProcess = new Array();
            for (var i = 0; i < rowSize; i++) {
                rowProcess[i] = new Array();
                for (var j = 0; j < rowDepth; j++) {
                    var tmp = rowPart[i][j];
                    if (tmp.isUsed) {
                        rowProcess[i].push({ isDelete: true });
                        continue;
                    }
                    if (tmp.value) {
                        rowProcess[i].push({
                            value: tmp.value,
                            // source: tmp.source,
                            sourceBlockId: tmp.sourceBlockId,
                            rowSpan: tmp.rowSpan,
                            colSpan: tmp.colSpan,
                            style: tmp.style
                        });
                    }
                    else {
                        rowProcess[i].push({
                            value: tmp.value,
                            // source: tmp.source,
                            sourceBlockId: tmp.sourceBlockId,
                            rowSpan: 1,
                            colSpan: headKeyRowSpan[j],
                            style: tmp.style
                        });
                    }
                    for (var k = 0; k < tmp.rowSpan; k++) {
                        rowPart[i + k][j].isUsed = true;
                    }
                }
                for (var j = rowDepth; j < rowPart[i].length; j++) {
                    rowProcess[i].push(rowPart[i][j]);
                }
            }
            var rowInfo = {
                layersBias: layersRowBias,
                cellLength: maxLength,
                tbClass: ROW_TABLE,
                alignHeader: colPart,
            };
            gen_blank_facet_table(rowProcess, rowHeader, rowInfo, 0, 0);
            // console.log('new', rowProcess);
            rowPart = gen_final_table(rowProcess, ROW_TABLE);
            // console.log('final', rowPart);
            for (var i = 0; i < colPart.length; i++) {
                var tmp = colPart[i].slice(rowDepth);
                finalTable[i] = new Array();
                for (var j = 0; j < tmp.length; j++) {
                    if (!tmp[j].isDelete)
                        finalTable[i].push(tmp[j]);
                }
            }
            for (var i = 0; i < rowPart.length; i++) {
                finalTable[i + colPart.length] = rowPart[i];
            }
            var rs = 0, cs = 0;
            for (var i = 0; i < colDepth; i++)
                rs += headKeyColSpan[i];
            for (var i = 0; i < rowDepth; i++)
                cs += headKeyRowSpan[i];
            finalTable[0].unshift({
                value: undefined, sourceBlockId: undefined,
                rowSpan: rs, colSpan: cs,
                style: undefined
            });
            console.log('final cross', finalTable);
        }
    }
    var idDict = {
        "rowDict": get_header_id_dict(rowHeader),
        "colDict": get_header_id_dict(columnHeader),
        "cellDict": get_cell_id_dict(cell)
    };
    finalTable = gen_valid_value_table(finalTable, tbClass, data.values, idDict);
    finalTable = gen_styled_table(finalTable, styles, idDict);
    console.log(rowDepth, colDepth, rowSize, colSize);
    console.log(idDict);
    return finalTable;
};
var transform = function (task) {
    var data = task.data, spec = task.spec;
    try {
        spec_init({ data: data, spec: spec });
    }
    catch (err) {
        console.log('Warning:', err.message);
        return new Array();
    }
    var rowHeader = spec.rowHeader, columnHeader = spec.columnHeader, cell = spec.cell, styles = spec.styles, attrInfo = spec.attrInfo;
    // check table class
    var tableClass = "";
    if (rowHeader !== undefined && rowHeader.length > 0) {
        if (columnHeader !== undefined && columnHeader.length > 0)
            tableClass = CROSS_TABLE;
        else
            tableClass = ROW_TABLE;
    }
    else {
        tableClass = COLUM_TABLE;
    }
    return table_process(tableClass, data, { rowHeader: rowHeader, columnHeader: columnHeader, cell: cell, attrInfo: attrInfo, styles: styles });
};

var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    spec_init: spec_init,
    transform: transform
});

var index = { utils: utils };

export { index as default };
