"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./app/globals.css":
/*!*************************!*\
  !*** ./app/globals.css ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"af61de315664\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9nbG9iYWxzLmNzcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsaUVBQWUsY0FBYztBQUM3QixJQUFJLElBQVUsSUFBSSxpQkFBaUIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9nYWdlbWNjb3kvRG9jdW1lbnRzL0NoYXRHZW5pdXMvYXBwL2dsb2JhbHMuY3NzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IFwiYWY2MWRlMzE1NjY0XCJcbmlmIChtb2R1bGUuaG90KSB7IG1vZHVsZS5ob3QuYWNjZXB0KCkgfVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/globals.css\n"));

/***/ }),

/***/ "(app-pages-browser)/./hooks/use-current-user.ts":
/*!***********************************!*\
  !*** ./hooks/use-current-user.ts ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   useCurrentUser: () => (/* binding */ useCurrentUser)\n/* harmony export */ });\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tanstack/react-query */ \"(app-pages-browser)/./node_modules/@tanstack/react-query/build/modern/useQuery.js\");\n/* harmony import */ var _clerk_nextjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clerk/nextjs */ \"(app-pages-browser)/./node_modules/@clerk/clerk-react/dist/index.mjs\");\n\n\nfunction useCurrentUser() {\n    const { user: clerkUser } = (0,_clerk_nextjs__WEBPACK_IMPORTED_MODULE_0__.useUser)();\n    return (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_1__.useQuery)({\n        queryKey: [\n            'currentUser'\n        ],\n        queryFn: {\n            \"useCurrentUser.useQuery\": async ()=>{\n                console.log('Fetching current user...');\n                const response = await fetch('/api/users/me');\n                if (!response.ok) {\n                    const error = await response.text();\n                    console.error('Failed to fetch user:', error);\n                    throw new Error('Failed to fetch current user');\n                }\n                const data = await response.json();\n                console.log('Current user data:', data);\n                return data;\n            }\n        }[\"useCurrentUser.useQuery\"],\n        enabled: !!clerkUser\n    });\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2hvb2tzL3VzZS1jdXJyZW50LXVzZXIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWlEO0FBQ1Q7QUFFakMsU0FBU0U7SUFDZCxNQUFNLEVBQUVDLE1BQU1DLFNBQVMsRUFBRSxHQUFHSCxzREFBT0E7SUFFbkMsT0FBT0QsK0RBQVFBLENBQUM7UUFDZEssVUFBVTtZQUFDO1NBQWM7UUFDekJDLE9BQU87dUNBQUU7Z0JBQ1BDLFFBQVFDLEdBQUcsQ0FBQztnQkFDWixNQUFNQyxXQUFXLE1BQU1DLE1BQU07Z0JBQzdCLElBQUksQ0FBQ0QsU0FBU0UsRUFBRSxFQUFFO29CQUNoQixNQUFNQyxRQUFRLE1BQU1ILFNBQVNJLElBQUk7b0JBQ2pDTixRQUFRSyxLQUFLLENBQUMseUJBQXlCQTtvQkFDdkMsTUFBTSxJQUFJRSxNQUFNO2dCQUNsQjtnQkFDQSxNQUFNQyxPQUFPLE1BQU1OLFNBQVNPLElBQUk7Z0JBQ2hDVCxRQUFRQyxHQUFHLENBQUMsc0JBQXNCTztnQkFDbEMsT0FBT0E7WUFDVDs7UUFDQUUsU0FBUyxDQUFDLENBQUNiO0lBQ2I7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2dhZ2VtY2NveS9Eb2N1bWVudHMvQ2hhdEdlbml1cy9ob29rcy91c2UtY3VycmVudC11c2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVF1ZXJ5IH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JztcbmltcG9ydCB7IHVzZVVzZXIgfSBmcm9tICdAY2xlcmsvbmV4dGpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUN1cnJlbnRVc2VyKCkge1xuICBjb25zdCB7IHVzZXI6IGNsZXJrVXNlciB9ID0gdXNlVXNlcigpO1xuXG4gIHJldHVybiB1c2VRdWVyeSh7XG4gICAgcXVlcnlLZXk6IFsnY3VycmVudFVzZXInXSxcbiAgICBxdWVyeUZuOiBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgY3VycmVudCB1c2VyLi4uJyk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL3VzZXJzL21lJyk7XG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggdXNlcjonLCBlcnJvcik7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGZldGNoIGN1cnJlbnQgdXNlcicpO1xuICAgICAgfVxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGNvbnNvbGUubG9nKCdDdXJyZW50IHVzZXIgZGF0YTonLCBkYXRhKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG4gICAgZW5hYmxlZDogISFjbGVya1VzZXIsXG4gIH0pO1xufSAiXSwibmFtZXMiOlsidXNlUXVlcnkiLCJ1c2VVc2VyIiwidXNlQ3VycmVudFVzZXIiLCJ1c2VyIiwiY2xlcmtVc2VyIiwicXVlcnlLZXkiLCJxdWVyeUZuIiwiY29uc29sZSIsImxvZyIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsImVycm9yIiwidGV4dCIsIkVycm9yIiwiZGF0YSIsImpzb24iLCJlbmFibGVkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./hooks/use-current-user.ts\n"));

/***/ })

});