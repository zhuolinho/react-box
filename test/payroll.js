let Payroll = artifacts.require("./Payroll.sol");
const ether = 1000000000000000000;

contract('Payroll', function (accounts) {

    it("...addEmployee", function () {
        return Payroll.deployed().then(function (instance) {
            payrollInstance = instance;
            for (let i = 0; i < accounts.length; i++) {
                payrollInstance.addEmployee(accounts[i], i, {from: accounts[0]});
            }
        }).then(function () {
            let arr = [];
            return (function callEmployees(i) {
                if (i == accounts.length) {
                    return arr;
                }
                return payrollInstance.employees.call(accounts[i]).then(function (account) {
                    arr.push(account);
                    return callEmployees(i + 1);
                });
            })(0);
        }).then(function (employees) {
            for (let i = 0; i < accounts.length; i++) {
                assert.equal(employees[i][1], i * ether, "The salary is wrong.");
                assert.equal(employees[i][0], accounts[i], "The id is wrong.");
            }
        });
    });

    it("...removeEmployee", function () {
        return Payroll.deployed().then(function (instance) {
            payrollInstance = instance;
            for (let i = 0; i < accounts.length; i++) {
                payrollInstance.removeEmployee(accounts[i]);
            }
        }).then(function () {
            let arr = [];
            return (function callEmployees(i) {
                if (i == accounts.length) {
                    return arr;
                }
                return payrollInstance.employees.call(accounts[i]).then(function (account) {
                    arr.push(account);
                    return callEmployees(i + 1);
                });
            })(0);
        }).then(function (employees) {
            for (let i = 0; i < accounts.length; i++) {
                assert.equal(employees[i][0], 0, "ID is not delete");
                assert.equal(employees[i][1], 0, "Salary is not delete.");
                assert.equal(employees[i][2], 0, "LastPayday is not delete");
            }
        });
    });

});
