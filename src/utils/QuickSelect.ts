
const swap = (arr: Array<any>, i: number, j: number) => {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

const defaultCompare = (a: number, b: number) => a < b ? -1 : a > b ? 1 : 0;

/**
 * A [Floyd-Rivest](https://en.wikipedia.org/wiki/Floyd%E2%80%93Rivest_algorithm) quick selection algorithm.
 *
 * Rearranges the array items so that all items in the [left, k] range are smaller than all items in [k, right];
 * The k-th element will have the (k - left + 1)th smallest value in [left, right].
 *
 * The array is modified in-place.
 *
 * Based on code by [Vladimir Agafonkin](https://www.npmjs.com/~mourner)
 *
 */

export function QuickSelect(
    arr: Array<any>,
    k: number,
    left?: number,
    right?: number,
    compare = defaultCompare
) {
    if (left === undefined) left = 0;
    if (right === undefined) right = arr.length - 1;

    while (right > left) {
        if (right - left > 600) {
            const n = right - left + 1;
            const m = k - left + 1;
            const z = Math.log(n);
            const s = 0.5 * Math.exp(2 * z / 3);
            const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            QuickSelect(arr, k, newLeft, newRight, compare);
        }
        const t = arr[k];
        let i = left;
        let j = right;
        swap(arr, left, k);
        if (compare(arr[right], t) > 0) swap(arr, left, right);
        while (i < j) {
            swap(arr, i, j);
            i++;
            j--;
            while (compare(arr[i], t) < 0) i++;
            while (compare(arr[j], t) > 0) j--;
        }
        if (compare(arr[left], t) === 0) {
            swap(arr, left, j);
        } else {
            j++;
            swap(arr, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;

    }
}
