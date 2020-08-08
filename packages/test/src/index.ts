enum TestPlanAction {
  RUN,
  SKIP,
  ONLY,
}

enum TestResult {
  OK = 'ok',
  FAIL = 'fail',
  SKIPPED = 'skipped',
}

type TestCase = () => void | Promise<void>

type TestFunction = (description: string, testCase: TestCase) => void

type PlannedTest = [TestPlanAction, string, TestCase]

interface TestReport {
  name?: string
  tests: [string, TestResult][]
}

interface TestMethods {
  run: () => Promise<TestReport>
  skip: TestFunction
  only: TestFunction
}

type EnhancedTestFunction = TestFunction & TestMethods

export function test(name?: string): EnhancedTestFunction {
  const testPlan: PlannedTest[] = []

  const t: TestFunction = (description, testCase) => {
    testPlan.push([TestPlanAction.RUN, description, testCase])
  }

  const methods: TestMethods = {
    skip(description, testCase) {
      testPlan.push([TestPlanAction.SKIP, description, testCase])
    },

    only(description, testCase) {
      testPlan.push([TestPlanAction.ONLY, description, testCase])
    },

    async run() {
      const report: TestReport = {
        name,
        tests: [],
      }

      const hasOnly = testPlan.some(([plan]) => plan === TestPlanAction.ONLY)

      await Promise.all(
        testPlan
          .map<PlannedTest>(([plan, ...rest]) => {
            const isSkipped = hasOnly && plan !== TestPlanAction.ONLY
            return [isSkipped ? TestPlanAction.SKIP : plan, ...rest]
          })
          .map(async ([plan, description, testCase], index) => {
            if (plan === TestPlanAction.SKIP) {
              report.tests[index] = [description, TestResult.SKIPPED]
            } else {
              try {
                await testCase()
                report.tests[index] = [description, TestResult.OK]
              } catch {
                report.tests[index] = [description, TestResult.FAIL]
              }
            }
          })
      )

      return report
    },
  }

  return Object.assign<TestFunction, TestMethods>(t, methods)
}
