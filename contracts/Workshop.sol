pragma solidity ^0.4.15;

import './zeppelin/math/SafeMath.sol';
import './zeppelin/ownership/Ownable.sol';

contract Workshop is Ownable {
  using SafeMath for uint256;

  bool public running;

  uint public totalAttendants;

  mapping(uint => string) public attendants;

  event AttendantAdded(uint256 number, string name);

  function Workshop() {
    running = false;
    totalAttendants = 1;
  }

  function addAttendant(string name) external {
    assert(running);
    attendants[totalAttendants] = name;
    increaseAttendants(1);
    AttendantAdded(totalAttendants, name);
  }

  function increaseAttendants(uint256) internal {
    totalAttendants ++;
  }

  function start() onlyOwner() {
    running = true;
  }

  function stop() onlyOwner() {
    running = false;
  }

}
