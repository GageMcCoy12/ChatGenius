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

/***/ "(app-pages-browser)/./components/Chat.tsx":
/*!*****************************!*\
  !*** ./components/Chat.tsx ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Chat: () => (/* binding */ Chat)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _hooks_use_messages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/hooks/use-messages */ \"(app-pages-browser)/./hooks/use-messages.ts\");\n/* harmony import */ var _MessageList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MessageList */ \"(app-pages-browser)/./components/MessageList.tsx\");\n/* harmony import */ var _MessageInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MessageInput */ \"(app-pages-browser)/./components/MessageInput.tsx\");\n/* harmony import */ var _components_ui_alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/ui/alert */ \"(app-pages-browser)/./components/ui/alert.tsx\");\n/* harmony import */ var _radix_ui_react_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @radix-ui/react-icons */ \"(app-pages-browser)/./node_modules/@radix-ui/react-icons/dist/react-icons.esm.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);\n/* __next_internal_client_entry_do_not_use__ Chat auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\nconst Chat = (param)=>{\n    let { channelId } = param;\n    _s();\n    const { messages, loading, error, sendMessage, refreshMessages, updateReactions } = (0,_hooks_use_messages__WEBPACK_IMPORTED_MODULE_1__.useMessages)(channelId);\n    const [lastMessage, setLastMessage] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(null);\n    const [lastSentMessage, setLastSentMessage] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(null);\n    // Reset lastSentMessage when changing channels\n    (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)({\n        \"Chat.useEffect\": ()=>{\n            setLastSentMessage(null);\n        }\n    }[\"Chat.useEffect\"], [\n        channelId\n    ]);\n    const handleSendMessage = async (message)=>{\n        if (!message.text.trim() && !message.fileUrl) return;\n        // Prevent duplicate messages within 2 seconds\n        if (lastSentMessage && lastSentMessage.text === message.text && Date.now() - lastSentMessage.timestamp < 2000) {\n            return;\n        }\n        try {\n            setLastSentMessage({\n                text: message.text,\n                timestamp: Date.now()\n            });\n            return await sendMessage(message);\n        } catch (error) {\n            console.error('Failed to send message:', error);\n            throw error;\n        }\n    };\n    const handleReactionsUpdate = async (messageId, reactions)=>{\n        try {\n            await updateReactions(messageId, reactions);\n        } catch (error) {\n            console.error('Error updating reactions:', error);\n        }\n    };\n    if (error) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"flex flex-col h-[calc(100vh-64px)] items-center justify-center p-4\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_alert__WEBPACK_IMPORTED_MODULE_4__.Alert, {\n                    variant: \"destructive\",\n                    className: \"mb-4\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_alert__WEBPACK_IMPORTED_MODULE_4__.AlertDescription, {\n                        children: error.toString()\n                    }, void 0, false, {\n                        fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                        lineNumber: 70,\n                        columnNumber: 11\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                    lineNumber: 69,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                    onClick: (e)=>refreshMessages(),\n                    className: \"flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_radix_ui_react_icons__WEBPACK_IMPORTED_MODULE_6__.ReloadIcon, {\n                            className: \"h-4 w-4\"\n                        }, void 0, false, {\n                            fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                            lineNumber: 76,\n                            columnNumber: 11\n                        }, undefined),\n                        \"Try again\"\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                    lineNumber: 72,\n                    columnNumber: 9\n                }, undefined)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n            lineNumber: 68,\n            columnNumber: 7\n        }, undefined);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex flex-col h-[calc(100vh-64px)] w-full relative\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex-1 overflow-y-auto pb-[80px]\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_MessageList__WEBPACK_IMPORTED_MODULE_2__.MessageList, {\n                    messages: messages,\n                    onReactionsUpdate: handleReactionsUpdate\n                }, void 0, false, {\n                    fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                    lineNumber: 86,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                lineNumber: 85,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"absolute bottom-0 left-0 right-0 bg-background\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_MessageInput__WEBPACK_IMPORTED_MODULE_3__.MessageInput, {\n                    onSend: handleSendMessage,\n                    isLoading: loading\n                }, void 0, false, {\n                    fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                    lineNumber: 92,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                lineNumber: 91,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n        lineNumber: 84,\n        columnNumber: 5\n    }, undefined);\n};\n_s(Chat, \"thv5/J943Xb7s83YjSNYIndej34=\", false, function() {\n    return [\n        _hooks_use_messages__WEBPACK_IMPORTED_MODULE_1__.useMessages\n    ];\n});\n_c = Chat;\nvar _c;\n$RefreshReg$(_c, \"Chat\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvQ2hhdC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFbUQ7QUFDUDtBQUNFO0FBQ2tCO0FBQ2I7QUFDUDtBQWlCckMsTUFBTVEsT0FBTztRQUFDLEVBQUVDLFNBQVMsRUFBYTs7SUFDM0MsTUFBTSxFQUFFQyxRQUFRLEVBQUVDLE9BQU8sRUFBRUMsS0FBSyxFQUFFQyxXQUFXLEVBQUVDLGVBQWUsRUFBRUMsZUFBZSxFQUFFLEdBQUdmLGdFQUFXQSxDQUFDUztJQUNoRyxNQUFNLENBQUNPLGFBQWFDLGVBQWUsR0FBR1gsK0NBQVFBLENBQXFCO0lBQ25FLE1BQU0sQ0FBQ1ksaUJBQWlCQyxtQkFBbUIsR0FBR2IsK0NBQVFBLENBQXlCO0lBRS9FLCtDQUErQztJQUMvQ0MsZ0RBQVNBOzBCQUFDO1lBQ1JZLG1CQUFtQjtRQUNyQjt5QkFBRztRQUFDVjtLQUFVO0lBRWQsTUFBTVcsb0JBQW9CLE9BQU9DO1FBQy9CLElBQUksQ0FBQ0EsUUFBUUMsSUFBSSxDQUFDQyxJQUFJLE1BQU0sQ0FBQ0YsUUFBUUcsT0FBTyxFQUFFO1FBRTlDLDhDQUE4QztRQUM5QyxJQUFJTixtQkFDQUEsZ0JBQWdCSSxJQUFJLEtBQUtELFFBQVFDLElBQUksSUFDckNHLEtBQUtDLEdBQUcsS0FBS1IsZ0JBQWdCUyxTQUFTLEdBQUcsTUFBTTtZQUNqRDtRQUNGO1FBRUEsSUFBSTtZQUNGUixtQkFBbUI7Z0JBQ2pCRyxNQUFNRCxRQUFRQyxJQUFJO2dCQUNsQkssV0FBV0YsS0FBS0MsR0FBRztZQUNyQjtZQUVBLE9BQU8sTUFBTWIsWUFBWVE7UUFDM0IsRUFBRSxPQUFPVCxPQUFPO1lBQ2RnQixRQUFRaEIsS0FBSyxDQUFDLDJCQUEyQkE7WUFDekMsTUFBTUE7UUFDUjtJQUNGO0lBRUEsTUFBTWlCLHdCQUF3QixPQUFPQyxXQUFtQkM7UUFDdEQsSUFBSTtZQUNGLE1BQU1oQixnQkFBZ0JlLFdBQVdDO1FBQ25DLEVBQUUsT0FBT25CLE9BQU87WUFDZGdCLFFBQVFoQixLQUFLLENBQUMsNkJBQTZCQTtRQUM3QztJQUNGO0lBRUEsSUFBSUEsT0FBTztRQUNULHFCQUNFLDhEQUFDb0I7WUFBSUMsV0FBVTs7OEJBQ2IsOERBQUM5Qix1REFBS0E7b0JBQUMrQixTQUFRO29CQUFjRCxXQUFVOzhCQUNyQyw0RUFBQzdCLGtFQUFnQkE7a0NBQUVRLE1BQU11QixRQUFROzs7Ozs7Ozs7Ozs4QkFFbkMsOERBQUNDO29CQUNDQyxTQUFTLENBQUNDLElBQU14QjtvQkFDaEJtQixXQUFVOztzQ0FFViw4REFBQzVCLDZEQUFVQTs0QkFBQzRCLFdBQVU7Ozs7Ozt3QkFBWTs7Ozs7Ozs7Ozs7OztJQUsxQztJQUVBLHFCQUNFLDhEQUFDRDtRQUFJQyxXQUFVOzswQkFDYiw4REFBQ0Q7Z0JBQUlDLFdBQVU7MEJBQ2IsNEVBQUNoQyxxREFBV0E7b0JBQ1ZTLFVBQVVBO29CQUNWNkIsbUJBQW1CVjs7Ozs7Ozs7Ozs7MEJBR3ZCLDhEQUFDRztnQkFBSUMsV0FBVTswQkFDYiw0RUFBQy9CLHVEQUFZQTtvQkFDWHNDLFFBQVFwQjtvQkFDUnFCLFdBQVc5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLckIsRUFBRTtHQTFFV0g7O1FBQ3lFUiw0REFBV0E7OztLQURwRlEiLCJzb3VyY2VzIjpbIi9Vc2Vycy9nYWdlbWNjb3kvRG9jdW1lbnRzL0NoYXRHZW5pdXMvY29tcG9uZW50cy9DaGF0LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCc7XG5cbmltcG9ydCB7IHVzZU1lc3NhZ2VzIH0gZnJvbSAnQC9ob29rcy91c2UtbWVzc2FnZXMnO1xuaW1wb3J0IHsgTWVzc2FnZUxpc3QgfSBmcm9tICcuL01lc3NhZ2VMaXN0JztcbmltcG9ydCB7IE1lc3NhZ2VJbnB1dCB9IGZyb20gJy4vTWVzc2FnZUlucHV0JztcbmltcG9ydCB7IEFsZXJ0LCBBbGVydERlc2NyaXB0aW9uIH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL2FsZXJ0JztcbmltcG9ydCB7IFJlbG9hZEljb24gfSBmcm9tICdAcmFkaXgtdWkvcmVhY3QtaWNvbnMnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICdAL3R5cGVzL21lc3NhZ2VzJztcblxuaW50ZXJmYWNlIENoYXRQcm9wcyB7XG4gIGNoYW5uZWxJZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgTGFzdE1lc3NhZ2Uge1xuICB0ZXh0OiBzdHJpbmc7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgTGFzdFNlbnRNZXNzYWdlIHtcbiAgdGV4dDogc3RyaW5nO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IENoYXQgPSAoeyBjaGFubmVsSWQgfTogQ2hhdFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgbWVzc2FnZXMsIGxvYWRpbmcsIGVycm9yLCBzZW5kTWVzc2FnZSwgcmVmcmVzaE1lc3NhZ2VzLCB1cGRhdGVSZWFjdGlvbnMgfSA9IHVzZU1lc3NhZ2VzKGNoYW5uZWxJZCk7XG4gIGNvbnN0IFtsYXN0TWVzc2FnZSwgc2V0TGFzdE1lc3NhZ2VdID0gdXNlU3RhdGU8TGFzdE1lc3NhZ2UgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2xhc3RTZW50TWVzc2FnZSwgc2V0TGFzdFNlbnRNZXNzYWdlXSA9IHVzZVN0YXRlPExhc3RTZW50TWVzc2FnZSB8IG51bGw+KG51bGwpO1xuXG4gIC8vIFJlc2V0IGxhc3RTZW50TWVzc2FnZSB3aGVuIGNoYW5naW5nIGNoYW5uZWxzXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0TGFzdFNlbnRNZXNzYWdlKG51bGwpO1xuICB9LCBbY2hhbm5lbElkXSk7XG5cbiAgY29uc3QgaGFuZGxlU2VuZE1lc3NhZ2UgPSBhc3luYyAobWVzc2FnZTogeyB0ZXh0OiBzdHJpbmc7IGZpbGVVcmw/OiBzdHJpbmcgfSkgPT4ge1xuICAgIGlmICghbWVzc2FnZS50ZXh0LnRyaW0oKSAmJiAhbWVzc2FnZS5maWxlVXJsKSByZXR1cm47XG5cbiAgICAvLyBQcmV2ZW50IGR1cGxpY2F0ZSBtZXNzYWdlcyB3aXRoaW4gMiBzZWNvbmRzXG4gICAgaWYgKGxhc3RTZW50TWVzc2FnZSAmJiBcbiAgICAgICAgbGFzdFNlbnRNZXNzYWdlLnRleHQgPT09IG1lc3NhZ2UudGV4dCAmJiBcbiAgICAgICAgRGF0ZS5ub3coKSAtIGxhc3RTZW50TWVzc2FnZS50aW1lc3RhbXAgPCAyMDAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHNldExhc3RTZW50TWVzc2FnZSh7XG4gICAgICAgIHRleHQ6IG1lc3NhZ2UudGV4dCxcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgcmV0dXJuIGF3YWl0IHNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBtZXNzYWdlOicsIGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVSZWFjdGlvbnNVcGRhdGUgPSBhc3luYyAobWVzc2FnZUlkOiBzdHJpbmcsIHJlYWN0aW9uczogTWVzc2FnZVsncmVhY3Rpb25zJ10pID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXBkYXRlUmVhY3Rpb25zKG1lc3NhZ2VJZCwgcmVhY3Rpb25zKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgcmVhY3Rpb25zOicsIGVycm9yKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBoLVtjYWxjKDEwMHZoLTY0cHgpXSBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcC00XCI+XG4gICAgICAgIDxBbGVydCB2YXJpYW50PVwiZGVzdHJ1Y3RpdmVcIiBjbGFzc05hbWU9XCJtYi00XCI+XG4gICAgICAgICAgPEFsZXJ0RGVzY3JpcHRpb24+e2Vycm9yLnRvU3RyaW5nKCl9PC9BbGVydERlc2NyaXB0aW9uPlxuICAgICAgICA8L0FsZXJ0PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17KGUpID0+IHJlZnJlc2hNZXNzYWdlcygpfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtc20gdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGhvdmVyOnRleHQtZm9yZWdyb3VuZFwiXG4gICAgICAgID5cbiAgICAgICAgICA8UmVsb2FkSWNvbiBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICBUcnkgYWdhaW5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaC1bY2FsYygxMDB2aC02NHB4KV0gdy1mdWxsIHJlbGF0aXZlXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBvdmVyZmxvdy15LWF1dG8gcGItWzgwcHhdXCI+XG4gICAgICAgIDxNZXNzYWdlTGlzdCBcbiAgICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XG4gICAgICAgICAgb25SZWFjdGlvbnNVcGRhdGU9e2hhbmRsZVJlYWN0aW9uc1VwZGF0ZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tMCBsZWZ0LTAgcmlnaHQtMCBiZy1iYWNrZ3JvdW5kXCI+XG4gICAgICAgIDxNZXNzYWdlSW5wdXRcbiAgICAgICAgICBvblNlbmQ9e2hhbmRsZVNlbmRNZXNzYWdlfVxuICAgICAgICAgIGlzTG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTsgIl0sIm5hbWVzIjpbInVzZU1lc3NhZ2VzIiwiTWVzc2FnZUxpc3QiLCJNZXNzYWdlSW5wdXQiLCJBbGVydCIsIkFsZXJ0RGVzY3JpcHRpb24iLCJSZWxvYWRJY29uIiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJDaGF0IiwiY2hhbm5lbElkIiwibWVzc2FnZXMiLCJsb2FkaW5nIiwiZXJyb3IiLCJzZW5kTWVzc2FnZSIsInJlZnJlc2hNZXNzYWdlcyIsInVwZGF0ZVJlYWN0aW9ucyIsImxhc3RNZXNzYWdlIiwic2V0TGFzdE1lc3NhZ2UiLCJsYXN0U2VudE1lc3NhZ2UiLCJzZXRMYXN0U2VudE1lc3NhZ2UiLCJoYW5kbGVTZW5kTWVzc2FnZSIsIm1lc3NhZ2UiLCJ0ZXh0IiwidHJpbSIsImZpbGVVcmwiLCJEYXRlIiwibm93IiwidGltZXN0YW1wIiwiY29uc29sZSIsImhhbmRsZVJlYWN0aW9uc1VwZGF0ZSIsIm1lc3NhZ2VJZCIsInJlYWN0aW9ucyIsImRpdiIsImNsYXNzTmFtZSIsInZhcmlhbnQiLCJ0b1N0cmluZyIsImJ1dHRvbiIsIm9uQ2xpY2siLCJlIiwib25SZWFjdGlvbnNVcGRhdGUiLCJvblNlbmQiLCJpc0xvYWRpbmciXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/Chat.tsx\n"));

/***/ })

});