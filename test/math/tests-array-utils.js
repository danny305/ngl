
import { quicksortIP, quicksortCmp, arraySortedCmp } from "../../src/math/array-utils.js";

import { assert } from 'chai';


// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {

    Array.from = (function () {

        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) { return 0; }
            if (number === 0 || !isFinite(number)) { return number; }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike/*, mapFn, thisArg */) {

            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
                throw new TypeError("Array.from requires an array-like object - not null or undefined");
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Let k be 0.
            var k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;
            // 20. Return A.
            return A;
        };

    }());

}


describe('math/array-utils', function() {


describe('quicksortIP', function () {
    it('eleSize 1', function () {
        var list = [ 3, 0, 5, 9, 2, 1, 7 ];
        // console.log( list );

        var arr1 = new Float32Array( list );
        quicksortIP( arr1, 1, 0 );
        // console.log( arr1 );

        var arr2 = new Float32Array( list );
        quicksortIP( arr2, 1, 0, 3, 6 );
        // console.log( arr2 );

        assert.deepEqual(
            Array.from( arr1 ),
            [ 0, 1, 2, 3, 5, 7, 9 ],
            "Passed! full sort"
        );
        assert.deepEqual(
            Array.from( arr2 ),
            [ 3, 0, 5, 1, 2, 9, 7 ],
            "Passed! partial sort"
        );
    });

    it('eleSize 2', function () {
        var list = [ 3, 0, 0, 0, 5, 0, 9, 0, 2, 0, 1, 0, 7, 0 ];
        // console.log( list );

        var arr1 = new Float32Array( list );
        quicksortIP( arr1, 2, 0 );
        // console.log( arr1 );

        var arr2 = new Float32Array( list );
        quicksortIP( arr2, 2, 0, 3, 6 );
        // console.log( arr2 );

        assert.deepEqual(
            Array.from( arr1 ),
            [ 0, 0, 1, 0, 2, 0, 3, 0, 5, 0, 7, 0, 9, 0 ],
            "Passed! full sort"
        );
        assert.deepEqual(
            Array.from( arr2 ),
            [ 3, 0, 0, 0, 5, 0, 1, 0, 2, 0, 9, 0, 7, 0 ],
            "Passed! partial sort"
        );
    });

    it('eleSize 3', function () {
        var list = [ 3, 0, 0, 0, 0, 0, 5, 0, 0, 9, 0, 0, 2, 0, 0, 1, 0, 0, 7, 0, 0];
        // console.log( list );

        var arr1 = new Float32Array( list );
        quicksortIP( arr1, 3, 0 );
        // console.log( arr1 );

        var arr2 = new Float32Array( list );
        quicksortIP( arr2, 3, 0, 3, 6 );
        // console.log( arr2 );

        assert.deepEqual(
            Array.from( arr1 ),
            [ 0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 5, 0, 0, 7, 0, 0, 9, 0, 0 ],
            "Passed! full sort"
        );
        assert.deepEqual(
            Array.from( arr2 ),
            [ 3, 0, 0, 0, 0, 0, 5, 0, 0, 1, 0, 0, 2, 0, 0, 9, 0, 0, 7, 0, 0 ],
            "Passed! partial sort"
        );
    });
});


describe('quicksortCmp', function () {
    it('basic', function () {
        var list = [ 3, 0, 5, 9, 2, 1, 7 ];

        var cmp = function( a, b ){
            if( a > b ) return 1;
            if( a < b ) return -1;
            return 0;
        };

        var arr1 = new Float32Array( list );
        quicksortCmp( arr1 );
        assert.deepEqual(
            Array.from( arr1 ),
            [ 0, 1, 2, 3, 5, 7, 9 ],
            "Passed! full sort"
        );
        assert.isTrue(
            arraySortedCmp( arr1, cmp ),
            "Passed! full sort"
        );

        var arr2 = new Float32Array( list );
        quicksortCmp( arr2, undefined, 3, 6 );
        assert.deepEqual(
            Array.from( arr2 ),
            [ 3, 0, 5, 1, 2, 9, 7 ],
            "Passed! partial sort"
        );
        assert.isTrue(
            arraySortedCmp( arr2.subarray( 3, 6 ), cmp ),
            "Passed! partial sort"
        );

        var cmpInv = function( a, b ){
            if( a > b ) return -1;
            if( a < b ) return 1;
            return 0;
        };
        var arr3 = new Float32Array( list );
        quicksortCmp( arr3, cmpInv );
        assert.deepEqual(
            Array.from( arr3 ),
            [ 9, 7, 5, 3, 2, 1, 0 ],
            "Passed! full sort inverted"
        );
        assert.isTrue(
            arraySortedCmp( arr3, cmpInv ),
            "Passed! full sort inverted"
        );
    });

    it('points', function () {
        var points = new Float32Array([15.267999649047852,13.824999809265137,5.593999862670898,14.993000030517578,9.862000465393066,7.442999839782715,11.392999649047852,11.307999610900879,10.1850004196167,11.659000396728516,8.295999526977539,13.491000175476074,9.489999771118164,7.519000053405762,16.819000244140625,8.72599983215332,4.857999801635742,12.92300033569336,7.670000076293945,2.0309998989105225,11.244999885559082,4.664000034332275,3.2679998874664307,10.343000411987305,6.052000045776367,5.933000087738037,8.744000434875488,7.877999782562256,3.7780001163482666,6.651000022888184,5.2129998207092285,2.0160000324249268,5.557000160217285,3.5360000133514404,5.000999927520752,4.617000102996826,6.136000156402588,6.072000026702881,2.6530001163482666,6.239999771118164,3.1440000534057617,0.6840000152587891,2.947000026702881,3.816999912261963,-0.1889999955892563,3.200000047683716,7.146999835968018,-1.1030000448226929,6.228000164031982,5.901000022888184,-3.506999969482422,4.98799991607666,3.755000114440918,-5.686999797821045,3.259999990463257,7.045000076293945,-7.421999931335449,5.534999847412109,10.510000228881836,-5.730000019073486,5.947000026702881,10.756999969482422,-2.5230000019073486,5.485000133514404,13.060999870300293,-0.38199999928474426,7.035999774932861,13.682000160217285,2.5399999618530273,4.7820000648498535,16.166000366210938,3.494999885559082,2.315000057220459,13.52299976348877,3.578000068664551,4.2270002365112305,11.251999855041504,5.546999931335449,4.5279998779296875,13.42199993133545,8.024999618530273,0.9470000267028809,14.112000465393066,8.468000411987305,0.28600001335144043,10.631999969482422,8.545000076293945,3.7660000324249268,9.71500015258789,11.185999870300293,7.0370001792907715,12.75,11.954000473022461,7.580999851226807,13.949000358581543,8.944000244140625,11.970999717712402,13.583000183105469,7.552000045776367,13.168000221252441,18.006000518798828,6.945000171661377,17.097000122070312,16.65999984741211,4.96999979019165,20.593000411987305,17.742000579833984,3.944999933242798,20.13800048828125,15.02299976348877,5.877999782562256,21.868999481201172,11.38700008392334,8.4350004196167,20.35700035095215,14.317000389099121,11.947999954223633,19.533000946044922,11.718000411987305,14.362000465393066,16.652000427246094,11.368000030517578,16.033000946044922,15.434000015258789,9.550000190734863,19.166000366210938,11.720000267028809,11.039999961853027,17.42799949645996,14.930000305175781,9.862000465393066,13.567999839782715,16.093000411987305,5.704999923706055,14.038999557495117,13.732999801635742,6.928999900817871,11.026000022888184]);

        var cmp = function cmp( a, b ){
            if( a > b ) return 1;
            if( a < b ) return -1;
            return 0;
        };

        quicksortCmp( points, cmp );
        assert.isTrue(
            arraySortedCmp( points, cmp ),
            "Passed! sort points"
        );
    });

});


});
