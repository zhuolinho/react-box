let Payroll = artifacts.require("./Payroll.sol");
const ether = 1000000000000000000;

contract('Payroll', function (accounts) {
    let initialBalance;
    let payrollInstance;

    it("...add 10 employees", function () {
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

    it("...remove 10 employees", function () {
        return payrollInstance.addFund({from: accounts[0], value: 99 * ether}).then(function () {
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

    it("...getPaid immediately", function () {
        return payrollInstance.addEmployee(accounts[1], 3, {from: accounts[0]}).then(function () {
            return web3.eth.getBalance(accounts[1]);
        }).then(function (balance) {
            initialBalance = balance;
            return payrollInstance.getPaid({from: accounts[1]});
        }).then(assert.fail).catch(function (err) {
            console.log(err);
        });
    });

    it("...getPaid affter 11 seconds", function () {
        return (new Promise(function (resolve, reject) {
            setTimeout(resolve, 11000);
        })).then(function () {
            return payrollInstance.getPaid({from: accounts[1]});
        }).then(function () {
            return web3.eth.getBalance(accounts[1]);
        }).then(function (balance) {
            console.log("Get", (balance - initialBalance) / ether, "ether");
        });
    });

});
