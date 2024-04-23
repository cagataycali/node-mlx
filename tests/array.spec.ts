import mx from '..';
import {assertArray, assertArrayAllTrue, assertArrayAllFalse} from './utils';
import {assert} from 'chai';

describe('dtype', () => {
  it('size', () => {
    assert.equal(mx.bool_.size, 1);
    assert.equal(mx.uint8.size, 1);
    assert.equal(mx.uint16.size, 2);
    assert.equal(mx.uint32.size, 4);
    assert.equal(mx.uint64.size, 8);
    assert.equal(mx.int8.size, 1);
    assert.equal(mx.int16.size, 2);
    assert.equal(mx.int32.size, 4);
    assert.equal(mx.int64.size, 8);
    assert.equal(mx.float16.size, 2);
    assert.equal(mx.float32.size, 4);
    assert.equal(mx.bfloat16.size, 2);
    assert.equal(mx.complex64.size, 8);
  });
});

describe('array', () => {
  describe('equality', () => {
    it('arrayEqArray', () => {
      const a = mx.array([1, 2, 3]);
      const b = mx.array([1, 2, 3]);
      const c = mx.array([1, 2, 4]);
      assertArrayAllTrue(mx.all(mx.equal(a, b)));
      assertArrayAllFalse(mx.all(mx.equal(a, c)));
    });

    it('arrayEqScalar', () => {
      const a = mx.array([1, 2, 3]);
      const b = 1;
      const c = 4;
      const d = 2.5;
      const e = mx.array([1, 2.5, 3.25]);
      assertArrayAllTrue(mx.any(mx.equal(a, b)));
      assertArrayAllFalse(mx.all(mx.equal(a, c)));
      assertArrayAllFalse(mx.all(mx.equal(a, d)));
      assertArrayAllTrue(mx.any(mx.equal(a, e)));
    });

    it('listEqualsArray', () => {
      const a = mx.array([1, 2, 3]);
      const b = [1, 2, 3];
      const c = [1, 2, 4];
      assertArrayAllTrue(mx.equal(a, b));
      assertArray(mx.equal(a, c),
                  (arrays) => assert.deepEqual(arrays, [true, true, false]));
    });
  });

  describe('inequality', () => {
    it('arrayNeArray', () => {
      const a = mx.array([1, 2, 3]);
      const b = mx.array([1, 2, 3]);
      const c = mx.array([1, 2, 4]);
      assertArrayAllFalse(mx.any(mx.notEqual(a, b)));
      assertArrayAllTrue(mx.any(mx.notEqual(a, c)));
    });

    it('arrayNeScalar', () => {
      const a = mx.array([1, 2, 3]);
      const b = 1;
      const c = 4;
      const d = 1.5;
      const e = 2.5;
      const f = mx.array([1, 2.5, 3.25]);
      assertArrayAllFalse(mx.all(mx.notEqual(a, b)));
      assertArrayAllTrue(mx.any(mx.notEqual(a, c)));
      assertArrayAllTrue(mx.any(mx.notEqual(a, d)));
      assertArrayAllTrue(mx.any(mx.notEqual(a, e)));
      assertArrayAllFalse(mx.all(mx.notEqual(a, f)));
    });

    it('listNotEqualsArray', () => {
      const a = mx.array([1, 2, 3]);
      const b = [1, 2, 3];
      const c = [1, 2, 4];
      assertArrayAllFalse(mx.notEqual(a, b));
      assertArray(mx.notEqual(a, c),
                  (arrays) => assert.deepEqual(arrays, [false, false, true]));
    });
  });

  describe('array', () => {
    it('arrayBasics', () => {
      let x = mx.array(1);
      assert.equal(x.size, 1);
      assert.equal(x.ndim, 0);
      assert.equal(x.itemsize, 4);
      assert.equal(x.nbytes, 4);
      assert.deepEqual(x.shape, []);
      assert.equal(x.dtype, mx.float32);
      assert.equal(x.item(), 1);
      assert.isTrue(typeof x.item() === 'number');

      assert.throws(() => {
        x.length;
      }, TypeError);

      x = mx.array(1, mx.uint32);
      assert.equal(x.item(), 1);
      assert.isTrue(typeof x.item() === 'number');

      x = mx.array(1, mx.int64);
      assert.equal(x.item(), 1);
      assert.isTrue(typeof x.item() === 'number');

      x = mx.array(1, mx.bfloat16);
      assert.equal(x.item(), 1.0);

      x = mx.array(1.0);
      assert.equal(x.size, 1);
      assert.equal(x.ndim, 0);
      assert.deepEqual(x.shape, []);
      assert.equal(x.dtype, mx.float32);
      assert.equal(x.item(), 1.0);
      assert.isTrue(typeof x.item() === 'number');

      x = mx.array(false);
      assert.equal(x.size, 1);
      assert.equal(x.ndim, 0);
      assert.deepEqual(x.shape, []);
      assert.equal(x.dtype, mx.bool_);
      assert.equal(x.item(), false);
      assert.isTrue(typeof x.item() === 'boolean');

      x = mx.array(mx.complex(1, 1));
      assert.equal(x.ndim, 0);
      assert.deepEqual(x.shape, []);
      assert.equal(x.dtype, mx.complex64);
      assert.deepEqual(x.item(), {re: 1, im: 1});
      assert.isTrue(typeof x.item() === 'object');

      x = mx.array([true, false, true]);
      assert.equal(x.dtype, mx.bool_);
      assert.equal(x.ndim, 1);
      assert.deepEqual(x.shape, [3]);
      assert.equal(x.length, 3);

      x = mx.array([true, false, true], mx.float32);
      assert.equal(x.dtype, mx.float32);

      x = mx.array([0, 1, 2]);
      assert.equal(x.dtype, mx.float32);
      assert.equal(x.ndim, 1);
      assert.deepEqual(x.shape, [3]);

      x = mx.array([0, 1, 2], mx.float32);
      assert.equal(x.dtype, mx.float32);

      x = mx.array([0.0, 1.0, 2.0]);
      assert.equal(x.dtype, mx.float32);
      assert.equal(x.ndim, 1);
      assert.deepEqual(x.shape, [3]);

      x = mx.array([mx.complex(0, 1), mx.complex(1)]);
      assert.equal(x.dtype, mx.complex64);
      assert.equal(x.ndim, 1);
      assert.deepEqual(x.shape, [2]);

      x = mx.array([1, 2, 3], mx.int32);
      assert.equal(x.dtype, mx.int32);
      assert.deepEqual(x.tolist(), [1, 2, 3]);
    });

    it('boolConversion', () => {
      let x = mx.array(true);
      assertArrayAllTrue(x);
      x = mx.array(false);
      assertArrayAllFalse(x);
    });

    it('constructionFromLists', () => {
      let x = mx.array([]);
      assert.equal(x.size, 0);
      assert.deepEqual(x.shape, [0]);
      assert.equal(x.dtype, mx.float32);

      x = mx.array([[], [], []]);
      assert.equal(x.size, 0);
      assert.deepEqual(x.shape, [3, 0]);
      assert.equal(x.dtype, mx.float32);

      x = mx.array([[[], []], [[], []], [[], []]]);
      assert.equal(x.size, 0);
      assert.deepEqual(x.shape, [3, 2, 0]);
      assert.equal(x.dtype, mx.float32);

      assert.throws(() => {
        x = mx.array([[[], []], [[]], [[], []]]);
      }, Error);

      assert.throws(() => {
        x = mx.array([[[], []], [[1.0, 2.0], []], [[], []]]);
      }, Error);

      assert.throws(() => {
        x = mx.array([[0, 1], [[0, 1], 1]]);
      }, Error);

      x = mx.array([[1.0, 2.0], [0.0, 3.9]], mx.bool_);
      assert.equal(x.dtype, mx.bool_);
      assertArrayAllTrue(mx.arrayEqual(x, mx.array([[true, true], [false, true]])));

      x = mx.array([[1.0, 2.0], [0.0, 3.9]], mx.int32);
      assertArrayAllTrue(mx.arrayEqual(x, mx.array([[1, 2], [0, 3]])));

      x = mx.array([mx.complex(1, 0), mx.complex(0, 2)], mx.complex64);
      assert.deepEqual(x.tolist(), [{re: 1, im: 0}, {re: 0, im: 2}]);
    });

    it('arrayToList', () => {
      const types = [mx.bool_, mx.uint32, mx.int32, mx.int64, mx.float32];
      for (const t of types) {
        const xSingle = mx.array(1, t);
        assertArrayAllTrue(mx.equal(xSingle.tolist(), 1));
      }

      const valsMultiple = [1, 2, 3, 4];
      const xMultiple = mx.array(valsMultiple);
      assertArrayAllTrue(mx.equal(xMultiple.tolist(), valsMultiple));

      const vals2D = [[1, 2], [3, 4]];
      const x2D = mx.array(vals2D);
      assertArrayAllTrue(mx.equal(x2D.tolist(), vals2D));

      const valsBool = [[1, 0], [0, 1]];
      const xBool = mx.array(valsBool, mx.bool_);
      assertArrayAllTrue(mx.equal(xBool.tolist(), valsBool));

      const valsFloat = [[1.5, 2.5], [3.5, 4.5]];
      const xFloat = mx.array(valsFloat);
      assertArrayAllTrue(mx.equal(xFloat.tolist(), valsFloat));

      const vals3D = [[[0.5, 1.5], [2.5, 3.5]], [[4.5, 5.5], [6.5, 7.5]]];
      const x3D = mx.array(vals3D);
      assertArrayAllTrue(mx.equal(x3D.tolist(), vals3D));

      const valsEmpty = [];
      const xEmpty = mx.array(valsEmpty);
      assertArrayAllTrue(mx.equal(xEmpty.tolist(), valsEmpty));

      const valsEmpty2D = [[], []];
      const xEmpty2D = mx.array(valsEmpty2D);
      assertArrayAllTrue(mx.equal(xEmpty2D.tolist(), valsEmpty2D));

      const valsHalf = [1.0, 2.0, 3.0, 4.0, 5.0];
      const xHalfFloat16 = mx.array(valsHalf, mx.float16);
      assertArrayAllTrue(mx.equal(xHalfFloat16.tolist(), valsHalf));

      const xHalfBfloat16 = mx.array(valsHalf, mx.bfloat16);
      assertArrayAllTrue(mx.equal(xHalfBfloat16.tolist(), valsHalf));
    });

    it('dtypeJSScalarPromotion', () => {
      const tests = [
        [mx.bool, mx.multiply, false, mx.bool],
        [mx.bool, mx.multiply, 0, mx.float32],
        [mx.bool, mx.multiply, 1.0, mx.float32],
        [mx.int8, mx.multiply, false, mx.int8],
        [mx.int8, mx.multiply, 0, mx.float32],
        [mx.int8, mx.multiply, 1.0, mx.float32],
        [mx.int16, mx.multiply, false, mx.int16],
        [mx.int16, mx.multiply, 0, mx.float32],
        [mx.int16, mx.multiply, 1.0, mx.float32],
        [mx.int32, mx.multiply, false, mx.int32],
        [mx.int32, mx.multiply, 0, mx.float32],
        [mx.int32, mx.multiply, 1.0, mx.float32],
        [mx.int64, mx.multiply, false, mx.int64],
        [mx.int64, mx.multiply, 0, mx.float32],
        [mx.int64, mx.multiply, 1.0, mx.float32],
        [mx.uint8, mx.multiply, false, mx.uint8],
        [mx.uint8, mx.multiply, 0, mx.float32],
        [mx.uint8, mx.multiply, 1.0, mx.float32],
        [mx.uint16, mx.multiply, false, mx.uint16],
        [mx.uint16, mx.multiply, 0, mx.float32],
        [mx.uint16, mx.multiply, 1.0, mx.float32],
        [mx.uint32, mx.multiply, false, mx.uint32],
        [mx.uint32, mx.multiply, 0, mx.float32],
        [mx.uint32, mx.multiply, 1.0, mx.float32],
        [mx.uint64, mx.multiply, false, mx.uint64],
        [mx.uint64, mx.multiply, 0, mx.float32],
        [mx.uint64, mx.multiply, 1.0, mx.float32],
        [mx.float32, mx.multiply, false, mx.float32],
        [mx.float32, mx.multiply, 0, mx.float32],
        [mx.float32, mx.multiply, 1.0, mx.float32],
        [mx.float16, mx.multiply, false, mx.float16],
        [mx.float16, mx.multiply, 0, mx.float32],
        [mx.float16, mx.multiply, 1.0, mx.float32],
      ];

      for (const [dtypeIn, f, v, dtypeOut] of tests) {
        const x = mx.array(0, dtypeIn as mx.Dtype);
        const y = (f as (a, dtype) => mx.array)(x, v);
        assert.equal(y.dtype, dtypeOut);
      }
    });

    it('arrayTypeCast', () => {
      const a = mx.array([0.1, 2.3, -1.3]);
      const b = [0, 2, -1];

      assert.deepEqual(a.astype(mx.int32).tolist(), b);
      assert.equal(a.astype(mx.int32).dtype, mx.int32);

      const c = mx.array(b).astype(mx.float32);
      assert.equal(c.dtype, mx.float32);
    });

    it('arrayIteration', () => {
      let a = mx.array([0, 1, 2]);
      let i = 0;
      for (const el of a) {
        assert.equal(el.item(), i++);
      }

      a = mx.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]]);
      let [x, y, z] = a;
      assert.deepEqual(x.tolist(), [1.0, 2.0]);
      assert.deepEqual(y.tolist(), [3.0, 4.0]);
      assert.deepEqual(z.tolist(), [5.0, 6.0]);
    });
  });
});
