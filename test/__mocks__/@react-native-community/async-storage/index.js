// tslint:disable-next-line
export const VALUE_OBJECT = { x: 1, id: 2 }
export const VALUE_STRING = JSON.stringify(VALUE_OBJECT);

// mocks
export const mockGetItem = jest.fn().mockReturnValue(Promise.resolve(VALUE_STRING));
export const mockSetItem = jest.fn();
export const mockRemoveItem = jest.fn();
export const mockClear = jest.fn();

export default {
  clear: mockClear,
  getItem: mockGetItem,
  removeItem: mockRemoveItem,
  setItem: mockSetItem,
};
