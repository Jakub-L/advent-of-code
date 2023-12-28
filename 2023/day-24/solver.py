import sys
import sympy
from sympy.parsing.sympy_parser import parse_expr


def main():
    """
    Solves the equations given to it as a command line argument.

    Equations are assumed to involve x, y, z, u, v and w as variables and to be passed
    as a comma-separated list of equations.

    We use sympy to solve the equations and then filter out the solutions that are not
    integer for x, y, z, u, v and w. We then print the sum of x, y and z for the first
    solution (which is the solution for Day 24).
    """
    x, y, z, u, v, w = sympy.symbols("x y z u v w")
    all_solutions = sympy.solve(
        [parse_expr(equation) for equation in sys.argv[1].split(",")], dict=True
    )
    integer_solutions = [
        solution
        for solution in all_solutions
        if all(int(value) == value for value in solution.values())
    ]
    print(integer_solutions[0][x] + integer_solutions[0][y] + integer_solutions[0][z])


if __name__ == "__main__":
    main()
