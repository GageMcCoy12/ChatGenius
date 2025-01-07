"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/dm/[userId]/page",{

/***/ "(app-pages-browser)/./components/Chat.tsx":
/*!*****************************!*\
  !*** ./components/Chat.tsx ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Chat: () => (/* binding */ Chat)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _hooks_use_messages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/hooks/use-messages */ \"(app-pages-browser)/./hooks/use-messages.ts\");\n/* harmony import */ var _MessageList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MessageList */ \"(app-pages-browser)/./components/MessageList.tsx\");\n/* harmony import */ var _MessageInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MessageInput */ \"(app-pages-browser)/./components/MessageInput.tsx\");\n/* harmony import */ var _components_ui_alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/ui/alert */ \"(app-pages-browser)/./components/ui/alert.tsx\");\n/* harmony import */ var _radix_ui_react_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @radix-ui/react-icons */ \"(app-pages-browser)/./node_modules/@radix-ui/react-icons/dist/react-icons.esm.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);\n/* __next_internal_client_entry_do_not_use__ Chat auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\nconst Chat = (param)=>{\n    let { channelId } = param;\n    _s();\n    const { messages, loading, error, sendMessage, refreshMessages, updateReactions } = (0,_hooks_use_messages__WEBPACK_IMPORTED_MODULE_1__.useMessages)(channelId);\n    const [lastMessage, setLastMessage] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(null);\n    const [lastSentMessage, setLastSentMessage] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(null);\n    const activeChannelRef = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(channelId);\n    const isSending = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(false);\n    // Update active channel ref and reset state when channel changes\n    (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)({\n        \"Chat.useEffect\": ()=>{\n            activeChannelRef.current = channelId;\n            setLastSentMessage(null);\n            isSending.current = false;\n            // Cleanup function\n            return ({\n                \"Chat.useEffect\": ()=>{\n                    isSending.current = false;\n                }\n            })[\"Chat.useEffect\"];\n        }\n    }[\"Chat.useEffect\"], [\n        channelId\n    ]);\n    const handleSendMessage = async (message)=>{\n        try {\n            return await sendMessage(message);\n        } catch (error) {\n            if (error instanceof Error && error.message === 'Duplicate message') {\n                // Silently ignore duplicate messages\n                return;\n            }\n            console.error('Failed to send message:', error);\n            throw error;\n        }\n    };\n    const handleReactionsUpdate = async (messageId, reactions)=>{\n        try {\n            await updateReactions(messageId, reactions);\n        } catch (error) {\n            console.error('Error updating reactions:', error);\n        }\n    };\n    if (error) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"flex flex-col h-[calc(100vh-64px)] items-center justify-center p-4\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_alert__WEBPACK_IMPORTED_MODULE_4__.Alert, {\n                    variant: \"destructive\",\n                    className: \"mb-4\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_alert__WEBPACK_IMPORTED_MODULE_4__.AlertDescription, {\n                        children: error.toString()\n                    }, void 0, false, {\n                        fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                        lineNumber: 69,\n                        columnNumber: 11\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                    lineNumber: 68,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                    onClick: (e)=>refreshMessages(),\n                    className: \"flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_radix_ui_react_icons__WEBPACK_IMPORTED_MODULE_6__.ReloadIcon, {\n                            className: \"h-4 w-4\"\n                        }, void 0, false, {\n                            fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                            lineNumber: 75,\n                            columnNumber: 11\n                        }, undefined),\n                        \"Try again\"\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                    lineNumber: 71,\n                    columnNumber: 9\n                }, undefined)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n            lineNumber: 67,\n            columnNumber: 7\n        }, undefined);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex flex-col h-[calc(100vh-64px)] w-full relative\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex-1 overflow-y-auto pb-[80px]\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_MessageList__WEBPACK_IMPORTED_MODULE_2__.MessageList, {\n                    messages: messages,\n                    onReactionsUpdate: handleReactionsUpdate\n                }, void 0, false, {\n                    fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                    lineNumber: 85,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                lineNumber: 84,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"absolute bottom-0 left-0 right-0 bg-background\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_MessageInput__WEBPACK_IMPORTED_MODULE_3__.MessageInput, {\n                    onSend: handleSendMessage,\n                    isLoading: loading\n                }, void 0, false, {\n                    fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                    lineNumber: 91,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n                lineNumber: 90,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/gagemccoy/Documents/ChatGenius/components/Chat.tsx\",\n        lineNumber: 83,\n        columnNumber: 5\n    }, undefined);\n};\n_s(Chat, \"HGSiXX1T8QfAKAaVeU0AdUGxn/Y=\", false, function() {\n    return [\n        _hooks_use_messages__WEBPACK_IMPORTED_MODULE_1__.useMessages\n    ];\n});\n_c = Chat;\nvar _c;\n$RefreshReg$(_c, \"Chat\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvQ2hhdC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFbUQ7QUFDUDtBQUNFO0FBQ2tCO0FBQ2I7QUFDQztBQWlCN0MsTUFBTVMsT0FBTztRQUFDLEVBQUVDLFNBQVMsRUFBYTs7SUFDM0MsTUFBTSxFQUFFQyxRQUFRLEVBQUVDLE9BQU8sRUFBRUMsS0FBSyxFQUFFQyxXQUFXLEVBQUVDLGVBQWUsRUFBRUMsZUFBZSxFQUFFLEdBQUdoQixnRUFBV0EsQ0FBQ1U7SUFDaEcsTUFBTSxDQUFDTyxhQUFhQyxlQUFlLEdBQUdaLCtDQUFRQSxDQUFxQjtJQUNuRSxNQUFNLENBQUNhLGlCQUFpQkMsbUJBQW1CLEdBQUdkLCtDQUFRQSxDQUF5QjtJQUMvRSxNQUFNZSxtQkFBbUJiLDZDQUFNQSxDQUFDRTtJQUNoQyxNQUFNWSxZQUFZZCw2Q0FBTUEsQ0FBQztJQUV6QixpRUFBaUU7SUFDakVELGdEQUFTQTswQkFBQztZQUNSYyxpQkFBaUJFLE9BQU8sR0FBR2I7WUFDM0JVLG1CQUFtQjtZQUNuQkUsVUFBVUMsT0FBTyxHQUFHO1lBRXBCLG1CQUFtQjtZQUNuQjtrQ0FBTztvQkFDTEQsVUFBVUMsT0FBTyxHQUFHO2dCQUN0Qjs7UUFDRjt5QkFBRztRQUFDYjtLQUFVO0lBRWQsTUFBTWMsb0JBQW9CLE9BQU9DO1FBQy9CLElBQUk7WUFDRixPQUFPLE1BQU1YLFlBQVlXO1FBQzNCLEVBQUUsT0FBT1osT0FBTztZQUNkLElBQUlBLGlCQUFpQmEsU0FBU2IsTUFBTVksT0FBTyxLQUFLLHFCQUFxQjtnQkFDbkUscUNBQXFDO2dCQUNyQztZQUNGO1lBQ0FFLFFBQVFkLEtBQUssQ0FBQywyQkFBMkJBO1lBQ3pDLE1BQU1BO1FBQ1I7SUFDRjtJQUVBLE1BQU1lLHdCQUF3QixPQUFPQyxXQUFtQkM7UUFDdEQsSUFBSTtZQUNGLE1BQU1kLGdCQUFnQmEsV0FBV0M7UUFDbkMsRUFBRSxPQUFPakIsT0FBTztZQUNkYyxRQUFRZCxLQUFLLENBQUMsNkJBQTZCQTtRQUM3QztJQUNGO0lBRUEsSUFBSUEsT0FBTztRQUNULHFCQUNFLDhEQUFDa0I7WUFBSUMsV0FBVTs7OEJBQ2IsOERBQUM3Qix1REFBS0E7b0JBQUM4QixTQUFRO29CQUFjRCxXQUFVOzhCQUNyQyw0RUFBQzVCLGtFQUFnQkE7a0NBQUVTLE1BQU1xQixRQUFROzs7Ozs7Ozs7Ozs4QkFFbkMsOERBQUNDO29CQUNDQyxTQUFTLENBQUNDLElBQU10QjtvQkFDaEJpQixXQUFVOztzQ0FFViw4REFBQzNCLDZEQUFVQTs0QkFBQzJCLFdBQVU7Ozs7Ozt3QkFBWTs7Ozs7Ozs7Ozs7OztJQUsxQztJQUVBLHFCQUNFLDhEQUFDRDtRQUFJQyxXQUFVOzswQkFDYiw4REFBQ0Q7Z0JBQUlDLFdBQVU7MEJBQ2IsNEVBQUMvQixxREFBV0E7b0JBQ1ZVLFVBQVVBO29CQUNWMkIsbUJBQW1CVjs7Ozs7Ozs7Ozs7MEJBR3ZCLDhEQUFDRztnQkFBSUMsV0FBVTswQkFDYiw0RUFBQzlCLHVEQUFZQTtvQkFDWHFDLFFBQVFmO29CQUNSZ0IsV0FBVzVCOzs7Ozs7Ozs7Ozs7Ozs7OztBQUtyQixFQUFFO0dBekVXSDs7UUFDeUVULDREQUFXQTs7O0tBRHBGUyIsInNvdXJjZXMiOlsiL1VzZXJzL2dhZ2VtY2NveS9Eb2N1bWVudHMvQ2hhdEdlbml1cy9jb21wb25lbnRzL0NoYXQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50JztcblxuaW1wb3J0IHsgdXNlTWVzc2FnZXMgfSBmcm9tICdAL2hvb2tzL3VzZS1tZXNzYWdlcyc7XG5pbXBvcnQgeyBNZXNzYWdlTGlzdCB9IGZyb20gJy4vTWVzc2FnZUxpc3QnO1xuaW1wb3J0IHsgTWVzc2FnZUlucHV0IH0gZnJvbSAnLi9NZXNzYWdlSW5wdXQnO1xuaW1wb3J0IHsgQWxlcnQsIEFsZXJ0RGVzY3JpcHRpb24gfSBmcm9tICdAL2NvbXBvbmVudHMvdWkvYWxlcnQnO1xuaW1wb3J0IHsgUmVsb2FkSWNvbiB9IGZyb20gJ0ByYWRpeC11aS9yZWFjdC1pY29ucyc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnQC90eXBlcy9tZXNzYWdlcyc7XG5cbmludGVyZmFjZSBDaGF0UHJvcHMge1xuICBjaGFubmVsSWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIExhc3RNZXNzYWdlIHtcbiAgdGV4dDogc3RyaW5nO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIExhc3RTZW50TWVzc2FnZSB7XG4gIHRleHQ6IHN0cmluZztcbiAgdGltZXN0YW1wOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjb25zdCBDaGF0ID0gKHsgY2hhbm5lbElkIH06IENoYXRQcm9wcykgPT4ge1xuICBjb25zdCB7IG1lc3NhZ2VzLCBsb2FkaW5nLCBlcnJvciwgc2VuZE1lc3NhZ2UsIHJlZnJlc2hNZXNzYWdlcywgdXBkYXRlUmVhY3Rpb25zIH0gPSB1c2VNZXNzYWdlcyhjaGFubmVsSWQpO1xuICBjb25zdCBbbGFzdE1lc3NhZ2UsIHNldExhc3RNZXNzYWdlXSA9IHVzZVN0YXRlPExhc3RNZXNzYWdlIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtsYXN0U2VudE1lc3NhZ2UsIHNldExhc3RTZW50TWVzc2FnZV0gPSB1c2VTdGF0ZTxMYXN0U2VudE1lc3NhZ2UgfCBudWxsPihudWxsKTtcbiAgY29uc3QgYWN0aXZlQ2hhbm5lbFJlZiA9IHVzZVJlZihjaGFubmVsSWQpO1xuICBjb25zdCBpc1NlbmRpbmcgPSB1c2VSZWYoZmFsc2UpO1xuXG4gIC8vIFVwZGF0ZSBhY3RpdmUgY2hhbm5lbCByZWYgYW5kIHJlc2V0IHN0YXRlIHdoZW4gY2hhbm5lbCBjaGFuZ2VzXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgYWN0aXZlQ2hhbm5lbFJlZi5jdXJyZW50ID0gY2hhbm5lbElkO1xuICAgIHNldExhc3RTZW50TWVzc2FnZShudWxsKTtcbiAgICBpc1NlbmRpbmcuY3VycmVudCA9IGZhbHNlO1xuICAgIFxuICAgIC8vIENsZWFudXAgZnVuY3Rpb25cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaXNTZW5kaW5nLmN1cnJlbnQgPSBmYWxzZTtcbiAgICB9O1xuICB9LCBbY2hhbm5lbElkXSk7XG5cbiAgY29uc3QgaGFuZGxlU2VuZE1lc3NhZ2UgPSBhc3luYyAobWVzc2FnZTogeyB0ZXh0OiBzdHJpbmc7IGZpbGVVcmw/OiBzdHJpbmcgfSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgc2VuZE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmIGVycm9yLm1lc3NhZ2UgPT09ICdEdXBsaWNhdGUgbWVzc2FnZScpIHtcbiAgICAgICAgLy8gU2lsZW50bHkgaWdub3JlIGR1cGxpY2F0ZSBtZXNzYWdlc1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBtZXNzYWdlOicsIGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVSZWFjdGlvbnNVcGRhdGUgPSBhc3luYyAobWVzc2FnZUlkOiBzdHJpbmcsIHJlYWN0aW9uczogTWVzc2FnZVsncmVhY3Rpb25zJ10pID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXBkYXRlUmVhY3Rpb25zKG1lc3NhZ2VJZCwgcmVhY3Rpb25zKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgcmVhY3Rpb25zOicsIGVycm9yKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBoLVtjYWxjKDEwMHZoLTY0cHgpXSBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcC00XCI+XG4gICAgICAgIDxBbGVydCB2YXJpYW50PVwiZGVzdHJ1Y3RpdmVcIiBjbGFzc05hbWU9XCJtYi00XCI+XG4gICAgICAgICAgPEFsZXJ0RGVzY3JpcHRpb24+e2Vycm9yLnRvU3RyaW5nKCl9PC9BbGVydERlc2NyaXB0aW9uPlxuICAgICAgICA8L0FsZXJ0PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17KGUpID0+IHJlZnJlc2hNZXNzYWdlcygpfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtc20gdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGhvdmVyOnRleHQtZm9yZWdyb3VuZFwiXG4gICAgICAgID5cbiAgICAgICAgICA8UmVsb2FkSWNvbiBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICBUcnkgYWdhaW5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaC1bY2FsYygxMDB2aC02NHB4KV0gdy1mdWxsIHJlbGF0aXZlXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBvdmVyZmxvdy15LWF1dG8gcGItWzgwcHhdXCI+XG4gICAgICAgIDxNZXNzYWdlTGlzdCBcbiAgICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XG4gICAgICAgICAgb25SZWFjdGlvbnNVcGRhdGU9e2hhbmRsZVJlYWN0aW9uc1VwZGF0ZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tMCBsZWZ0LTAgcmlnaHQtMCBiZy1iYWNrZ3JvdW5kXCI+XG4gICAgICAgIDxNZXNzYWdlSW5wdXRcbiAgICAgICAgICBvblNlbmQ9e2hhbmRsZVNlbmRNZXNzYWdlfVxuICAgICAgICAgIGlzTG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTsgIl0sIm5hbWVzIjpbInVzZU1lc3NhZ2VzIiwiTWVzc2FnZUxpc3QiLCJNZXNzYWdlSW5wdXQiLCJBbGVydCIsIkFsZXJ0RGVzY3JpcHRpb24iLCJSZWxvYWRJY29uIiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VSZWYiLCJDaGF0IiwiY2hhbm5lbElkIiwibWVzc2FnZXMiLCJsb2FkaW5nIiwiZXJyb3IiLCJzZW5kTWVzc2FnZSIsInJlZnJlc2hNZXNzYWdlcyIsInVwZGF0ZVJlYWN0aW9ucyIsImxhc3RNZXNzYWdlIiwic2V0TGFzdE1lc3NhZ2UiLCJsYXN0U2VudE1lc3NhZ2UiLCJzZXRMYXN0U2VudE1lc3NhZ2UiLCJhY3RpdmVDaGFubmVsUmVmIiwiaXNTZW5kaW5nIiwiY3VycmVudCIsImhhbmRsZVNlbmRNZXNzYWdlIiwibWVzc2FnZSIsIkVycm9yIiwiY29uc29sZSIsImhhbmRsZVJlYWN0aW9uc1VwZGF0ZSIsIm1lc3NhZ2VJZCIsInJlYWN0aW9ucyIsImRpdiIsImNsYXNzTmFtZSIsInZhcmlhbnQiLCJ0b1N0cmluZyIsImJ1dHRvbiIsIm9uQ2xpY2siLCJlIiwib25SZWFjdGlvbnNVcGRhdGUiLCJvblNlbmQiLCJpc0xvYWRpbmciXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/Chat.tsx\n"));

/***/ })

});