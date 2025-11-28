let mockRecordset: any[] = [];

export const __setMockRecordset = (data: any[]) => {
  mockRecordset = data;
};

class MockRequest {
  inputs: Record<string, any> = {};

  input(name: string, value: any) {
    this.inputs[name] = value;
    return this;
  }

  async execute(_procedure: string) {
    return { recordset: mockRecordset };
  }
}

class MockPool {
  request() {
    return new MockRequest();
  }
}

// 👉 Named export (VERY IMPORTANT)
export const connect = jest.fn().mockResolvedValue(new MockPool());

// 👉 Default export (covers `import sql from "mssql"`)
export default {
  connect,
};
