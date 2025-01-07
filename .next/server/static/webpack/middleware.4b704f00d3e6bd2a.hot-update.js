"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("middleware",{

/***/ "(middleware)/./middleware.ts":
/*!***********************!*\
  !*** ./middleware.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(middleware)/./node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js\");\n\n// Debug log to check if env is loaded\nconsole.log('CLERK_SECRET_KEY exists:', !!process.env.CLERK_SECRET_KEY);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_0__.clerkMiddleware)());\nconst config = {\n    matcher: [\n        // Skip Next.js internals and all static files, unless found in search params\n        '/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',\n        // Always run for API routes\n        '/(api|trpc)(.*)'\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBc0Q7QUFHdEQsc0NBQXNDO0FBQ3RDQyxRQUFRQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQ0MsUUFBUUMsR0FBRyxDQUFDQyxnQkFBZ0I7QUFFdEUsaUVBQWVMLHFFQUFlQSxFQUFFQSxFQUFDO0FBRTFCLE1BQU1NLFNBQVM7SUFDcEJDLFNBQVM7UUFDUCw2RUFBNkU7UUFDN0U7UUFDQSw0QkFBNEI7UUFDNUI7S0FDRDtBQUNILEVBQUMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9nYWdlbWNjb3kvRG9jdW1lbnRzL0NoYXRHZW5pdXMvbWlkZGxld2FyZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjbGVya01pZGRsZXdhcmUgfSBmcm9tICdAY2xlcmsvbmV4dGpzL3NlcnZlcidcbmltcG9ydCB7IGdldE9yQ3JlYXRlVXNlciB9IGZyb20gJ0AvbGliL3VzZXInXG5cbi8vIERlYnVnIGxvZyB0byBjaGVjayBpZiBlbnYgaXMgbG9hZGVkXG5jb25zb2xlLmxvZygnQ0xFUktfU0VDUkVUX0tFWSBleGlzdHM6JywgISFwcm9jZXNzLmVudi5DTEVSS19TRUNSRVRfS0VZKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xlcmtNaWRkbGV3YXJlKCk7XG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIG1hdGNoZXI6IFtcbiAgICAvLyBTa2lwIE5leHQuanMgaW50ZXJuYWxzIGFuZCBhbGwgc3RhdGljIGZpbGVzLCB1bmxlc3MgZm91bmQgaW4gc2VhcmNoIHBhcmFtc1xuICAgICcvKCg/IV9uZXh0fFteP10qXFxcXC4oPzpodG1sP3xjc3N8anMoPyFvbil8anBlP2d8d2VicHxwbmd8Z2lmfHN2Z3x0dGZ8d29mZjI/fGljb3xjc3Z8ZG9jeD98eGxzeD98emlwfHdlYm1hbmlmZXN0KSkuKiknLFxuICAgIC8vIEFsd2F5cyBydW4gZm9yIEFQSSByb3V0ZXNcbiAgICAnLyhhcGl8dHJwYykoLiopJyxcbiAgXSxcbn0iXSwibmFtZXMiOlsiY2xlcmtNaWRkbGV3YXJlIiwiY29uc29sZSIsImxvZyIsInByb2Nlc3MiLCJlbnYiLCJDTEVSS19TRUNSRVRfS0VZIiwiY29uZmlnIiwibWF0Y2hlciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(middleware)/./middleware.ts\n");

/***/ })

});