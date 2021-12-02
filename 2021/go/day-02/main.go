package main

import (
	"aoc/2021/utils"
	"fmt"
	"strconv"
	"strings"
)

// INPUTS
var instructions = utils.ReadInput("./../inputs/day-02.txt", "\n")

// UTILS
// Struct representing a single instruction, parsed into direction and value
type Instruction struct {
	dir string
	val int
}

// Struct representing a basic submarine with no aim functionality
type BasicSubmarine struct {
	depth, position int
}

// Struct representing a submarine with aim functionality
type Submarine struct {
	depth, position, aim int
}

// Parse instructions into a struct
func parseInstruction(instruction string) Instruction {
	instructionArray := strings.Split(instruction, " ")
	direction := instructionArray[0]
	value, _ := strconv.Atoi(instructionArray[1])
	return Instruction{direction, value}
}

// Move a basic submarine depending on a string instruction
func (sub *BasicSubmarine) move(instruction string) {
	instr := parseInstruction(instruction)
	switch instr.dir {
	case "up":
		sub.depth -= instr.val
	case "down":
		sub.depth += instr.val
	case "forward":
		sub.position += instr.val
	}
}

// Move a submarine depending on a string instruction
func (sub *Submarine) move(instruction string) {
	instr := parseInstruction(instruction)
	switch instr.dir {
	case "up":
		sub.aim -= instr.val
	case "down":
		sub.aim += instr.val
	case "forward":
		sub.position += instr.val
		sub.depth += instr.val * sub.aim
	}
}

// PART 1 & 2
func main() {
	firstSub := BasicSubmarine{0, 0}
	secondSub := Submarine{0, 0, 0}
	for _, instr := range instructions {
		firstSub.move(instr)
		secondSub.move(instr)
	}
	fmt.Printf("Part 1: %d \n", firstSub.depth*firstSub.position)
	fmt.Printf("Part 2: %d \n", secondSub.depth*secondSub.position)
}
