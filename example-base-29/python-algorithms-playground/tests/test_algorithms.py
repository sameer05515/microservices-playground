from algorithms.searching.binary_search import binary_search
from algorithms.sorting.merge_sort import merge_sort
from algorithms.sorting.quick_sort import quick_sort
from algorithms.strings.anagram import is_anagram_hashmap, is_anagram_frequency_array
from algorithms.strings.palindrome import is_palindrome
from algorithms.arrays.two_sum import two_sum
from algorithms.arrays.kadane_max_subarray import max_subarray_sum
from algorithms.math.prime import is_prime
from algorithms.math.gcd_lcm import gcd, lcm
from algorithms.hashmap.longest_consecutive import longest_consecutive
from algorithms.dynamic_programming.coin_change import coin_change
from algorithms.dynamic_programming.lcs import lcs
from algorithms.greedy.jump_game import can_jump
from algorithms.backtracking.subsets import subsets

def test_search():
    assert binary_search([1,2,3,4,5], 4) == 3

def test_sorting():
    assert merge_sort([3,1,2]) == [1,2,3]
    assert quick_sort([5,1,4,2]) == [1,2,4,5]

def test_strings():
    assert is_anagram_hashmap("listen", "silent")
    assert is_anagram_frequency_array("listen", "silent")
    assert is_palindrome("A man, a plan, a canal: Panama")

def test_arrays():
    assert two_sum([2,7,11,15], 9) == [0,1]
    assert max_subarray_sum([-2,1,-3,4,-1,2,1,-5,4]) == 6

def test_math():
    assert is_prime(29)
    assert not is_prime(1)
    assert gcd(48,18) == 6
    assert lcm(12,18) == 36

def test_hashing():
    assert longest_consecutive([100,4,200,1,3,2]) == 4

def test_dp():
    assert coin_change([1,2,5], 11) == 3
    assert lcs("abcde", "ace") == 3

def test_greedy_backtracking():
    assert can_jump([2,3,1,1,4])
    assert len(subsets([1,2,3])) == 8
