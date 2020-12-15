import { EmployeeManager, Employee } from "./pageObjects/EmployeeManager";

// you don't need to set the JSON in a new folder, but I thought it was a good example
import * as employees from "./data/employees.json";

describe("employee manager v2", () => {
  // this is where you'd want to change firefox vs chrome to update your testing.
  const page = new EmployeeManager({ browser: "firefox" });
  beforeEach(async () => {
    await page.navigate();
  });
  afterAll(async () => {
    await page.driver.quit();
  });
  test("Searching narrows the list", async () => {
    let originalList = await page.getEmployeeList();
    await page.searchFor("Bill");
    let resultList = await page.getEmployeeList();
    expect(originalList.length).toBeGreaterThanOrEqual(resultList.length);
  });
  test("Screenshotting the 'screenshot' employees", async () => {
    // we need to search for the right group of employees
    await page.searchFor("Screenshot");
    // and then we can take the screenshot -- though I did have to make the folder "screenshots" manually first
    await page.takeScreenshot("screenshots/screenshot");
  });
  //I literally wrapped the old add/delete test in a loop, and updated a few parameters.
  //That's it.
  employees.forEach((newEmployee) => {
    //I updated the test name
    test(`Can add and delete an employee (newEmployee.name)`, async () => {
      await page.addEmployee(newEmployee);
      let employee = await page.getCurrentEmployee();
      expect(employee.name).toEqual(newEmployee.name);
      expect(employee.phone).toEqual(newEmployee.phone);
      expect(employee.email).toEqual(newEmployee.email);
      expect(employee.title).toEqual(newEmployee.title);
      //had to update this argument
      await page.deleteEmployee(newEmployee.name);
      let employeeList = await page.getEmployeeList();
      //and this one
      expect(employeeList).not.toContain(newEmployee.name);
    });
  });
});
