// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract FunctionTypes{
    uint256 public number = 5;
    
    constructor() payable {}

    // 函数类型
    // function (<parameter types>) {internal|external} [pure|view|payable] [returns (<return types>)]
    // 默认function
    function add() external{
        number = number + 1;
    }

    // pure: 纯纯牛马
    function addPure(uint256 _number) external pure returns(uint256 new_number){
        new_number = _number+1;
    }
    
    // view: 看客
    function addView() external view returns(uint256 new_number) {
        new_number = number + 1;
    }

    // internal: 内部函数,内部函数无法直接被调用
    /**
    我们定义一个internal的minus()函数，每次调用使得number变量减1。由于是internal，只能由合约内部调用，而外部不能。
    因此，我们必须再定义一个external的minusCall()函数，来间接调用内部的 minus()
    */
    function minus() internal {
        number = number - 1;
    }

    // 合约内的函数可以调用内部函数
    function minusCall() external {
        minus();
    }

    // payable: 递钱，能给合约支付eth的函数
    // 我们定义一个external payable的minusPayable()函数，间接的调用minus()，并且返回合约里的ETH余额（this关键字可以让我们引用合约地址)。 
    // 我们可以在调用minusPayable()时，往合约里转入1个ETH。
    function minusPayable() external payable returns(uint256 balance) {
        minus();    
        balance = address(this).balance;
    }
}