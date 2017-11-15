let Payroll = artifacts.require("./Payroll.sol");
const ether = 1000000000000000000;

contract('Payroll', function (accounts) {

    it("...addEmployee", function () {
        return Payroll.deployed().then(function (instance) {
            payrollInstance = instance;
            payrollInstance.addEmployee(accounts[0], 2, {from: accounts[0]});
            payrollInstance.addEmployee(accounts[1], 3, {from: accounts[0]});
        }).then(function () {
            return payrollInstance.employees.call(accounts[1]);
        }).then(function (employee) {
            assert.equal(employee[1].toJSON(), 3 * ether, "The salary is wrong.");
            assert.equal(employee[0], accounts[1], "The id is wrong.");
        });
    });

});
