"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/mdast-util-find-and-replace";
exports.ids = ["vendor-chunks/mdast-util-find-and-replace"];
exports.modules = {

/***/ "(ssr)/./node_modules/mdast-util-find-and-replace/lib/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/mdast-util-find-and-replace/lib/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   findAndReplace: () => (/* binding */ findAndReplace)\n/* harmony export */ });\n/* harmony import */ var escape_string_regexp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! escape-string-regexp */ \"(ssr)/./node_modules/escape-string-regexp/index.js\");\n/* harmony import */ var unist_util_visit_parents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! unist-util-visit-parents */ \"(ssr)/./node_modules/unist-util-visit-parents/lib/index.js\");\n/* harmony import */ var unist_util_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! unist-util-is */ \"(ssr)/./node_modules/unist-util-is/lib/index.js\");\n/**\n * @import {Nodes, Parents, PhrasingContent, Root, Text} from 'mdast'\n * @import {BuildVisitor, Test, VisitorResult} from 'unist-util-visit-parents'\n */\n\n/**\n * @typedef RegExpMatchObject\n *   Info on the match.\n * @property {number} index\n *   The index of the search at which the result was found.\n * @property {string} input\n *   A copy of the search string in the text node.\n * @property {[...Array<Parents>, Text]} stack\n *   All ancestors of the text node, where the last node is the text itself.\n *\n * @typedef {RegExp | string} Find\n *   Pattern to find.\n *\n *   Strings are escaped and then turned into global expressions.\n *\n * @typedef {Array<FindAndReplaceTuple>} FindAndReplaceList\n *   Several find and replaces, in array form.\n *\n * @typedef {[Find, Replace?]} FindAndReplaceTuple\n *   Find and replace in tuple form.\n *\n * @typedef {ReplaceFunction | string | null | undefined} Replace\n *   Thing to replace with.\n *\n * @callback ReplaceFunction\n *   Callback called when a search matches.\n * @param {...any} parameters\n *   The parameters are the result of corresponding search expression:\n *\n *   * `value` (`string`) — whole match\n *   * `...capture` (`Array<string>`) — matches from regex capture groups\n *   * `match` (`RegExpMatchObject`) — info on the match\n * @returns {Array<PhrasingContent> | PhrasingContent | string | false | null | undefined}\n *   Thing to replace with.\n *\n *   * when `null`, `undefined`, `''`, remove the match\n *   * …or when `false`, do not replace at all\n *   * …or when `string`, replace with a text node of that value\n *   * …or when `Node` or `Array<Node>`, replace with those nodes\n *\n * @typedef {[RegExp, ReplaceFunction]} Pair\n *   Normalized find and replace.\n *\n * @typedef {Array<Pair>} Pairs\n *   All find and replaced.\n *\n * @typedef Options\n *   Configuration.\n * @property {Test | null | undefined} [ignore]\n *   Test for which nodes to ignore (optional).\n */\n\n\n\n\n\n/**\n * Find patterns in a tree and replace them.\n *\n * The algorithm searches the tree in *preorder* for complete values in `Text`\n * nodes.\n * Partial matches are not supported.\n *\n * @param {Nodes} tree\n *   Tree to change.\n * @param {FindAndReplaceList | FindAndReplaceTuple} list\n *   Patterns to find.\n * @param {Options | null | undefined} [options]\n *   Configuration (when `find` is not `Find`).\n * @returns {undefined}\n *   Nothing.\n */\nfunction findAndReplace(tree, list, options) {\n  const settings = options || {}\n  const ignored = (0,unist_util_is__WEBPACK_IMPORTED_MODULE_1__.convert)(settings.ignore || [])\n  const pairs = toPairs(list)\n  let pairIndex = -1\n\n  while (++pairIndex < pairs.length) {\n    (0,unist_util_visit_parents__WEBPACK_IMPORTED_MODULE_2__.visitParents)(tree, 'text', visitor)\n  }\n\n  /** @type {BuildVisitor<Root, 'text'>} */\n  function visitor(node, parents) {\n    let index = -1\n    /** @type {Parents | undefined} */\n    let grandparent\n\n    while (++index < parents.length) {\n      const parent = parents[index]\n      /** @type {Array<Nodes> | undefined} */\n      const siblings = grandparent ? grandparent.children : undefined\n\n      if (\n        ignored(\n          parent,\n          siblings ? siblings.indexOf(parent) : undefined,\n          grandparent\n        )\n      ) {\n        return\n      }\n\n      grandparent = parent\n    }\n\n    if (grandparent) {\n      return handler(node, parents)\n    }\n  }\n\n  /**\n   * Handle a text node which is not in an ignored parent.\n   *\n   * @param {Text} node\n   *   Text node.\n   * @param {Array<Parents>} parents\n   *   Parents.\n   * @returns {VisitorResult}\n   *   Result.\n   */\n  function handler(node, parents) {\n    const parent = parents[parents.length - 1]\n    const find = pairs[pairIndex][0]\n    const replace = pairs[pairIndex][1]\n    let start = 0\n    /** @type {Array<Nodes>} */\n    const siblings = parent.children\n    const index = siblings.indexOf(node)\n    let change = false\n    /** @type {Array<PhrasingContent>} */\n    let nodes = []\n\n    find.lastIndex = 0\n\n    let match = find.exec(node.value)\n\n    while (match) {\n      const position = match.index\n      /** @type {RegExpMatchObject} */\n      const matchObject = {\n        index: match.index,\n        input: match.input,\n        stack: [...parents, node]\n      }\n      let value = replace(...match, matchObject)\n\n      if (typeof value === 'string') {\n        value = value.length > 0 ? {type: 'text', value} : undefined\n      }\n\n      // It wasn’t a match after all.\n      if (value === false) {\n        // False acts as if there was no match.\n        // So we need to reset `lastIndex`, which currently being at the end of\n        // the current match, to the beginning.\n        find.lastIndex = position + 1\n      } else {\n        if (start !== position) {\n          nodes.push({\n            type: 'text',\n            value: node.value.slice(start, position)\n          })\n        }\n\n        if (Array.isArray(value)) {\n          nodes.push(...value)\n        } else if (value) {\n          nodes.push(value)\n        }\n\n        start = position + match[0].length\n        change = true\n      }\n\n      if (!find.global) {\n        break\n      }\n\n      match = find.exec(node.value)\n    }\n\n    if (change) {\n      if (start < node.value.length) {\n        nodes.push({type: 'text', value: node.value.slice(start)})\n      }\n\n      parent.children.splice(index, 1, ...nodes)\n    } else {\n      nodes = [node]\n    }\n\n    return index + nodes.length\n  }\n}\n\n/**\n * Turn a tuple or a list of tuples into pairs.\n *\n * @param {FindAndReplaceList | FindAndReplaceTuple} tupleOrList\n *   Schema.\n * @returns {Pairs}\n *   Clean pairs.\n */\nfunction toPairs(tupleOrList) {\n  /** @type {Pairs} */\n  const result = []\n\n  if (!Array.isArray(tupleOrList)) {\n    throw new TypeError('Expected find and replace tuple or list of tuples')\n  }\n\n  /** @type {FindAndReplaceList} */\n  // @ts-expect-error: correct.\n  const list =\n    !tupleOrList[0] || Array.isArray(tupleOrList[0])\n      ? tupleOrList\n      : [tupleOrList]\n\n  let index = -1\n\n  while (++index < list.length) {\n    const tuple = list[index]\n    result.push([toExpression(tuple[0]), toFunction(tuple[1])])\n  }\n\n  return result\n}\n\n/**\n * Turn a find into an expression.\n *\n * @param {Find} find\n *   Find.\n * @returns {RegExp}\n *   Expression.\n */\nfunction toExpression(find) {\n  return typeof find === 'string' ? new RegExp((0,escape_string_regexp__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(find), 'g') : find\n}\n\n/**\n * Turn a replace into a function.\n *\n * @param {Replace} replace\n *   Replace.\n * @returns {ReplaceFunction}\n *   Function.\n */\nfunction toFunction(replace) {\n  return typeof replace === 'function'\n    ? replace\n    : function () {\n        return replace\n      }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWRhc3QtdXRpbC1maW5kLWFuZC1yZXBsYWNlL2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQSxZQUFZLDZDQUE2QztBQUN6RCxZQUFZLG1DQUFtQztBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFFBQVE7QUFDdEI7QUFDQSxjQUFjLFFBQVE7QUFDdEI7QUFDQSxjQUFjLDJCQUEyQjtBQUN6QztBQUNBO0FBQ0EsYUFBYSxpQkFBaUI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLDRCQUE0QjtBQUN6QztBQUNBO0FBQ0EsYUFBYSxrQkFBa0I7QUFDL0I7QUFDQTtBQUNBLGFBQWEsNkNBQTZDO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLDJCQUEyQjtBQUN4QztBQUNBO0FBQ0EsYUFBYSxhQUFhO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyx5QkFBeUI7QUFDdkM7QUFDQTs7QUFFeUM7QUFDWTtBQUNoQjs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQSxXQUFXLDBDQUEwQztBQUNyRDtBQUNBLFdBQVcsNEJBQTRCO0FBQ3ZDO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDTztBQUNQO0FBQ0Esa0JBQWtCLHNEQUFPO0FBQ3pCO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLHNFQUFZO0FBQ2hCOztBQUVBLGFBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQSxlQUFlLHFCQUFxQjtBQUNwQzs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLDBCQUEwQjtBQUMzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQSxhQUFhLGdCQUFnQjtBQUM3QjtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsY0FBYztBQUM3QjtBQUNBO0FBQ0E7QUFDQSxlQUFlLHdCQUF3QjtBQUN2Qzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0MscUJBQXFCO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsNkNBQTZDO0FBQ2pFOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMENBQTBDO0FBQ3JEO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxvQkFBb0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsZ0VBQU07QUFDckQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL2dhZ2VtY2NveS9Eb2N1bWVudHMvQ2hhdEdlbml1cy9ub2RlX21vZHVsZXMvbWRhc3QtdXRpbC1maW5kLWFuZC1yZXBsYWNlL2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBpbXBvcnQge05vZGVzLCBQYXJlbnRzLCBQaHJhc2luZ0NvbnRlbnQsIFJvb3QsIFRleHR9IGZyb20gJ21kYXN0J1xuICogQGltcG9ydCB7QnVpbGRWaXNpdG9yLCBUZXN0LCBWaXNpdG9yUmVzdWx0fSBmcm9tICd1bmlzdC11dGlsLXZpc2l0LXBhcmVudHMnXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiBSZWdFeHBNYXRjaE9iamVjdFxuICogICBJbmZvIG9uIHRoZSBtYXRjaC5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBpbmRleFxuICogICBUaGUgaW5kZXggb2YgdGhlIHNlYXJjaCBhdCB3aGljaCB0aGUgcmVzdWx0IHdhcyBmb3VuZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpbnB1dFxuICogICBBIGNvcHkgb2YgdGhlIHNlYXJjaCBzdHJpbmcgaW4gdGhlIHRleHQgbm9kZS5cbiAqIEBwcm9wZXJ0eSB7Wy4uLkFycmF5PFBhcmVudHM+LCBUZXh0XX0gc3RhY2tcbiAqICAgQWxsIGFuY2VzdG9ycyBvZiB0aGUgdGV4dCBub2RlLCB3aGVyZSB0aGUgbGFzdCBub2RlIGlzIHRoZSB0ZXh0IGl0c2VsZi5cbiAqXG4gKiBAdHlwZWRlZiB7UmVnRXhwIHwgc3RyaW5nfSBGaW5kXG4gKiAgIFBhdHRlcm4gdG8gZmluZC5cbiAqXG4gKiAgIFN0cmluZ3MgYXJlIGVzY2FwZWQgYW5kIHRoZW4gdHVybmVkIGludG8gZ2xvYmFsIGV4cHJlc3Npb25zLlxuICpcbiAqIEB0eXBlZGVmIHtBcnJheTxGaW5kQW5kUmVwbGFjZVR1cGxlPn0gRmluZEFuZFJlcGxhY2VMaXN0XG4gKiAgIFNldmVyYWwgZmluZCBhbmQgcmVwbGFjZXMsIGluIGFycmF5IGZvcm0uXG4gKlxuICogQHR5cGVkZWYge1tGaW5kLCBSZXBsYWNlP119IEZpbmRBbmRSZXBsYWNlVHVwbGVcbiAqICAgRmluZCBhbmQgcmVwbGFjZSBpbiB0dXBsZSBmb3JtLlxuICpcbiAqIEB0eXBlZGVmIHtSZXBsYWNlRnVuY3Rpb24gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkfSBSZXBsYWNlXG4gKiAgIFRoaW5nIHRvIHJlcGxhY2Ugd2l0aC5cbiAqXG4gKiBAY2FsbGJhY2sgUmVwbGFjZUZ1bmN0aW9uXG4gKiAgIENhbGxiYWNrIGNhbGxlZCB3aGVuIGEgc2VhcmNoIG1hdGNoZXMuXG4gKiBAcGFyYW0gey4uLmFueX0gcGFyYW1ldGVyc1xuICogICBUaGUgcGFyYW1ldGVycyBhcmUgdGhlIHJlc3VsdCBvZiBjb3JyZXNwb25kaW5nIHNlYXJjaCBleHByZXNzaW9uOlxuICpcbiAqICAgKiBgdmFsdWVgIChgc3RyaW5nYCkg4oCUIHdob2xlIG1hdGNoXG4gKiAgICogYC4uLmNhcHR1cmVgIChgQXJyYXk8c3RyaW5nPmApIOKAlCBtYXRjaGVzIGZyb20gcmVnZXggY2FwdHVyZSBncm91cHNcbiAqICAgKiBgbWF0Y2hgIChgUmVnRXhwTWF0Y2hPYmplY3RgKSDigJQgaW5mbyBvbiB0aGUgbWF0Y2hcbiAqIEByZXR1cm5zIHtBcnJheTxQaHJhc2luZ0NvbnRlbnQ+IHwgUGhyYXNpbmdDb250ZW50IHwgc3RyaW5nIHwgZmFsc2UgfCBudWxsIHwgdW5kZWZpbmVkfVxuICogICBUaGluZyB0byByZXBsYWNlIHdpdGguXG4gKlxuICogICAqIHdoZW4gYG51bGxgLCBgdW5kZWZpbmVkYCwgYCcnYCwgcmVtb3ZlIHRoZSBtYXRjaFxuICogICAqIOKApm9yIHdoZW4gYGZhbHNlYCwgZG8gbm90IHJlcGxhY2UgYXQgYWxsXG4gKiAgICog4oCmb3Igd2hlbiBgc3RyaW5nYCwgcmVwbGFjZSB3aXRoIGEgdGV4dCBub2RlIG9mIHRoYXQgdmFsdWVcbiAqICAgKiDigKZvciB3aGVuIGBOb2RlYCBvciBgQXJyYXk8Tm9kZT5gLCByZXBsYWNlIHdpdGggdGhvc2Ugbm9kZXNcbiAqXG4gKiBAdHlwZWRlZiB7W1JlZ0V4cCwgUmVwbGFjZUZ1bmN0aW9uXX0gUGFpclxuICogICBOb3JtYWxpemVkIGZpbmQgYW5kIHJlcGxhY2UuXG4gKlxuICogQHR5cGVkZWYge0FycmF5PFBhaXI+fSBQYWlyc1xuICogICBBbGwgZmluZCBhbmQgcmVwbGFjZWQuXG4gKlxuICogQHR5cGVkZWYgT3B0aW9uc1xuICogICBDb25maWd1cmF0aW9uLlxuICogQHByb3BlcnR5IHtUZXN0IHwgbnVsbCB8IHVuZGVmaW5lZH0gW2lnbm9yZV1cbiAqICAgVGVzdCBmb3Igd2hpY2ggbm9kZXMgdG8gaWdub3JlIChvcHRpb25hbCkuXG4gKi9cblxuaW1wb3J0IGVzY2FwZSBmcm9tICdlc2NhcGUtc3RyaW5nLXJlZ2V4cCdcbmltcG9ydCB7dmlzaXRQYXJlbnRzfSBmcm9tICd1bmlzdC11dGlsLXZpc2l0LXBhcmVudHMnXG5pbXBvcnQge2NvbnZlcnR9IGZyb20gJ3VuaXN0LXV0aWwtaXMnXG5cbi8qKlxuICogRmluZCBwYXR0ZXJucyBpbiBhIHRyZWUgYW5kIHJlcGxhY2UgdGhlbS5cbiAqXG4gKiBUaGUgYWxnb3JpdGhtIHNlYXJjaGVzIHRoZSB0cmVlIGluICpwcmVvcmRlciogZm9yIGNvbXBsZXRlIHZhbHVlcyBpbiBgVGV4dGBcbiAqIG5vZGVzLlxuICogUGFydGlhbCBtYXRjaGVzIGFyZSBub3Qgc3VwcG9ydGVkLlxuICpcbiAqIEBwYXJhbSB7Tm9kZXN9IHRyZWVcbiAqICAgVHJlZSB0byBjaGFuZ2UuXG4gKiBAcGFyYW0ge0ZpbmRBbmRSZXBsYWNlTGlzdCB8IEZpbmRBbmRSZXBsYWNlVHVwbGV9IGxpc3RcbiAqICAgUGF0dGVybnMgdG8gZmluZC5cbiAqIEBwYXJhbSB7T3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWR9IFtvcHRpb25zXVxuICogICBDb25maWd1cmF0aW9uICh3aGVuIGBmaW5kYCBpcyBub3QgYEZpbmRgKS5cbiAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gKiAgIE5vdGhpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQW5kUmVwbGFjZSh0cmVlLCBsaXN0LCBvcHRpb25zKSB7XG4gIGNvbnN0IHNldHRpbmdzID0gb3B0aW9ucyB8fCB7fVxuICBjb25zdCBpZ25vcmVkID0gY29udmVydChzZXR0aW5ncy5pZ25vcmUgfHwgW10pXG4gIGNvbnN0IHBhaXJzID0gdG9QYWlycyhsaXN0KVxuICBsZXQgcGFpckluZGV4ID0gLTFcblxuICB3aGlsZSAoKytwYWlySW5kZXggPCBwYWlycy5sZW5ndGgpIHtcbiAgICB2aXNpdFBhcmVudHModHJlZSwgJ3RleHQnLCB2aXNpdG9yKVxuICB9XG5cbiAgLyoqIEB0eXBlIHtCdWlsZFZpc2l0b3I8Um9vdCwgJ3RleHQnPn0gKi9cbiAgZnVuY3Rpb24gdmlzaXRvcihub2RlLCBwYXJlbnRzKSB7XG4gICAgbGV0IGluZGV4ID0gLTFcbiAgICAvKiogQHR5cGUge1BhcmVudHMgfCB1bmRlZmluZWR9ICovXG4gICAgbGV0IGdyYW5kcGFyZW50XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IHBhcmVudHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSBwYXJlbnRzW2luZGV4XVxuICAgICAgLyoqIEB0eXBlIHtBcnJheTxOb2Rlcz4gfCB1bmRlZmluZWR9ICovXG4gICAgICBjb25zdCBzaWJsaW5ncyA9IGdyYW5kcGFyZW50ID8gZ3JhbmRwYXJlbnQuY2hpbGRyZW4gOiB1bmRlZmluZWRcblxuICAgICAgaWYgKFxuICAgICAgICBpZ25vcmVkKFxuICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICBzaWJsaW5ncyA/IHNpYmxpbmdzLmluZGV4T2YocGFyZW50KSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBncmFuZHBhcmVudFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGdyYW5kcGFyZW50ID0gcGFyZW50XG4gICAgfVxuXG4gICAgaWYgKGdyYW5kcGFyZW50KSB7XG4gICAgICByZXR1cm4gaGFuZGxlcihub2RlLCBwYXJlbnRzKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgYSB0ZXh0IG5vZGUgd2hpY2ggaXMgbm90IGluIGFuIGlnbm9yZWQgcGFyZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1RleHR9IG5vZGVcbiAgICogICBUZXh0IG5vZGUuXG4gICAqIEBwYXJhbSB7QXJyYXk8UGFyZW50cz59IHBhcmVudHNcbiAgICogICBQYXJlbnRzLlxuICAgKiBAcmV0dXJucyB7VmlzaXRvclJlc3VsdH1cbiAgICogICBSZXN1bHQuXG4gICAqL1xuICBmdW5jdGlvbiBoYW5kbGVyKG5vZGUsIHBhcmVudHMpIHtcbiAgICBjb25zdCBwYXJlbnQgPSBwYXJlbnRzW3BhcmVudHMubGVuZ3RoIC0gMV1cbiAgICBjb25zdCBmaW5kID0gcGFpcnNbcGFpckluZGV4XVswXVxuICAgIGNvbnN0IHJlcGxhY2UgPSBwYWlyc1twYWlySW5kZXhdWzFdXG4gICAgbGV0IHN0YXJ0ID0gMFxuICAgIC8qKiBAdHlwZSB7QXJyYXk8Tm9kZXM+fSAqL1xuICAgIGNvbnN0IHNpYmxpbmdzID0gcGFyZW50LmNoaWxkcmVuXG4gICAgY29uc3QgaW5kZXggPSBzaWJsaW5ncy5pbmRleE9mKG5vZGUpXG4gICAgbGV0IGNoYW5nZSA9IGZhbHNlXG4gICAgLyoqIEB0eXBlIHtBcnJheTxQaHJhc2luZ0NvbnRlbnQ+fSAqL1xuICAgIGxldCBub2RlcyA9IFtdXG5cbiAgICBmaW5kLmxhc3RJbmRleCA9IDBcblxuICAgIGxldCBtYXRjaCA9IGZpbmQuZXhlYyhub2RlLnZhbHVlKVxuXG4gICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IG1hdGNoLmluZGV4XG4gICAgICAvKiogQHR5cGUge1JlZ0V4cE1hdGNoT2JqZWN0fSAqL1xuICAgICAgY29uc3QgbWF0Y2hPYmplY3QgPSB7XG4gICAgICAgIGluZGV4OiBtYXRjaC5pbmRleCxcbiAgICAgICAgaW5wdXQ6IG1hdGNoLmlucHV0LFxuICAgICAgICBzdGFjazogWy4uLnBhcmVudHMsIG5vZGVdXG4gICAgICB9XG4gICAgICBsZXQgdmFsdWUgPSByZXBsYWNlKC4uLm1hdGNoLCBtYXRjaE9iamVjdClcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5sZW5ndGggPiAwID8ge3R5cGU6ICd0ZXh0JywgdmFsdWV9IDogdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIC8vIEl0IHdhc27igJl0IGEgbWF0Y2ggYWZ0ZXIgYWxsLlxuICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAvLyBGYWxzZSBhY3RzIGFzIGlmIHRoZXJlIHdhcyBubyBtYXRjaC5cbiAgICAgICAgLy8gU28gd2UgbmVlZCB0byByZXNldCBgbGFzdEluZGV4YCwgd2hpY2ggY3VycmVudGx5IGJlaW5nIGF0IHRoZSBlbmQgb2ZcbiAgICAgICAgLy8gdGhlIGN1cnJlbnQgbWF0Y2gsIHRvIHRoZSBiZWdpbm5pbmcuXG4gICAgICAgIGZpbmQubGFzdEluZGV4ID0gcG9zaXRpb24gKyAxXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3RhcnQgIT09IHBvc2l0aW9uKSB7XG4gICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICB2YWx1ZTogbm9kZS52YWx1ZS5zbGljZShzdGFydCwgcG9zaXRpb24pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIG5vZGVzLnB1c2goLi4udmFsdWUpXG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgICBub2Rlcy5wdXNoKHZhbHVlKVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQgPSBwb3NpdGlvbiArIG1hdGNoWzBdLmxlbmd0aFxuICAgICAgICBjaGFuZ2UgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICghZmluZC5nbG9iYWwpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgbWF0Y2ggPSBmaW5kLmV4ZWMobm9kZS52YWx1ZSlcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlKSB7XG4gICAgICBpZiAoc3RhcnQgPCBub2RlLnZhbHVlLmxlbmd0aCkge1xuICAgICAgICBub2Rlcy5wdXNoKHt0eXBlOiAndGV4dCcsIHZhbHVlOiBub2RlLnZhbHVlLnNsaWNlKHN0YXJ0KX0pXG4gICAgICB9XG5cbiAgICAgIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEsIC4uLm5vZGVzKVxuICAgIH0gZWxzZSB7XG4gICAgICBub2RlcyA9IFtub2RlXVxuICAgIH1cblxuICAgIHJldHVybiBpbmRleCArIG5vZGVzLmxlbmd0aFxuICB9XG59XG5cbi8qKlxuICogVHVybiBhIHR1cGxlIG9yIGEgbGlzdCBvZiB0dXBsZXMgaW50byBwYWlycy5cbiAqXG4gKiBAcGFyYW0ge0ZpbmRBbmRSZXBsYWNlTGlzdCB8IEZpbmRBbmRSZXBsYWNlVHVwbGV9IHR1cGxlT3JMaXN0XG4gKiAgIFNjaGVtYS5cbiAqIEByZXR1cm5zIHtQYWlyc31cbiAqICAgQ2xlYW4gcGFpcnMuXG4gKi9cbmZ1bmN0aW9uIHRvUGFpcnModHVwbGVPckxpc3QpIHtcbiAgLyoqIEB0eXBlIHtQYWlyc30gKi9cbiAgY29uc3QgcmVzdWx0ID0gW11cblxuICBpZiAoIUFycmF5LmlzQXJyYXkodHVwbGVPckxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgZmluZCBhbmQgcmVwbGFjZSB0dXBsZSBvciBsaXN0IG9mIHR1cGxlcycpXG4gIH1cblxuICAvKiogQHR5cGUge0ZpbmRBbmRSZXBsYWNlTGlzdH0gKi9cbiAgLy8gQHRzLWV4cGVjdC1lcnJvcjogY29ycmVjdC5cbiAgY29uc3QgbGlzdCA9XG4gICAgIXR1cGxlT3JMaXN0WzBdIHx8IEFycmF5LmlzQXJyYXkodHVwbGVPckxpc3RbMF0pXG4gICAgICA/IHR1cGxlT3JMaXN0XG4gICAgICA6IFt0dXBsZU9yTGlzdF1cblxuICBsZXQgaW5kZXggPSAtMVxuXG4gIHdoaWxlICgrK2luZGV4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICBjb25zdCB0dXBsZSA9IGxpc3RbaW5kZXhdXG4gICAgcmVzdWx0LnB1c2goW3RvRXhwcmVzc2lvbih0dXBsZVswXSksIHRvRnVuY3Rpb24odHVwbGVbMV0pXSlcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuLyoqXG4gKiBUdXJuIGEgZmluZCBpbnRvIGFuIGV4cHJlc3Npb24uXG4gKlxuICogQHBhcmFtIHtGaW5kfSBmaW5kXG4gKiAgIEZpbmQuXG4gKiBAcmV0dXJucyB7UmVnRXhwfVxuICogICBFeHByZXNzaW9uLlxuICovXG5mdW5jdGlvbiB0b0V4cHJlc3Npb24oZmluZCkge1xuICByZXR1cm4gdHlwZW9mIGZpbmQgPT09ICdzdHJpbmcnID8gbmV3IFJlZ0V4cChlc2NhcGUoZmluZCksICdnJykgOiBmaW5kXG59XG5cbi8qKlxuICogVHVybiBhIHJlcGxhY2UgaW50byBhIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7UmVwbGFjZX0gcmVwbGFjZVxuICogICBSZXBsYWNlLlxuICogQHJldHVybnMge1JlcGxhY2VGdW5jdGlvbn1cbiAqICAgRnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHRvRnVuY3Rpb24ocmVwbGFjZSkge1xuICByZXR1cm4gdHlwZW9mIHJlcGxhY2UgPT09ICdmdW5jdGlvbidcbiAgICA/IHJlcGxhY2VcbiAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlcGxhY2VcbiAgICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/mdast-util-find-and-replace/lib/index.js\n");

/***/ })

};
;