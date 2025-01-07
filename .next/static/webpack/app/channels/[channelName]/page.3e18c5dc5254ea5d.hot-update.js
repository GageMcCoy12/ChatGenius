"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/channels/[channelName]/page",{

/***/ "(app-pages-browser)/./components/MessageReactions.tsx":
/*!*****************************************!*\
  !*** ./components/MessageReactions.tsx ***!
  \*****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MessageReactions: () => (/* binding */ MessageReactions)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _clerk_nextjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @clerk/nextjs */ \"(app-pages-browser)/./node_modules/@clerk/clerk-react/dist/index.mjs\");\n/* harmony import */ var _components_ui_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/ui/button */ \"(app-pages-browser)/./components/ui/button.tsx\");\n/* harmony import */ var _components_ui_popover__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/popover */ \"(app-pages-browser)/./components/ui/popover.tsx\");\n/* harmony import */ var _barrel_optimize_names_Smile_lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! __barrel_optimize__?names=Smile!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/smile.js\");\n/* harmony import */ var _emoji_mart_data__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @emoji-mart/data */ \"(app-pages-browser)/./node_modules/@emoji-mart/data/sets/15/native.json\");\n/* harmony import */ var _emoji_mart_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emoji-mart/react */ \"(app-pages-browser)/./node_modules/@emoji-mart/react/dist/module.js\");\n/* __next_internal_client_entry_do_not_use__ MessageReactions auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\nfunction MessageReactions(param) {\n    let { messageId, initialReactions, onReactionsUpdate } = param;\n    _s();\n    const { user } = (0,_clerk_nextjs__WEBPACK_IMPORTED_MODULE_5__.useUser)();\n    const [reactions, setReactions] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialReactions);\n    const [isPickerOpen, setIsPickerOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const handleEmojiSelect = (emoji)=>{\n        if (!user) return;\n        const newReaction = {\n            id: \"temp-\".concat(Date.now()),\n            emoji: emoji.native,\n            userId: user.id,\n            user: {\n                id: user.id,\n                username: user.username || user.firstName || 'User',\n                imageURL: user.imageUrl\n            }\n        };\n        // Check if user has already used this emoji\n        const existingReactionIndex = reactions.findIndex((r)=>r.emoji === emoji.native && r.userId === user.id);\n        let updatedReactions;\n        if (existingReactionIndex > -1) {\n            // Remove the reaction if it exists\n            updatedReactions = reactions.filter((_, index)=>index !== existingReactionIndex);\n        } else {\n            // Add the new reaction\n            updatedReactions = [\n                ...reactions,\n                newReaction\n            ];\n        }\n        setReactions(updatedReactions);\n        onReactionsUpdate(messageId, updatedReactions);\n        setIsPickerOpen(false);\n    };\n    // Group reactions by emoji\n    const groupedReactions = reactions.reduce((acc, reaction)=>{\n        if (!acc[reaction.emoji]) {\n            acc[reaction.emoji] = [];\n        }\n        acc[reaction.emoji].push(reaction);\n        return acc;\n    }, {});\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex items-center gap-2 mt-1\",\n        children: [\n            Object.entries(groupedReactions).map((param)=>{\n                let [emoji, users] = param;\n                return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_button__WEBPACK_IMPORTED_MODULE_2__.Button, {\n                    variant: \"ghost\",\n                    size: \"sm\",\n                    className: \"h-6 px-2 text-xs\",\n                    onClick: ()=>handleEmojiSelect({\n                            native: emoji\n                        }),\n                    children: [\n                        emoji,\n                        \" \",\n                        users.length\n                    ]\n                }, emoji, true, {\n                    fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/MessageReactions.tsx\",\n                    lineNumber: 68,\n                    columnNumber: 9\n                }, this);\n            }),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_popover__WEBPACK_IMPORTED_MODULE_3__.Popover, {\n                open: isPickerOpen,\n                onOpenChange: setIsPickerOpen,\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_popover__WEBPACK_IMPORTED_MODULE_3__.PopoverTrigger, {\n                        asChild: true,\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_button__WEBPACK_IMPORTED_MODULE_2__.Button, {\n                            variant: \"ghost\",\n                            size: \"sm\",\n                            className: \"h-6 w-6 p-0\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Smile_lucide_react__WEBPACK_IMPORTED_MODULE_6__[\"default\"], {\n                                className: \"h-4 w-4\"\n                            }, void 0, false, {\n                                fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/MessageReactions.tsx\",\n                                lineNumber: 81,\n                                columnNumber: 13\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/MessageReactions.tsx\",\n                            lineNumber: 80,\n                            columnNumber: 11\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/MessageReactions.tsx\",\n                        lineNumber: 79,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_popover__WEBPACK_IMPORTED_MODULE_3__.PopoverContent, {\n                        className: \"w-full p-0 border-none\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_emoji_mart_react__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                            data: _emoji_mart_data__WEBPACK_IMPORTED_MODULE_7__,\n                            onEmojiSelect: handleEmojiSelect,\n                            theme: \"light\",\n                            previewPosition: \"none\",\n                            skinTonePosition: \"none\"\n                        }, void 0, false, {\n                            fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/MessageReactions.tsx\",\n                            lineNumber: 85,\n                            columnNumber: 11\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/MessageReactions.tsx\",\n                        lineNumber: 84,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/MessageReactions.tsx\",\n                lineNumber: 78,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/MessageReactions.tsx\",\n        lineNumber: 66,\n        columnNumber: 5\n    }, this);\n}\n_s(MessageReactions, \"zxheszFNviDyQFWEi4XtGX0QHYE=\", false, function() {\n    return [\n        _clerk_nextjs__WEBPACK_IMPORTED_MODULE_5__.useUser\n    ];\n});\n_c = MessageReactions;\nvar _c;\n$RefreshReg$(_c, \"MessageReactions\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvTWVzc2FnZVJlYWN0aW9ucy50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRWlDO0FBQ087QUFFUTtBQUNrQztBQUM3QztBQUNEO0FBQ0c7QUFRaEMsU0FBU1MsaUJBQWlCLEtBQXlFO1FBQXpFLEVBQUVDLFNBQVMsRUFBRUMsZ0JBQWdCLEVBQUVDLGlCQUFpQixFQUF5QixHQUF6RTs7SUFDL0IsTUFBTSxFQUFFQyxJQUFJLEVBQUUsR0FBR1osc0RBQU9BO0lBQ3hCLE1BQU0sQ0FBQ2EsV0FBV0MsYUFBYSxHQUFHZiwrQ0FBUUEsQ0FBQ1c7SUFDM0MsTUFBTSxDQUFDSyxjQUFjQyxnQkFBZ0IsR0FBR2pCLCtDQUFRQSxDQUFDO0lBRWpELE1BQU1rQixvQkFBb0IsQ0FBQ0M7UUFDekIsSUFBSSxDQUFDTixNQUFNO1FBRVgsTUFBTU8sY0FBYztZQUNsQkMsSUFBSSxRQUFtQixPQUFYQyxLQUFLQyxHQUFHO1lBQ3BCSixPQUFPQSxNQUFNSyxNQUFNO1lBQ25CQyxRQUFRWixLQUFLUSxFQUFFO1lBQ2ZSLE1BQU07Z0JBQ0pRLElBQUlSLEtBQUtRLEVBQUU7Z0JBQ1hLLFVBQVViLEtBQUthLFFBQVEsSUFBSWIsS0FBS2MsU0FBUyxJQUFJO2dCQUM3Q0MsVUFBVWYsS0FBS2dCLFFBQVE7WUFDekI7UUFDRjtRQUVBLDRDQUE0QztRQUM1QyxNQUFNQyx3QkFBd0JoQixVQUFVaUIsU0FBUyxDQUMvQ0MsQ0FBQUEsSUFBS0EsRUFBRWIsS0FBSyxLQUFLQSxNQUFNSyxNQUFNLElBQUlRLEVBQUVQLE1BQU0sS0FBS1osS0FBS1EsRUFBRTtRQUd2RCxJQUFJWTtRQUNKLElBQUlILHdCQUF3QixDQUFDLEdBQUc7WUFDOUIsbUNBQW1DO1lBQ25DRyxtQkFBbUJuQixVQUFVb0IsTUFBTSxDQUFDLENBQUNDLEdBQUdDLFFBQVVBLFVBQVVOO1FBQzlELE9BQU87WUFDTCx1QkFBdUI7WUFDdkJHLG1CQUFtQjttQkFBSW5CO2dCQUFXTTthQUFZO1FBQ2hEO1FBRUFMLGFBQWFrQjtRQUNickIsa0JBQWtCRixXQUFXdUI7UUFDN0JoQixnQkFBZ0I7SUFDbEI7SUFFQSwyQkFBMkI7SUFDM0IsTUFBTW9CLG1CQUFtQnZCLFVBQVV3QixNQUFNLENBQUMsQ0FBQ0MsS0FBS0M7UUFDOUMsSUFBSSxDQUFDRCxHQUFHLENBQUNDLFNBQVNyQixLQUFLLENBQUMsRUFBRTtZQUN4Qm9CLEdBQUcsQ0FBQ0MsU0FBU3JCLEtBQUssQ0FBQyxHQUFHLEVBQUU7UUFDMUI7UUFDQW9CLEdBQUcsQ0FBQ0MsU0FBU3JCLEtBQUssQ0FBQyxDQUFDc0IsSUFBSSxDQUFDRDtRQUN6QixPQUFPRDtJQUNULEdBQUcsQ0FBQztJQUVKLHFCQUNFLDhEQUFDRztRQUFJQyxXQUFVOztZQUNaQyxPQUFPQyxPQUFPLENBQUNSLGtCQUFrQlMsR0FBRyxDQUFDO29CQUFDLENBQUMzQixPQUFPNEIsTUFBTTtxQ0FDbkQsOERBQUM3Qyx5REFBTUE7b0JBRUw4QyxTQUFRO29CQUNSQyxNQUFLO29CQUNMTixXQUFVO29CQUNWTyxTQUFTLElBQU1oQyxrQkFBa0I7NEJBQUVNLFFBQVFMO3dCQUFNOzt3QkFFaERBO3dCQUFNO3dCQUFFNEIsTUFBTUksTUFBTTs7bUJBTmhCaEM7Ozs7OzswQkFTVCw4REFBQ2hCLDJEQUFPQTtnQkFBQ2lELE1BQU1wQztnQkFBY3FDLGNBQWNwQzs7a0NBQ3pDLDhEQUFDWixrRUFBY0E7d0JBQUNpRCxPQUFPO2tDQUNyQiw0RUFBQ3BELHlEQUFNQTs0QkFBQzhDLFNBQVE7NEJBQVFDLE1BQUs7NEJBQUtOLFdBQVU7c0NBQzFDLDRFQUFDckMsaUZBQUtBO2dDQUFDcUMsV0FBVTs7Ozs7Ozs7Ozs7Ozs7OztrQ0FHckIsOERBQUN2QyxrRUFBY0E7d0JBQUN1QyxXQUFVO2tDQUN4Qiw0RUFBQ25DLHlEQUFNQTs0QkFDTEQsTUFBTUEsNkNBQUlBOzRCQUNWZ0QsZUFBZXJDOzRCQUNmc0MsT0FBTTs0QkFDTkMsaUJBQWdCOzRCQUNoQkMsa0JBQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU03QjtHQTlFZ0JqRDs7UUFDR1Isa0RBQU9BOzs7S0FEVlEiLCJzb3VyY2VzIjpbIi9Vc2Vycy9nYWdlbWNjb3kvRG9jdW1lbnRzL0NoYXRHZW5pdXMvY29tcG9uZW50cy9NZXNzYWdlUmVhY3Rpb25zLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCc7XG5cbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVXNlciB9IGZyb20gJ0BjbGVyay9uZXh0anMnO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJ0AvdHlwZXMvbWVzc2FnZXMnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL2J1dHRvbic7XG5pbXBvcnQgeyBQb3BvdmVyLCBQb3BvdmVyQ29udGVudCwgUG9wb3ZlclRyaWdnZXIgfSBmcm9tICdAL2NvbXBvbmVudHMvdWkvcG9wb3Zlcic7XG5pbXBvcnQgeyBTbWlsZSB9IGZyb20gJ2x1Y2lkZS1yZWFjdCc7XG5pbXBvcnQgZGF0YSBmcm9tICdAZW1vamktbWFydC9kYXRhJztcbmltcG9ydCBQaWNrZXIgZnJvbSAnQGVtb2ppLW1hcnQvcmVhY3QnO1xuXG5pbnRlcmZhY2UgTWVzc2FnZVJlYWN0aW9uc1Byb3BzIHtcbiAgbWVzc2FnZUlkOiBzdHJpbmc7XG4gIGluaXRpYWxSZWFjdGlvbnM6IE1lc3NhZ2VbJ3JlYWN0aW9ucyddO1xuICBvblJlYWN0aW9uc1VwZGF0ZTogKG1lc3NhZ2VJZDogc3RyaW5nLCByZWFjdGlvbnM6IE1lc3NhZ2VbJ3JlYWN0aW9ucyddKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZVJlYWN0aW9ucyh7IG1lc3NhZ2VJZCwgaW5pdGlhbFJlYWN0aW9ucywgb25SZWFjdGlvbnNVcGRhdGUgfTogTWVzc2FnZVJlYWN0aW9uc1Byb3BzKSB7XG4gIGNvbnN0IHsgdXNlciB9ID0gdXNlVXNlcigpO1xuICBjb25zdCBbcmVhY3Rpb25zLCBzZXRSZWFjdGlvbnNdID0gdXNlU3RhdGUoaW5pdGlhbFJlYWN0aW9ucyk7XG4gIGNvbnN0IFtpc1BpY2tlck9wZW4sIHNldElzUGlja2VyT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgaGFuZGxlRW1vamlTZWxlY3QgPSAoZW1vamk6IGFueSkgPT4ge1xuICAgIGlmICghdXNlcikgcmV0dXJuO1xuXG4gICAgY29uc3QgbmV3UmVhY3Rpb24gPSB7XG4gICAgICBpZDogYHRlbXAtJHtEYXRlLm5vdygpfWAsIC8vIFRlbXBvcmFyeSBJRCwgc2VydmVyIHdpbGwgYXNzaWduIHJlYWwgb25lXG4gICAgICBlbW9qaTogZW1vamkubmF0aXZlLFxuICAgICAgdXNlcklkOiB1c2VyLmlkLFxuICAgICAgdXNlcjoge1xuICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUgfHwgdXNlci5maXJzdE5hbWUgfHwgJ1VzZXInLFxuICAgICAgICBpbWFnZVVSTDogdXNlci5pbWFnZVVybCxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIC8vIENoZWNrIGlmIHVzZXIgaGFzIGFscmVhZHkgdXNlZCB0aGlzIGVtb2ppXG4gICAgY29uc3QgZXhpc3RpbmdSZWFjdGlvbkluZGV4ID0gcmVhY3Rpb25zLmZpbmRJbmRleChcbiAgICAgIHIgPT4gci5lbW9qaSA9PT0gZW1vamkubmF0aXZlICYmIHIudXNlcklkID09PSB1c2VyLmlkXG4gICAgKTtcblxuICAgIGxldCB1cGRhdGVkUmVhY3Rpb25zO1xuICAgIGlmIChleGlzdGluZ1JlYWN0aW9uSW5kZXggPiAtMSkge1xuICAgICAgLy8gUmVtb3ZlIHRoZSByZWFjdGlvbiBpZiBpdCBleGlzdHNcbiAgICAgIHVwZGF0ZWRSZWFjdGlvbnMgPSByZWFjdGlvbnMuZmlsdGVyKChfLCBpbmRleCkgPT4gaW5kZXggIT09IGV4aXN0aW5nUmVhY3Rpb25JbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFkZCB0aGUgbmV3IHJlYWN0aW9uXG4gICAgICB1cGRhdGVkUmVhY3Rpb25zID0gWy4uLnJlYWN0aW9ucywgbmV3UmVhY3Rpb25dO1xuICAgIH1cblxuICAgIHNldFJlYWN0aW9ucyh1cGRhdGVkUmVhY3Rpb25zKTtcbiAgICBvblJlYWN0aW9uc1VwZGF0ZShtZXNzYWdlSWQsIHVwZGF0ZWRSZWFjdGlvbnMpO1xuICAgIHNldElzUGlja2VyT3BlbihmYWxzZSk7XG4gIH07XG5cbiAgLy8gR3JvdXAgcmVhY3Rpb25zIGJ5IGVtb2ppXG4gIGNvbnN0IGdyb3VwZWRSZWFjdGlvbnMgPSByZWFjdGlvbnMucmVkdWNlKChhY2MsIHJlYWN0aW9uKSA9PiB7XG4gICAgaWYgKCFhY2NbcmVhY3Rpb24uZW1vamldKSB7XG4gICAgICBhY2NbcmVhY3Rpb24uZW1vamldID0gW107XG4gICAgfVxuICAgIGFjY1tyZWFjdGlvbi5lbW9qaV0ucHVzaChyZWFjdGlvbik7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgdHlwZW9mIHJlYWN0aW9ucz4pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBtdC0xXCI+XG4gICAgICB7T2JqZWN0LmVudHJpZXMoZ3JvdXBlZFJlYWN0aW9ucykubWFwKChbZW1vamksIHVzZXJzXSkgPT4gKFxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAga2V5PXtlbW9qaX1cbiAgICAgICAgICB2YXJpYW50PVwiZ2hvc3RcIlxuICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiaC02IHB4LTIgdGV4dC14c1wiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlRW1vamlTZWxlY3QoeyBuYXRpdmU6IGVtb2ppIH0pfVxuICAgICAgICA+XG4gICAgICAgICAge2Vtb2ppfSB7dXNlcnMubGVuZ3RofVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICkpfVxuICAgICAgPFBvcG92ZXIgb3Blbj17aXNQaWNrZXJPcGVufSBvbk9wZW5DaGFuZ2U9e3NldElzUGlja2VyT3Blbn0+XG4gICAgICAgIDxQb3BvdmVyVHJpZ2dlciBhc0NoaWxkPlxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cImdob3N0XCIgc2l6ZT1cInNtXCIgY2xhc3NOYW1lPVwiaC02IHctNiBwLTBcIj5cbiAgICAgICAgICAgIDxTbWlsZSBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Qb3BvdmVyVHJpZ2dlcj5cbiAgICAgICAgPFBvcG92ZXJDb250ZW50IGNsYXNzTmFtZT1cInctZnVsbCBwLTAgYm9yZGVyLW5vbmVcIj5cbiAgICAgICAgICA8UGlja2VyXG4gICAgICAgICAgICBkYXRhPXtkYXRhfVxuICAgICAgICAgICAgb25FbW9qaVNlbGVjdD17aGFuZGxlRW1vamlTZWxlY3R9XG4gICAgICAgICAgICB0aGVtZT1cImxpZ2h0XCJcbiAgICAgICAgICAgIHByZXZpZXdQb3NpdGlvbj1cIm5vbmVcIlxuICAgICAgICAgICAgc2tpblRvbmVQb3NpdGlvbj1cIm5vbmVcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvUG9wb3ZlckNvbnRlbnQ+XG4gICAgICA8L1BvcG92ZXI+XG4gICAgPC9kaXY+XG4gICk7XG59ICJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZVVzZXIiLCJCdXR0b24iLCJQb3BvdmVyIiwiUG9wb3ZlckNvbnRlbnQiLCJQb3BvdmVyVHJpZ2dlciIsIlNtaWxlIiwiZGF0YSIsIlBpY2tlciIsIk1lc3NhZ2VSZWFjdGlvbnMiLCJtZXNzYWdlSWQiLCJpbml0aWFsUmVhY3Rpb25zIiwib25SZWFjdGlvbnNVcGRhdGUiLCJ1c2VyIiwicmVhY3Rpb25zIiwic2V0UmVhY3Rpb25zIiwiaXNQaWNrZXJPcGVuIiwic2V0SXNQaWNrZXJPcGVuIiwiaGFuZGxlRW1vamlTZWxlY3QiLCJlbW9qaSIsIm5ld1JlYWN0aW9uIiwiaWQiLCJEYXRlIiwibm93IiwibmF0aXZlIiwidXNlcklkIiwidXNlcm5hbWUiLCJmaXJzdE5hbWUiLCJpbWFnZVVSTCIsImltYWdlVXJsIiwiZXhpc3RpbmdSZWFjdGlvbkluZGV4IiwiZmluZEluZGV4IiwiciIsInVwZGF0ZWRSZWFjdGlvbnMiLCJmaWx0ZXIiLCJfIiwiaW5kZXgiLCJncm91cGVkUmVhY3Rpb25zIiwicmVkdWNlIiwiYWNjIiwicmVhY3Rpb24iLCJwdXNoIiwiZGl2IiwiY2xhc3NOYW1lIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsInVzZXJzIiwidmFyaWFudCIsInNpemUiLCJvbkNsaWNrIiwibGVuZ3RoIiwib3BlbiIsIm9uT3BlbkNoYW5nZSIsImFzQ2hpbGQiLCJvbkVtb2ppU2VsZWN0IiwidGhlbWUiLCJwcmV2aWV3UG9zaXRpb24iLCJza2luVG9uZVBvc2l0aW9uIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/MessageReactions.tsx\n"));

/***/ })

});