/**
 * Solution to Day 24 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/24
 */

/*
 * Today's solution must be analysed first, as there are 9^14 = 2E13 possible combinations.
 * Even at 1E9 numbers checked a second, it would still be approximately 40 minutes to brute
 * force.
 *
 * The input puzzle can be split into 14 blocks, each separated by an `inp w` call, working on
 * consecutive digits (instruction numbers added for easier reference):
 *
 *    BLOCK 1     BLOCK 2     BLOCK 3     BLOCK 4     BLOCK 5     BLOCK 6     BLOCK 7     BLOCK 8     BLOCK 9     BLOCK 10    BLOCK 11    BLOCK 12    BLOCK 13    BLOCK 14
 *  1 inp w       inp w       inp w       inp w       inp w       inp w       inp w       inp w       inp w       inp w       inp w       inp w       inp w       inp w
 *  2 mul x 0     mul x 0     mul x 0     mul x 0     mul x 0     mul x 0     mul x 0     mul x 0     mul x 0     mul x 0     mul x 0     mul x 0     mul x 0     mul x 0
 *  3 add x z     add x z     add x z     add x z     add x z     add x z     add x z     add x z     add x z     add x z     add x z     add x z     add x z     add x z
 *  4 mod x 26    mod x 26    mod x 26    mod x 26    mod x 26    mod x 26    mod x 26    mod x 26    mod x 26    mod x 26    mod x 26    mod x 26    mod x 26    mod x 26
 *  5 div z 1     div z 1     div z 1     div z 1     div z 26    div z 1     div z 26    div z 26    div z 1     div z 1     div z 26    div z 26    div z 26    div z 26
 *  6 add x 14    add x 13    add x 13    add x 12    add x -12   add x 12    add x -2    add x -11   add x 13    add x 14    add x 0     add x -12   add x -13   add x -6
 *  7 eql x w     eql x w     eql x w     eql x w     eql x w     eql x w     eql x w     eql x w     eql x w     eql x w     eql x w     eql x w     eql x w     eql x w
 *  8 eql x 0     eql x 0     eql x 0     eql x 0     eql x 0     eql x 0     eql x 0     eql x 0     eql x 0     eql x 0     eql x 0     eql x 0     eql x 0     eql x 0
 *  9 mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0
 * 10 add y 25    add y 25    add y 25    add y 25    add y 25    add y 25    add y 25    add y 25    add y 25    add y 25    add y 25    add y 25    add y 25    add y 25
 * 11 mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x
 * 12 add y 1     add y 1     add y 1     add y 1     add y 1     add y 1     add y 1     add y 1     add y 1     add y 1     add y 1     add y 1     add y 1     add y 1
 * 13 mul z y     mul z y     mul z y     mul z y     mul z y     mul z y     mul z y     mul z y     mul z y     mul z y     mul z y     mul z y     mul z y     mul z y
 * 14 mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0     mul y 0
 * 15 add y w     add y w     add y w     add y w     add y w     add y w     add y w     add y w     add y w     add y w     add y w     add y w     add y w     add y w
 * 16 add y 8     add y 8     add y 3     add y 10    add y 8     add y 8     add y 8     add y 5     add y 9     add y 3     add y 4     add y 9     add y 2     add y 7
 * 17 mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x     mul y x
 * 18 add z y     add z y     add z y     add z y     add z y     add z y     add z y     add z y     add z y     add z y     add z y     add z y     add z y     add z y
 *
 * The only differences between the blocks occur on instructions 5, 6, and 16. The other lines
 * are the same. If we label the divisor in instruction 5 as A, the addend in instruction 6 as
 * B and the addend in instruction 16 as C, we can write a generic block:
 *
 *  1 inp w
 *  2 mul x 0
 *  3 add x z
 *  4 mod x 26
 *  5 div z A
 *  6 add x B
 *  7 eql x w
 *  8 eql x 0
 *  9 mul y 0
 * 10 add y 25
 * 11 mul y x
 * 12 add y 1
 * 13 mul z y
 * 14 mul y 0
 * 15 add y w
 * 16 add y C
 * 17 mul y x
 * 18 add z y
 *
 * These instructions can be further interpreted by simply replacing their values with previous
 * results. This simplifies the instructions to (in JavaScript notation, where `readInput()` is
 * some function allowing for the digit of w to be input):
 *
 * I   w = readInput()
 * II  x = Number((z % 26) + B !== w)
 * III z = Math.floor(z / A)
 * IV  z *= (25 * x) + 1
 * V   z += (w + C) * x
 *
 * And the values of the factors A, B and C for each of the blocks are:
 *    BLOCK 1     BLOCK 2     BLOCK 3     BLOCK 4     BLOCK 5     BLOCK 6     BLOCK 7     BLOCK 8     BLOCK 9     BLOCK 10    BLOCK 11    BLOCK 12    BLOCK 13    BLOCK 14
 *  A 1           1           1           1           26          1           26          26          1           1           26          26          26          26
 *  B 14          13          13          12          -12         12          -2          -11         13          14          0           -12         -13         -6
 *  C 8           8           3           10          8           8           8           5           9           3           4           9           2           7
 *
 * For II, since z % 26 has to be in the range 0 - 25 and w is a single digit, if B > 9 then x = 1
 * For III, if A = 1, then the equation simplifies and has no effect on Z.  All blocks with
 * A = 1 have B > 9 and therefore, blocks 1, 2, 3, 4, 6, 9, 10 simplifiy to:
 *
 *     w = readInput()
 *     z *= 26
 *     z += w + C
 *
 * What this essentially does is shifts the z-stack one base-26 "bit" to the left and pushes
 * w + C onto the end of the z-stack. This happens in 7 of the blocks. If we want to end with
 * z = 0, we need to empty the stack in the other blocks.
 *
 * For III, if A = 26, this essentially removes the last base-26 "bit" from the z-stack. In
 * order to keep the stack empty (since there are 7 of these blocks, and they need to exactly
 * counteract the A = 1 blocks), we have to ensure that IV and V do not shift the z-stack or
 * push another digit onto the stack. This can be achieved if x = 0, so II must be false.
 *
 * This can be done by analysing the numbers in A = 1 and corresponding A = 26 blocks. For
 * example, let's look at II for Block 5 and the conditions under which it's 0:
 *
 * II  (z % 26) + (-12) == w5
 *
 * Where, w5 is the 5th digit of the MONAD number and (z % 26) is the most recently pushed
 * base-26 "bit", which was added in block 4:
 *
 * V   z += w4 + 10
 *
 * Therefore:
 *     w4 + 10 - 12 === w5
 *     w4 - 2 === w5
 *
 * A similar set of conditions can be made for each of the pairs of blocks:
 *     w1 + 8 - 6 === w14     ->     w1 + 2 = w14
 *     w2 + 8 - 13 === w13    ->     w2 - 5 = w13
 *     w3 + 3 - 11 === w8     ->     w3 - 8 = w8
 *     w4 + 10 - 12 === w5    ->     w4 - 2 = w5
 *     w6 + 8 - 2 === w7      ->     w6 + 6 = w7
 *     w9 + 9 - 12 === w12    ->     w9 - 3 = w12
 *     w10 + 3 - 0 === w11    ->     w10 + 3 = w11
 *
 * Since all digits have to be 0 < w < 10, maximising these digits can be easily done manually:
 *     w1 = 7     ->     w14 = 9
 *     w2 = 9     ->     w13 = 4
 *     w3 = 9     ->     w8 = 1
 *     w4 = 9     ->     w5 = 7
 *     w6 = 3     ->     w7 = 9
 *     w9 = 9     ->     w12 = 6
 *     w10 = 6    ->     w11 = 9
 * Combining into a maximum number of: 79997391969649
 * 
 * A similarly straightforward process can be done for Part 2, where the lowest possible digit
 * is to be chosen for each of the positions:
 *     w1 = 1     ->     w14 = 3
 *     w2 = 6     ->     w13 = 1
 *     w3 = 9     ->     w8 = 1
 *     w4 = 3     ->     w5 = 1
 *     w6 = 1     ->     w7 = 7
 *     w9 = 4     ->     w12 = 1
 *     w10 = 1    ->     w11 = 4
 * Combining into a maximum number of: 16931171414113
 */
